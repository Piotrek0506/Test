import { Deck, Card, SessionState, CardResult, Grade, SessionSummary, FilterSettings } from '../models/index.js';
import { loadSession, saveSession, getDeckResults } from '../storage/storage.js'; 

const ONE_SECOND = 1000;

export class FlashcardSession {
    private deck: Deck;
    private cardsInSession: Card[] = []; 
    private state: SessionState;
    private cardStartTime: number = 0; 
    private timerInterval: number | null = null;
    
    private defaultFilterSettings: FilterSettings; 

    constructor(deckData: Deck, filterSettings: FilterSettings) {
        this.deck = deckData;
        this.defaultFilterSettings = filterSettings;
        
        const savedState = loadSession(deckData.deckTitle);
        
        if (savedState) {
            this.state = savedState;
            this.cardsInSession = savedState.cardOrderIds
                .map(id => this.deck.cards.find(c => c.id === id))
                .filter(c => c !== undefined) as Card[];
        } else {
            this.state = this.initializeNewSession();
        }
        
        if (!this.state.isCompleted) {
            this.cardStartTime = Date.now();
        }
    }
    
    // --- Inicjalizacja i Pomocnicze ---
    
    private shuffleArray<T>(array: T[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    private initializeNewSession(): SessionState {
        let filteredCards = [...this.deck.cards];
        const settings = this.defaultFilterSettings;
        
        // 1. FILTRUJ PO TAGACH
        if (settings.filterTag) {
             filteredCards = filteredCards.filter(c => c.tag === settings.filterTag);
        }
        
        // 2. TRYB POWTÓRZ TYLKO TRUDNE
        if (settings.repeatOnlyHard) {
            const allResults = getDeckResults(this.deck.deckTitle);
            const hardCardIds = new Set(allResults
                .filter(r => r.grade === 'NotYet')
                .map(r => r.cardId));
                
            const previouslyHardCards = filteredCards.filter(c => hardCardIds.has(c.id));
            
            if (previouslyHardCards.length > 0) {
                 filteredCards = previouslyHardCards;
            } else {
                 console.warn("Brak trudnych fiszek do powtórki. Rozpoczynam normalną sesję.");
                 settings.repeatOnlyHard = false; 
            }
        }
        
        this.cardsInSession = filteredCards;
        
        if (settings.shuffle) {
            this.shuffleArray(this.cardsInSession);
        }
        
        if (this.cardsInSession.length === 0) {
             // Zwracamy stan ukończony, jeśli po filtrach nie ma kart
             return {
                deckTitle: this.deck.deckTitle,
                cardOrderIds: [],
                currentCardIndex: 0,
                sessionStartTime: 0,
                results: [],
                isCompleted: true,
                lastReviewDate: 0,
                filterSettings: settings
             };
        }
        
        const initialResults: CardResult[] = this.cardsInSession.map(card => ({
            cardId: card.id,
            grade: null,
            timeSpentMs: 0,
            reviewedAt: 0,
        }));

        return {
            deckTitle: this.deck.deckTitle,
            cardOrderIds: this.cardsInSession.map(c => c.id),
            currentCardIndex: 0,
            sessionStartTime: Date.now(),
            results: initialResults,
            isCompleted: false,
            lastReviewDate: 0,
            filterSettings: settings 
        };
    }
    
    public getCurrentCard(): Card {
        if (this.cardsInSession.length === 0) {
             throw new Error("Brak fiszek w sesji. Sprawdź filtry.");
        }
        return this.cardsInSession[this.state.currentCardIndex];
    }
    
    public getCurrentResult(): CardResult {
        const currentCardId = this.getCurrentCard().id;
        return this.state.results.find(r => r.cardId === currentCardId)!;
    }

    public getState(): SessionState {
        return this.state;
    }
    
    /**
     * Ocenia bieżącą fiszkę. Rejestruje czas i wynik.
     */
    public gradeCard(grade: Grade): void {
        const currentResult = this.getCurrentResult();
        
        if (currentResult.grade !== null) {
             console.warn("Fiszka już oceniona, edycja zablokowana.");
             return;
        }

        const now = Date.now();
        const timeSpent = currentResult.timeSpentMs + (now - this.cardStartTime); 

        currentResult.grade = grade;
        currentResult.timeSpentMs = timeSpent;
        currentResult.reviewedAt = now;

        saveSession(this.state);
        
        this.checkCompletion();
        
        this.cardStartTime = Date.now();
    }
    
    // --- Nawigacja ---

    public goToNext(): boolean {
        if (this.state.currentCardIndex < this.cardsInSession.length - 1) {
            this.state.currentCardIndex++;
            this.cardStartTime = Date.now(); 
            saveSession(this.state);
            return true;
        }
        return false;
    }

    public goToPrevious(): boolean {
        if (this.state.currentCardIndex > 0) {
            this.state.currentCardIndex--;
            this.cardStartTime = Date.now(); 
            saveSession(this.state);
            return true;
        }
        return false;
    }
    
    /**
     * Sprawdza, czy wszystkie karty zostały ocenione i ustawia flagę isCompleted.
     */
    private checkCompletion(): void {
        const allGraded = this.state.results.every(r => r.grade !== null);
        if (allGraded && !this.state.isCompleted) {
            this.state.isCompleted = true;
            this.stopTimer();
            // Finalny zapis stanu po ukończeniu sesji
            saveSession(this.state); 
        }
    }
    
    // --- Statystyki i Timery ---

    public getTimeOnCurrentCardMs(): number {
        const currentResult = this.getCurrentResult();
        if (currentResult.grade !== null) {
            return currentResult.timeSpentMs; 
        }
        return currentResult.timeSpentMs + (Date.now() - this.cardStartTime);
    }

    public getTotalSessionTimeMs(): number {
        if (this.state.isCompleted) {
            const lastReviewedTime = Math.max(0, ...this.state.results.map(r => r.reviewedAt));
            return lastReviewedTime - this.state.sessionStartTime;
        }
        
        const timeInCurrentCard = Date.now() - this.cardStartTime;
        
        const timeInPreviousCards = this.state.results
            .filter((_, index) => index < this.state.currentCardIndex && this.state.results[index].grade !== null)
            .reduce((sum, r) => sum + r.timeSpentMs, 0);

        return timeInPreviousCards + timeInCurrentCard;
    }
    
    public startTimer(callback: (totalTime: string, cardTime: string) => void): void {
        if (this.timerInterval !== null || this.state.isCompleted) {
            return;
        }

        this.timerInterval = setInterval(() => {
            const totalTimeStr = this.formatTime(this.getTotalSessionTimeMs());
            const cardTimeStr = this.formatTime(this.getTimeOnCurrentCardMs());
            callback(totalTimeStr, cardTimeStr);
        }, ONE_SECOND) as unknown as number; 
    }

    public stopTimer(): void {
        if (this.timerInterval !== null) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    public getKnownCount(): number {
        return this.state.results.filter(r => r.grade === 'Known').length;
    }
    
    public getNotYetCount(): number {
        return this.state.results.filter(r => r.grade === 'NotYet').length;
    }
    
    public formatTime(ms: number): string {
        const totalSeconds = Math.floor(ms / ONE_SECOND);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        const pad = (num: number) => num.toString().padStart(2, '0');
        return `${pad(minutes)}:${pad(seconds)}`;
    }

    public getSummary(): SessionSummary {
        const gradedResults = this.state.results.filter(r => r.grade !== null);
        
        const totalTimeGraded = gradedResults.reduce((sum, r) => sum + r.timeSpentMs, 0);
        
        const finalTotalTimeMs = this.state.isCompleted 
            ? Math.max(0, ...this.state.results.map(r => r.reviewedAt)) - this.state.sessionStartTime
            : this.getTotalSessionTimeMs();

        const avgTimeMs = gradedResults.length > 0 ? totalTimeGraded / gradedResults.length : 0;
        
        const hardCardsIds = this.state.results
            .filter(r => r.grade === 'NotYet')
            .map(r => r.cardId);

        const hardCards: Card[] = this.deck.cards.filter(card => hardCardsIds.includes(card.id));

        return {
            known: this.getKnownCount(),
            notYet: this.getNotYetCount(),
            totalTime: this.formatTime(finalTotalTimeMs),
            avgTime: this.formatTime(avgTimeMs),
            hardCards: hardCards
        };
    }
    
    public isFinishButtonActive(): boolean {
        // Zakończenie sesji jest możliwe tylko wtedy, gdy wszystkie karty są ocenione
        return this.state.isCompleted;
    }

    public isCurrentCardGraded(): boolean {
        return this.getCurrentResult().grade !== null;
    }
    
    public isSessionCompleted(): boolean {
        return this.state.isCompleted;
    }
    
    public resetForHardCards(): FlashcardSession {
         const newSettings: FilterSettings = {
             shuffle: this.state.filterSettings.shuffle, 
             filterTag: null,
             repeatOnlyHard: true 
         };
         
         return new FlashcardSession(this.deck, newSettings);
    }
    
    public getTagsInDeck(): string[] {
        const tags = new Set<string>();
        this.deck.cards.forEach(card => {
            if (card.tag) {
                tags.add(card.tag);
            }
        });
        return Array.from(tags).sort();
    }
}
