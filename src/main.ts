// @ts-ignore
import deckData from './data/deck.json'; 

// Poprawione importy z jawnymi ścieżkami modułów (.js lub /index.js)
import { Deck } from './models/index.js'; 
import { FlashcardSession } from './logic/session.js'; 
import { renderStartScreen, renderCardViewHtml, renderSummaryScreen } from './renderers/index.js'; 
import { loadSession } from './storage/storage.js'; // Zmieniono z clearSession na loadSession

const app = document.getElementById('app') as HTMLDivElement;
const deck: Deck = deckData as Deck;
let session: FlashcardSession | null = null;
let cardRevealed = false;

/**
 * Aktualizuje panel statystyk (liczniki czasowe)
 */
function updateStatsPanel(totalTime: string, cardTime: string): void {
    const totalTimer = document.getElementById('session-timer');
    const cardTimer = document.getElementById('card-timer');
    if (totalTimer) totalTimer.textContent = totalTime;
    if (cardTimer) cardTimer.textContent = cardTime;
}

/**
 * Renderuje widok fiszki i podpina event listenery.
 */
function showCardView(newCard: boolean = true) {
    if (!session) return;
    
    // Jeśli przechodzimy do nowej fiszki, ukryj odpowiedź, chyba że jest już oceniona.
    if (newCard) {
        cardRevealed = session.isCurrentCardGraded();
    }
    
    app.innerHTML = renderCardViewHtml(session, cardRevealed);
    
    // Uruchomienie/Zatrzymanie timera
    session.stopTimer();
    if (!session.getState().isCompleted && deck.session.showTimer) {
        session.startTimer(updateStatsPanel);
    }
    
    // --- Event Listenery ---
    
    // 1. Pokaż odpowiedź
    document.getElementById('show-answer-btn')?.addEventListener('click', () => {
        cardRevealed = true;
        showCardView(false); // Ponowne renderowanie bez zmiany stanu sesji
    });

    // 2. Ocena: Znam
    document.getElementById('grade-known-btn')?.addEventListener('click', () => {
        session!.gradeCard('Known');
        handleCardGraded();
    });

    // 3. Ocena: Jeszcze nie
    document.getElementById('grade-notyet-btn')?.addEventListener('click', () => {
        session!.gradeCard('NotYet');
        handleCardGraded();
    });

    // 4. Nawigacja
    document.getElementById('prev-card-btn')?.addEventListener('click', () => {
        if (session!.goToPrevious()) {
            showCardView();
        }
    });

    document.getElementById('next-card-btn')?.addEventListener('click', () => {
        if (session!.goToNext()) {
            showCardView();
        }
    });
    
    // 5. Zakończ
    document.getElementById('finish-session-btn')?.addEventListener('click', () => {
        if (session?.isFinishButtonActive()) {
            session.stopTimer();
            showSummary();
        }
    });
}

/**
 * Obsługa zdarzenia po ocenie fiszki.
 */
function handleCardGraded() {
    if (session!.getState().isCompleted) {
        showSummary();
    } else {
        // Przechodzi do następnej fiszki
        if (session!.goToNext()) {
            showCardView();
        }
    }
}

/**
 * Renderuje widok podsumowania.
 */
function showSummary() {
    if (!session) return;
    
    session.stopTimer();
    const summary = session.getSummary();
    app.innerHTML = renderSummaryScreen(deck.deckTitle, summary);
    
    // Powrót do startowego
    document.getElementById('return-to-start-btn')?.addEventListener('click', () => {
        // clearSession(deck.deckTitle); // Opcjonalnie kasowanie stanu
        session = null;
        cardRevealed = false;
        showStartScreen();
    });
}

/**
 * Renderuje widok startowy i podpina event listenery.
 */
function showStartScreen() {
    app.innerHTML = renderStartScreen(deck.deckTitle, deck.cards.length);
    
    // Start sesji
    document.getElementById('start-session-btn')?.addEventListener('click', () => {
        // Tworzymy nową sesję, która wczyta zapisany stan lub zainicjalizuje nową.
        session = new FlashcardSession(deck); 
        showCardView();
    });
}

/**
 * Inicjalizacja aplikacji na podstawie stanu (localStorage).
 */
function initApp() {
    // Sprawdzamy, czy istnieje zapisana sesja
    const savedSessionState = loadSession(deck.deckTitle);

    if (savedSessionState && savedSessionState.isCompleted) {
        session = new FlashcardSession(deck);
        showSummary();
    } else if (savedSessionState && savedSessionState.sessionStartTime !== 0) {
        session = new FlashcardSession(deck);
        showCardView();
    } else {
        showStartScreen();
    }
}

// Uruchomienie aplikacji
initApp();