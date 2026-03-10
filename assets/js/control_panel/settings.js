//  setttings for font family
let colorMidBg = getCustomPropertyValue('--color-mid-bg');
let colorFg = getCustomPropertyValue('--color-fg');
let textShadowColor = document.getElementById("shadow-color");
let textShadowOpacity = document.getElementById("shadow-opacity");
let textShadowIntensity = document.getElementById("shadow-intensity");
let textShadowHorOffset = document.getElementById("hor-shadow-offset");
let textShadowVerOffset = document.getElementById("ver-shadow-offset");
let bgMargin = document.getElementById("bg-margin");
const fontElement = document.getElementById("fontStyle");
const selectedFont = fontElement.options[fontElement.selectedIndex].value;
const opacityRange = document.getElementById("bg-opacity");
const roundedCorner = document.getElementById("rounded-corner");
const mainBorder = document.getElementById("main-border");
const fontOutline = document.getElementById("font-outline");
const fontOutlineColor = document.getElementById("font-outline-color");
const mainBorderType = document.getElementById("main-border-type");
const mainBorderColor = document.getElementById("main-border-color");
const boldButton = document.getElementById("bold");
const italicButton = document.getElementById("italic");
const underlineButton = document.getElementById("underline");
const textAlign = document.querySelectorAll('input[name="align"]');
const bgColorInput = document.getElementById("bgColor");
let displayLineByLine = document.getElementById("obs-bible-display-song-line-by-line");
const gradientPreview = document.getElementById("bg-gradient-preview");
const gradientModal = document.getElementById("gradient-modal");
const gradientBackdrop = document.getElementById("gradient-backdrop");
const gradientClose = document.getElementById("gradient-close");
const gradientColorGrid = document.getElementById("gradient-color-grid");
const gradientOpacityTrack = document.getElementById("gradient-opacity-track");
const gradientOpacityHandle = document.getElementById("gradient-opacity-handle");
const gradientDirectionOptions = document.querySelectorAll(".gradient-direction-option");

const gradientStorageKeys = {
    colors: "obs-bible-gradient-colors",
    type: "obs-bible-gradient-type",
    direction: "obs-bible-gradient-direction",
    opacity: "obs-bible-gradient-opacity",
    css: "obs-bible-gradient-css",
};

let gradientColors = [];
let gradientType = "linear";
let gradientDirection = "to-right";
let selectedGradientIndex = 0;

const gradientAddSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="14" height="14"><path class="icons" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112-112 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l112 0 0 112c0 17.7 14.3 32 32 32s32-14.3 32-32l0-112 112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-112 0 0-112z"/></svg>`;

function getDefaultGradientColors() {
    const savedRaw = localStorage.getItem("rawBgColor");
    const firstColor = savedRaw || "#553355";
    return [
        { color: firstColor, opacity: 1 },
        { color: "#000000", opacity: 1 }
    ];
}

function buildGradientCss(colors, typeValue, directionValue) {
    const rgbaColors = colors.map(colorItem => hexToRgba(colorItem.color, colorItem.opacity));
    if (typeValue === "radial") {
        return `radial-gradient(circle at center, ${rgbaColors.join(", ")})`;
    }
    if (typeValue === "conic") {
        return `conic-gradient(from 0deg at center, ${rgbaColors.join(", ")})`;
    }
    if (directionValue === "to-bottom-right") {
        return `linear-gradient(135deg, ${rgbaColors.join(", ")})`;
    }
    return `linear-gradient(to right, ${rgbaColors.join(", ")})`;
}

function setGradientPreview(cssValue) {
    if (gradientPreview) {
        gradientPreview.style.backgroundImage = cssValue ? cssValue : "none";
    }
}

function broadcastGradient(cssValue) {
    const settingsChannel = new BroadcastChannel("settings");
    settingsChannel.postMessage({ gradientBackground: cssValue });
    settingsChannel.close();
}

function clearGradient() {
    localStorage.removeItem(gradientStorageKeys.css);
    const settingsChannel = new BroadcastChannel("settings");
    settingsChannel.postMessage({ clearGradient: true });
    settingsChannel.close();
}

function saveGradientState(cssValue) {
    localStorage.setItem(gradientStorageKeys.colors, JSON.stringify(gradientColors));
    localStorage.setItem(gradientStorageKeys.type, gradientType);
    localStorage.setItem(gradientStorageKeys.direction, gradientDirection);
    localStorage.setItem(gradientStorageKeys.css, cssValue);
}

