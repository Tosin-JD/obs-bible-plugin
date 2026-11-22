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
const sliderValueInputs = new Map();
let activeSliderTrack = null;

function getSliderValueConfig(slider) {
    const min = slider.min === "" ? 0 : Number(slider.min);
    const max = slider.max === "" ? 100 : Number(slider.max);
    const stepAttribute = slider.getAttribute("step");
    const step = stepAttribute === "any" ? null : Number(stepAttribute || 1);
    const validStep = step !== null && Number.isFinite(step) && step > 0 ? step : null;
    const stepString = String(validStep);
    const exponent = stepString.match(/e-(\d+)$/i);
    const precision = validStep === null
        ? 8
        : Math.min(8, exponent
            ? Number(exponent[1])
            : (stepString.split(".")[1] || "").length);
    const normalizedMin = Number.isFinite(min) ? min : 0;

    return {
        min: normalizedMin,
        max: Number.isFinite(max) ? max : 100,
        step: validStep,
        precision,
        allowNegative: normalizedMin < 0,
        allowFraction: validStep === null || !Number.isInteger(validStep),
    };
}

function sanitizeNumericInput(value, allowNegative, allowFraction) {
    let sanitized = "";
    let hasDecimal = false;

    for (const character of value) {
        if (/[0-9]/.test(character)) {
            sanitized += character;
        } else if (character === "-" && allowNegative && sanitized === "") {
            sanitized += character;
        } else if (character === "." && allowFraction && !hasDecimal) {
            sanitized += character;
            hasDecimal = true;
        }
    }

    return sanitized;
}

function isIncompleteNumericInput(value) {
    return value === "" || value === "-" || value === "." || value === "-." || value.endsWith(".");
}

function normalizeSliderValue(value, config) {
    const clamped = Math.min(config.max, Math.max(config.min, value));
    const stepped = config.step === null
        ? clamped
        : config.min + Math.round((clamped - config.min) / config.step) * config.step;
    const bounded = Math.min(config.max, Math.max(config.min, stepped));
    return Number(bounded.toFixed(config.precision));
}

function syncSliderValueInput(slider) {
    const valueInput = sliderValueInputs.get(slider);
    if (valueInput) valueInput.value = slider.value;
}

function updateSliderFromValueInput(slider, valueInput, config) {
    const parsed = Number(valueInput.value);
    if (Number.isNaN(parsed)) return;

    const previousValue = slider.value;
    slider.value = String(normalizeSliderValue(parsed, config));
    if (slider.value !== previousValue) {
        slider.dispatchEvent(new Event("input", { bubbles: true }));
    } else {
        syncSliderValueInput(slider);
    }
}

function clearActiveSliderTrack() {
    activeSliderTrack?.classList.remove("is-active");
    activeSliderTrack = null;
}

document.addEventListener("pointerup", clearActiveSliderTrack);
document.addEventListener("pointercancel", clearActiveSliderTrack);

function initializeSliderValueInputs() {
    document.querySelectorAll("input[type='range'].slider").forEach(slider => {
        const valueInput = document.getElementById(`${slider.id}-value`);
        if (!valueInput) return;
        const config = getSliderValueConfig(slider);
        valueInput.inputMode = config.allowFraction || config.allowNegative ? "decimal" : "numeric";
        sliderValueInputs.set(slider, valueInput);
        syncSliderValueInput(slider);
        slider.addEventListener("input", () => syncSliderValueInput(slider));

        const track = slider.closest(".slider-track-wrap");
        if (track) {
            track.addEventListener("pointerenter", () => track.classList.add("is-hovered"));
            track.addEventListener("pointerleave", () => track.classList.remove("is-hovered"));
            slider.addEventListener("pointerdown", () => {
                clearActiveSliderTrack();
                activeSliderTrack = track;
                track.classList.add("is-active");
            });
            slider.addEventListener("focus", () => track.classList.add("is-focused"));
            slider.addEventListener("blur", () => track.classList.remove("is-focused"));
        }

        valueInput.addEventListener("input", () => {
            const sanitized = sanitizeNumericInput(valueInput.value, config.allowNegative, config.allowFraction);
            if (sanitized !== valueInput.value) valueInput.value = sanitized;
            if (isIncompleteNumericInput(sanitized)) return;
            updateSliderFromValueInput(slider, valueInput, config);
        });
        valueInput.addEventListener("blur", () => {
            const sanitized = sanitizeNumericInput(valueInput.value, config.allowNegative, config.allowFraction);
            if (sanitized !== valueInput.value) valueInput.value = sanitized;
            if (isIncompleteNumericInput(sanitized)) {
                syncSliderValueInput(slider);
                return;
            }
            updateSliderFromValueInput(slider, valueInput, config);
            syncSliderValueInput(slider);
        });
    });
}

