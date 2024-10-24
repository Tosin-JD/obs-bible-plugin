// // toggle display on and off
const toggleButton = document.getElementById("toggle-button");
const toggleDisplay = document.getElementById("toggle-display");

toggleDisplay.addEventListener("change", function() {
    let sendSettingsChannel = new BroadcastChannel("settings");
    if (toggleDisplay.checked) {
        sendSettingsChannel.postMessage({ toggleDisplay: "none" });
    } else {
        sendSettingsChannel.postMessage({ toggleDisplay: "flex" });
    }

    sendSettingsChannel.close();
});

toggleButton.addEventListener('click', function(){
    let sendSettingsChannel = new BroadcastChannel("settings");
    if (toggleDisplay.checked){
        toggleDisplay.checked = false;
        sendSettingsChannel.postMessage({ toggleDisplay: "flex" });
    }else{
        toggleDisplay.checked = true;
        sendSettingsChannel.postMessage({ toggleDisplay: "none" });
    }
});

document.addEventListener('keydown', function(event) {
    // Check if the Control key and the Arrow Down key are pressed
    if (event.ctrlKey && event.key === 'ArrowUp') {
        // Prevent default behavior if necessary
        event.preventDefault();

        let sendSettingsChannel = new BroadcastChannel("settings");
        if (toggleDisplay.checked){
            toggleDisplay.checked = false;
            sendSettingsChannel.postMessage({ toggleDisplay: "flex" });
        }else{
            toggleDisplay.checked = true;
            sendSettingsChannel.postMessage({ toggleDisplay: "none" });
        }
    }
});
