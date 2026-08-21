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
const backgroundOpacityControls = document.querySelectorAll("[data-bg-opacity-control]");
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
const backgroundSettingTrigger = document.getElementById("background-setting-trigger");
const backgroundStylePreview = document.getElementById("background-style-preview");
const backgroundModeModal = document.getElementById("background-mode-modal");
const backgroundModeBackdrop = document.getElementById("background-mode-backdrop");
const backgroundModeClose = document.getElementById("background-mode-close");
const backgroundModeColor = document.getElementById("background-mode-color");
const backgroundModeGradient = document.getElementById("background-mode-gradient");
const backgroundColorOptionPreview = document.getElementById("background-color-option-preview");
const backgroundGradientOptionPreview = document.getElementById("background-gradient-option-preview");
const gradientModal = document.getElementById("gradient-modal");
const gradientBackdrop = document.getElementById("gradient-backdrop");
const gradientClose = document.getElementById("gradient-close");
const gradientColorGrid = document.getElementById("gradient-color-grid");
const gradientOpacityTrack = document.getElementById("gradient-opacity-track");
const gradientOpacityHandle = document.getElementById("gradient-opacity-handle");
const gradientDirectionOptions = document.querySelectorAll(".gradient-direction-option");
const BACKGROUND_OPACITY_STEPS = 20;

const gradientStorageKeys = {
    mode: "obs-bible-background-mode",
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
    if (directionValue === "to-bottom") {
        return `linear-gradient(to bottom, ${rgbaColors.join(", ")})`;
    }
    if (directionValue === "to-bottom-right") {
        return `linear-gradient(135deg, ${rgbaColors.join(", ")})`;
    }
    if (directionValue === "to-bottom-left") {
        return `linear-gradient(225deg, ${rgbaColors.join(", ")})`;
    }
    return `linear-gradient(to right, ${rgbaColors.join(", ")})`;
}

function getBgContentType() {
    const bgSelect = document.getElementById("bg-content-type-select");
    if (bgSelect && bgSelect.value) {
        return bgSelect.value;
    }
    const lastSavedTab = localStorage.getItem("lastContentTab") || localStorage.getItem("selectedTab");
    if (lastSavedTab === "bibleText") return "bible";
    if (lastSavedTab === "songs") return "song";
    return "text";
}

const idbMedia = {
  dbPromise: null,
  init() {
    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve) => {
        try {
          const req = indexedDB.open("obs_bible_media_store", 1);
          req.onupgradeneeded = () => req.result.createObjectStore("media");
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => resolve(null);
        } catch (e) {
          resolve(null);
        }
      });
    }
    return this.dbPromise;
  },
  async set(key, val) {
    try { localStorage.setItem(key, val); } catch (e) {}
    const db = await this.init();
    if (db) {
      const tx = db.transaction("media", "readwrite");
      tx.objectStore("media").put(val, key);
    }
  },
  async get(key) {
    const db = await this.init();
    if (db) {
      const tx = db.transaction("media", "readonly");
      const req = tx.objectStore("media").get(key);
      const res = await new Promise((r) => {
        req.onsuccess = () => r(req.result);
        req.onerror = () => r(null);
      });
      if (res !== undefined && res !== null) return res;
    }
    return localStorage.getItem(key);
  }
};

function setBgItem(keyName, val) {
    const contentType = getBgContentType();
    const fullKey = `${keyName}_${contentType}`;
    idbMedia.set(fullKey, val);
}

function getBgItem(keyName) {
    const contentType = getBgContentType();
    const fullKey = `${keyName}_${contentType}`;
    return localStorage.getItem(fullKey) || localStorage.getItem(keyName);
}

function removeBgItem(keyName) {
    const contentType = getBgContentType();
    localStorage.removeItem(`${keyName}_${contentType}`);
    localStorage.removeItem(keyName);
}

