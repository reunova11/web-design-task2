// js/QuoteWidget.js
import UIComponent from './UIComponent.js';

export default class QuoteWidget extends UIComponent {
  constructor(cfg = {}) {
    super({ ...cfg, title: cfg.title || 'Случайная цитата' });
    this.current = null;
    this.controller = null; // for fetch abort if needed
  }

  renderBody() {
    const container = document.createElement('div');

    const quoteText = document.createElement('div');
    quoteText.className = 'quote-text';
    quoteText.textContent = 'Загрузка цитаты...';

    const meta = document.createElement('div');
    meta.className = 'small';
    meta.textContent = '';

    const btnRow = document.createElement('div');
    btnRow.style.display = 'flex';
    btnRow.style.gap = '8px';

    const refreshBtn = document.createElement('button');
    refreshBtn.className = 'primary';
    refreshBtn.textContent = 'Обновить';

    btnRow.appendChild(refreshBtn);

    container.appendChild(quoteText);
    container.appendChild(meta);
    container.appendChild(btnRow);

    // handlers
    const load = () => this.fetchQuote().then(q => {
      if (!q) return;
      this.current = q;
      quoteText.textContent = `"${q.content}"`;
      meta.textContent = `— ${q.author || 'Неизвестный'}`;
    }).catch(_ => {
      quoteText.textContent = 'Не удалось загрузить цитату.';
      meta.textContent = '';
    });

    this.addListener(refreshBtn, 'click', load);

    // initial load
    load();

    this._quoteEl = quoteText;
    this._metaEl = meta;
    return container;
  }

  async fetchQuote() {
    // Use quotable.io public API
    if (this.controller) {
      try { this.controller.abort(); } catch(e){}
    }
    this.controller = new AbortController();
    const signal = this.controller.signal;
    const res = await fetch('https://api.quotable.io/random', { signal });
    if (!res.ok) throw new Error('Fetch error');
    const data = await res.json();
    return data; // {content, author, ...}
  }

  destroy() {
    try { if (this.controller) this.controller.abort(); } catch(e){}
    this.controller = null;
    super.destroy();
  }
}