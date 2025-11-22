import { SessionState, CardResult } from '../models/index.js'; 

const STORAGE_KEY_PREFIX = 'flashcard_session_';

/**
 * Zapisuje stan sesji do localStorage.
 * @param state - aktualny stan sesji.
 */
export function saveSession(state: SessionState): void {
    const key = STORAGE_KEY_PREFIX + state.deckTitle;
    try {
        state.lastReviewDate = Date.now(); 
        localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
        console.error("Błąd zapisu do localStorage", e);
    }
}

/**
 * Wczytuje stan sesji z localStorage.
 * @param deckTitle - tytuł talii.
 * @returns Zapisany stan sesji lub null.
 */
export function loadSession(deckTitle: string): SessionState | null {
    const key = STORAGE_KEY_PREFIX + deckTitle;
    try {
        const json = localStorage.getItem(key);
        if (json) {
            const loadedState: SessionState = JSON.parse(json);
            return {
                ...loadedState,
                // Zapewnienie kompatybilności wstecznej dla starszych zapisów
                filterSettings: loadedState.filterSettings || { shuffle: true, filterTag: null, repeatOnlyHard: false }
            };
        }
    } catch (e) {
        console.error("Błąd odczytu z localStorage", e);
    }
    return null;
}

/**
 * Usuwa stan sesji z localStorage.
 * @param deckTitle - tytuł talii.
 */
export function clearSession(deckTitle: string): void {
    const key = STORAGE_KEY_PREFIX + deckTitle;
    localStorage.removeItem(key);
}

/**
 * Wczytuje poprzednie wyniki (CardResult[]) dla danej talii (do trybu powtórki).
 * @param deckTitle - tytuł talii.
 * @returns Tablica CardResult[] lub pusta tablica, jeśli brak danych.
 */
export function getDeckResults(deckTitle: string): CardResult[] {
    const state = loadSession(deckTitle);
    return state ? state.results : [];
}