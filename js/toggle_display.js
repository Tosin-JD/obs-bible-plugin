// toggle display on and off
const toggleDisplay = document.getElementById("toggle-display");

toggleDisplay.addEventListener("click", function() {
    let sendSettingsChannel = new BroadcastChannel("settings");
    sendSettingsChannel.postMessage({ toggleDisplay: "toggleDisplay" });
    sendSettingsChannel.close();
});
<<<<<<< HEAD

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'ArrowUp') {
        // toggle display on and off
        let sendSettingsChannel = new BroadcastChannel("settings");
        sendSettingsChannel.postMessage({ toggleDisplay: "toggleDisplay" });
        sendSettingsChannel.close();
    }
});
=======
>>>>>>> 011b7423a553ca7018aa38c82443b16038a60b75
