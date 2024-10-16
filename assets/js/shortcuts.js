document.addEventListener('keydown', function(event) {
    // Check if the Control key is pressed and the 'L' key (key code 76) is pressed
    if (event.ctrlKey && event.shiftKey && event.key === 'L' || event.ctrlKey && event.shiftKey && event.key === 'l') {
        event.preventDefault(); // Prevent default action (e.g., clearing console in some browsers)
        let selectedValue = "Left"
    
        let sendSettingsChannel = new BroadcastChannel("settings");
        sendSettingsChannel.postMessage({ selectedTextAlignment: selectedValue });
        sendSettingsChannel.close();
    }
    if (event.ctrlKey && event.shiftKey && event.key === 'R' || event.ctrlKey && event.shiftKey && event.key === 'r') {
        event.preventDefault(); // Prevent the default refresh action

        let selectedValue = "Right";
        let sendSettingsChannel = new BroadcastChannel("settings");
        sendSettingsChannel.postMessage({ selectedTextAlignment: selectedValue });
        sendSettingsChannel.close();
    }
    if (event.ctrlKey && event.shiftKey && event.key === 'E' || event.ctrlKey && event.shiftKey && event.key === 'e') {
        event.preventDefault(); // Prevent default action (e.g., clearing console in some browsers)
        let selectedValue = "Center"
    
        let sendSettingsChannel = new BroadcastChannel("settings");
        sendSettingsChannel.postMessage({ selectedTextAlignment: selectedValue });
        sendSettingsChannel.close();
    }
    if (event.ctrlKey && event.shiftKey && event.key === 'J' || event.ctrlKey && event.shiftKey && event.key === 'j') {
        event.preventDefault(); // Prevent default action (e.g., clearing console in some browsers)
        let selectedValue = "Justify"
    
        let sendSettingsChannel = new BroadcastChannel("settings");
        sendSettingsChannel.postMessage({ selectedTextAlignment: selectedValue });
        sendSettingsChannel.close();
    }
});