window.syncControlPanelSliderValues = () => {
    sliderValueInputs.forEach((valueInput, slider) => { valueInput.value = slider.value; });
};

initializeSliderValueInputs();

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
    if (typeof val === "string") {
      try { localStorage.setItem(key, val); } catch (e) {}
    }
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
  },
  async cacheRemoteMedia(url) {
    if (!url || typeof url !== "string") return null;
    if (url.startsWith("data:") || url.startsWith("blob:")) return null;

    const cacheKey = `cached_blob_${url}`;
    const existing = await this.get(cacheKey);
    if (existing instanceof Blob) {
      return existing;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) return null;
      const blob = await response.blob();
      if (blob && blob.size > 0) {
        await this.set(cacheKey, blob);
        return blob;
      }
    } catch (err) {
      console.warn("Could not cache remote media locally:", err);
    }
    return null;
  },
  async getMediaBlob(url) {
    if (!url || typeof url !== "string") return null;
    if (url.startsWith("data:") || url.startsWith("blob:")) return null;

    const cacheKey = `cached_blob_${url}`;
    const cached = await this.get(cacheKey);
    if (cached instanceof Blob) {
      return cached;
    }
    return null;
  }
};

function isSeparateBackgrounds() {
    return localStorage.getItem("obs-bible-background-scope") === "separate";
}

function setBgItem(keyName, val) {
    if (isSeparateBackgrounds()) {
        const contentType = getBgContentType();
        const fullKey = `${keyName}_${contentType}`;
        idbMedia.set(fullKey, val);
        idbMedia.set(keyName, val);
    } else {
        // Unified background: write to global key and sync to all tab keys
        idbMedia.set(keyName, val);
        idbMedia.set(`${keyName}_bible`, val);
        idbMedia.set(`${keyName}_song`, val);
        idbMedia.set(`${keyName}_text`, val);
    }
}

function getBgItem(keyName) {
    if (isSeparateBackgrounds()) {
        const contentType = getBgContentType();
        const fullKey = `${keyName}_${contentType}`;
        return localStorage.getItem(fullKey) || localStorage.getItem(keyName);
    } else {
        return localStorage.getItem(keyName) || localStorage.getItem(`${keyName}_bible`) || localStorage.getItem(`${keyName}_song`) || localStorage.getItem(`${keyName}_text`);
    }
}

function removeBgItem(keyName) {
    if (isSeparateBackgrounds()) {
        const contentType = getBgContentType();
        localStorage.removeItem(`${keyName}_${contentType}`);
        localStorage.removeItem(keyName);
    } else {
        localStorage.removeItem(keyName);
        localStorage.removeItem(`${keyName}_bible`);
        localStorage.removeItem(`${keyName}_song`);
        localStorage.removeItem(`${keyName}_text`);
    }
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

    // Keep visual selection state synchronized on the parent cards
    document.querySelectorAll(".background-mode-option").forEach(option => {
        const radio = option.querySelector(".background-mode-radio");
        if (radio && radio.checked) {
            option.classList.add("selected");
        } else {
            option.classList.remove("selected");
        }
    });
}

function getBackgroundOpacityRawValue() {
    const scopedValue = isSeparateBackgrounds()
        ? localStorage.getItem(`obs-bible-bg-opacity_${getBgContentType()}`)
        : null;
    const savedValue = scopedValue ?? localStorage.getItem("obs-bible-bg-opacity") ??
        localStorage.getItem("savedOpacity");
    const numericValue = Number(savedValue);
    return savedValue !== null && savedValue.trim() !== "" && Number.isFinite(numericValue)
        ? Math.round(Math.min(BACKGROUND_OPACITY_STEPS, Math.max(0, numericValue)))
        : BACKGROUND_OPACITY_STEPS;
}

function getBackgroundOpacityValue() {
    return getBackgroundOpacityRawValue() / BACKGROUND_OPACITY_STEPS;
}

function syncBackgroundOpacityControls(rawValue = String(getBackgroundOpacityRawValue())) {
    backgroundOpacityControls.forEach(control => {
        control.max = String(BACKGROUND_OPACITY_STEPS);
        control.value = rawValue;
        syncSliderValueInput(control);
    });
}

