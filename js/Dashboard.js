// js/Dashboard.js
import ToDoWidget from './ToDoWidget.js';
import QuoteWidget from './QuoteWidget.js';
import AdviceWidget from './AdviceWidget.js';

export default class Dashboard {
  /**
   * container: DOM element where widgets will be rendered
   */
  constructor(container) {
    if (!container) throw new Error('Dashboard requires container element');
    this.container = container;
    // keep link to dashboard on container for widgets to call remove via header button
    this.container.__dashboardInstance = this;
    this.widgets = []; // {id, instance}
    this.typeMap = {
      'todo': ToDoWidget,
      'quote': QuoteWidget,
      'advice': AdviceWidget
    };
  }

  /**
   * Добавляет виджет указанного типа.
   * @param {string} widgetType - 'todo'|'quote'|'advice'
   */
  addWidget(widgetType) {
    const Klass = this.typeMap[widgetType];
    if (!Klass) {
      console.warn('Unknown widget type', widgetType);
      return null;
    }
    const id = `w-${Math.random().toString(36).slice(2,9)}`;
    // create instance
    const instance = new Klass({ id });
    const node = instance.render();
    // append to DOM
    this.container.appendChild(node);
    this.widgets.push({ id, instance });
    return id;
  }

  /**
   * Удаляет виджет по ID: вызывает destroy и удаляет из коллекции.
   * @param {string} widgetId
   */
  removeWidget(widgetId) {
    const idx = this.widgets.findIndex(w => w.id === widgetId);
    if (idx === -1) return false;
    const { instance } = this.widgets[idx];
    try {
      instance.destroy();
    } catch (e) { console.error(e); }
    this.widgets.splice(idx,1);
    return true;
  }

  /**
   * Удаляет все виджеты
   */
  clearAll() {
    [...this.widgets].forEach(w => this.removeWidget(w.id));
  }

  /**
   * Возвращает snapshot состояния (для демонстрации)
   */
  snapshot() {
    return this.widgets.map(w => ({
      id: w.id,
      type: w.instance.constructor.name,
      state: { ... (w.instance.tasks ? { tasks: w.instance.tasks } : {} ), current: w.instance.current || null }
    }));
  }
}