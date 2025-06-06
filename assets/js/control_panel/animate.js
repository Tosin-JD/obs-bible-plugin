const getElementById = (id) => document.getElementById(id);

const createAnimationData = (type, duration, easing, isVisible) => ({
    type,
    duration,
    easing,
    display: isVisible ? 'flex' : 'none'
});

const sendAnimationMessage = (animationData) => {
    const sendChannel = new BroadcastChannel("obs-bible-animation");
    sendChannel.postMessage(animationData);
    sendChannel.close();
    localStorage.setItem('obs-bible-animationData', JSON.stringify(animationData));
};

const toggle = (checked) => !checked;

const updateStateAndSendMessage = ({ toggleDisplay, animationType, duration, easing }) => {
    const updatedVisibility = toggle(toggleDisplay.checked);
    const animationData = createAnimationData(
        animationType.value,
        duration.value,
        easing.value,
        updatedVisibility
    );

    sendAnimationMessage(animationData);
    toggleDisplay.checked = updatedVisibility;
};

const createButtonHandler = (elements) => () => updateStateAndSendMessage(elements);

const createKeyHandler = (elements) => (event) => {
    if (event.ctrlKey && event.key === 'ArrowUp') {
        event.preventDefault();
        updateStateAndSendMessage(elements);
    }
};

const initializeApp = () => {
    const elements = {
        animationType: getElementById('animation-type'),
        duration: getElementById('animation-duration'),
        easing: getElementById('animation-easing'),
        toggleButton: getElementById("toggle-button-display"),
        toggleDisplay: getElementById("toggle-display"),
    };

    elements.toggleButton.addEventListener('click', createButtonHandler(elements));
    document.addEventListener('keydown', createKeyHandler(elements));
};

initializeApp();
