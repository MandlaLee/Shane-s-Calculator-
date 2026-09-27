/* =========================================
   SHANE'S CALCULATOR
   Calculator Engine
   ========================================= */


const resultDisplay = document.getElementById("result");
const expressionDisplay = document.getElementById("expression");

const buttons = document.querySelectorAll(".button");


/* =========================================
   CALCULATOR STATE
   ========================================= */

let currentValue = "0";

let previousValue = null;

let currentOperator = null;

let waitingForOperand = false;


/* =========================================
   DISPLAY
   ========================================= */

function updateDisplay() {

    resultDisplay.textContent = currentValue;

    if (
        previousValue !== null &&
        currentOperator !== null
    ) {

        expressionDisplay.textContent =
            `${formatNumber(previousValue)} ${currentOperator}`;

    } else {

        expressionDisplay.textContent = "";

    }
}


/* =========================================
   NUMBER FORMATTING
   ========================================= */

function formatNumber(number) {

    if (!Number.isFinite(Number(number))) {
        return "Error";
    }

    return Number(number).toLocaleString(
        "en-US",
        {
            maximumFractionDigits: 12
        }
    );
}


/* =========================================
   INPUT NUMBER
   ========================================= */

function inputNumber(number) {

    if (currentValue === "Error") {

        currentValue = number;

        waitingForOperand = false;

        updateDisplay();

        return;
    }


    if (waitingForOperand) {

        currentValue = number;

        waitingForOperand = false;

    } else {

        if (currentValue === "0") {

            currentValue = number;

        } else {

            currentValue += number;

        }

    }


    updateDisplay();
}


/* =========================================
   DECIMAL
   ========================================= */

function inputDecimal() {

    if (currentValue === "Error") {

        currentValue = "0.";

        waitingForOperand = false;

        updateDisplay();

        return;
    }


    if (waitingForOperand) {

        currentValue = "0.";

        waitingForOperand = false;

    } else if (!currentValue.includes(".")) {

        currentValue += ".";

    }


    updateDisplay();
}


/* =========================================
   SELECT OPERATOR
   ========================================= */

function chooseOperator(operator) {

    const value = Number(currentValue);


    if (!Number.isFinite(value)) {
        return;
    }


    /*
     * If an operator is already waiting
     * and the user enters another number,
     * calculate the previous operation first.
     */

    if (
        currentOperator !== null &&
        previousValue !== null &&
        !waitingForOperand
    ) {

        calculate();

    }


    previousValue = Number(currentValue);

    currentOperator = operator;

    waitingForOperand = true;


    updateDisplay();
}


/* =========================================
   CALCULATE
   ========================================= */

function calculate() {

    if (
        previousValue === null ||
        currentOperator === null
    ) {
        return;
    }


    const firstNumber = Number(previousValue);

    const secondNumber = Number(currentValue);

    let answer;


    switch (currentOperator) {

        case "+":
            answer = firstNumber + secondNumber;
            break;


        case "−":
            answer = firstNumber - secondNumber;
            break;


        case "×":
            answer = firstNumber * secondNumber;
            break;


        case "÷":

            if (secondNumber === 0) {

                showError();

                return;
            }

            answer = firstNumber / secondNumber;

            break;


        default:
            return;
    }


    /*
     * Prevent floating-point results such as
     * 0.30000000000000004
     */

    answer = Number(answer.toFixed(12));


    currentValue = String(answer);

    previousValue = null;

    currentOperator = null;

    waitingForOperand = true;


    updateDisplay();
}


/* =========================================
   ERROR
   ========================================= */

function showError() {

    currentValue = "Error";

    previousValue = null;

    currentOperator = null;

    waitingForOperand = true;


    updateDisplay();
}


/* =========================================
   CLEAR
   ========================================= */

function clearCalculator() {

    currentValue = "0";

    previousValue = null;

    currentOperator = null;

    waitingForOperand = false;


    updateDisplay();
}


/* =========================================
   BACKSPACE
   ========================================= */

function backspace() {

    if (waitingForOperand) {
        return;
    }


    if (currentValue === "Error") {

        clearCalculator();

        return;
    }


    if (currentValue.length <= 1) {

        currentValue = "0";

    } else {

        currentValue =
            currentValue.slice(0, -1);

    }


    updateDisplay();
}


/* =========================================
   PERCENTAGE
   ========================================= */

function percentage() {

    const value = Number(currentValue);


    if (!Number.isFinite(value)) {
        return;
    }


    currentValue =
        String(value / 100);


    updateDisplay();
}


/* =========================================
   BUTTON EVENTS
   ========================================= */

buttons.forEach(button => {

    button.addEventListener("click", () => {

        const value =
            button.dataset.value;

        const action =
            button.dataset.action;


        /* Number / decimal */

        if (value !== undefined) {

            if (
                value >= "0" &&
                value <= "9"
            ) {

                inputNumber(value);

                return;
            }


            if (value === ".") {

                inputDecimal();

                return;
            }


            /* Operator */

            chooseOperator(value);

            return;
        }


        /* Actions */

        switch (action) {

            case "clear":

                clearCalculator();

                break;


            case "backspace":

                backspace();

                break;


            case "percent":

                percentage();

                break;


            case "equals":

                calculate();

                break;

        }

    });

});


/* =========================================
   KEYBOARD SUPPORT
   ========================================= */

document.addEventListener("keydown", event => {

    const key = event.key;


    /* Numbers */

    if (/^[0-9]$/.test(key)) {

        inputNumber(key);

        return;
    }


    /* Decimal */

    if (key === ".") {

        inputDecimal();

        return;
    }


    /* Operators */

    if (key === "+") {

        chooseOperator("+");

        return;
    }


    if (key === "-") {

        chooseOperator("−");

        return;
    }


    if (key === "*") {

        chooseOperator("×");

        return;
    }


    if (key === "/") {

        event.preventDefault();

        chooseOperator("÷");

        return;
    }


    /* Equals */

    if (
        key === "Enter" ||
        key === "="
    ) {

        calculate();

        return;
    }


    /* Backspace */

    if (key === "Backspace") {

        backspace();

        return;
    }


    /* Escape */

    if (key === "Escape") {

        clearCalculator();

        return;
    }


    /* Percentage */

    if (key === "%") {

        percentage();

        return;
    }

});


/* =========================================
   INITIAL DISPLAY
   ========================================= */

updateDisplay();
