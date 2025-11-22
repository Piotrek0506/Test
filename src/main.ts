// src/main.ts

// @ts-ignore
import deckData from './data/deck.json'; 

import { Deck, FilterSettings, SessionState } from './models/index.js'; 
import { FlashcardSession } from './logic/session.js'; 
import { renderStartScreen, renderCardViewHtml, renderSummaryScreen, drawBarChart } from './renderers/index.js'; 
import { loadSession, clearSession } from './storage/storage.js'; 

const app = document.getElementById('app') as HTMLDivElement;
const deck: Deck = deckData as Deck;
let session: FlashcardSession | null = null;
let cardRevealed = false;

// Domyślne ustawienia z pliku JSON (w razie braku zapisu)
let currentFilterSettings: FilterSettings = {
    filterTag: null,
    repeatOnlyHard: false,
    shuffle: deck.session.shuffle 
};

/**
 * Eksportuje wyniki bieżącej sesji do pliku JSON.
 */
function exportResultsToJson(deckTitle: string, state: SessionState): void {
    const filename = `${deckTitle.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().slice(0,10)}_results.json`;
    
    const exportData = {
        deckTitle: state.deckTitle,
        sessionStartTime: new Date(state.sessionStartTime).toLocaleString(),
        isCompleted: state.isCompleted,
        filterSettings: state.filterSettings,
        summary: session?.getSummary(), 
        results: state.results
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert(`Wyniki pomyślnie wyeksportowano do ${filename}`);
}


function updateStatsPanel(totalTime: string, cardTime: string): void {
    const totalTimer = document.getElementById('session-timer');
    const cardTimer = document.getElementById('card-timer');
    if (totalTimer) totalTimer.textContent = totalTime;
    if (cardTimer) cardTimer.textContent = cardTime;
}

/**
 * Przełącza do ekranu głównego, resetując bieżący stan sesji.
 */
function goToStartScreen() {
    if (session) {
        session.stopTimer();
        // Zgodnie z wymaganiem, nie usuwamy stanu, chyba że zaczynamy powtórkę.
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
    
    if (session.getState().cardOrderIds.length === 0) {
        alert('Brak fiszek spełniających kryteria filtrowania/powtórki. Zmień ustawienia i spróbuj ponownie.');
        goToStartScreen();
        return;
    }
    
    // Resetujemy 'cardRevealed', jeśli to nowa karta, lub używamy stanu oceny
    if (newCard) {
        cardRevealed = session.isCurrentCardGraded();
    }
    
    const isCardGraded = session.isCurrentCardGraded();
    
    app.innerHTML = renderCardViewHtml(session, cardRevealed);
    
    session.stopTimer();
    if (deck.session.showTimer) {
        session.startTimer(updateStatsPanel);
    }
    
    // --- Event Listenery ---
    
    document.getElementById('main-menu-btn')?.addEventListener('click', goToStartScreen);

    document.getElementById('show-answer-btn')?.addEventListener('click', () => {
        cardRevealed = true;
        showCardView(false); 
    });

    // Przyciski oceniania - aktywne tylko dla nieocenionych kart
    if (!isCardGraded) {
        document.getElementById('grade-known-btn')?.addEventListener('click', () => {
            session!.gradeCard('Known');
            handleCardGraded();
        });

        document.getElementById('grade-notyet-btn')?.addEventListener('click', () => {
            session!.gradeCard('NotYet');
            handleCardGraded();
        });
    }

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
    
    // Akcja zakończenia: aktywowana tylko, gdy wszystkie fiszki ocenione
    document.getElementById('finish-session-btn')?.addEventListener('click', () => {
        if (session?.isFinishButtonActive()) {
            session.stopTimer();
            showSummary();
        } else {
             alert('Musisz ocenić wszystkie fiszki, aby zakończyć sesję!');
        }
    });
}

/**
 * Obsługa zdarzenia po ocenie fiszki (automatyczne przejście).
 */
function handleCardGraded() {
    // Jeśli nie ukończono, próbujemy przejść do następnej karty.
    if (!session!.isSessionCompleted() && session!.goToNext()) {
        showCardView();
    } else {
        // Jeśli jesteśmy na ostatniej karcie i właśnie ją oceniliśmy, odświeżamy 
        // widok, aby przycisk "Zakończ sesję" stał się aktywny.
        showCardView(false); 
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
    
    document.getElementById('return-to-start-btn')?.addEventListener('click', goToStartScreen);
    
    document.getElementById('export-json-btn')?.addEventListener('click', () => {
        if (session) {
            exportResultsToJson(deck.deckTitle, session.getState());
        }
    });
    
    document.getElementById('repeat-hard-btn')?.addEventListener('click', () => {
        // Tworzymy nową sesję z włączonym trybem powtórki trudnych
        const initialSettings: FilterSettings = {
            shuffle: currentFilterSettings.shuffle, 
            filterTag: null, 
            repeatOnlyHard: true 
        };
        
        const newSession = new FlashcardSession(deck, initialSettings);
        
        if (newSession.getState().cardOrderIds.length > 0) {
            // Wymagane czyszczenie stanu dla nowej sesji, by zacząć "od zera"
            clearSession(deck.deckTitle);
            
            session = newSession;
            currentFilterSettings = session.getState().filterSettings; 
            
            showCardView();
        } else {
            alert('Brak trudnych fiszek do powtórki.');
            goToStartScreen(); 
        }
    });
}

/**
 * Renderuje widok startowy i podpina event listenery.
 */
function showStartScreen() {
    app.innerHTML = renderStartScreen(deck, currentFilterSettings);
    
    // Ustawienie aktualnych wartości filtrów w UI
    (document.getElementById('tag-filter') as HTMLSelectElement).value = currentFilterSettings.filterTag || '';
    (document.getElementById('shuffle-setting') as HTMLInputElement).checked = currentFilterSettings.shuffle;
    (document.getElementById('repeat-hard-setting') as HTMLInputElement).checked = currentFilterSettings.repeatOnlyHard;
    
    // Event Listenery dla zmian filtrów (aktualizują currentFilterSettings)
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
    
    // Start sesji
    document.getElementById('start-session-btn')?.addEventListener('click', () => {
        // Tworzenie nowej sesji z aktualnymi ustawieniami filtrów
        session = new FlashcardSession(deck, currentFilterSettings); 
        
        currentFilterSettings = session.getState().filterSettings; // Użyj finalnych ustawień z sesji (np. po resecie repeatOnlyHard)

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
        // Wczytanie zapisanych filtrów, nawet jeśli sesja jest ukończona, by z nich wystartować
        currentFilterSettings = savedSessionState.filterSettings; 
        
        // Próbujemy kontynuować zapisaną sesję
        session = new FlashcardSession(deck, currentFilterSettings);
    }

    if (session && session.isSessionCompleted()) {
        showSummary();
    } else if (session && session.getState().sessionStartTime !== 0) {
        showCardView();
    } else {
        // Jeśli brak zapisu lub sesja jest świeżo zainicjalizowana bez postępu, resetujemy filtry.
        if (!savedSessionState) {
            currentFilterSettings = {
                filterTag: null,
                repeatOnlyHard: false,
                shuffle: deck.session.shuffle
            };
        }
        showStartScreen();
    }
}

// Uruchomienie aplikacji
initApp();
