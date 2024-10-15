<<<<<<< HEAD
// toggle display on and off
const toggleDisplay = document.getElementById("toggle-display");

toggleDisplay.addEventListener("click", function() {
    let sendSettingsChannel = new BroadcastChannel("settings");
    sendSettingsChannel.postMessage({ toggleDisplay: "toggleDisplay" });
    sendSettingsChannel.close();
});

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'ArrowUp') {
        // toggle display on and off
        let sendSettingsChannel = new BroadcastChannel("settings");
        sendSettingsChannel.postMessage({ toggleDisplay: "toggleDisplay" });
        sendSettingsChannel.close();
    }
=======
// toggle display on and off
const toggleDisplay = document.getElementById("toggle-display");

toggleDisplay.addEventListener("click", function() {
    let sendSettingsChannel = new BroadcastChannel("settings");
    sendSettingsChannel.postMessage({ toggleDisplay: "toggleDisplay" });
    sendSettingsChannel.close();
});

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'ArrowUp') {
        // toggle display on and off
        let sendSettingsChannel = new BroadcastChannel("settings");
        sendSettingsChannel.postMessage({ toggleDisplay: "toggleDisplay" });
        sendSettingsChannel.close();
    }
>>>>>>> 7bdaa887cbc72a2c6830d7520e8929adaa87cab8
});