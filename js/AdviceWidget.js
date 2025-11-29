// js/AdviceWidget.js
import UIComponent from './UIComponent.js';

export default class AdviceWidget extends UIComponent {
  constructor(cfg = {}) {
    super({ ...cfg, title: cfg.title || 'Совет дня' });
    this.current = null;
    this.controller = null;
  }

  renderBody() {
    const container = document.createElement('div');

    const advText = document.createElement('div');
    advText.className = 'quote-text';
    advText.textContent = 'Загрузка совета...';

    const btnRow = document.createElement('div');
    btnRow.style.display = 'flex';
    btnRow.style.gap = '8px';

    const refreshBtn = document.createElement('button');
    refreshBtn.className = 'primary';
    refreshBtn.textContent = 'Обновить';

    btnRow.appendChild(refreshBtn);

    container.appendChild(advText);
    container.appendChild(btnRow);

    const load = async () => {
      try {
        const data = await this.fetchAdvice();
        this.current = data;
        advText.textContent = `"${data.advice}"`;
      } catch (e) {
        advText.textContent = 'Не удалось загрузить совет.';
      }
    };

    this.addListener(refreshBtn, 'click', load);
    load();

    this._advEl = advText;
    return container;
  }

  async fetchAdvice() {
    // Advice Slip API (no API key)
    // Note: adviceslip API sometimes caches; works for demo.
    if (this.controller) {
      try { this.controller.abort(); } catch(e){}
    }
    this.controller = new AbortController();
    const res = await fetch('https://api.adviceslip.com/advice', { signal: this.controller.signal });
    if (!res.ok) throw new Error('Fetch error');
    const data = await res.json();
    // { slip: { id, advice } }
    return data.slip;
  }

  destroy() {
    try { if (this.controller) this.controller.abort(); } catch(e){}
    this.controller = null;
    super.destroy();
  }
}