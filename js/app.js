/**
 * Translation App - Main Logic
 * Supports English <-> Chinese translation
 * Primary API: MyMemory
 * Fallback API: LibreTranslate
 */

// ========================================
// State Management
// ========================================
const state = {
    sourceLang: 'en',
    targetLang: 'zh-CN',
    isTranslating: false,
    debounceTimer: null,
    history: [],
    theme: 'light'
};

// ========================================
// DOM Elements
// ========================================
const elements = {
    sourceInput: document.getElementById('sourceInput'),
    resultText: document.getElementById('resultText'),
    resultPlaceholder: document.getElementById('resultPlaceholder'),
    resultLoading: document.getElementById('resultLoading'),
    translateBtn: document.getElementById('translateBtn'),
    swapBtn: document.getElementById('swapBtn'),
    clearBtn: document.getElementById('clearBtn'),
    copyBtn: document.getElementById('copyBtn'),
    sourceLang: document.getElementById('sourceLang'),
    targetLang: document.getElementById('targetLang'),
    charCount: document.getElementById('charCount'),
    autoDetectHint: document.getElementById('autoDetectHint'),
    apiStatus: document.getElementById('apiStatus'),
    errorMessage: document.getElementById('errorMessage'),
    errorText: document.getElementById('errorText'),
    errorClose: document.getElementById('errorClose'),
    themeToggle: document.getElementById('themeToggle'),
    historyHeader: document.getElementById('historyHeader'),
    historyToggle: document.getElementById('historyToggle'),
    historyContent: document.getElementById('historyContent'),
    historyList: document.getElementById('historyList'),
    historyEmpty: document.getElementById('historyEmpty'),
    clearHistoryBtn: document.getElementById('clearHistoryBtn')
};

// ========================================
// Initialize
// ========================================
function init() {
    loadTheme();
    loadHistory();
    bindEvents();
    updateLanguageLabels();
}

// ========================================
// Event Binding
// ========================================
function bindEvents() {
    // Input with debounce for auto-translate
    elements.sourceInput.addEventListener('input', handleInput);

    // Keyboard shortcut: Ctrl+Enter to translate
    elements.sourceInput.addEventListener('keydown', handleKeydown);

    // Translate button
    elements.translateBtn.addEventListener('click', () => translate());

    // Swap languages
    elements.swapBtn.addEventListener('click', swapLanguages);

    // Clear button
    elements.clearBtn.addEventListener('click', clearAll);

    // Copy button
    elements.copyBtn.addEventListener('click', copyResult);

    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);

    // History toggle
    elements.historyHeader.addEventListener('click', toggleHistory);

    // Clear history
    elements.clearHistoryBtn.addEventListener('click', clearHistory);

    // Error close
    elements.errorClose.addEventListener('click', hideError);
}

// ========================================
// Input Handler with Debounce
// ========================================
function handleInput() {
    const text = elements.sourceInput.value.trim();
    updateCharCount(text.length);
    autoDetectLanguage(text);

    // Clear previous timer
    if (state.debounceTimer) {
        clearTimeout(state.debounceTimer);
    }

    // Auto-translate after 800ms of inactivity
    if (text.length > 0) {
        state.debounceTimer = setTimeout(() => {
            translate();
        }, 800);
    } else {
        showPlaceholder();
    }
}

// ========================================
// Keyboard Handler
// ========================================
function handleKeydown(e) {
    // Ctrl+Enter or Cmd+Enter to translate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        translate();
    }
}

// ========================================
// Auto-detect Language
// ========================================
function autoDetectLanguage(text) {
    if (!text) {
        elements.autoDetectHint.textContent = '自动检测语言';
        return;
    }

    const hasChinese = /[\u4e00-\u9fa5]/.test(text);

    if (hasChinese) {
        state.sourceLang = 'zh-CN';
        state.targetLang = 'en';
        elements.autoDetectHint.textContent = '检测到中文 → 翻译为英文';
    } else {
        state.sourceLang = 'en';
        state.targetLang = 'zh-CN';
        elements.autoDetectHint.textContent = '检测到英文 → 翻译为中文';
    }

    updateLanguageLabels();
}

// ========================================
// Update Language Labels
// ========================================
function updateLanguageLabels() {
    elements.sourceLang.textContent = state.sourceLang === 'en' ? 'English' : '中文';
    elements.targetLang.textContent = state.targetLang === 'en' ? 'English' : '中文';
}