function applyGradient() {
    const gradientCss = buildGradientCss(gradientColors, gradientType, gradientDirection);
    setGradientPreview(gradientCss);
    saveGradientState(gradientCss);
    broadcastGradient(gradientCss);
    updateGradientDirectionPreviews();
}

function updateGradientDirectionUI() {
    gradientDirectionOptions.forEach(option => {
        const isActive = option.dataset.gradient === gradientType && option.dataset.direction === gradientDirection;
        option.classList.toggle("active", isActive);
    });
}

function updateGradientDirectionPreviews() {
    gradientDirectionOptions.forEach(option => {
        const optionType = option.dataset.gradient;
        const optionDirection = option.dataset.direction;
        const optionCss = buildGradientCss(gradientColors, optionType, optionDirection);
        option.style.backgroundImage = optionCss;
    });
}

function updateOpacityTrack() {
    if (!gradientOpacityTrack || !gradientOpacityHandle) {
        return;
    }
    const selected = gradientColors[selectedGradientIndex] || gradientColors[0];
    if (!selected) {
        return;
    }
    const solid = hexToRgba(selected.color, 1);
    const transparent = hexToRgba(selected.color, 0);
    gradientOpacityTrack.style.setProperty("--opacity-color-solid", solid);
    gradientOpacityTrack.style.setProperty("--opacity-color-transparent", transparent);
    const percent = Math.round((selected.opacity || 0) * 100);
    gradientOpacityHandle.style.left = `${percent}%`;
    gradientOpacityTrack.setAttribute("aria-valuenow", `${percent}`);
}

function setSelectedGradientIndex(index) {
    selectedGradientIndex = Math.max(0, Math.min(index, gradientColors.length - 1));
    updateOpacityTrack();
}

function renderGradientSwatches() {
    if (!gradientColorGrid) {
        return;
    }
    gradientColorGrid.innerHTML = "";

    gradientColors.forEach((colorItem, index) => {
        const swatch = document.createElement("button");
        swatch.type = "button";
        swatch.className = "gradient-swatch";
        swatch.style.backgroundColor = colorItem.color;

        const colorInput = document.createElement("input");
        colorInput.type = "color";
        colorInput.value = colorItem.color;
        colorInput.style.display = "none";

        swatch.addEventListener("click", () => {
            setSelectedGradientIndex(index);
            colorInput.click();
        });

        colorInput.addEventListener("input", () => {
            gradientColors[index].color = colorInput.value;
            swatch.style.backgroundColor = colorInput.value;
            applyGradient();
            updateOpacityTrack();
        });

        swatch.appendChild(colorInput);

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "gradient-swatch-remove";
        removeButton.textContent = "×";
        removeButton.addEventListener("click", (event) => {
            event.stopPropagation();
            if (gradientColors.length <= 1) {
                return;
            }
            gradientColors.splice(index, 1);
            renderGradientSwatches();
            applyGradient();
            setSelectedGradientIndex(Math.min(selectedGradientIndex, gradientColors.length - 1));
        });
        swatch.appendChild(removeButton);

        gradientColorGrid.appendChild(swatch);
    });

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "gradient-add-btn";
    addButton.innerHTML = gradientAddSvg;
    addButton.addEventListener("click", () => {
        gradientColors.push({ color: "#ffffff", opacity: 1 });
        renderGradientSwatches();
        setSelectedGradientIndex(gradientColors.length - 1);
        applyGradient();
    });
    gradientColorGrid.appendChild(addButton);
}

function openGradientModal() {
    if (!gradientModal) {
        return;
    }
    gradientModal.classList.add("is-open");
    gradientModal.setAttribute("aria-hidden", "false");
}

function closeGradientModal() {
    if (!gradientModal) {
        return;
    }
    gradientModal.classList.remove("is-open");
    gradientModal.setAttribute("aria-hidden", "true");
}

function loadGradientState() {
    const savedColors = localStorage.getItem(gradientStorageKeys.colors);
    const savedType = localStorage.getItem(gradientStorageKeys.type);
    const savedDirection = localStorage.getItem(gradientStorageKeys.direction);
    const savedCss = localStorage.getItem(gradientStorageKeys.css);

    if (savedColors) {
        const parsed = JSON.parse(savedColors);
        if (parsed.length && typeof parsed[0] === "string") {
            gradientColors = parsed.map(color => ({ color, opacity: 1 }));
        } else {
            gradientColors = parsed.map(item => ({
                color: item.color || "#000000",
                opacity: typeof item.opacity === "number" ? item.opacity : 1
            }));
        }
    } else {
        gradientColors = getDefaultGradientColors();
    }
    gradientType = savedType || "linear";
    gradientDirection = savedDirection || "to-right";

    const previewCss = savedCss || buildGradientCss(gradientColors, gradientType, gradientDirection);
    setGradientPreview(previewCss);
    renderGradientSwatches();
    updateGradientDirectionUI();
    updateGradientDirectionPreviews();
    setSelectedGradientIndex(0);
}