function getBackgroundMode() {
    const savedMode = getBgItem("obs-bible-background-mode");
    if (savedMode) return savedMode;
    return "plain";
}

function syncBackgroundModeRadios() {
    const currentMode = getBackgroundMode();
    const bgNoneRadio = document.getElementById("background-mode-none");
    const bgImageRadio = document.getElementById("background-mode-image");
    const bgVideoRadio = document.getElementById("background-mode-video");

    if (bgNoneRadio) bgNoneRadio.checked = currentMode === "none";
    if (backgroundModeColor) backgroundModeColor.checked = currentMode === "plain";
    if (backgroundModeGradient) backgroundModeGradient.checked = currentMode === "gradient";
    if (bgImageRadio) bgImageRadio.checked = currentMode === "image";
    if (bgVideoRadio) bgVideoRadio.checked = currentMode === "video";
}

function getBackgroundOpacityValue() {
    const savedOpacity = Number(localStorage.getItem("savedOpacity"));
    if (Number.isFinite(savedOpacity) && savedOpacity >= 0) {
        return savedOpacity / BACKGROUND_OPACITY_STEPS;
    }
    return 1;
}

function syncBackgroundOpacityControls(rawValue) {
    backgroundOpacityControls.forEach(control => {
        control.max = String(BACKGROUND_OPACITY_STEPS);
        control.value = rawValue;
    });
}

function updateBackgroundOpacityPreview() {
    const rawColor = localStorage.getItem("rawBgColor") || bgColorInput?.value || "#553355";
    const transparent = hexToRgba(rawColor, 0);
    const solid = hexToRgba(rawColor, 1);

    backgroundOpacityControls.forEach(control => {
        control.style.backgroundImage = `linear-gradient(to right, ${transparent}, ${solid})`;
    });
}

function getSolidBackgroundCss() {
    const rawColor = localStorage.getItem("rawBgColor") || bgColorInput?.value || "#553355";
    return hexToRgba(rawColor, getBackgroundOpacityValue());
}

function setBackgroundSurface(element, backgroundColor, backgroundImage) {
    if (!element) {
        return;
    }
    element.style.backgroundColor = backgroundColor || "transparent";
    element.style.backgroundImage = backgroundImage || "none";
}

function updateBackgroundPreviews() {
    const savedGradientCss = localStorage.getItem(gradientStorageKeys.css);
    const solidBackgroundCss = getSolidBackgroundCss();
    const gradientCss = savedGradientCss || buildGradientCss(gradientColors, gradientType, gradientDirection);
    const currentMode = getBackgroundMode();

    setBackgroundSurface(backgroundColorOptionPreview, solidBackgroundCss, "none");
    setBackgroundSurface(backgroundGradientOptionPreview, "transparent", gradientCss);

    if (currentMode === "gradient" && savedGradientCss) {
        setBackgroundSurface(backgroundStylePreview, solidBackgroundCss, savedGradientCss);
    } else {
        setBackgroundSurface(backgroundStylePreview, solidBackgroundCss, "none");
    }

    syncBackgroundModeRadios();
    updateBackgroundOpacityPreview();
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
    updateBackgroundPreviews();
}

function broadcastPlainBackground() {
    const settingsChannel = new BroadcastChannel("settings");
    settingsChannel.postMessage({ selectedBgColor: getSolidBackgroundCss() });
    settingsChannel.close();
}

function broadcastBgUpdate() {
    const contentType = getBgContentType();
    const settingsChannel = new BroadcastChannel("settings");
    settingsChannel.postMessage({ bgUpdateContentType: contentType });
    settingsChannel.close();
}

