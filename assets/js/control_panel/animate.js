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

const TEXT_ANIMATION_STORAGE_KEY = 'obs-bible-text-animationData';
const TEXT_ANIMATION_CHANNEL = 'obs-bible-text-animation';

const textTransitionOptions = [
    ['none', 'None'],
    ['fade', 'Fade'],
    ['bounce', 'Bounce'],
    ['shake', 'Shake'],
    ['crossfade', 'Crossfade Transition'],
    ['blur', 'Blur Transition'],
    ['slide-left', 'Slide Left'],
    ['slide-right', 'Slide Right'],
    ['slide-top', 'Slide Top'],
    ['slide-bottom', 'Slide Bottom'],
    ['flip', 'Flip Transition'],
    ['spin', 'Spin Transition'],
    ['rotate', 'Rotate Transition'],
    ['mask', 'Mask Transition'],
    ['circular-reveal', 'Circular Reveal'],
    ['vertical-split', 'Vertical Split Transition'],
    ['horizontal-split', 'Horizontal Split Transition'],
    ['push', 'Push Transition'],
    ['pull', 'Pull Transition'],
    ['whip-pan', 'Whip Pan Text Transition'],
    ['wave', 'Wave Transition'],
    ['liquid-morph', 'Liquid Morph Transition'],
    ['pixel-dissolve', 'Pixel Dissolve Transition'],
    ['light-flash', 'Light Flash Transition'],
    ['glow', 'Glowing Transition'],
    ['staggered-letter', 'Staggered Letter Transition'],
    ['perspective', 'Perspective Transition'],
    ['3d-rotation', '3D Rotation Transition'],
    ['zoom-in', 'Zoom In'],
    ['zoom-out', 'Zoom Out']
];

const textEffectOptions = [
    ['none', 'None'],
    ['pulsating', 'Pulsating Text'],
    ['breathing', 'Breathing Text'],
    ['shaking', 'Shaking Text'],
    ['wiggling', 'Wiggling Text'],
    ['floating', 'Floating Text'],
    ['swinging', 'Swinging Text'],
    ['waving', 'Waving Text'],
    ['stretching', 'Stretching Text'],
    ['squeezing', 'Squeezing Text'],
    ['3d-extrusion', '3D Extrusion'],
    ['metallic-reflection', 'Metallic Reflection'],
    ['reflection', 'Text Reflection'],
    ['shadow-animation', 'Text Shadow Animation'],
    ['gradient-colour', 'Gradient Colour Animation'],
    ['rainbow', 'Rainbow Text'],
    ['neon-flicker', 'Neon Flicker'],
    ['light-sweep', 'Light Sweep'],
    ['glowing-outline', 'Glowing Outline'],
    ['fire', 'Fire Text'],
    ['smoke', 'Smoke Text'],
    ['particle', 'Particle Text'],
    ['liquid-distortion', 'Liquid Distortion'],
    ['chromatic-aberration', 'Chromatic Aberration'],
    ['rgb-split', 'RGB Split'],
    ['text-scrambling', 'Text Scrambling'],
    ['text-shuffling', 'Text Shuffling']
];

const defaultTextAnimationData = {
    version: 1,
    enabled: true,
    intro: { type: 'crossfade', easing: 'ease-in-out' },
    outro: { type: 'crossfade', easing: 'ease-in-out' },
    duration: 0.6,
    stagger: 0.03,
    effect: { enabled: false, type: 'none' }
};

const clamp = (value, min, max, fallback) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? Math.min(max, Math.max(min, numericValue)) : fallback;
};

const normalizeTextAnimationData = (data) => {
    const safe = data && typeof data === 'object' ? data : {};
    const introType = textTransitionOptions.some(([value]) => value === safe.intro?.type)
        ? safe.intro.type : defaultTextAnimationData.intro.type;
    const outroType = textTransitionOptions.some(([value]) => value === safe.outro?.type)
        ? safe.outro.type : defaultTextAnimationData.outro.type;
    const effectType = textEffectOptions.some(([value]) => value === safe.effect?.type)
        ? safe.effect.type : 'none';
    const easings = ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'];
    return {
        version: 1,
        enabled: typeof safe.enabled === 'boolean' ? safe.enabled : true,
        intro: {
            type: introType,
            easing: easings.includes(safe.intro?.easing) ? safe.intro.easing : 'ease-in-out'
        },
        outro: {
            type: outroType,
            easing: easings.includes(safe.outro?.easing) ? safe.outro.easing : 'ease-in-out'
        },
        duration: clamp(safe.duration, 0.1, 10, 0.6),
        stagger: clamp(safe.stagger, 0, 1, 0.03),
        effect: {
            enabled: typeof safe.effect?.enabled === 'boolean' ? safe.effect.enabled : false,
            type: effectType
        }
    };
};

