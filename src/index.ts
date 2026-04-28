import { SessionApi } from "./scrpits/session-api.js";
import { SessionController } from "./scrpits/session-controller.js";
import { TimerUI, type TimerUIElements } from "./scrpits/ui-helpers.js";

function getRequiredElement<T extends HTMLElement>(id: string): T {
    const element = document.getElementById(id);

    if (!element) {
        throw new Error(`Missing required element: ${id}`);
    }

    return element as T;
}

const timerElement = getRequiredElement<HTMLDivElement>("timer");
const timerTextElement = getRequiredElement<HTMLSpanElement>("timer-text");
const inputPanel = getRequiredElement<HTMLDivElement>("input-panel");
const sessionNameInput = getRequiredElement<HTMLInputElement>("session-name");
const hoursInput = getRequiredElement<HTMLInputElement>("hours");
const minutesInput = getRequiredElement<HTMLInputElement>("minutes");
const secondsInput = getRequiredElement<HTMLInputElement>("seconds");
const startButton = getRequiredElement<HTMLButtonElement>("start");
const stopButton = getRequiredElement<HTMLButtonElement>("stop");
const resetButton = getRequiredElement<HTMLButtonElement>("reset");
const endSessionButton = getRequiredElement<HTMLButtonElement>("end-session");
const sessionsHistory = getRequiredElement<HTMLDivElement>("sessions-history");
const sessionsEmpty = getRequiredElement<HTMLDivElement>("sessions-empty");

const placeholderInputs: HTMLInputElement[] = [sessionNameInput, hoursInput, minutesInput, secondsInput];
const timeInputs: HTMLInputElement[] = [hoursInput, minutesInput, secondsInput];

const elements: TimerUIElements = {
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

const sessionApi = new SessionApi();
const ui = new TimerUI(elements);
const sessionController = new SessionController( elements, ui, sessionApi );

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
