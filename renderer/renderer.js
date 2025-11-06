// renderer/renderer.js
const display = document.getElementById('display');
const keys = document.querySelector('.keys');

let first = null;      // angka pertama
let op = null;         // operator (+ - × ÷)
let waitingNext = false; // apakah menunggu angka berikutnya

function format(n) {
  // hindari floating error dan tampilkan maksimal 12 digit
  const s = Number(n).toPrecision(12);
  // hilangkan trailing zero
  return parseFloat(s).toString();
}

function inputNumber(d) {
  if (waitingNext) {
    display.textContent = d;
    waitingNext = false;
  } else {
    const cur = display.textContent === '0' ? '' : display.textContent;
    display.textContent = cur + d;
  }
}

function inputDot() {
  if (waitingNext) {
    display.textContent = '0.';
    waitingNext = false;
    return;
  }
  if (!display.textContent.includes('.')) {
    display.textContent += '.';
  }
}

function setOperator(nextOp) {
  const value = parseFloat(display.textContent);
  if (first === null) {
    first = value;
  } else if (!waitingNext) {
    first = compute(first, op, value);
    display.textContent = format(first);
  }
  op = nextOp;
  waitingNext = true;
}

function compute(a, operator, b) {
  switch (operator) {
    case '+': return a + b;
    case '-': return a - b;
    case '×': return a * b;
    case '÷': return b === 0 ? NaN : a / b;
    default:  return b;
  }
}

function clearAll() {
  first = null;
  op = null;
  waitingNext = false;
  display.textContent = '0';
}

function percent() {
  const v = parseFloat(display.textContent) / 100;
  display.textContent = format(v);
  if (!waitingNext && first !== null && op === null) {
    first = v;
  }
}

function equals() {
  if (op === null) return;
  const second = parseFloat(display.textContent);
  const result = compute(first, op, second);
  display.textContent = isNaN(result) ? 'Error' : format(result);
  first = isNaN(result) ? null : result;
  op = null;
  waitingNext = true;
}

keys.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const action = btn.dataset.action;
  if (action === 'num') return inputNumber(btn.textContent.trim());
  if (action === 'dot') return inputDot();
  if (action === 'op')  return setOperator(btn.dataset.op);
  if (action === 'equals') return equals();
  if (action === 'clear') return clearAll();
  if (action === 'percent') return percent();
});
