const display = document.getElementById('display');
const formulaEl = document.getElementById('formula');

let expr = '';       // full expression being built, e.g. "5*-5"
let current = '0';   // what #display shows
let evaluated = false;

function isOperatorChar(ch) {
  return ch === '+' || ch === '-' || ch === '*' || ch === '/';
}

function update() {
  display.textContent = current;
  formulaEl.textContent = expr;
}

function pressNumber(digit) {
  if (evaluated) {
    expr = digit;
    current = digit;
    evaluated = false;
    update();
    return;
  }
  if (expr !== '' && isOperatorChar(expr[expr.length - 1])) {
    // just after an operator: start a new number
    expr += digit;
    current = digit;
  } else if (current === '0') {
    if (digit === '0') return;
    expr = expr.slice(0, -1) + digit;
    current = digit;
  } else if (current === '-' && expr === '-') {
    // negative number being started
    expr += digit;
    current = '-' + digit;
  } else {
    expr += digit;
    current += digit;
  }
  update();
}

function pressDecimal() {
  if (evaluated) {
    expr = '0.';
    current = '0.';
    evaluated = false;
    update();
    return;
  }
  if (expr !== '' && isOperatorChar(expr[expr.length - 1])) {
    expr += '0.';
    current = '0.';
  } else if (current.includes('.')) {
    return;
  } else {
    expr += '.';
    current += '.';
  }
  update();
}

function pressOperator(op) {
  if (evaluated) {
    expr = current + op;
    current = op;
    evaluated = false;
    update();
    return;
  }
  if (expr === '') {
    if (op === '-') {
      expr = '-';
      current = '-';
      update();
    }
    return;
  }
  const last = expr[expr.length - 1];
  if (isOperatorChar(last)) {
    if (op === '-' && last !== '-') {
      // allow a negative sign after an operator, e.g. 5 * -5
      expr += op;
      current = op;
    } else {
      // replace trailing operator(s) with the new one, e.g. 5 + * 7 -> 5 * 7
      expr = expr.replace(/[+\-*/]+$/, '') + op;
      current = op;
    }
  } else {
    expr += op;
    current = op;
  }
  update();
}

function evaluateExpression(e) {
  const clean = e.replace(/[+\-*/]+$/, '');
  if (!/^[0-9+\-*/. ]+$/.test(clean) || clean === '') return NaN;
  // eslint-disable-next-line no-new-func
  return Function('"use strict"; return (' + clean + ')')();
}

function pressEquals() {
  if (expr === '' || evaluated) return;
  const result = evaluateExpression(expr);
  if (Number.isNaN(result)) return;
  const rounded = parseFloat(result.toPrecision(12));
  current = String(rounded);
  expr = current;
  evaluated = true;
  update();
}

function pressClear() {
  expr = '';
  current = '0';
  evaluated = false;
  update();
}

const numbers = { zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9' };
Object.entries(numbers).forEach(([id, digit]) => {
  document.getElementById(id).addEventListener('click', () => pressNumber(digit));
});
document.getElementById('decimal').addEventListener('click', pressDecimal);
document.getElementById('add').addEventListener('click', () => pressOperator('+'));
document.getElementById('subtract').addEventListener('click', () => pressOperator('-'));
document.getElementById('multiply').addEventListener('click', () => pressOperator('*'));
document.getElementById('divide').addEventListener('click', () => pressOperator('/'));
document.getElementById('equals').addEventListener('click', pressEquals);
document.getElementById('clear').addEventListener('click', pressClear);

update();
