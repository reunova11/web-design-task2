// main.js
import Dashboard from './js/Dashboard.js';

const root = document.getElementById('dashboard-root');
const dashboard = new Dashboard(root);

// Buttons
const btnTodo = document.getElementById('add-todo');
const btnQuote = document.getElementById('add-quote');
const btnAdvice = document.getElementById('add-advice');

btnTodo.addEventListener('click', () => dashboard.addWidget('todo'));
btnQuote.addEventListener('click', () => dashboard.addWidget('quote'));
btnAdvice.addEventListener('click', () => dashboard.addWidget('advice'));

// For demo: add one of each on load
dashboard.addWidget('todo');
dashboard.addWidget('quote');