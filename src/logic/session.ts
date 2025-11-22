import { Deck, Card, SessionState, CardResult, Grade, SessionSummary } from '../models';
import { loadSession, saveSession } from '../storage/storage';

const ONE_SECOND = 1000;

export class FlashcardSession {
    private deck: Deck;
    private cardsInSession: Card[] = []; // Uporządkowane fiszki na czas sesji
    private state: SessionState;
    private cardStartTime: number = 0; // Pomiar czasu dla bieżącej fiszki
    private timerInterval: number | null = null;

    constructor(deckData: Deck) {
        this.deck = deckData;
        
        const savedState = loadSession(deckData.deckTitle);
        
        if (savedState) {
            this.state = savedState;
            // Odtworzenie kolejności fiszek z zapisanego stanu
            this.cardsInSession = savedState.cardOrderIds
                .map(id => this.deck.cards.find(c => c.id === id))
                .filter(c => c !== undefined) as Card[];
        } else {
            this.state = this.initializeNewSession();
        }
        
        // Ustawienie czasu startu dla bieżącej fiszki, jeśli sesja trwa
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
        this.cardsInSession = [...this.deck.cards];
        if (this.deck.session.shuffle) {
            this.shuffleArray(this.cardsInSession);
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
        };
    }
    
    // Zwraca dane bieżącej fiszki
    public getCurrentCard(): Card {
        return this.cardsInSession[this.state.currentCardIndex];
    }
    
    // Zwraca wynik bieżącej fiszki z tablicy wyników
    public getCurrentResult(): CardResult {
        const currentCardId = this.getCurrentCard().id;
        return this.state.results.find(r => r.cardId === currentCardId)!;
    }

    public getState(): SessionState {
        return this.state;
    }
    
    // --- Logika Oceny ---
    
    /**
     * Ocenia bieżącą fiszkę. Rejestruje czas i wynik.
     */
    public gradeCard(grade: Grade): void {
        const currentResult = this.getCurrentResult();
        
        // Zapobiega ponownej edycji po ocenie
        if (currentResult.grade !== null) {
             console.warn("Fiszka już oceniona, edycja zablokowana.");
             return;
        }

        const now = Date.now();
        const timeSpent = now - this.cardStartTime;

        currentResult.grade = grade;
        currentResult.timeSpentMs = timeSpent;
        currentResult.reviewedAt = now;

        this.checkCompletion();
        saveSession(this.state);
        
        // Czas startu dla następnej fiszki
        this.cardStartTime = Date.now();
    }
    
    // --- Nawigacja ---

    public goToNext(): boolean {
        // Musi być aktywna tylko jeśli nie jesteśmy na końcu
        if (this.state.currentCardIndex < this.cardsInSession.length - 1) {
            this.state.currentCardIndex++;
            this.cardStartTime = Date.now(); 
            saveSession(this.state);
            return true;
        }
        return false;
    }

    public goToPrevious(): boolean {
        // Musi być aktywna tylko jeśli nie jesteśmy na początku
        if (this.state.currentCardIndex > 0) {
            this.state.currentCardIndex--;
            this.cardStartTime = Date.now(); 
            saveSession(this.state);
            return true;
        }
        return false;
    }
    
    // Sprawdzenie, czy wszystkie fiszki są ocenione
    private checkCompletion(): void {
        const allGraded = this.state.results.every(r => r.grade !== null);
        if (allGraded && !this.state.isCompleted) {
            this.state.isCompleted = true;
            this.stopTimer();
            saveSession(this.state);
        }
    }
    
    // --- Statystyki i Timery ---

    /**
     * Zwraca czas spędzony na bieżącej fiszce (odliczany w milisekundach).
     */
    public getTimeOnCurrentCardMs(): number {
        return Date.now() - this.cardStartTime;
    }

    /**
     * Zwraca łączny czas trwania sesji (odliczany w milisekundach).
     */
    public getTotalSessionTimeMs(): number {
        if (this.state.isCompleted) {
            // Czas liczymy od startu do ostatniej oceny
            const lastReviewedTime = Math.max(...this.state.results.map(r => r.reviewedAt));
            return lastReviewedTime - this.state.sessionStartTime;
        }
        // Jeśli trwa - do teraz
        return Date.now() - this.state.sessionStartTime;
    }
    
    public startTimer(callback: (totalTime: string, cardTime: string) => void): void {
        if (this.timerInterval !== null) {
            return;
        }
        if (this.state.isCompleted) {
            return;
        }

        this.timerInterval = setInterval(() => {
            const totalTimeStr = this.formatTime(this.getTotalSessionTimeMs());
            const cardTimeStr = this.formatTime(this.getTimeOnCurrentCardMs());
            callback(totalTimeStr, cardTimeStr);
        }, ONE_SECOND) as unknown as number; // Użycie as number do zgodności z Node/Browser
    }

    public stopTimer(): void {
        if (this.timerInterval !== null) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    // Liczniki
    public getKnownCount(): number {
        return this.state.results.filter(r => r.grade === 'Known').length;
    }
    
    public getNotYetCount(): number {
        return this.state.results.filter(r => r.grade === 'NotYet').length;
    }
    
    // Formatuje czas z milisekund na "mm:ss"
    public formatTime(ms: number): string {
        const totalSeconds = Math.floor(ms / ONE_SECOND);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        const pad = (num: number) => num.toString().padStart(2, '0');
        return `${pad(minutes)}:${pad(seconds)}`;
    }

    // Oblicza i zwraca podsumowanie sesji
    public getSummary(): SessionSummary {
        const totalTimeMs = this.getTotalSessionTimeMs();
        const totalCards = this.cardsInSession.length;
        
        // Sumujemy tylko czas spędzony na ocenionych fiszkach
        const totalTimeGraded = this.state.results.reduce((sum, r) => sum + r.timeSpentMs, 0);
        
        const avgTimeMs = totalCards > 0 ? totalTimeGraded / totalCards : 0;
        
        const hardCardsIds = this.state.results
            .filter(r => r.grade === 'NotYet')
            .map(r => r.cardId);

        const hardCards: Card[] = this.deck.cards.filter(card => hardCardsIds.includes(card.id));

        return {
            known: this.getKnownCount(),
            notYet: this.getNotYetCount(),
            totalTime: this.formatTime(totalTimeMs),
            avgTime: this.formatTime(avgTimeMs),
            hardCards: hardCards
        };
    }
    
    // Wymagania blokad
    public isFinishButtonActive(): boolean {
        return this.state.isCompleted;
    }

    public isCurrentCardGraded(): boolean {
        return this.getCurrentResult().grade !== null;
    }
}