function updateBackgroundOpacityPreview() {
    const rawColor = localStorage.getItem("rawBgColor") || bgColorInput?.value || "#553355";
    const transparent = hexToRgba(rawColor, 0);
    const solid = hexToRgba(rawColor, 1);
    const opacity = getBackgroundOpacityValue();

    backgroundOpacityControls.forEach(control => {
        control.style.backgroundImage = `linear-gradient(to right, ${transparent}, ${solid})`;
    });
    if (backgroundColorOptionPreview) backgroundColorOptionPreview.style.opacity = "1";
    if (backgroundGradientOptionPreview) backgroundGradientOptionPreview.style.opacity = String(opacity);
    if (backgroundStylePreview) {
        backgroundStylePreview.style.opacity = getBackgroundMode() === "gradient" ? String(opacity) : "1";
    }
    const videoPreview = document.getElementById("cp-video-preview");
    if (videoPreview) videoPreview.style.opacity = String(opacity);
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
    const savedGradientCss = getBgItem("obs-bible-gradient-css") || localStorage.getItem(gradientStorageKeys.css);
    const solidBackgroundCss = getSolidBackgroundCss();
    const gradientCss = savedGradientCss || buildGradientCss(gradientColors, gradientType, gradientDirection);
    const currentMode = getBackgroundMode();

    setBackgroundSurface(backgroundColorOptionPreview, solidBackgroundCss, "none");
    setBackgroundSurface(backgroundGradientOptionPreview, "transparent", gradientCss);

    if (currentMode === "gradient") {
        setBackgroundSurface(backgroundStylePreview, "transparent", gradientCss);
    } else {
        setBackgroundSurface(backgroundStylePreview, solidBackgroundCss, "none");
    }

    syncBackgroundModeRadios();
    updateBackgroundOpacityPreview();
}

function isGifSource(src) {
    if (!src) return false;
    if (/^data:image\/gif/i.test(src.trim())) return true;
    try { return new URL(src, window.location.href).pathname.toLowerCase().endsWith(".gif"); } catch (_) { return false; }
}

function detachControlPanelMedia() {
    const video = document.getElementById("cp-video-preview");
    if (video) { video.pause(); video.removeAttribute("src"); video.load(); video.style.display = "none"; }
}

function broadcastGradient(cssValue) {
    const settingsChannel = new BroadcastChannel("settings");
    settingsChannel.postMessage({ gradientBackground: cssValue });
    settingsChannel.close();
}

function clearGradient() {
    localStorage.removeItem(gradientStorageKeys.css);
    removeBgItem("obs-bible-gradient-css");
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
    const contentType = isSeparateBackgrounds() ? getBgContentType() : "all";
    const settingsChannel = new BroadcastChannel("settings");
    settingsChannel.postMessage({
        bgUpdateContentType: contentType,
        backgroundScope: isSeparateBackgrounds() ? "separate" : "same"
    });
    settingsChannel.close();
}

function setBackgroundMode(mode, options = {}) {
    const { broadcast = true } = options;
    setBgItem("obs-bible-background-mode", mode);
    localStorage.setItem("obs-bible-background-mode", mode);

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
    localStorage.setItem(gradientStorageKeys.css, cssValue);
    localStorage.setItem(gradientStorageKeys.colors, JSON.stringify(gradientColors));
    localStorage.setItem(gradientStorageKeys.type, gradientType);
    localStorage.setItem(gradientStorageKeys.direction, gradientDirection);
}

