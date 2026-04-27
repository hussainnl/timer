

export class TimerUI {
    constructor(elements) {
        this.elements = elements;
        this.sanitizeInput = this.sanitizeInput.bind(this);
        this.hidePlaceholderOnFocus = this.hidePlaceholderOnFocus.bind(this);
        this.restorePlaceholderOnBlur = this.restorePlaceholderOnBlur.bind(this);
    }

    formatTime(value) {
        return value.toString().padStart(2, "0");
    }

    formatSessionDuration(durationInSeconds) {
        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        const seconds = durationInSeconds % 60;

        return `${this.formatTime(hours)}h:${this.formatTime(minutes)}m:${this.formatTime(seconds)}s`;
    }

    sanitizeInput(event) {
        event.target.value = event.target.value.replace(/\D/g, "");
    }

    hidePlaceholderOnFocus(event) {
        event.target.placeholder = "";
    }

    restorePlaceholderOnBlur(event) {
        if (event.target.value === "") {
            event.target.placeholder = event.target.dataset.placeholder || "";
        }
    }

    restoreAllPlaceholders() {
        this.elements.placeholderInputs.forEach((input) => {
            input.placeholder = input.dataset.placeholder || "";
        });
    }

    setupInputEnhancements() {
        this.elements.placeholderInputs.forEach((input) => {
            input.dataset.placeholder = input.placeholder;
            input.addEventListener("focus", this.hidePlaceholderOnFocus);
            input.addEventListener("blur", this.restorePlaceholderOnBlur);
        });

        this.elements.timeInputs.forEach((input) => {
            input.addEventListener("input", this.sanitizeInput);
        });
    }

    showTimerView() {
        this.elements.inputPanel.classList.add("hidden");
        this.elements.timerElement.classList.remove("hidden");
        this.elements.timerElement.classList.add("flex");
    }

    showInputView() {
        this.elements.timerElement.classList.add("hidden");
        this.elements.timerElement.classList.remove("flex");
        this.elements.inputPanel.classList.remove("hidden");
    }

    renderTimer(totalSeconds) {
        this.elements.timerTextElement.textContent = this.formatSessionDuration(totalSeconds);
    }

    setButtonDisabledState(button, isDisabled) {
        button.disabled = isDisabled;
        button.classList.toggle("opacity-50", isDisabled);
        button.classList.toggle("cursor-not-allowed", isDisabled);
    }

    updateControls(state) {
        const { startButton, stopButton, endSessionButton, sessionNameInput } = this.elements;

        stopButton.textContent = state.isPaused ? "استئناف الجلسة" : "توقف الجلسة";

        this.setButtonDisabledState(startButton, state.hasStarted);
        this.setButtonDisabledState(stopButton, !state.hasStarted);
        this.setButtonDisabledState(endSessionButton, !state.hasStarted);

        sessionNameInput.disabled = state.hasStarted;
        sessionNameInput.classList.toggle("opacity-70", state.hasStarted);
    }

    resetForm() {
        const {
            timerTextElement,
            sessionNameInput,
            hoursInput,
            minutesInput,
            secondsInput,
        } = this.elements;

        timerTextElement.textContent = "00h:00m:00s";
        sessionNameInput.value = "";
        hoursInput.value = "";
        minutesInput.value = "";
        secondsInput.value = "";
        this.restoreAllPlaceholders();
    }

    addSessionToHistory(name, durationInSeconds) {
        const sessionItem = document.createElement("div");
        const sessionName = document.createElement("p");
        const sessionTime = document.createElement("p");

        sessionItem.className = "flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3";
        sessionName.className = "text-lg font-semibold text-teal-200";
        sessionTime.className = "text-sm font-medium text-slate-300";

        sessionName.textContent = name;
        sessionTime.textContent = this.formatSessionDuration(durationInSeconds);

        sessionItem.append(sessionName, sessionTime);
        this.elements.sessionsHistory.prepend(sessionItem);
        this.elements.sessionsEmpty.classList.add("hidden");
        this.elements.sessionsHistory.classList.remove("hidden");
    }
}