function setBackgroundMode(mode, options = {}) {
    const { broadcast = true } = options;
    setBgItem("obs-bible-background-mode", mode);

    if (mode === "plain") {
        const rawColor = localStorage.getItem("rawBgColor") || bgColorInput?.value || "#000000";
        setBgItem("obs-bible-bg-color", rawColor);
    } else if (mode === "gradient") {
        const gradientCss = getBgItem("obs-bible-gradient-css") || buildGradientCss(gradientColors, gradientType, gradientDirection);
        saveGradientState(gradientCss);
    }

    if (broadcast) {
        broadcastBgUpdate();
    }

    updateBackgroundPreviews();
}

function openPlainBackgroundPicker() {
    bgColorInput?.click();
}

function openGradientEditor() {
    setBackgroundMode("gradient");
    syncBgFormToContentType();
}

function saveGradientState(cssValue) {
    setBgItem("obs-bible-gradient-colors", JSON.stringify(gradientColors));
    setBgItem("obs-bible-gradient-type", gradientType);
    setBgItem("obs-bible-gradient-direction", gradientDirection);
    setBgItem("obs-bible-gradient-css", cssValue);
}

function applyGradient() {
    const gradientCss = buildGradientCss(gradientColors, gradientType, gradientDirection);
    saveGradientState(gradientCss);
    broadcastBgUpdate();
    updateGradientDirectionPreviews();
    updateBackgroundPreviews();
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
    renderGradientPresets();
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

function openBackgroundModeModal() {
    if (!backgroundModeModal) {
        return;
    }
    const lastTab = localStorage.getItem("lastContentTab") || localStorage.getItem("selectedTab");
    const bgSelect = document.getElementById("bg-content-type-select");
    if (bgSelect) {
        if (lastTab === "bibleText") {
            bgSelect.value = "bible";
        } else if (lastTab === "songs") {
            bgSelect.value = "song";
        } else if (lastTab === "text") {
            bgSelect.value = "text";
        }
    }
    syncBgFormToContentType();
    backgroundModeModal.classList.add("is-open");
    backgroundModeModal.setAttribute("aria-hidden", "false");
}

function closeBackgroundModeModal() {
    if (!backgroundModeModal) {
        return;
    }
    backgroundModeModal.classList.remove("is-open");
    backgroundModeModal.setAttribute("aria-hidden", "true");
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

    renderGradientSwatches();
    updateGradientDirectionUI();
    updateGradientDirectionPreviews();
    setSelectedGradientIndex(0);
    updateBackgroundPreviews();
}


fontElement.addEventListener("change", function() {
    let selectedValue = fontElement.options[fontElement.selectedIndex].value;

    let sendSettingsChannel = new BroadcastChannel("settings");
    sendSettingsChannel.postMessage({ selectedFont: selectedValue });
    sendSettingsChannel.close();
});


function applyBackgroundOpacity(rawValue) {
    let currentOpacity = Number(rawValue) / BACKGROUND_OPACITY_STEPS;
    localStorage.setItem('savedOpacity', rawValue);
    syncBackgroundOpacityControls(String(rawValue));
    const rawColor = localStorage.getItem("rawBgColor") || bgColorInput?.value || "#553355";
    let newColor = hexToRgba(rawColor, currentOpacity);

    let settingsChannel = new BroadcastChannel("settings");
    settingsChannel.postMessage({ opacityColor: newColor });
    settingsChannel.close();
    setBackgroundMode("plain", { broadcast: false });
    clearGradient();
}

backgroundOpacityControls.forEach(control => {
    control.addEventListener("input", () => {
        applyBackgroundOpacity(control.value);
    });
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
    localStorage.setItem('rawBgColor', bgColorInput.value);
    const alphaValue = getBackgroundOpacityValue();
    let newColor = hexToRgba(selectedColor, alphaValue);

    let settingsChannel = new BroadcastChannel("settings");
    settingsChannel.postMessage({ selectedBgColor: newColor });
    settingsChannel.close();
    setBackgroundMode("plain", { broadcast: false });
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
syncBackgroundOpacityControls(String(localStorage.getItem("savedOpacity") || String(BACKGROUND_OPACITY_STEPS)));

if (backgroundSettingTrigger) {
    backgroundSettingTrigger.addEventListener("click", openBackgroundModeModal);
    backgroundSettingTrigger.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openBackgroundModeModal();
        }
    });
}