fontElement.addEventListener("change", function() {
    let selectedValue = fontElement.options[fontElement.selectedIndex].value;

    let sendSettingsChannel = new BroadcastChannel("settings");
    sendSettingsChannel.postMessage({ selectedFont: selectedValue });
    sendSettingsChannel.close();
});


opacityRange.addEventListener("input", function () {
    let currentOpacity = opacityRange.value / 10;
    localStorage.setItem('savedOpacity', opacityRange.value);
    let bgColor = localStorage.getItem('bgColor');
    let rgbValues
    if (bgColor){
      rgbValues = bgColor.match(/\d+/g);
    }else{
      rgbValues = 'rgba(85, 34, 85, 0.5)';
    }
    let newColor = `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, ${currentOpacity})`;

    let settingsChannel = new BroadcastChannel("settings");
    settingsChannel.postMessage({ opacityColor: newColor });
    settingsChannel.close();
    clearGradient();
});



roundedCorner.addEventListener("input", function () {
    let currentRoundedCorner = roundedCorner.value;

    let settingsChannel = new BroadcastChannel("settings");
    settingsChannel.postMessage({ roundedCorner: currentRoundedCorner });
    settingsChannel.close();
});


mainBorder.addEventListener("input", function () {
    let currentMainBorder = mainBorder.value;

    let settingsChannel = new BroadcastChannel("settings");
    settingsChannel.postMessage({ mainBorder: currentMainBorder });
    settingsChannel.close();
});



mainBorderColor.addEventListener("input", function () {
    let currentMainBorderColor = mainBorderColor.value;

    let settingsChannel = new BroadcastChannel("settings");
    settingsChannel.postMessage({ mainBorderColor: currentMainBorderColor });
    settingsChannel.close();
});


mainBorderType.addEventListener("input", function () {
    let currentMainBorderType = mainBorderType.value;

    let settingsChannel = new BroadcastChannel("settings");
    settingsChannel.postMessage({ mainBorderType: currentMainBorderType });
    settingsChannel.close();
});


fontOutline.addEventListener("input", function () {
    let currentFontOutline = fontOutline.value;

    let settingsChannel = new BroadcastChannel("settings");
    settingsChannel.postMessage({ fontOutline: currentFontOutline });
    settingsChannel.close();
});


fontOutlineColor.addEventListener("input", function () {
    let currentFontOutlineColor = fontOutlineColor.value;

    let settingsChannel = new BroadcastChannel("settings");
    settingsChannel.postMessage({ fontOutlineColor: currentFontOutlineColor });
    settingsChannel.close();
});


bgColorInput.addEventListener("input", function () {
    let selectedColor = bgColorInput.value;
    let collectdBgColor = localStorage.getItem('bgColor');
    localStorage.setItem('rawBgColor', bgColorInput.value);

    const rgbaParts = collectdBgColor.split(",");
    const alphaValue = rgbaParts.length === 4 ? parseFloat(rgbaParts[3]) : 1;
    let newColor = hexToRgba(selectedColor, alphaValue);

    let settingsChannel = new BroadcastChannel("settings");
    settingsChannel.postMessage({ selectedBgColor: newColor });
    settingsChannel.close();
    clearGradient();

});


// handle Font Color
const fontColorInput = document.getElementById("fontColor");
fontColorInput.addEventListener("input", function () {
    let selectedColor = fontColorInput.value;
    localStorage.setItem('rawFontColor', fontColorInput.value);

    let settingsChannel = new BroadcastChannel("settings");
    settingsChannel.postMessage({ selectedFontColor: selectedColor });
    settingsChannel.close();
});

// handle Title Color
const titleColorInput = document.getElementById("titleColor");
titleColorInput.addEventListener("input", function () {
    let selectedColor = titleColorInput.value;
    localStorage.setItem('rawTitleColor', titleColorInput.value);

    let settingsChannel = new BroadcastChannel("settings");
    settingsChannel.postMessage({ selectedTitleColor: selectedColor });
    settingsChannel.close();
});


