import type { TimerUI, TimerUIElements } from "./ui-helpers.js";

export interface SessionControllerOptions {
    elements: TimerUIElements;
    ui: TimerUI;
    totalSeconds: number;
}



export class SessionController {

    private totalSeconds: number;
    private interval: number | undefined;
    private initialDuration: number;
    private hasStarted: boolean;
    private isPaused: boolean;
    private activeSessionName: string;

    constructor(private readonly elements: TimerUIElements ,
        private readonly ui: TimerUI ) {
        this.ui = ui;
        this.interval = undefined;
        this.totalSeconds = 0;
        this.initialDuration = 0;
        this.hasStarted = false;
        this.isPaused = false;
        this.activeSessionName = "";
        this.tickTimer = this.tickTimer.bind(this);
    };
    startSession() {
        this.totalSeconds = this.readDurationFromInputs();

        if (this.totalSeconds <= 0) {
            return;
        }

        this.initialDuration = this.totalSeconds;
        this.hasStarted = true;
        this.isPaused = false;
        this.activeSessionName = this.elements.sessionNameInput.value.trim() || "جلسة بدون اسم";

        this.ui.renderTimer(this.totalSeconds);
        this.ui.showTimerView();
        this.applyControls();
        this.startCountdown();
    }

    readDurationFromInputs() {
        const { hoursInput, minutesInput, secondsInput } = this.elements;
        const hours = parseInt(hoursInput.value, 10) || 0;
        const minutes = parseInt(minutesInput.value, 10) || 0;
        const seconds = parseInt(secondsInput.value, 10) || 0;

        return (hours * 3600) + (minutes * 60) + seconds;
    }

    applyControls() {
        this.ui.updateControls({
            hasStarted: this.hasStarted,
            isPaused: this.isPaused,
        });
    }

    startCountdown() {
        clearInterval(this.interval);
        this.interval = setInterval(this.tickTimer, 1000);
    }

    completeSession(options ={addToHistory: false, alertMessage: ""}) {
        const { addToHistory  = false, alertMessage = "" } = options;
        const sessionName =
            this.activeSessionName || this.elements.sessionNameInput.value.trim() || "جلسة بدون اسم";

        if (addToHistory && this.initialDuration > 0) {
            this.ui.addSessionToHistory(sessionName, this.initialDuration);
        }

        this.resetState();

        if (alertMessage) {
            alert(alertMessage);
        }
    }

    resetState() {
        clearInterval(this.interval);
        this.interval = undefined;
        this.totalSeconds = 0;
        this.initialDuration = 0;
        this.hasStarted = false;
        this.isPaused = false;
        this.activeSessionName = "";
        this.ui.resetForm();
        this.ui.showInputView();
        this.applyControls();
    }


    tickTimer() {
        if (this.totalSeconds <= 0) {
            this.completeSession({ addToHistory: true, alertMessage: "انتهت الجلسة!" });
            return;
        }

        this.totalSeconds -= 1;
        this.ui.renderTimer(this.totalSeconds);

        if (this.totalSeconds === 0) {
            this.completeSession({ addToHistory: true, alertMessage: "انتهت الجلسة!" });
        }
    }



    toggleSessionPause() {
        if (!this.hasStarted) {
            return;
        }

        if (this.isPaused) {
            this.isPaused = false;
            this.applyControls();
            this.startCountdown();
            return;
        }

        clearInterval(this.interval);
        this.interval = undefined;
        this.isPaused = true;
        this.applyControls();
    }

    resetSession() {
        this.resetState();
    }

    endSession() {
        if (!this.hasStarted) {
            return;
        }

        this.completeSession({ addToHistory: true, alertMessage: "تم إنهاء الجلسة." });
    }

    initialize() {
        this.applyControls();
    }
}