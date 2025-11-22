// @ts-ignore
import deckData from './data/deck.json'; 

import { Deck, FilterSettings } from './models/index.js'; 
import { FlashcardSession } from './logic/session.js'; 
import { renderStartScreen, renderCardViewHtml, renderSummaryScreen, drawBarChart } from './renderers/index.js'; 
import { loadSession, clearSession } from './storage/storage.js'; 

const app = document.getElementById('app') as HTMLDivElement;
const deck: Deck = deckData as Deck;
let session: FlashcardSession | null = null;
let cardRevealed = false;

// Globalny obiekt przechowujący AKTUALNIE WYBRANE FILTRY na ekranie startowym.
// Używamy tego do rozpoczęcia nowej sesji, gdy użytkownik kliknie "Rozpocznij".
let currentFilterSettings: FilterSettings = {
    filterTag: null,
    repeatOnlyHard: false,
    shuffle: deck.session.shuffle 
};

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
 * Przełącza do ekranu głównego, resetując bieżący stan sesji.
 * Koryguje: Resetuje stan, aby można było rozpocząć nową sesję z nowymi filtrami.
 */
function goToStartScreen() {
    if (session) {
        session.stopTimer();
        // KLUCZOWA ZMIANA: Usuwamy stan sesji z localStorage, 
        // aby następny start był NOWĄ sesją z bieżącymi filtrami.
        clearSession(deck.deckTitle);
    }
    session = null;
    cardRevealed = false;
    showStartScreen();
}

/**
 * Renderuje widok fiszki i podpina event listenery.
 */
function showCardView(newCard: boolean = true) {
    if (!session) return;
    
    // Zabezpieczenie przed brakiem kart po filtrowaniu
    if (session.getState().cardOrderIds.length === 0) {
        alert('Brak fiszek spełniających kryteria filtrowania. Zmień ustawienia i spróbuj ponownie.');
        goToStartScreen();
        return;
    }
    
    // Weryfikacja, czy sesja została właśnie zakończona
    if (session.isSessionCompleted()) {
         showSummary();
         return;
    }

    if (newCard) {
        cardRevealed = session.isCurrentCardGraded();
    }
    
    app.innerHTML = renderCardViewHtml(session, cardRevealed);
    
    // Uruchomienie/Zatrzymanie timera
    session.stopTimer();
    if (deck.session.showTimer) {
        session.startTimer(updateStatsPanel);
    }
    
    // --- Event Listenery ---
    
    // NAPRAWIONE: Przycisk powrotu do menu w trakcie sesji
    document.getElementById('main-menu-btn')?.addEventListener('click', goToStartScreen);

    // ... (pozostała obsługa przycisków na fiszce bez zmian)

    document.getElementById('show-answer-btn')?.addEventListener('click', () => {
        cardRevealed = true;
        showCardView(false); 
    });

    document.getElementById('grade-known-btn')?.addEventListener('click', () => {
        session!.gradeCard('Known');
        handleCardGraded();
    });

    document.getElementById('grade-notyet-btn')?.addEventListener('click', () => {
        session!.gradeCard('NotYet');
        handleCardGraded();
    });

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
    
    document.getElementById('finish-session-btn')?.addEventListener('click', () => {
        if (session?.isFinishButtonActive()) {
            session.stopTimer();
            showSummary();
        }
    });
}

/**
 * Obsługa zdarzenia po ocenie fiszki.
 * Koryguje: Przejście do podsumowania zaraz po ostatniej ocenie.
 */
function handleCardGraded() {
    if (session!.isSessionCompleted()) {
        showSummary();
        return;
    }
    
    // Jeśli nie jest ostatnia karta, przejdź do następnej
    if (session!.goToNext()) {
        showCardView();
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
    
    drawBarChart(summary.known, summary.notYet);
    
    // Powrót do ekranu startowego (zawsze po zakończeniu/podsumowaniu)
    document.getElementById('return-to-start-btn')?.addEventListener('click', goToStartScreen);
    
    // Obsługa powtórki trudnych
    document.getElementById('repeat-hard-btn')?.addEventListener('click', () => {
        const newSession = session!.resetForHardCards();
        
        if (newSession.getState().cardOrderIds.length > 0) {
            session = newSession;
            currentFilterSettings = session.getState().filterSettings; 
            
            clearSession(deck.deckTitle); 
            
            showCardView();
        } else {
            alert('Brak trudnych fiszek do powtórki. Zaczynamy normalną sesję.');
            goToStartScreen(); 
        }
    });
}

/**
 * Renderuje widok startowy i podpina event listenery.
 */
function showStartScreen() {
    app.innerHTML = renderStartScreen(deck, currentFilterSettings);
    
    // Ustawienie wartości formularza na podstawie globalnego stanu currentFilterSettings
    (document.getElementById('tag-filter') as HTMLSelectElement).value = currentFilterSettings.filterTag || '';
    (document.getElementById('shuffle-setting') as HTMLInputElement).checked = currentFilterSettings.shuffle;
    (document.getElementById('repeat-hard-setting') as HTMLInputElement).checked = currentFilterSettings.repeatOnlyHard;
    
    // ... (Obsługa zmian filtrów bez zmian)
    
    document.getElementById('tag-filter')?.addEventListener('change', (e) => {
        currentFilterSettings.filterTag = (e.target as HTMLSelectElement).value || null;
        currentFilterSettings.repeatOnlyHard = false; 
        (document.getElementById('repeat-hard-setting') as HTMLInputElement).checked = false;
    });
    
    document.getElementById('shuffle-setting')?.addEventListener('change', (e) => {
        currentFilterSettings.shuffle = (e.target as HTMLInputElement).checked;
    });

    document.getElementById('repeat-hard-setting')?.addEventListener('change', (e) => {
        currentFilterSettings.repeatOnlyHard = (e.target as HTMLInputElement).checked;
        if (currentFilterSettings.repeatOnlyHard) {
            currentFilterSettings.filterTag = null; 
            (document.getElementById('tag-filter') as HTMLSelectElement).value = '';
        }
    });
    
    // Start sesji: Tworzy sesję na podstawie AKTUALLYCH WARTOŚCI currentFilterSettings.
    document.getElementById('start-session-btn')?.addEventListener('click', () => {
        session = new FlashcardSession(deck, currentFilterSettings); 
        
        // Zapisujemy ostateczne, zatwierdzone filtry sesji
        currentFilterSettings = session.getState().filterSettings;

        if (session.getState().cardOrderIds.length > 0) {
            showCardView();
        } else {
            alert('Brak fiszek spełniających kryteria filtrowania. Zmień ustawienia i spróbuj ponownie.');
            session = null;
        }
    });
}

/**
 * Inicjalizacja aplikacji.
 */
function initApp() {
    const savedSessionState = loadSession(deck.deckTitle);

    if (savedSessionState) {
        // Wczytanie zapisanych filtrów, jeśli istnieje zapisana sesja
        currentFilterSettings = savedSessionState.filterSettings;
        session = new FlashcardSession(deck, currentFilterSettings);
    }

    if (session && session.isSessionCompleted()) {
        showSummary();
    } else if (session && session.getState().sessionStartTime !== 0) {
        showCardView();
    } else {
        // Ustawienie domyślnych filtrów przy pierwszym uruchomieniu
        currentFilterSettings = {
            filterTag: null,
            repeatOnlyHard: false,
            shuffle: deck.session.shuffle
        };
        showStartScreen();
    }
}

// Uruchomienie aplikacji
initApp();
