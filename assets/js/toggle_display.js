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