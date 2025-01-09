// Helper functions for handling DOM elements
const getElementById = (id) => document.getElementById(id);

// Helper function for creating the animation data
const createAnimationData = (type, duration, easing, isVisible) => ({
    type,
    duration,
    easing,
    display: isVisible ? 'flex' : 'none'
});

// Function to send the animation message
const sendAnimationMessage = (animationData) => {
    const sendChannel = new BroadcastChannel("obs-bible-animation");
    sendChannel.postMessage(animationData);
    sendChannel.close();
    localStorage.setItem('obs-bible-animationData', JSON.stringify(animationData));
};

// Toggle the display state
const toggleDisplayState = (toggleDisplay) => !toggleDisplay.checked;

// Update the DOM state and send the animation message
const updateStateAndSendMessage = (toggleDisplay, animationTypeSelect, durationInput, easingSelect) => {
    const updatedToggleDisplay = toggleDisplayState(toggleDisplay);
    const animationData = createAnimationData(
        animationTypeSelect.value,
        durationInput.value,
        easingSelect.value,
        updatedToggleDisplay
    );
    toggleDisplay.checked = updatedToggleDisplay;
    sendAnimationMessage(animationData);
};

// Functional event handler for button click
const handleButtonClick = (toggleDisplay, animationTypeSelect, durationInput, easingSelect) => () => {
    updateStateAndSendMessage(toggleDisplay, animationTypeSelect, durationInput, easingSelect);
};

// Functional event handler for keydown (Ctrl + ArrowUp)
const handleKeydown = (toggleDisplay, animationTypeSelect, durationInput, easingSelect) => (event) => {
    if (event.ctrlKey && event.key === 'ArrowUp') {
        event.preventDefault();
        updateStateAndSendMessage(toggleDisplay, animationTypeSelect, durationInput, easingSelect);
    }
};

// Main function to initialize the app
const initializeApp = () => {
    const animationTypeSelect = getElementById('animation-type');
    const durationInput = getElementById('animation-duration');
    const easingSelect = getElementById('animation-easing');
    const toggleButton = getElementById("toggle-button-display");
    const toggleDisplay = getElementById("toggle-display");

    toggleButton.addEventListener('click', handleButtonClick(toggleDisplay, animationTypeSelect, durationInput, easingSelect));
    document.addEventListener('keydown', handleKeydown(toggleDisplay, animationTypeSelect, durationInput, easingSelect));
};

// Run the app
initializeApp();