if (backgroundModeBackdrop) {
    backgroundModeBackdrop.addEventListener("click", closeBackgroundModeModal);
}

if (backgroundModeClose) {
    backgroundModeClose.addEventListener("click", closeBackgroundModeModal);
}

const bgContentTypeSelect = document.getElementById("bg-content-type-select");
const bgNoneRadio = document.getElementById("background-mode-none");
const bgImageRadio = document.getElementById("background-mode-image");
const bgVideoRadio = document.getElementById("background-mode-video");

const bgImageSection = document.getElementById("bg-image-section");
const bgVideoSection = document.getElementById("bg-video-section");
const bgImageFileInput = document.getElementById("bg-image-file-input");
const bgImageFileBtn = document.getElementById("bg-image-file-btn");
const bgImageFilename = document.getElementById("bg-image-filename");
const bgVideoFileInput = document.getElementById("bg-video-file-input");
const bgVideoFileBtn = document.getElementById("bg-video-file-btn");
const bgVideoFilename = document.getElementById("bg-video-filename");

const bibleBgBtn = document.getElementById("bible-bg-btn");
const songBgBtn = document.getElementById("song-bg-btn");

const bgPlainColorSection = document.getElementById("bg-plain-color-section");
const bgPlainColorPicker = document.getElementById("bg-plain-color-picker");
const bgPlainColorHex = document.getElementById("bg-plain-color-hex");

const PROFESSIONAL_GRADIENT_PRESETS = [
    { name: "Midnight Sapphire", css: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)" },
    { name: "Graceful Velvet", css: "linear-gradient(135deg, #180008 0%, #3b0764 50%, #111827 100%)" },
    { name: "Emerald Sanctuary", css: "linear-gradient(135deg, #064e3b 0%, #022c22 50%, #0f172a 100%)" },
    { name: "Golden Worship", css: "linear-gradient(135deg, #451a03 0%, #290e05 50%, #0c0a09 100%)" },
    { name: "Celestial Dusk", css: "linear-gradient(135deg, #172554 0%, #3b0764 50%, #09090b 100%)" },
    { name: "Nordic Slate", css: "linear-gradient(135deg, #1f2937 0%, #111827 50%, #030712 100%)" },
    { name: "Sacred Amethyst", css: "linear-gradient(135deg, #2e1065 0%, #1c053a 50%, #000000 100%)" },
    { name: "Oceanic Abyss", css: "linear-gradient(135deg, #083344 0%, #0c4a6e 50%, #020617 100%)" }
];

function renderGradientPresets() {
    const grid = document.getElementById("gradient-presets-grid");
    if (!grid) return;
    grid.innerHTML = "";

    PROFESSIONAL_GRADIENT_PRESETS.forEach(preset => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "gradient-preset-tile tooltip tooltip-bottom";
        btn.setAttribute("data-tooltip", preset.name);
        btn.style.backgroundImage = preset.css;
        btn.addEventListener("click", () => {
            saveGradientState(preset.css);
            setBackgroundMode("gradient");
            broadcastBgUpdate();
            updateBackgroundPreviews();
        });
        grid.appendChild(btn);
    });
}