boldButton.addEventListener("click", function () {
    let currentBoldState = localStorage.getItem('boldState') || 'normal';
    const newBoldState = (currentBoldState === 'bold') ? 'normal' : 'bold';
    boldButton.style.fontWeight = currentBoldState;
    if (currentBoldState === 'bold'){
        // boldButton.style.backgroundColor  = colorMidBg;
        boldButton.classList.remove("activated");
    }else{
        // boldButton.style.backgroundColor ='#55a'
        boldButton.classList.add("activated");
    }

    let settingsChannel = new BroadcastChannel("settings");
    settingsChannel.postMessage({ currentBoldState: newBoldState });
    settingsChannel.close();
});


italicButton.addEventListener("click", function () {
    let currentItalicState = localStorage.getItem('italicState') || 'normal';
    const newItalicState = (currentItalicState === 'italic') ? 'normal' : 'italic';
    italicButton.style.fontWeight = newItalicState;
    if (currentItalicState === 'italic'){
        italicButton.classList.remove("activated");
        italicButton.style.fontStyle  = 'normal';
    }else{
        italicButton.classList.add("activated");
        italicButton.style.fontStyle  = 'italic';
    }

    let settingsChannel = new BroadcastChannel("settings");
    settingsChannel.postMessage({ currentItalicState: newItalicState });
    settingsChannel.close();
});


underlineButton.addEventListener("click", function () {
    let currentUnderlineState = localStorage.getItem('underlineState') || 'none';
    const newUnderlineState = (currentUnderlineState === 'underline') ? 'none' : 'underline';
    underlineButton.style.fontWeight = newUnderlineState;
    if (currentUnderlineState === 'underline'){
        underlineButton.classList.remove("activated");
        underlineButton.style.textDecoration  = 'none';
    }else{
        underlineButton.classList.add("activated");
        underlineButton.style.textDecoration  = 'underline';
    }

    let settingsChannel = new BroadcastChannel("settings");
    settingsChannel.postMessage({ currentUnderlineState: newUnderlineState });
    settingsChannel.close();
});


textAlign.forEach(radio => {
    radio.addEventListener('change', () => {
        if (radio.checked) {
            let sendSettingsChannel = new BroadcastChannel("settings");
            sendSettingsChannel.postMessage({ selectedTextAlignment: radio.value });
            sendSettingsChannel.close();
            localStorage.setItem('selectedAlign', radio.value); // Save the selected value
        }
    });
});


textShadowColor.addEventListener("change", function() {
    let selectedColor = textShadowColor.value;
    localStorage.setItem('rawShadowColor', textShadowColor.value);
    let rgbaParts
    rgbaParts = selectedColor.split(",");

    const alphaValue  = Number(localStorage.getItem('savedTextOpacity')) /10;
    let newColor = hexToRgba(selectedColor, alphaValue);
    localStorage.setItem('textShadowColor', newColor);

    let savedVerOffset = localStorage.getItem('savedVerOffset');
    let savedHorOffset = localStorage.getItem('savedHorOffset');
    let savedIntensity = localStorage.getItem('savedTextIntensity');
    let shadowValue = `${savedHorOffset}px ${savedVerOffset}px ${savedIntensity}px ${newColor}`;

    let settingsChannel = new BroadcastChannel("settings");
    settingsChannel.postMessage({ selectedShadowColor: shadowValue });
    settingsChannel.close();
});

textShadowOpacity.addEventListener("input", function () {
    let currentOpacity = textShadowOpacity.value / 10;
    localStorage.setItem('savedTextOpacity', textShadowOpacity.value);
    let shadowColor = localStorage.getItem('shadowColor');

    let rgbValues = shadowColor.match(/\d+/g);
    let newColor = `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, ${currentOpacity})`;
    localStorage.setItem('textShadowColor', newColor);
    let savedVerOffset = localStorage.getItem('savedVerOffset');
    let savedHorOffset = localStorage.getItem('savedHorOffset');
    let savedIntensity = localStorage.getItem('savedTextIntensity');
    let shadowValue = `${savedHorOffset}px ${savedVerOffset}px ${savedIntensity}px ${newColor}`;

    let settingsChannel = new BroadcastChannel("settings");
    settingsChannel.postMessage({ selectedShadowColor: shadowValue });
    settingsChannel.close();
});


