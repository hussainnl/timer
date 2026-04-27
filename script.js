import { TimerUI } from "./src/js/ui-helpers.js";
import { SessionController } from "./src/js/session-controller.js";

const timerElement = document.getElementById("timer");
const timerTextElement = document.getElementById("timer-text");
const inputPanel = document.getElementById("input-panel");
const sessionNameInput = document.getElementById("session-name");
const hoursInput = document.getElementById("hours");
const minutesInput = document.getElementById("minutes");
const secondsInput = document.getElementById("seconds");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const resetButton = document.getElementById("reset");
const endSessionButton = document.getElementById("end-session");
const sessionsHistory = document.getElementById("sessions-history");
const sessionsEmpty = document.getElementById("sessions-empty");

const placeholderInputs = [sessionNameInput, hoursInput, minutesInput, secondsInput];
const timeInputs = [hoursInput, minutesInput, secondsInput];

const elements = {
    endSessionButton,
    hoursInput,
    inputPanel,
    minutesInput,
    placeholderInputs,
    resetButton,
    secondsInput,
    sessionNameInput,
    sessionsEmpty,
    sessionsHistory,
    startButton,
    stopButton,
    timeInputs,
    timerElement,
    timerTextElement,
};

const ui = new TimerUI(elements);
const sessionController = new SessionController({ elements, ui });

ui.setupInputEnhancements();

startButton.addEventListener("click", () => {
    sessionController.startSession();
});

stopButton.addEventListener("click", () => {
    sessionController.toggleSessionPause();
});

resetButton.addEventListener("click", () => {
    sessionController.resetSession();
});

endSessionButton.addEventListener("click", () => {
    sessionController.endSession();
});

sessionController.initialize();
