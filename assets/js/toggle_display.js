const toggleButton = document.getElementById("toggle-button");
const toggleDisplay = document.getElementById("toggle-display");

const sendToggleMessage = (isChecked) => {
    const sendSettingsChannel = new BroadcastChannel("settings");
    sendSettingsChannel.postMessage({ toggleDisplay: isChecked ? "none" : "flex" });
    sendSettingsChannel.close();
};

const toggleDisplayState = () => {
    toggleDisplay.checked = !toggleDisplay.checked;
    sendToggleMessage(toggleDisplay.checked);
};

toggleDisplay.addEventListener("change", () => {
    sendToggleMessage(toggleDisplay.checked);
});

toggleButton.addEventListener('click', toggleDisplayState);

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'ArrowUp') {
        event.preventDefault();
        toggleDisplayState();
    }
});