textShadowIntensity.addEventListener('input', function () {
    let currentIntensity = textShadowIntensity.value;
    localStorage.setItem('savedTextIntensity', textShadowIntensity.value);
    let savedTextShadowValue = localStorage.getItem('textShadowColor');
    let savedVerOffset = localStorage.getItem('savedVerOffset');
    let savedHorOffset = localStorage.getItem('savedHorOffset');

    let shadowValue = `${savedHorOffset}px ${savedVerOffset}px ${currentIntensity}px ${savedTextShadowValue}`;

    let settingsChannel = new BroadcastChannel("settings");
    settingsChannel.postMessage({ selectedShadowColor: shadowValue });
    settingsChannel.close();
});

textShadowHorOffset.addEventListener('input', function () {
    let currentOffset = textShadowHorOffset.value;
    localStorage.setItem('savedHorOffset', currentOffset);
    let savedTextShadowValue = localStorage.getItem('textShadowColor');
    let savedIntensity = localStorage.getItem('savedTextIntensity');
    let savedVerOffset = localStorage.getItem('savedVerOffset');

    let shadowValue = `${currentOffset}px ${savedVerOffset}px ${savedIntensity}px ${savedTextShadowValue}`;

    let settingsChannel = new BroadcastChannel("settings");
    settingsChannel.postMessage({ selectedShadowColor: shadowValue });
    settingsChannel.close();
});


textShadowVerOffset.addEventListener('input', function () {
    let currentOffset = textShadowVerOffset.value;
    localStorage.setItem('savedVerOffset', textShadowVerOffset.value);
    let savedTextShadowValue = localStorage.getItem('textShadowColor');
    let savedIntensity = localStorage.getItem('savedTextIntensity');
    let savedHorOffset = localStorage.getItem('savedHorOffset');

    let shadowValue = `${savedHorOffset}px ${currentOffset}px ${savedIntensity}px ${savedTextShadowValue}`;

    let settingsChannel = new BroadcastChannel("settings");
    settingsChannel.postMessage({ selectedShadowColor: shadowValue });
    settingsChannel.close();
});


bgMargin.addEventListener("change", function() {
    let selectedMargin = bgMargin.value;
    localStorage.setItem('bgMargin', bgMargin.value);

    let settingsChannel = new BroadcastChannel("settings");
    settingsChannel.postMessage({ selectedBgMargin: selectedMargin });
    settingsChannel.close();
});

displayLineByLine.addEventListener("change", function() {
    localStorage.setItem("obs-bible-display-song-line-by-line", displayLineByLine.checked);
});

loadGradientState();

if (gradientPreview) {
    gradientPreview.addEventListener("click", openGradientModal);
}

if (gradientBackdrop) {
    gradientBackdrop.addEventListener("click", closeGradientModal);
}

if (gradientClose) {
    gradientClose.addEventListener("click", closeGradientModal);
}

function handleOpacityPointer(event) {
    if (!gradientOpacityTrack) {
        return;
    }
    const rect = gradientOpacityTrack.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const percent = rect.width ? x / rect.width : 0;
    const opacity = Math.min(Math.max(percent, 0), 1);
    if (gradientColors[selectedGradientIndex]) {
        gradientColors[selectedGradientIndex].opacity = opacity;
        updateOpacityTrack();
        applyGradient();
    }
}

if (gradientOpacityTrack) {
    gradientOpacityTrack.addEventListener("mousedown", (event) => {
        handleOpacityPointer(event);
        const move = (moveEvent) => handleOpacityPointer(moveEvent);
        const up = () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
        };
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
    });

    gradientOpacityTrack.addEventListener("touchstart", (event) => {
        handleOpacityPointer(event);
    }, { passive: true });
    gradientOpacityTrack.addEventListener("touchmove", (event) => {
        handleOpacityPointer(event);
    }, { passive: true });

    gradientOpacityTrack.addEventListener("keydown", (event) => {
        const step = event.shiftKey ? 0.1 : 0.02;
        if (!gradientColors[selectedGradientIndex]) {
            return;
        }
        if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
            gradientColors[selectedGradientIndex].opacity = Math.max(0, gradientColors[selectedGradientIndex].opacity - step);
            updateOpacityTrack();
            applyGradient();
        }
        if (event.key === "ArrowRight" || event.key === "ArrowUp") {
            gradientColors[selectedGradientIndex].opacity = Math.min(1, gradientColors[selectedGradientIndex].opacity + step);
            updateOpacityTrack();
            applyGradient();
        }
    });
}

gradientDirectionOptions.forEach(option => {
    option.addEventListener("click", () => {
        gradientType = option.dataset.gradient;
        gradientDirection = option.dataset.direction;
        updateGradientDirectionUI();
        applyGradient();
    });
});