function updatePlainColorFromInput(colorVal) {
    if (!colorVal || !/^#[0-9A-Fa-f]{6}$/i.test(colorVal)) return;
    setBgItem("obs-bible-bg-color", colorVal);
    localStorage.setItem("rawBgColor", colorVal);
    if (bgColorInput) bgColorInput.value = colorVal;
    setBackgroundMode("plain");
    broadcastBgUpdate();
    updateBackgroundPreviews();
}

bgPlainColorPicker?.addEventListener("input", (e) => {
    if (bgPlainColorHex) bgPlainColorHex.value = e.target.value;
    updatePlainColorFromInput(e.target.value);
});

bgPlainColorHex?.addEventListener("change", (e) => {
    let val = e.target.value.trim();
    if (!val.startsWith("#")) val = "#" + val;
    if (bgPlainColorPicker) bgPlainColorPicker.value = val;
    updatePlainColorFromInput(val);
});

function syncBgFormToContentType() {
    syncBackgroundModeRadios();
    const mode = getBackgroundMode();

    const bgGradientInlineSection = document.getElementById("bg-gradient-inline-section");
    if (bgPlainColorSection) bgPlainColorSection.style.display = (mode === "plain") ? "block" : "none";
    if (bgGradientInlineSection) bgGradientInlineSection.style.display = (mode === "gradient") ? "block" : "none";
    if (bgImageSection) bgImageSection.style.display = (mode === "image") ? "block" : "none";
    if (bgVideoSection) bgVideoSection.style.display = (mode === "video") ? "block" : "none";

    const savedPlainColor = getBgItem("obs-bible-bg-color") || localStorage.getItem("rawBgColor") || "#000000";
    if (bgPlainColorPicker) bgPlainColorPicker.value = savedPlainColor;
    if (bgPlainColorHex) bgPlainColorHex.value = savedPlainColor;

    if (mode === "gradient") {
        loadGradientState();
        renderGradientPresets();
        renderGradientSwatches();
        updateGradientDirectionUI();
        updateGradientDirectionPreviews();
    }

    const savedImageName = getBgItem("obs-bible-image-filename");
    if (bgImageFilename) bgImageFilename.textContent = savedImageName || (getBgItem("obs-bible-image-url") ? "Saved Image Loaded" : "No image chosen");

    const savedVideoName = getBgItem("obs-bible-video-filename");
    if (bgVideoFilename) bgVideoFilename.textContent = savedVideoName || (getBgItem("obs-bible-video-url") ? "Saved Video Loaded" : "No video chosen");

    updateBackgroundPreviews();
}

if (bibleBgBtn) {
    bibleBgBtn.addEventListener("click", () => {
        if (bgContentTypeSelect) bgContentTypeSelect.value = "bible";
        openBackgroundModeModal();
        syncBgFormToContentType();
    });
}

if (songBgBtn) {
    songBgBtn.addEventListener("click", () => {
        if (bgContentTypeSelect) bgContentTypeSelect.value = "song";
        openBackgroundModeModal();
        syncBgFormToContentType();
    });
}

if (bgImageFileBtn && bgImageFileInput) {
    bgImageFileBtn.addEventListener("click", () => bgImageFileInput.click());
    bgImageFileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            if (bgImageFilename) bgImageFilename.textContent = file.name;
            setBgItem("obs-bible-image-filename", file.name);
            const reader = new FileReader();
            reader.onload = (evt) => {
                const dataUrl = evt.target.result;
                setBgItem("obs-bible-image-url", dataUrl);
                setBackgroundMode("image");
                syncBgFormToContentType();
            };
            reader.readAsDataURL(file);
        }
    });
}

if (bgVideoFileBtn && bgVideoFileInput) {
    bgVideoFileBtn.addEventListener("click", () => bgVideoFileInput.click());
    bgVideoFileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            if (bgVideoFilename) bgVideoFilename.textContent = file.name;
            setBgItem("obs-bible-video-filename", file.name);
            const reader = new FileReader();
            reader.onload = (evt) => {
                const dataUrl = evt.target.result;
                setBgItem("obs-bible-video-url", dataUrl);
                setBackgroundMode("video");
                syncBgFormToContentType();
            };
            reader.readAsDataURL(file);
        }
    });
}

