import { Deck, FilterSettings } from '../models/index.js';
import { FlashcardSession } from '../logic/session.js'; 

export function renderFilterPanel(deck: Deck, currentSettings: FilterSettings): string {
    const tempSession = new FlashcardSession(deck, currentSettings);
    const uniqueTags = tempSession.getTagsInDeck();

    const tagOptions = uniqueTags.map(tag => 
        `<option value="${tag}" ${currentSettings.filterTag === tag ? 'selected' : ''}>${tag}</option>`
    ).join('');

    return `
        <h2>⚙️ Opcje Sesji</h2>
        <div class="filter-panel">
            <div class="filter-group">
                <label for="tag-filter">Filtruj po tagach:</label>
                <select id="tag-filter">
                    <option value="">Wszystkie tagi</option>
                    ${tagOptions}
                </select>
            </div>
            
            <div class="filter-group">
                <label for="shuffle-setting">Losowanie:</label>
                <input type="checkbox" id="shuffle-setting" ${currentSettings.shuffle ? 'checked' : ''}>
                <span>Losuj kolejność fiszek</span>
            </div>
            
            <div class="filter-group">
                <label for="repeat-hard-setting">Tryb powtórki:</label>
                <input type="checkbox" id="repeat-hard-setting" ${currentSettings.repeatOnlyHard ? 'checked' : ''}>
                <span>Tylko nieznane/trudne fiszki</span>
            </div>
        </div>
    `;
}
