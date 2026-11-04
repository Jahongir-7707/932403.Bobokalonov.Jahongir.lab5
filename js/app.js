/* ==========================================================
   Лабораторная работа №5. DOM и localStorage
   Вариант 12: список гаджетов с характеристиками
   ========================================================== */

'use strict';

// Ключи для localStorage
var KEY_GADGETS = 'lab5.gadgets';
var KEY_THEME = 'lab5.theme';
var KEY_HIDDEN = 'lab5.listHidden';

// Список, который показывается при первом открытии страницы
var DEFAULT_GADGETS = [
  {
    name: 'Samsung Galaxy S25 Ultra',
    specs: ['Экран 6,9", 1480 нит', 'Батарея 9,5 ч', 'Зум до 100×']
  },
  {
    name: 'Valve Steam Deck OLED',
    specs: ['Экран OLED 7,4"', 'Батарея 4,2 ч', 'Вес 640 г']
  }
];

// Текущее состояние страницы
var gadgets = [];

/**
 * Поиск элемента по id с проверкой: если элемента нет,
 * пишем в консоль и возвращаем null, а не падаем с ошибкой.
 */
function getElement(id) {
  var element = document.getElementById(id);

  if (!element) {
    console.error('Элемент с id "' + id + '" не найден в разметке');
    return null;
  }

  return element;
}

/* ---------- localStorage ---------- */

/**
 * Чтение из localStorage. Хранилище может быть недоступно
 * (приватный режим), а JSON — повреждён, поэтому try/catch.
 */
function loadFromStorage(key, fallback) {
  try {
    var raw = localStorage.getItem(key);

    if (raw === null) {
      return fallback;
    }

    return JSON.parse(raw);
  } catch (error) {
    console.warn('Не удалось прочитать "' + key + '": ' + error.message);
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn('Не удалось сохранить "' + key + '": ' + error.message);
    return false;
  }
}

/* ---------- Отрисовка ---------- */

/**
 * Создание карточки гаджета через createElement.
 * Возвращает готовый элемент <li>.
 */
function createGadgetCard(gadget, index) {
  var item = document.createElement('li');
  item.className = 'gadget';
  item.setAttribute('data-index', index);

  var title = document.createElement('h3');
  title.textContent = gadget.name;

  var list = document.createElement('ul');

  for (var i = 0; i < gadget.specs.length; i++) {
    var spec = document.createElement('li');
    spec.textContent = gadget.specs[i];
    list.appendChild(spec);
  }

  var button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn-remove';
  button.textContent = 'Удалить';
  button.setAttribute('data-index', index);

  item.appendChild(title);
  item.appendChild(list);
  item.appendChild(button);

  return item;
}

/**
 * Перерисовка всего списка и счётчика.
 */
function renderGadgets() {
  var container = getElement('gadget-list');

  if (!container) {
    return;
  }

  container.textContent = ''; // очистка старого содержимого

  if (gadgets.length === 0) {
    var note = document.createElement('li');
    note.className = 'empty-note';
    note.textContent = 'Список пуст. Добавьте первый гаджет.';
    container.appendChild(note);
  } else {
    for (var i = 0; i < gadgets.length; i++) {
      container.appendChild(createGadgetCard(gadgets[i], i));
    }
  }

  updateCounter();
}

/**
 * Счётчик: карточки ищем через querySelectorAll.
 */
function updateCounter() {
  var counter = getElement('counter');

  if (!counter) {
    return;
  }

  var cards = document.querySelectorAll('#gadget-list .gadget');
  var specs = document.querySelectorAll('#gadget-list .gadget ul li');

  counter.textContent =
    'Гаджетов в списке: ' + cards.length + ', характеристик: ' + specs.length;
}

/**
 * Сообщение об ошибке ввода под полями.
 */
function showError(message) {
  var box = document.querySelector('#collection .form-error');

  if (!box) {
    return;
  }

  box.textContent = message;
}

/* ---------- Действия пользователя ---------- */