// ========================================
// Swap Languages
// ========================================
function swapLanguages() {
    // Swap language state
    [state.sourceLang, state.targetLang] = [state.targetLang, state.sourceLang];
    updateLanguageLabels();

    // Swap text content
    const resultText = elements.resultText.textContent;
    if (resultText && resultText !== '') {
        elements.sourceInput.value = resultText;
        updateCharCount(resultText.length);
        autoDetectLanguage(resultText);
        translate();
    }

    // Animate swap button
    elements.swapBtn.style.transform = 'rotate(180deg)';
    setTimeout(() => {
        elements.swapBtn.style.transform = '';
    }, 300);
}

// ========================================
// Clear All
// ========================================
function clearAll() {
    elements.sourceInput.value = '';
    showPlaceholder();
    updateCharCount(0);
    elements.autoDetectHint.textContent = '自动检测语言';
    hideError();
    elements.sourceInput.focus();
}

// ========================================
// Show Placeholder
// ========================================
function showPlaceholder() {
    elements.resultPlaceholder.style.display = 'flex';
    elements.resultText.style.display = 'none';
    elements.resultLoading.style.display = 'none';
    elements.apiStatus.textContent = '';
}

// ========================================
// Show Loading
// ========================================
function showLoading() {
    elements.resultPlaceholder.style.display = 'none';
    elements.resultText.style.display = 'none';
    elements.resultLoading.style.display = 'flex';
    elements.apiStatus.textContent = '翻译中...';
    elements.translateBtn.disabled = true;
    state.isTranslating = true;
}

// ========================================
// Hide Loading
// ========================================
function hideLoading() {
    elements.resultLoading.style.display = 'none';
    elements.translateBtn.disabled = false;
    state.isTranslating = false;
}

// ========================================
// Show Result
// ========================================
function showResult(text, apiName) {
    elements.resultPlaceholder.style.display = 'none';
    elements.resultLoading.style.display = 'none';
    elements.resultText.style.display = 'block';
    elements.resultText.textContent = text;
    elements.apiStatus.textContent = `API: ${apiName}`;
}

// ========================================
// Show Error
// ========================================
function showError(message) {
    elements.errorText.textContent = message;
    elements.errorMessage.style.display = 'flex';
}

function hideError() {
    elements.errorMessage.style.display = 'none';
}

// ========================================
// Update Character Count
// ========================================
function updateCharCount(count) {
    elements.charCount.textContent = `${count} / 5000`;
    if (count > 4500) {
        elements.charCount.style.color = 'var(--error-color)';
    } else {
        elements.charCount.style.color = '';
    }
}

// ========================================
// Translation Core
// ========================================
async function translate() {
    const text = elements.sourceInput.value.trim();
    if (!text || state.isTranslating) return;

    showLoading();
    hideError();

    try {
        // Try MyMemory API first (primary)
        let result = await translateWithMyMemory(text);
        if (result) {
            hideLoading();
            showResult(result.translatedText, 'MyMemory');
            addToHistory(text, result.translatedText, state.sourceLang, state.targetLang);
            return;
        }
    } catch (myMemoryError) {
        console.warn('MyMemory API failed, trying LibreTranslate:', myMemoryError);
    }

    try {
        // Fallback to LibreTranslate API
        let result = await translateWithLibreTranslate(text);
        if (result) {
            hideLoading();
            showResult(result.translatedText, 'LibreTranslate');
            addToHistory(text, result.translatedText, state.sourceLang, state.targetLang);
            return;
        }
    } catch (libreError) {
        console.error('LibreTranslate API failed:', libreError);
    }

    // Both APIs failed
    hideLoading();
    showError('翻译失败，请检查网络连接后重试。 / Translation failed. Please check your network connection.');
    showPlaceholder();
}

// ========================================
// MyMemory API (Primary)
// ========================================
async function translateWithMyMemory(text) {
    const source = state.sourceLang === 'zh-CN' ? 'zh-CN' : 'en';
    const target = state.sourceLang === 'zh-CN' ? 'en' : 'zh-CN';
    const langPair = `${source}|${target}`;

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`MyMemory API returned ${response.status}`);
    }

    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData && data.responseData.translatedText) {
        return { translatedText: data.responseData.translatedText };
    }

    throw new Error('MyMemory API returned invalid response');
}

