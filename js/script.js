/* ==========================================================
   Лабораторная работа №4. Основы JavaScript
   Вариант 12: время автономной работы гаджетов
   ========================================================== */

'use strict';

// Исходные данные: время автономной работы в часах (мои замеры)
var gadgets = [
  'Samsung Galaxy S25 Ultra',
  'Apple MacBook Air M4',
  'Sony WH-1000XM6',
  'Valve Steam Deck OLED',
  'Nintendo Switch OLED',
  'ASUS ROG Ally',
  'Meta Quest 3'
];

var batteryHours = [9.5, 8.6, 9, 4.2, 4, 3.5, 2.5];

// Границы из задания
var LONG_LIFE = 8; // долгожители: больше 8 часов
var LOW_LIFE = 4;  // слабая автономность: 4 часа и меньше

/**
 * Максимальное значение в массиве.
 * Перебираем элементы и запоминаем наибольший.
 */
function findMax(numbers) {
  var max = numbers[0];

  for (var i = 1; i < numbers.length; i++) {
    if (numbers[i] > max) {
      max = numbers[i];
    }
  }

  return max;
}

/**
 * Фильтрация: оставляем значения больше заданной границы.
 */
function filterAbove(numbers, limit) {
  var result = [];

  for (var i = 0; i < numbers.length; i++) {
    if (numbers[i] > limit) {
      result.push(numbers[i]);
    }
  }

  return result;
}

/**
 * Сумма всех значений массива.
 */
function getSum(numbers) {
  var sum = 0;

  for (var i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }

  return sum;
}

/**
 * Среднее арифметическое. Пустой массив отдаёт 0, чтобы не получить NaN.
 */
function getAverage(numbers) {
  if (numbers.length === 0) {
    return 0;
  }

  return getSum(numbers) / numbers.length;
}

/**
 * Устройства со слабой автономностью: количество, доля и названия.
 * Цикл while — для разнообразия конструкций.
 */
function countLowBattery(numbers, names, limit) {
  var count = 0;
  var lowNames = [];
  var i = 0;

  while (i < numbers.length) {
    if (numbers[i] <= limit) {
      count++;
      lowNames.push(names[i]);
    }
    i++;
  }

  return {
    count: count,
    share: (count / numbers.length) * 100,
    names: lowNames
  };
}

/**
 * Имя пользователя. Если окно закрыли или строка пустая — «Гость».
 */
function askName() {
  var name = prompt('Как вас зовут?', '');

  if (name === null || name.trim() === '') {
    return 'Гость';
  }

  return name.trim();
}

/**
 * Округление до одного знака после запятой.
 */
function round1(value) {
  return Math.round(value * 10) / 10;
}

/**
 * Число в привычном для русского текста виде: 5.9 -> «5,9».
 */
function formatNumber(value) {
  return String(round1(value)).replace('.', ',');
}

/**
 * Основная логика: считает показатели и выводит результаты.
 */
function main() {
  var userName = askName();
  alert('Привет, ' + userName + '! Сейчас посчитаем автономность моих гаджетов.');
  console.log('Пользователь: ' + userName);

  var total = getSum(batteryHours);
  var average = getAverage(batteryHours);
  var max = findMax(batteryHours);
  var longLife = filterAbove(batteryHours, LONG_LIFE);
  var low = countLowBattery(batteryHours, gadgets, LOW_LIFE);

  // Таблица исходных данных в консоли
  console.log('Всего устройств: ' + batteryHours.length);
  console.log('Суммарное время работы: ' + formatNumber(total) + ' ч');
  console.log('Максимум: ' + max + ' ч (' + gadgets[batteryHours.indexOf(max)] + ')');
  console.log('Долгожители (> ' + LONG_LIFE + ' ч): ' + longLife.join(', ') + ' ч');

  console.log(
    'Устройств со слабой автономностью (<= ' + LOW_LIFE + ' ч): ' +
    low.count + ' шт., доля ' + formatNumber(low.share) + '%'
  );
  console.log('Это: ' + low.names.join(', '));

  // Дополнительное условие из задания
  if (average < 6) {
    console.log('Стоит обратить внимание на энергоэффективность');
  } else {
    console.log('Средняя автономность в норме');
  }

  alert(
    'Среднее время работы — ' + formatNumber(average) + ' часов, ' +
    longLife.length + ' устройств — долгожители.'
  );
}

// Расчёт запускается по кнопке, чтобы окна не появлялись при каждой перезагрузке
window.addEventListener('DOMContentLoaded', function () {
  var button = document.getElementById('calc-button');

  if (!button) {
    console.warn('Кнопка расчёта не найдена, скрипт ЛР №4 не запущен');
    return;
  }

  button.addEventListener('click', main);
});
