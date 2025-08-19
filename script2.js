const calculator = document.querySelector('.calculator');
const display = document.querySelector('.calculator-display');
const buttons = document.querySelector('.calculator-buttons');

let firstValue = null;
let operator = null;
let waitingForSecondValue = false;

function updateDisplay() {
    display.textContent = display.textContent.replace(/^0+(?=\d)/, '');
    if (display.textContent.length > 9) {
        display.style.fontSize = '2.5rem';
    } else {
        display.style.fontSize = '3.5rem';
    }
}

buttons.addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) return;

    // Add active class for visual feedback
    target.classList.add('active');
    setTimeout(() => {
        target.classList.remove('active');
    }, 100); // Remove after a short delay

    if (target.classList.contains('operator-button')) {
        handleOperator(target.textContent);
        return;
    }

    if (target.classList.contains('action-button')) {
        handleActionButton(target.textContent);
        return;
    }

    if (target.classList.contains('button-decimal')) {
        inputDecimal(target.textContent);
        return;
    }

    inputDigit(target.textContent);
});

function inputDigit(digit) {
    if (waitingForSecondValue) {
        display.textContent = digit;
        waitingForSecondValue = false;
    } else {
        display.textContent = display.textContent === '0' ? digit : display.textContent + digit;
    }
    updateDisplay();
}

function inputDecimal(dot) {
    if (waitingForSecondValue) return;
    if (!display.textContent.includes(dot)) {
        display.textContent += dot;
    }
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(display.textContent);

    if (operator && waitingForSecondValue) {
        operator = nextOperator;
        return;
    }

    if (firstValue === null) {
        firstValue = inputValue;
    } else if (operator) {
        const result = performCalculation[`${operator}`](firstValue, inputValue);
        display.textContent = `${parseFloat(result.toFixed(7))}`;
        firstValue = result;
    }

    waitingForSecondValue = true;
    operator = nextOperator;
}

function handleActionButton(action) {
    const inputValue = parseFloat(display.textContent);

    if (action === 'AC') {
        firstValue = null;
        operator = null;
        waitingForSecondValue = false;
        display.textContent = '0';
    } else if (action === '+/-') {
        display.textContent = (inputValue * -1).toString();
    } else if (action === '%') {
        display.textContent = (inputValue / 100).toString();
    }
}

const performCalculation = {
    '÷': (first, second) => first / second,
    '×': (first, second) => first * second,
    '+': (first, second) => first + second,
    '-': (first, second) => first - second,
    '=': (first, second) => second,
};
