// js/UIComponent.js
export default class UIComponent {
  /**
   * Базовый класс для всех виджетов
   * @param {Object} cfg - конфигурация {id, title, container}
   */
  constructor(cfg = {}) {
    const { id = `w-${Math.random().toString(36).slice(2,9)}`, title = 'Widget', container = null } = cfg;
    this.id = id;
    this.title = title;
    this.container = container; // DOM node where widget will be appended
    this.el = null;             // корневой DOM-элемент виджета
    this._listeners = [];       // список привязанных обработчиков для корректного удаления
    this.minimized = false;
  }

  /**
   * Создает DOM-элемент виджета.
   * Дочерним классам — переопределять renderBody(), этот метод собирает каркас.
   */
  render() {
    const wrapper = document.createElement('article');
    wrapper.classList.add('widget');
    wrapper.dataset.widgetId = this.id;

    // header
    const header = document.createElement('div');
    header.className = 'widget-header';

    const titleEl = document.createElement('div');
    titleEl.className = 'widget-title';
    titleEl.textContent = this.title;

    const actions = document.createElement('div');
    actions.className = 'widget-actions';

    // minimize button
    const btnMin = document.createElement('button');
    btnMin.className = 'icon-btn';
    btnMin.title = 'Minimize';
    btnMin.innerHTML = '—';
    btnMin.addEventListener('click', () => this.toggleMinimize());

    // close button
    const btnClose = document.createElement('button');
    btnClose.className = 'icon-btn';
    btnClose.title = 'Close';
    btnClose.innerHTML = '✕';
    btnClose.addEventListener('click', () => {
      if (this.container && this.container.__dashboardInstance) {
        this.container.__dashboardInstance.removeWidget(this.id);
      } else {
        this.destroy();
      }
    });

    actions.appendChild(btnMin);
    actions.appendChild(btnClose);

    header.appendChild(titleEl);
    header.appendChild(actions);

    const body = document.createElement('div');
    body.className = 'widget-body';

    // call subclass to fill body
    const inner = this.renderBody();
    if (inner instanceof HTMLElement) {
      body.appendChild(inner);
    } else if (Array.isArray(inner)) {
      inner.forEach(n => n instanceof HTMLElement && body.appendChild(n));
    } else if (typeof inner === 'string') {
      body.innerHTML = inner;
    }

    wrapper.appendChild(header);
    wrapper.appendChild(body);

    this.el = wrapper;
    this._headerEl = header;
    this._bodyEl = body;

    return wrapper;
  }

  /**
   * Переопределяется в дочерних классах — возвращает содержимое body.
   */
  renderBody() {
    return document.createElement('div'); // пустой по умолчанию
  }

  /**
   * Переключение состояния минификации
   */
  toggleMinimize() {
    this.minimized = !this.minimized;
    if (this._bodyEl) {
      this._bodyEl.style.display = this.minimized ? 'none' : '';
    }
  }

  /**
   * Удаление виджета: снимаем слушатели, удаляем элемент из DOM.
   */
  destroy() {
    // remove stored listeners
    this._listeners.forEach(({el, event, handler}) => {
      try { el.removeEventListener(event, handler); } catch(e){ /* ignore */ }
    });
    this._listeners = [];

    // remove element from DOM
    if (this.el && this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }
    this.el = null;
    this._bodyEl = null;
    this._headerEl = null;
  }

  /**
   * Утилита: добавляет слушатель и запоминает его для удаления позже.
   * @param {Element} el
   * @param {string} event
   * @param {Function} handler
   */
  addListener(el, event, handler) {
    el.addEventListener(event, handler);
    this._listeners.push({el, event, handler});
  }
}