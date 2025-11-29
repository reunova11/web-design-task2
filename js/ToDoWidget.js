// js/ToDoWidget.js
import UIComponent from './UIComponent.js';

export default class ToDoWidget extends UIComponent {
  constructor(cfg = {}) {
    super({ ...cfg, title: cfg.title || 'Список дел' });
    this.tasks = []; // internal state
  }

  renderBody() {
    const container = document.createElement('div');

    // input area
    const inputRow = document.createElement('div');
    inputRow.className = 'todo-input';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Новая задача...';

    const addBtn = document.createElement('button');
    addBtn.className = 'primary';
    addBtn.textContent = 'Добавить';

    inputRow.appendChild(input);
    inputRow.appendChild(addBtn);

    // list area
    const list = document.createElement('ul');
    list.className = 'todo-list';

    container.appendChild(inputRow);
    container.appendChild(list);

    // handlers
    const onAdd = () => {
      const text = input.value.trim();
      if (!text) return;
      const task = { id: `t-${Date.now()}`, text, done:false };
      this.tasks.push(task);
      this._renderTask(task, list);
      input.value = '';
    };

    this.addListener(addBtn, 'click', onAdd);
    this.addListener(input, 'keydown', (e) => {
      if (e.key === 'Enter') onAdd();
    });

    // Save references for destroy if needed
    this._listEl = list;
    return container;
  }

  _renderTask(task, listEl) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.dataset.taskId = task.id;

    const chk = document.createElement('input');
    chk.type = 'checkbox';
    chk.checked = !!task.done;

    const txt = document.createElement('span');
    txt.textContent = task.text;
    txt.style.flex = '1';

    const delBtn = document.createElement('button');
    delBtn.className = 'icon-btn';
    delBtn.title = 'Удалить';
    delBtn.innerHTML = '🗑';

    if (task.done) li.classList.add('completed');

    // handlers
    const onToggle = () => {
      task.done = chk.checked;
      li.classList.toggle('completed', task.done);
    };
    const onDelete = () => {
      this.tasks = this.tasks.filter(t => t.id !== task.id);
      if (li.parentNode) li.parentNode.removeChild(li);
    };

    this.addListener(chk, 'change', onToggle);
    this.addListener(delBtn, 'click', onDelete);

    li.appendChild(chk);
    li.appendChild(txt);
    li.appendChild(delBtn);

    listEl.appendChild(li);
  }

  destroy() {
    // call base implementation (removes listeners and element)
    super.destroy();
    // clear internal arrays
    this.tasks = [];
  }
}