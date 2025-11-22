// src/logic/session.ts

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
        
        // Sprawdzenie, czy bieżące filtry odpowiadają zapisanym filtrom
        const filterChanged = savedState && JSON.stringify(savedState.filterSettings) !== JSON.stringify(filterSettings);
        
        if (savedState && !filterChanged) {
            this.state = savedState;
            this.cardsInSession = savedState.cardOrderIds
                .map(id => this.deck.cards.find(c => c.id === id))
                .filter(c => c !== undefined) as Card[];
        } else {
            this.state = this.initializeNewSession();
        }
        
        if (!this.state.isCompleted && this.cardsInSession.length > 0) {
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
        let cardsPool = [...this.deck.cards];
        const settings = this.defaultFilterSettings;
        
        // 1. FILTROWANIE DLA TRYBU POWTÓRKI
        if (settings.repeatOnlyHard) {
            const allResults = getDeckResults(this.deck.deckTitle);
            const hardCardIds = new Set(allResults
                .filter(r => r.grade === 'NotYet')
                .map(r => r.cardId));
                
            let cardsToRepeat = this.deck.cards.filter(c => hardCardIds.has(c.id));

            if (cardsToRepeat.length > 0) {
                 cardsPool = cardsToRepeat;
                 // Zastosowanie filtru tagów na zbiorze KART DO POWTÓRKI (jeśli jest ustawiony)
                 if (settings.filterTag) {
                      cardsPool = cardsPool.filter(c => c.tag === settings.filterTag);
                 }
            } else {
                 // Jeśli brak trudnych, wracamy do normalnej puli, ale zachowujemy filtry tagów, jeśli są ustawione
                 if (settings.filterTag) {
                      cardsPool = this.deck.cards.filter(c => c.tag === settings.filterTag);
                 } else {
                      cardsPool = [...this.deck.cards];
                 }
                 settings.repeatOnlyHard = false; // Musimy zresetować ustawienie filtra w stanie
            }
        } else {
            // 2. NORMALNE FILTROWANIE PO TAGACH (gdy tryb powtórki jest WYŁĄCZONY)
            if (settings.filterTag) {
                cardsPool = cardsPool.filter(c => c.tag === settings.filterTag);
            }
        }
        
        this.cardsInSession = cardsPool;
        
        // 3. Losowanie
        if (settings.shuffle) {
            this.shuffleArray(this.cardsInSession);
        }
        
        // W przypadku braku kart
        if (this.cardsInSession.length === 0) {
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
        
    /**
     * Zapisuje bieżący czas na karcie (o ile nie została oceniona) przed nawigacją.
     */
    private updateTimeSpentBeforeNavigation(): void {
        const currentResult = this.getCurrentResult();
        if (currentResult.grade === null && this.cardStartTime !== 0) {
            const timeElapsed = Date.now() - this.cardStartTime;
            currentResult.timeSpentMs += timeElapsed;
        }
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
    
    public gradeCard(grade: Grade): void {
        const currentResult = this.getCurrentResult();
        
        // Wymaganie: Po ocenie, edycja jest zablokowana.
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
        
        // Ustawiamy 0, bo czas od teraz będzie mierzony na kolejnej karcie.
        this.cardStartTime = Date.now(); 
    }
    
    // --- Nawigacja ---

    public goToNext(): boolean {
        if (this.state.currentCardIndex < this.cardsInSession.length - 1) {
            // Zapisz czas na bieżącej karcie PRZED przejściem
            this.updateTimeSpentBeforeNavigation();
            
            this.state.currentCardIndex++;
            this.cardStartTime = Date.now(); 
            saveSession(this.state);
            return true;
        }
        return false;
    }

    public goToPrevious(): boolean {
        if (this.state.currentCardIndex > 0) {
            // Zapisz czas na bieżącej karcie PRZED przejściem
            this.updateTimeSpentBeforeNavigation();
            
            this.state.currentCardIndex--;
            this.cardStartTime = Date.now(); 
            saveSession(this.state);
            return true;
        }
        return false;
    }
    
    private checkCompletion(): void {
        const allGraded = this.state.results.every(r => r.grade !== null);
        if (allGraded && !this.state.isCompleted) {
            this.state.isCompleted = true;
            this.stopTimer();
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
        // Jeśli ukończona, obliczamy czas na podstawie sessionStartTime i ostatniej recenzowanej karty
        if (this.state.isCompleted) {
            const lastReviewedTime = Math.max(0, ...this.state.results.map(r => r.reviewedAt));
            return lastReviewedTime > 0 ? lastReviewedTime - this.state.sessionStartTime : 0;
        }
        
        // Sumujemy czas spędzony na już opuszczonych kartach i dodajemy czas bieżącej
        const timeInPreviousCards = this.state.results
            .reduce((sum, r, index) => {
                // Dodajemy czas tylko, jeśli karta została opuszczona (index < currentCardIndex) 
                // lub jeśli jest to bieżąca karta, obsłużymy ją później
                if (index < this.state.currentCardIndex) {
                    return sum + r.timeSpentMs;
                }
                return sum;
            }, 0);

        return timeInPreviousCards + this.getTimeOnCurrentCardMs();
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
        // Upewniamy się, że czas dla ostatniej karty jest zaktualizowany (jeśli była ręcznie opuszczona/ukończona)
        if (!this.state.isCompleted) {
            this.updateTimeSpentBeforeNavigation();
        }
        
        const gradedResults = this.state.results.filter(r => r.grade !== null);
        
        const totalTimeGraded = gradedResults.reduce((sum, r) => sum + r.timeSpentMs, 0);
        
        const finalTotalTimeMs = this.getTotalSessionTimeMs();

        const avgTimeMs = gradedResults.length > 0 ? totalTimeGraded / gradedResults.length : 0;
        
        const hardCardsIds = this.state.results
            .filter(r => r.grade === 'NotYet')
            .map(r => r.cardId);

        const hardCards: Card[] = this.cardsInSession.filter(card => hardCardsIds.includes(card.id));

        return {
            known: this.getKnownCount(),
            notYet: this.getNotYetCount(),
            totalTime: this.formatTime(finalTotalTimeMs),
            avgTime: this.formatTime(avgTimeMs),
            hardCards: hardCards
        };
    }
    
    public isFinishButtonActive(): boolean {
        return this.state.isCompleted;
    }

    public isCurrentCardGraded(): boolean {
        return this.getCurrentResult().grade !== null;
    }
    
    public isSessionCompleted(): boolean {
        return this.state.isCompleted;
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