const bgImageSourceRadios = document.querySelectorAll('input[name="bg-image-source-type"]');
const bgImageFileContainer = document.getElementById("bg-image-file-container");
const bgImageUrlContainer = document.getElementById("bg-image-url-container");
const bgImageUrlInput = document.getElementById("bg-image-url-input");
const bgImageUrlBtn = document.getElementById("bg-image-url-btn");

const bgVideoSourceRadios = document.querySelectorAll('input[name="bg-video-source-type"]');
const bgVideoFileContainer = document.getElementById("bg-video-file-container");
const bgVideoUrlContainer = document.getElementById("bg-video-url-container");
const bgVideoUrlInput = document.getElementById("bg-video-url-input");
const bgVideoUrlBtn = document.getElementById("bg-video-url-btn");

bgImageSourceRadios.forEach(radio => {
    radio.addEventListener("change", () => {
        if (radio.checked) {
            const isFile = radio.value === "file";
            if (bgImageFileContainer) bgImageFileContainer.style.display = isFile ? "block" : "none";
            if (bgImageUrlContainer) bgImageUrlContainer.style.display = isFile ? "none" : "block";
        }
    });
});

bgVideoSourceRadios.forEach(radio => {
    radio.addEventListener("change", () => {
        if (radio.checked) {
            const isFile = radio.value === "file";
            if (bgVideoFileContainer) bgVideoFileContainer.style.display = isFile ? "block" : "none";
            if (bgVideoUrlContainer) bgVideoUrlContainer.style.display = isFile ? "none" : "block";
        }
    });
});

if (bgImageUrlBtn && bgImageUrlInput) {
    bgImageUrlBtn.addEventListener("click", () => {
        const url = bgImageUrlInput.value.trim();
        if (url) {
            setBgItem("obs-bible-image-url", url);
            setBgItem("obs-bible-image-filename", `URL: ${url}`);
            if (bgImageFilename) bgImageFilename.textContent = `URL: ${url}`;
            setBackgroundMode("image");
            syncBgFormToContentType();
        }
    });
}

if (bgVideoUrlBtn && bgVideoUrlInput) {
    bgVideoUrlBtn.addEventListener("click", () => {
        const url = bgVideoUrlInput.value.trim();
        if (url) {
            setBgItem("obs-bible-video-url", url);
            setBgItem("obs-bible-video-filename", `URL: ${url}`);
            if (bgVideoFilename) bgVideoFilename.textContent = `URL: ${url}`;
            setBackgroundMode("video");
            syncBgFormToContentType();
        }
    });
}

if (bgContentTypeSelect) {
    bgContentTypeSelect.addEventListener("change", syncBgFormToContentType);
}

if (bgNoneRadio) {
    bgNoneRadio.addEventListener("change", () => {
        if (bgNoneRadio.checked) {
            setBackgroundMode("none");
            syncBgFormToContentType();
        }
    });
}

if (bgImageRadio) {
    bgImageRadio.addEventListener("change", () => {
        if (bgImageRadio.checked) {
            setBackgroundMode("image");
            syncBgFormToContentType();
        }
    });
}

if (bgVideoRadio) {
    bgVideoRadio.addEventListener("change", () => {
        if (bgVideoRadio.checked) {
            setBackgroundMode("video");
            syncBgFormToContentType();
        }
    });
}

if (backgroundModeColor) {
    backgroundModeColor.addEventListener("change", () => {
        if (!backgroundModeColor.checked) return;
        setBackgroundMode("plain");
        syncBgFormToContentType();
    });
}

if (backgroundModeGradient) {
    backgroundModeGradient.addEventListener("change", () => {
        if (!backgroundModeGradient.checked) return;
        setBackgroundMode("gradient");
        syncBgFormToContentType();
    });
}

if (gradientBackdrop) {
    gradientBackdrop.addEventListener("click", closeGradientModal);
}

if (gradientClose) {
    gradientClose.addEventListener("click", closeGradientModal);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeBackgroundModeModal();
        closeGradientModal();
    }
});

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
