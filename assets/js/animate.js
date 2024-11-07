const animationTypeSelect = document.getElementById('animation-type');
const durationInput = document.getElementById('animation-duration');
const easingSelect = document.getElementById('animation-easing');
const bgContainer = document.getElementById('bg-container');

const toggleButton = document.getElementById("toggle-button");
const toggleDisplay = document.getElementById("toggle-display");


const toggleDisplayState = (event) => {
    toggleDisplay.checked = !toggleDisplay.checked;
    sendAnimationMessage();
};

toggleButton.addEventListener('click', (event) => {
  toggleDisplayState(event);
});

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'ArrowUp') {
        event.preventDefault();
        toggleDisplayState();
    }
});

const sendAnimationMessage = () => {
    // const isCurrentlyVisible = bgContainer.style.display === 'flex';
    const isCurrentlyVisible = toggleDisplay.checked;
    
    const animationData = {
        type: animationTypeSelect.value,
        duration: durationInput.value,
        easing: easingSelect.value,
        display: isCurrentlyVisible ?  'flex':'none'
    };
    const sendChannel = new BroadcastChannel("obs-bible-animation");
    sendChannel.postMessage(animationData);
    sendChannel.close();
    localStorage.setItem('obs-bible-animationData', JSON.stringify(animationData));
};