const populateTextAnimationOptions = () => {
    const introSelect = getElementById('text-intro-animation-type');
    const outroSelect = getElementById('text-outro-animation-type');
    const effectSelect = getElementById('text-effect-type');

    [introSelect, outroSelect].forEach((select) => {
        if (!select) return;
        textTransitionOptions.forEach(([value, label]) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = label;
            select.appendChild(option);
        });
    });

    if (effectSelect) {
        textEffectOptions.forEach(([value, label]) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = label;
            effectSelect.appendChild(option);
        });
    }
};

const getTextAnimationDataFromControls = () => normalizeTextAnimationData({
    version: 1,
    enabled: getElementById('text-animation-enabled')?.checked ?? true,
    intro: {
        type: getElementById('text-intro-animation-type')?.value,
        easing: getElementById('text-intro-animation-easing')?.value
    },
    outro: {
        type: getElementById('text-outro-animation-type')?.value,
        easing: getElementById('text-outro-animation-easing')?.value
    },
    duration: getElementById('text-animation-duration')?.value,
    stagger: getElementById('text-animation-stagger')?.value,
    effect: {
        enabled: getElementById('text-effect-enabled')?.checked ?? false,
        type: getElementById('text-effect-type')?.value
    }
});

const sendTextAnimationData = (data) => {
    localStorage.setItem(TEXT_ANIMATION_STORAGE_KEY, JSON.stringify(data));
    const sendChannel = new BroadcastChannel(TEXT_ANIMATION_CHANNEL);
    sendChannel.postMessage(data);
    sendChannel.close();
};

const initializeTextAnimationControls = () => {
    populateTextAnimationOptions();

    let savedData = defaultTextAnimationData;
    try {
        savedData = normalizeTextAnimationData(JSON.parse(localStorage.getItem(TEXT_ANIMATION_STORAGE_KEY) || 'null'));
    } catch (error) {
        savedData = defaultTextAnimationData;
    }

    getElementById('text-animation-enabled').checked = savedData.enabled;
    getElementById('text-intro-animation-type').value = savedData.intro.type;
    getElementById('text-intro-animation-easing').value = savedData.intro.easing;
    getElementById('text-outro-animation-type').value = savedData.outro.type;
    getElementById('text-outro-animation-easing').value = savedData.outro.easing;
    getElementById('text-animation-duration').value = savedData.duration;
    getElementById('text-animation-stagger').value = savedData.stagger;
    getElementById('text-effect-enabled').checked = savedData.effect.enabled;
    getElementById('text-effect-type').value = savedData.effect.type;

    const controlIds = [
        'text-animation-enabled',
        'text-intro-animation-type',
        'text-intro-animation-easing',
        'text-outro-animation-type',
        'text-outro-animation-easing',
        'text-animation-duration',
        'text-animation-stagger',
        'text-effect-enabled',
        'text-effect-type'
    ];

    controlIds.forEach((id) => {
        const control = getElementById(id);
        if (!control) return;
        const eventName = control.type === 'checkbox' || control.tagName === 'SELECT' ? 'change' : 'input';
        control.addEventListener(eventName, () => {
            if (id === 'text-animation-duration') {
                control.value = clamp(control.value, 0.1, 10, 0.6);
            }
            if (id === 'text-animation-stagger') {
                control.value = clamp(control.value, 0, 1, 0.03);
            }
            sendTextAnimationData(getTextAnimationDataFromControls());
        });
    });

    getElementById('text-animation-preview')?.addEventListener('click', () => {
        sendTextAnimationData(getTextAnimationDataFromControls());
        const previewChannel = new BroadcastChannel(TEXT_ANIMATION_CHANNEL);
        previewChannel.postMessage({ type: 'preview' });
        previewChannel.close();
    });
};

initializeTextAnimationControls();