// ========================================
// LibreTranslate API (Fallback)
// ========================================
async function translateWithLibreTranslate(text) {
    const source = state.sourceLang === 'zh-CN' ? 'zh' : 'en';
    const target = state.sourceLang === 'zh-CN' ? 'en' : 'zh';

    const response = await fetch('https://libretranslate.com/translate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            q: text,
            source: source,
            target: target,
            format: 'text'
        })
    });

    if (!response.ok) {
        throw new Error(`LibreTranslate API returned ${response.status}`);
    }

    const data = await response.json();

    if (data.translatedText) {
        return { translatedText: data.translatedText };
    }

    throw new Error('LibreTranslate API returned invalid response');
}

// ========================================
// Copy Result
// ========================================
async function copyResult() {
    const text = elements.resultText.textContent;
    if (!text) return;

    try {
        await navigator.clipboard.writeText(text);

        // Show feedback
        const originalContent = elements.copyBtn.innerHTML;
        elements.copyBtn.innerHTML = '&#x2705;';
        elements.copyBtn.style.color = 'var(--success-color)';

        // Show floating feedback
        const feedback = document.createElement('div');
        feedback.className = 'copy-feedback';
        feedback.textContent = '已复制! Copied!';
        elements.resultText.parentElement.appendChild(feedback);

        setTimeout(() => {
            elements.copyBtn.innerHTML = originalContent;
            elements.copyBtn.style.color = '';
            feedback.remove();
        }, 1500);
    } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}

// ========================================
// Theme Management
// ========================================
function loadTheme() {
    const savedTheme = localStorage.getItem('translator-theme');
    state.theme = savedTheme || 'light';
    applyTheme();
}

function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('translator-theme', state.theme);
    applyTheme();
}

function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    const themeIcon = elements.themeToggle.querySelector('.theme-icon');
    themeIcon.textContent = state.theme === 'light' ? '🌙' : '☀️';
}

// ========================================
// History Management
// ========================================
function loadHistory() {
    try {
        const saved = localStorage.getItem('translator-history');
        state.history = saved ? JSON.parse(saved) : [];
    } catch (e) {
        state.history = [];
    }
    renderHistory();
}

function saveHistory() {
    try {
        localStorage.setItem('translator-history', JSON.stringify(state.history));
    } catch (e) {
        console.warn('Failed to save history:', e);
    }
}

function addToHistory(source, target, sourceLang, targetLang) {
    // Avoid duplicates
    const exists = state.history.some(item => item.source === source && item.target === target);
    if (exists) return;

    const item = {
        source,
        target,
        sourceLang,
        targetLang,
        timestamp: Date.now()
    };

    // Add to beginning, keep max 10
    state.history.unshift(item);
    if (state.history.length > 10) {
        state.history = state.history.slice(0, 10);
    }

    saveHistory();
    renderHistory();
}

function renderHistory() {
    if (state.history.length === 0) {
        elements.historyEmpty.style.display = 'flex';
        // Remove any existing history items
        const items = elements.historyList.querySelectorAll('.history-item');
        items.forEach(item => item.remove());
        return;
    }

    elements.historyEmpty.style.display = 'none';

    // Clear existing items (except empty message)
    const items = elements.historyList.querySelectorAll('.history-item');
    items.forEach(item => item.remove());

    state.history.forEach((item, index) => {
        const el = document.createElement('div');
        el.className = 'history-item';
        el.innerHTML = `
            <span class="history-source" title="${escapeHtml(item.source)}">${escapeHtml(truncate(item.source, 50))}</span>
            <span class="history-arrow">&#x2192;</span>
            <span class="history-target" title="${escapeHtml(item.target)}">${escapeHtml(truncate(item.target, 50))}</span>
        `;
        el.addEventListener('click', () => loadFromHistory(index));
        elements.historyList.appendChild(el);
    });
}

function loadFromHistory(index) {
    const item = state.history[index];
    if (!item) return;

    elements.sourceInput.value = item.source;
    updateCharCount(item.source.length);

    // Set language direction
    state.sourceLang = item.sourceLang;
    state.targetLang = item.targetLang;
    updateLanguageLabels();

    // Show result
    showResult(item.target, 'History');
}

function clearHistory() {
    state.history = [];
    saveHistory();
    renderHistory();
}

function toggleHistory() {
    const isHidden = elements.historyContent.style.display === 'none';
    elements.historyContent.style.display = isHidden ? 'block' : 'none';
    elements.historyToggle.classList.toggle('expanded', isHidden);
}

// ========================================
// Utility Functions
// ========================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function truncate(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// ========================================
// Start the App
// ========================================
document.addEventListener('DOMContentLoaded', init);