function addGadget() {
  var nameInput = getElement('gadget-name');
  var specsInput = getElement('gadget-specs');

  if (!nameInput || !specsInput) {
    return;
  }

  var name = nameInput.value.trim();
  var specsText = specsInput.value.trim();

  if (name === '') {
    showError('Введите название гаджета');
    nameInput.focus();
    return;
  }

  if (specsText === '') {
    showError('Введите хотя бы одну характеристику');
    specsInput.focus();
    return;
  }

  // «8 ядер, 12 ГБ» -> ['8 ядер', '12 ГБ']
  var specs = specsText.split(',');
  var cleanSpecs = [];

  for (var i = 0; i < specs.length; i++) {
    var value = specs[i].trim();

    if (value !== '') {
      cleanSpecs.push(value);
    }
  }

  gadgets.push({ name: name, specs: cleanSpecs });
  saveToStorage(KEY_GADGETS, gadgets);
  renderGadgets();

  nameInput.value = '';
  specsInput.value = '';
  showError('');
  console.log('Добавлен гаджет: ' + name);
}

function removeLast() {
  if (gadgets.length === 0) {
    showError('Удалять нечего: список пуст');
    return;
  }

  var removed = gadgets.pop();
  saveToStorage(KEY_GADGETS, gadgets);
  renderGadgets();
  showError('');
  console.log('Удалён последний гаджет: ' + removed.name);
}

/**
 * Удаление конкретной карточки. Обработчик один на весь список:
 * проверяем, что клик пришёл по кнопке «Удалить».
 */
function handleListClick(event) {
  var button = event.target.closest('.btn-remove');

  if (!button) {
    return;
  }

  var index = Number(button.getAttribute('data-index'));

  if (isNaN(index) || index < 0 || index >= gadgets.length) {
    console.error('Некорректный индекс карточки: ' + button.getAttribute('data-index'));
    return;
  }

  var removed = gadgets.splice(index, 1)[0];
  saveToStorage(KEY_GADGETS, gadgets);
  renderGadgets();
  console.log('Удалён гаджет: ' + removed.name);
}

/**
 * Применение темы: класс на body + текст кнопки.
 */
function applyTheme(theme) {
  var button = getElement('theme-button');

  if (theme === 'light') {
    document.body.classList.add('theme-light');
  } else {
    document.body.classList.remove('theme-light');
  }

  if (button) {
    button.textContent = theme === 'light' ? 'Тёмная тема' : 'Светлая тема';
  }
}

function toggleTheme() {
  var isLight = document.body.classList.contains('theme-light');
  var next = isLight ? 'dark' : 'light';

  applyTheme(next);
  saveToStorage(KEY_THEME, next);
  console.log('Тема переключена на: ' + next);
}

/**
 * Скрытие и показ списка: класс .is-hidden + текст кнопки.
 */
function applyListVisibility(hidden) {
  var container = getElement('gadget-list');
  var button = getElement('toggle-list-button');

  if (!container || !button) {
    return;
  }

  if (hidden) {
    container.classList.add('is-hidden');
  } else {
    container.classList.remove('is-hidden');
  }

  button.textContent = hidden ? 'Показать список' : 'Скрыть список';
  button.setAttribute('aria-expanded', hidden ? 'false' : 'true');
}

function toggleList() {
  var container = getElement('gadget-list');

  if (!container) {
    return;
  }

  var hidden = !container.classList.contains('is-hidden');

  applyListVisibility(hidden);
  saveToStorage(KEY_HIDDEN, hidden);
}

/* ---------- Запуск ---------- */

function init() {
  // Восстановление состояния из localStorage
  gadgets = loadFromStorage(KEY_GADGETS, DEFAULT_GADGETS);

  if (!Array.isArray(gadgets)) {
    console.warn('В хранилище лежали не те данные, беру список по умолчанию');
    gadgets = DEFAULT_GADGETS;
  }

  applyTheme(loadFromStorage(KEY_THEME, 'dark'));
  renderGadgets();
  applyListVisibility(loadFromStorage(KEY_HIDDEN, false) === true);

  // Привязка обработчиков с проверкой существования кнопок
  var buttons = [
    { id: 'add-button', handler: addGadget },
    { id: 'remove-last-button', handler: removeLast },
    { id: 'toggle-list-button', handler: toggleList },
    { id: 'theme-button', handler: toggleTheme }
  ];

  for (var i = 0; i < buttons.length; i++) {
    var element = getElement(buttons[i].id);

    if (element) {
      element.addEventListener('click', buttons[i].handler);
    }
  }

  var list = document.querySelector('#gadget-list');

  if (list) {
    list.addEventListener('click', handleListClick);
  }

  console.log('ЛР №5: страница готова, гаджетов в списке — ' + gadgets.length);
}

window.addEventListener('DOMContentLoaded', init);