function applyGradient() {
    const gradientCss = buildGradientCss(gradientColors, gradientType, gradientDirection);
    saveGradientState(gradientCss);
    setBgItem("obs-bible-background-mode", "gradient");
    localStorage.setItem("obs-bible-background-mode", "gradient");
    broadcastGradient(gradientCss);
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
    const gradientOpacityValue = document.getElementById("gradient-opacity-value");
    if (gradientOpacityValue) gradientOpacityValue.value = String(percent);
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
    updateBgScopeUI();
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
    const savedColors = getBgItem("obs-bible-gradient-colors") || localStorage.getItem(gradientStorageKeys.colors);
    const savedType = getBgItem("obs-bible-gradient-type") || localStorage.getItem(gradientStorageKeys.type);
    const savedDirection = getBgItem("obs-bible-gradient-direction") || localStorage.getItem(gradientStorageKeys.direction);
    const savedCss = getBgItem("obs-bible-gradient-css") || localStorage.getItem(gradientStorageKeys.css);

    if (savedColors) {
        try {
            const parsed = JSON.parse(savedColors);
            if (parsed.length && typeof parsed[0] === "string") {
                gradientColors = parsed.map(color => ({ color, opacity: 1 }));
            } else {
                gradientColors = parsed.map(item => ({
                    color: item.color || "#000000",
                    opacity: typeof item.opacity === "number" ? item.opacity : 1
                }));
            }
        } catch (e) {
            gradientColors = getDefaultGradientColors();
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

const bibleReferencePreferenceKeys = {
    lineLayout: "obs-bible-reference-line-layout",
    alignment: "obs-bible-reference-alignment",
    bookCase: "obs-bible-reference-book-case",
    showTranslation: "obs-bible-reference-show-translation",
    position: "obs-bible-reference-position",
    fontFamily: "obs-bible-reference-font-family",
    backgroundColor: "obs-bible-reference-background-color",
    backgroundOpacity: "obs-bible-reference-background-opacity",
    padding: "obs-bible-reference-padding",
    margin: "obs-bible-reference-margin",
    radius: "obs-bible-reference-radius"
};

function restoreBibleReferenceRadio(name, preferenceKey, allowedValues, defaultValue) {
    const savedValue = localStorage.getItem(preferenceKey);
    const value = allowedValues.includes(savedValue) ? savedValue : defaultValue;
    document.querySelectorAll(`input[name="${name}"]`).forEach(input => {
        input.checked = input.value === value;
    });
}

restoreBibleReferenceRadio(
    "bible-reference-line-layout",
    bibleReferencePreferenceKeys.lineLayout,
    ["same-line", "separate-line"],
    "same-line"
);
const bibleReferenceAlignmentControl = document.getElementById("bible-reference-alignment-control");

function updateBibleReferenceAlignmentVisibility() {
    const separateLineSelected = document.getElementById("bible-reference-separate-line").checked;
    bibleReferenceAlignmentControl.hidden = !separateLineSelected;
}

updateBibleReferenceAlignmentVisibility();

restoreBibleReferenceRadio(
    "bible-reference-alignment",
    bibleReferencePreferenceKeys.alignment,
    ["left", "center", "right", "justify"],
    "left"
);
restoreBibleReferenceRadio(
    "bible-reference-book-case",
    bibleReferencePreferenceKeys.bookCase,
    ["uppercase", "title-case"],
    "uppercase"
);
restoreBibleReferenceRadio(
    "bible-reference-position",
    bibleReferencePreferenceKeys.position,
    ["above", "below"],
    "above"
);

const bibleReferenceTranslationCheckbox = document.getElementById("bible-reference-show-translation");
bibleReferenceTranslationCheckbox.checked =
    localStorage.getItem(bibleReferencePreferenceKeys.showTranslation) === "true";

const bibleReferenceFontSelect = document.getElementById("bible-reference-font-family");
const savedBibleReferenceFont = localStorage.getItem(bibleReferencePreferenceKeys.fontFamily) || "";
bibleReferenceFontSelect.value = Array.from(bibleReferenceFontSelect.options)
    .some(option => option.value === savedBibleReferenceFont)
    ? savedBibleReferenceFont
    : "";

const bibleReferenceBackgroundColorInput = document.getElementById("bible-reference-background-color");
const savedBibleReferenceBackgroundColor = localStorage.getItem(bibleReferencePreferenceKeys.backgroundColor);
const validBibleReferenceBackgroundColor = /^#[0-9A-Fa-f]{6}$/.test(savedBibleReferenceBackgroundColor || "");
if (savedBibleReferenceBackgroundColor !== null && !validBibleReferenceBackgroundColor) {
    localStorage.removeItem(bibleReferencePreferenceKeys.backgroundColor);
}
bibleReferenceBackgroundColorInput.value = validBibleReferenceBackgroundColor
    ? savedBibleReferenceBackgroundColor
    : "#000000";

const bibleReferenceSliderSettings = [
    { id: "bible-reference-background-opacity", key: bibleReferencePreferenceKeys.backgroundOpacity, min: 0, max: 100, fallback: 100 },
    { id: "bible-reference-padding", key: bibleReferencePreferenceKeys.padding, min: 0, max: 80, fallback: 0 },
    { id: "bible-reference-margin", key: bibleReferencePreferenceKeys.margin, min: 0, max: 100, fallback: 0 },
    { id: "bible-reference-radius", key: bibleReferencePreferenceKeys.radius, min: 0, max: 80, fallback: 0 }
];

function notifyBibleReferencePreferenceChange(preferenceKey, value) {
    if (value === "") {
        localStorage.removeItem(preferenceKey);
    } else {
        localStorage.setItem(preferenceKey, value);
    }
    document.dispatchEvent(new CustomEvent("bible-display-settings-change"));
}

bibleReferenceSliderSettings.forEach(({ id, key, min, max, fallback }) => {
    const slider = document.getElementById(id);
    const savedValue = localStorage.getItem(key);
    const numericValue = Number(savedValue);
    slider.value = String(savedValue !== null && Number.isFinite(numericValue)
        ? Math.min(max, Math.max(min, numericValue))
        : fallback);
});
window.syncControlPanelSliderValues?.();

bibleReferenceBackgroundColorInput.addEventListener("input", () => {
    notifyBibleReferencePreferenceChange(
        bibleReferencePreferenceKeys.backgroundColor,
        bibleReferenceBackgroundColorInput.value
    );
});

bibleReferenceSliderSettings.forEach(({ id, key, min, max }) => {
    const slider = document.getElementById(id);
    slider.addEventListener("input", () => {
        const numericValue = Number(slider.value);
        const normalizedValue = Number.isFinite(numericValue)
            ? Math.min(max, Math.max(min, numericValue))
            : min;
        slider.value = String(normalizedValue);
        if (key === bibleReferencePreferenceKeys.backgroundOpacity &&
            !localStorage.getItem(bibleReferencePreferenceKeys.backgroundColor)) {
            localStorage.setItem(
                bibleReferencePreferenceKeys.backgroundColor,
                bibleReferenceBackgroundColorInput.value
            );
        }
        notifyBibleReferencePreferenceChange(key, String(normalizedValue));
    });
});

document.querySelectorAll('input[name="bible-reference-line-layout"]').forEach(input => {
    input.addEventListener("change", () => {
        if (input.checked) {
            updateBibleReferenceAlignmentVisibility();
            notifyBibleReferencePreferenceChange(bibleReferencePreferenceKeys.lineLayout, input.value);
        }
    });
});

document.querySelectorAll('input[name="bible-reference-alignment"]').forEach(input => {
    input.addEventListener("change", () => {
        if (input.checked) {
            notifyBibleReferencePreferenceChange(bibleReferencePreferenceKeys.alignment, input.value);
        }
    });
});

document.querySelectorAll('input[name="bible-reference-book-case"]').forEach(input => {
    input.addEventListener("change", () => {
        if (input.checked) {
            notifyBibleReferencePreferenceChange(bibleReferencePreferenceKeys.bookCase, input.value);
        }
    });
});

bibleReferenceTranslationCheckbox.addEventListener("change", () => {
    notifyBibleReferencePreferenceChange(
        bibleReferencePreferenceKeys.showTranslation,
        String(bibleReferenceTranslationCheckbox.checked)
    );
});

document.querySelectorAll('input[name="bible-reference-position"]').forEach(input => {
    input.addEventListener("change", () => {
        if (input.checked) {
            notifyBibleReferencePreferenceChange(bibleReferencePreferenceKeys.position, input.value);
        }
    });
});

bibleReferenceFontSelect.addEventListener("change", () => {
    notifyBibleReferencePreferenceChange(bibleReferencePreferenceKeys.fontFamily, bibleReferenceFontSelect.value);
});


function applyBackgroundOpacity(rawValue) {
    const numericValue = Number(rawValue);
    const normalizedValue = Number.isFinite(numericValue)
        ? Math.min(BACKGROUND_OPACITY_STEPS, Math.max(0, numericValue))
        : getBackgroundOpacityRawValue();
    const storedValue = String(normalizedValue);
    setBgItem("obs-bible-bg-opacity", storedValue);
    localStorage.setItem("savedOpacity", storedValue);
    syncBackgroundOpacityControls(storedValue);
    updateBackgroundPreviews();
    let settingsChannel = new BroadcastChannel("settings");
    settingsChannel.postMessage({ backgroundOpacityChanged: true });
    settingsChannel.close();
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


if (bgColorInput) {
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
}


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


function updateTextShadow() {
    const opacity = Number(textShadowOpacity.value) / 10;
    const rawColor = localStorage.getItem('rawShadowColor') || textShadowColor.value || '#000000';
    const shadowColor = hexToRgba(rawColor, opacity);
    const intensity = textShadowIntensity.value;
    const horizontalOffset = textShadowHorOffset.value;
    const verticalOffset = textShadowVerOffset.value;

    localStorage.setItem('savedTextOpacity', textShadowOpacity.value);
    localStorage.setItem('savedTextIntensity', intensity);
    localStorage.setItem('savedHorOffset', horizontalOffset);
    localStorage.setItem('savedVerOffset', verticalOffset);
    localStorage.setItem('textShadowColor', shadowColor);

    const shadowValue = `${horizontalOffset}px ${verticalOffset}px ${intensity}px ${shadowColor}`;
    let settingsChannel = new BroadcastChannel("settings");
    settingsChannel.postMessage({ selectedShadowColor: shadowValue });
    settingsChannel.close();
}

textShadowColor.addEventListener("change", function() {
    localStorage.setItem('rawShadowColor', textShadowColor.value);
    updateTextShadow();
});

textShadowOpacity.addEventListener('input', updateTextShadow);
textShadowIntensity.addEventListener('input', updateTextShadow);
textShadowHorOffset.addEventListener('input', updateTextShadow);
textShadowVerOffset.addEventListener('input', updateTextShadow);


bgMargin.addEventListener("input", function() {
    let selectedMargin = bgMargin.value;
    localStorage.setItem('savedBgMargin', selectedMargin);

    let settingsChannel = new BroadcastChannel("settings");
    settingsChannel.postMessage({ selectedBgMargin: selectedMargin });
    settingsChannel.close();
});

displayLineByLine.addEventListener("change", function() {
    localStorage.setItem("obs-bible-display-song-line-by-line", displayLineByLine.checked);
});

loadGradientState();
syncBackgroundOpacityControls();

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

const bgScopeSameRadio = document.getElementById("bg-scope-same");
const bgScopeSeparateRadio = document.getElementById("bg-scope-separate");
const bgContentTypeContainer = document.getElementById("bg-content-type-container");

function updateBgScopeUI() {
    const isSeparate = isSeparateBackgrounds();
    if (bgScopeSameRadio) bgScopeSameRadio.checked = !isSeparate;
    if (bgScopeSeparateRadio) bgScopeSeparateRadio.checked = isSeparate;
    if (bgContentTypeContainer) {
        bgContentTypeContainer.style.display = isSeparate ? "flex" : "none";
    }
}

function setBgScope(scope) {
    localStorage.setItem("obs-bible-background-scope", scope);
    if (scope === "separate" && bgContentTypeSelect) {
        const type = getBgContentType();
        const scopedMode = localStorage.getItem(`obs-bible-background-mode_${type}`);
        if (!scopedMode) {
            ["obs-bible-background-mode", "obs-bible-video-url", "obs-bible-video-filename", "obs-bible-video-source-type",
             "obs-bible-gradient-colors", "obs-bible-gradient-type", "obs-bible-gradient-direction", "obs-bible-gradient-css",
             "obs-bible-bg-color", "obs-bible-bg-opacity", "obs-bible-image-url", "obs-bible-image-filename"].forEach(key => {
                const value = localStorage.getItem(key);
                if (value !== null) localStorage.setItem(`${key}_${type}`, value);
            });
        }
    }
    updateBgScopeUI();
    syncBgFormToContentType();
    updateBackgroundPreviews();

    if (typeof broadcastBgUpdate === "function") {
        broadcastBgUpdate();
    }
}

if (bgScopeSameRadio) {
    bgScopeSameRadio.addEventListener("change", () => {
        if (bgScopeSameRadio.checked) setBgScope("same");
    });
}

if (bgScopeSeparateRadio) {
    bgScopeSeparateRadio.addEventListener("change", () => {
        if (bgScopeSeparateRadio.checked) setBgScope("separate");
    });
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
    {
        name: "Midnight Sapphire",
        css: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)",
        colors: [
            { color: "#0f172a", opacity: 1 },
            { color: "#1e1b4b", opacity: 1 },
            { color: "#311042", opacity: 1 }
        ],
        type: "linear",
        direction: "to-bottom-right"
    },
    {
        name: "Graceful Velvet",
        css: "linear-gradient(135deg, #180008 0%, #3b0764 50%, #111827 100%)",
        colors: [
            { color: "#180008", opacity: 1 },
            { color: "#3b0764", opacity: 1 },
            { color: "#111827", opacity: 1 }
        ],
        type: "linear",
        direction: "to-bottom-right"
    },
    {
        name: "Emerald Sanctuary",
        css: "linear-gradient(135deg, #064e3b 0%, #022c22 50%, #0f172a 100%)",
        colors: [
            { color: "#064e3b", opacity: 1 },
            { color: "#022c22", opacity: 1 },
            { color: "#0f172a", opacity: 1 }
        ],
        type: "linear",
        direction: "to-bottom-right"
    },
    {
        name: "Golden Worship",
        css: "linear-gradient(135deg, #451a03 0%, #290e05 50%, #0c0a09 100%)",
        colors: [
            { color: "#451a03", opacity: 1 },
            { color: "#290e05", opacity: 1 },
            { color: "#0c0a09", opacity: 1 }
        ],
        type: "linear",
        direction: "to-bottom-right"
    },
    {
        name: "Celestial Dusk",
        css: "linear-gradient(135deg, #172554 0%, #3b0764 50%, #09090b 100%)",
        colors: [
            { color: "#172554", opacity: 1 },
            { color: "#3b0764", opacity: 1 },
            { color: "#09090b", opacity: 1 }
        ],
        type: "linear",
        direction: "to-bottom-right"
    },
    {
        name: "Nordic Slate",
        css: "linear-gradient(135deg, #1f2937 0%, #111827 50%, #030712 100%)",
        colors: [
            { color: "#1f2937", opacity: 1 },
            { color: "#111827", opacity: 1 },
            { color: "#030712", opacity: 1 }
        ],
        type: "linear",
        direction: "to-bottom-right"
    },
    {
        name: "Sacred Amethyst",
        css: "linear-gradient(135deg, #2e1065 0%, #1c053a 50%, #000000 100%)",
        colors: [
            { color: "#2e1065", opacity: 1 },
            { color: "#1c053a", opacity: 1 },
            { color: "#000000", opacity: 1 }
        ],
        type: "linear",
        direction: "to-bottom-right"
    },
    {
        name: "Oceanic Abyss",
        css: "linear-gradient(135deg, #083344 0%, #0c4a6e 50%, #020617 100%)",
        colors: [
            { color: "#083344", opacity: 1 },
            { color: "#0c4a6e", opacity: 1 },
            { color: "#020617", opacity: 1 }
        ],
        type: "linear",
        direction: "to-bottom-right"
    }
];

function renderGradientPresets() {
    const grid = document.getElementById("gradient-presets-grid");
    if (!grid) return;
    grid.innerHTML = "";

    const activeCss = getBgItem("obs-bible-gradient-css") || localStorage.getItem(gradientStorageKeys.css);

    PROFESSIONAL_GRADIENT_PRESETS.forEach(preset => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "gradient-preset-tile tooltip tooltip-bottom";
        if (activeCss && activeCss === preset.css) {
            btn.classList.add("active");
        }
        btn.setAttribute("data-tooltip", preset.name);
        btn.style.backgroundImage = preset.css;
        btn.addEventListener("click", () => {
            // Apply preset immediately to in-memory state
            gradientColors = JSON.parse(JSON.stringify(preset.colors));
            gradientType = preset.type || "linear";
            gradientDirection = preset.direction || "to-bottom-right";
            selectedGradientIndex = 0;

            // Save new state immediately to both scoped and global storage
            saveGradientState(preset.css);
            setBgItem("obs-bible-background-mode", "gradient");
            localStorage.setItem("obs-bible-background-mode", "gradient");

            // Update active preset UI
            grid.querySelectorAll(".gradient-preset-tile").forEach(tile => tile.classList.remove("active"));
            btn.classList.add("active");

            // Immediately re-render palette swatches and direction controls in the modal
            renderGradientSwatches();
            updateGradientDirectionUI();
            updateGradientDirectionPreviews();
            updateOpacityTrack();
            updateBackgroundPreviews();

            // Broadcast immediately to receiver
            broadcastGradient(preset.css);
            broadcastBgUpdate();
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
    syncBackgroundOpacityControls();
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
    const savedVideoType = getVideoSourceType();
    if (bgVideoFilename) bgVideoFilename.textContent = savedVideoName || (getBgItem("obs-bible-video-url") ? "Saved Video Loaded" : "No video chosen");
    syncVideoSourceChoice();

    const savedVideoUrl = getBgItem("obs-bible-video-url");
    if (savedVideoUrl && savedVideoType === "url" && /^https?:/i.test(savedVideoUrl.trim())) {
        idbMedia.getMediaBlob(savedVideoUrl).then(blob => {
            if (blob && bgVideoFilename && !bgVideoFilename.textContent.includes("(cached locally ✓)")) {
                bgVideoFilename.textContent = `${savedVideoName || savedVideoUrl} (cached locally ✓)`;
            }
        });
    }

    if (mode !== "video") detachControlPanelMedia();
    else {
        const currentVideoUrl = getBgItem("obs-bible-video-url");
        const cpVideoPreview = document.getElementById("cp-video-preview");
        const previewToken = `${getBgContentType()}:${savedVideoType}:${currentVideoUrl || ""}`;
        window._cpVideoPreviewToken = previewToken;
        if (isGifSource(currentVideoUrl)) {
            if (cpVideoPreview) { cpVideoPreview.pause(); cpVideoPreview.removeAttribute("src"); cpVideoPreview.load(); cpVideoPreview.style.display = "none"; }
        } else if (currentVideoUrl && cpVideoPreview) {
            idbMedia.getMediaBlob(currentVideoUrl).then(blob => {
                if (window._cpVideoPreviewToken !== previewToken || getBackgroundMode() !== "video") return;
                cpVideoPreview.src = blob ? URL.createObjectURL(blob) : currentVideoUrl;
                cpVideoPreview.style.display = "block";
                cpVideoPreview.play().catch(() => {});
            }).catch(() => {
                if (window._cpVideoPreviewToken !== previewToken || getBackgroundMode() !== "video") return;
                cpVideoPreview.src = currentVideoUrl;
                cpVideoPreview.style.display = "block";
            });
        } else detachControlPanelMedia();
    }

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
            setBgItem("obs-bible-video-source-type", "file");
            syncVideoSourceChoice();
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

function getVideoSourceType() {
    const stored = getBgItem("obs-bible-video-source-type");
    if (stored === "file" || stored === "url") return stored;
    const url = (getBgItem("obs-bible-video-url") || "").trim();
    const inferred = /^(data:|blob:)/i.test(url) ? "file" : (/^https?:/i.test(url) ? "url" : "file");
    setBgItem("obs-bible-video-source-type", inferred);
    return inferred;
}

function syncVideoSourceChoice() {
    const value = getVideoSourceType();
    bgVideoSourceRadios.forEach(radio => { radio.checked = radio.value === value; });
    if (bgVideoFileContainer) bgVideoFileContainer.style.display = value === "file" ? "block" : "none";
    if (bgVideoUrlContainer) bgVideoUrlContainer.style.display = value === "url" ? "block" : "none";
    const saved = getBgItem("obs-bible-video-url") || "";
    if (value === "url" && bgVideoUrlInput && /^https?:/i.test(saved.trim())) bgVideoUrlInput.value = saved;
    if (value === "file" && bgVideoFilename) {
        const fileName = getBgItem("obs-bible-video-filename");
        bgVideoFilename.textContent = fileName && !/^URL:/i.test(fileName) ? fileName : (saved ? "Saved local video/GIF loaded" : "No video or GIF chosen");
    }
    if (value === "url" && bgVideoFilename) {
        const urlLabel = getBgItem("obs-bible-video-filename");
        bgVideoFilename.textContent = urlLabel || (saved ? `URL: ${saved}` : "No video URL applied");
    }
}

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
            setBgItem("obs-bible-video-source-type", radio.value);
            if (bgVideoFileContainer) bgVideoFileContainer.style.display = isFile ? "block" : "none";
            if (bgVideoUrlContainer) bgVideoUrlContainer.style.display = isFile ? "none" : "block";
            if (getBackgroundMode() === "video") syncBgFormToContentType();
        }
    });
});
syncVideoSourceChoice();

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
    bgVideoUrlBtn.addEventListener("click", async () => {
        const url = bgVideoUrlInput.value.trim();
        if (url) {
            setBgItem("obs-bible-video-source-type", "url");
            syncVideoSourceChoice();
            setBgItem("obs-bible-video-url", url);
            setBgItem("obs-bible-video-filename", `URL: ${url}`);
            if (bgVideoFilename) bgVideoFilename.textContent = `URL: ${url} (caching in browser...)`;
            setBackgroundMode("video");
            syncBgFormToContentType();

            // Cache remote video in IndexedDB for seamless zero-stutter looping
            bgVideoUrlBtn.disabled = true;
            const originalBtnText = bgVideoUrlBtn.textContent;
            bgVideoUrlBtn.textContent = "Caching...";

            try {
                const blob = await idbMedia.cacheRemoteMedia(url);
                const stillSelected = getBackgroundMode() === "video" && getVideoSourceType() === "url" && getBgItem("obs-bible-video-url") === url;
                if (blob) {
                    if (stillSelected && bgVideoFilename) bgVideoFilename.textContent = `URL: ${url} (cached locally ✓)`;
                } else {
                    if (stillSelected && bgVideoFilename) bgVideoFilename.textContent = `URL: ${url} (streaming directly)`;
                }
            } catch (e) {
                if (getBackgroundMode() === "video" && getBgItem("obs-bible-video-url") === url && bgVideoFilename) bgVideoFilename.textContent = `URL: ${url}`;
            } finally {
                bgVideoUrlBtn.disabled = false;
                bgVideoUrlBtn.textContent = originalBtnText;
            }
        }
    });
}

if (bgVideoUrlInput) {
    bgVideoUrlInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (bgVideoUrlBtn) bgVideoUrlBtn.click();
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
    const gradientOpacityValue = document.getElementById("gradient-opacity-value");
    if (gradientOpacityValue) {
        gradientOpacityValue.addEventListener("input", () => {
            const sanitized = sanitizeNumericInput(gradientOpacityValue.value, false, false);
            if (sanitized !== gradientOpacityValue.value) gradientOpacityValue.value = sanitized;
            if (isIncompleteNumericInput(sanitized)) return;
            const percent = Math.min(100, Math.max(0, Number(sanitized)));
            if (!gradientColors[selectedGradientIndex]) return;
            gradientColors[selectedGradientIndex].opacity = percent / 100;
            updateOpacityTrack();
            applyGradient();
        });
        gradientOpacityValue.addEventListener("blur", () => {
            const sanitized = sanitizeNumericInput(gradientOpacityValue.value, false, false);
            if (sanitized !== gradientOpacityValue.value) gradientOpacityValue.value = sanitized;
            if (isIncompleteNumericInput(sanitized)) updateOpacityTrack();
        });
    }
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
