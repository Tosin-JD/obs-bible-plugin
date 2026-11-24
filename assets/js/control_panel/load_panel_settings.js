// Check if a background color is saved in localStorage
const savedRawBgColor = localStorage.getItem('rawBgColor');
const savedFontFamily = localStorage.getItem('fontFamily');
const savedRawFontColor = localStorage.getItem('rawFontColor');
const savedBorderRadius = localStorage.getItem('borderRadius');
const savedOpacity = localStorage.getItem('savedOpacity');
const savedRawTitleColor = localStorage.getItem('rawTitleColor');
var savedMessage = localStorage.getItem('savedMessage');
var savedBoldState = localStorage.getItem('boldState');
var savedItalicState = localStorage.getItem('italicState');
var savedUnderlineState = localStorage.getItem('underlineState');
var savedTextAlign = localStorage.getItem('textAlign');
var savedBibleTranslation = localStorage.getItem('saved-bible-version');
var savedObsBibleTheme = localStorage.getItem('obs-bible-panel-theme');

let savedTextShadowColor = localStorage.getItem('rawShadowColor');
let savedTextShadowOpacity = localStorage.getItem('savedTextOpacity');
let savedTextShadowIntensity = localStorage.getItem('savedTextIntensity');
let savedTextShadowHorOffset = localStorage.getItem('savedHorOffset');
let savedTextShadowVerOffset = localStorage.getItem('savedVerOffset');
const savedAnimationData = localStorage.getItem('obs-bible-animationData');
const savedTextAnimationData = localStorage.getItem('obs-bible-text-animationData');
const savedSpaceBarCheckBox = localStorage.getItem('obs-bible-spacebar-checkbox');
const savedFadeInCheckBox = localStorage.getItem('obs-bible-fadein-checkbox');
const savedDisplayLineByLineCheckBox = localStorage.getItem('obs-bible-display-song-line-by-line');

let loadCheckboxes = () => {
    let spaceBarCheckBox = document.getElementById("spacebar-checkbox");
    let fadeInCheckBox = document.getElementById("fade-in-checkbox");
    let displayLineByLineCheckBox = document.getElementById("obs-bible-display-song-line-by-line");
    if (savedSpaceBarCheckBox === "true"){
        spaceBarCheckBox.checked = true;
    }else{
        spaceBarCheckBox.checked = false;
    }
    if (savedFadeInCheckBox === "true"){
        fadeInCheckBox.checked = true;
    }else{
        fadeInCheckBox.checked = false;
    }
    if (savedDisplayLineByLineCheckBox === "true"){
        displayLineByLineCheckBox.checked = true;
    }else{
        displayLineByLineCheckBox.checked = false;
    }
}


let  loadSavedBorder = () => {
  let savedMainBorder = localStorage.getItem('obs-bible-saved-main-border');
  let savedMainBorderColor = localStorage.getItem('obs-bible-saved-main-border-color');
  let savedMainBorderType = localStorage.getItem('obs-bible-saved-main-border-type');
  let mainBorder = document.getElementById('main-border');
  let mainBorderColor = document.getElementById('main-border-color');
  let mainBorderType = document.getElementById('main-border-type');

  if (savedMainBorder !== null) {
    mainBorder.value = savedMainBorder;
  }
  if (savedMainBorderColor !== null) {
    mainBorderColor.value = savedMainBorderColor;
  }
  if (savedMainBorderType !== null) {
    mainBorderType.value = savedMainBorderType;
  }
}


let loadFontStroke = () => {
  let savedStrokeWidth = localStorage.getItem('obs-bible-saved-font-outline');
  let savedStrokeColor = localStorage.getItem('obs-bible-saved-font-outline-color');
  let fontOutlineSlider =  document.getElementById("font-outline");
  textOutlineColorPicker =  document.getElementById("font-outline-color");

  // Apply saved settings if they exist
  if (savedStrokeWidth !== null) {
    fontOutlineSlider.value = savedStrokeWidth;
  }
  if (savedStrokeColor !== null) {
    textOutlineColorPicker.value = savedStrokeColor;
  }
}


if (savedAnimationData) {
    let animationData = JSON.parse(savedAnimationData);
    animationTypeSelect = document.getElementById('animation-type');
    durationInput = document.getElementById('animation-duration');
    easingSelect = document.getElementById('animation-easing');

    // Apply the saved values to the form elements
    animationTypeSelect.value = animationData.type || animationTypeSelect.value;
    durationInput.value = animationData.duration || durationInput.value;
    easingSelect.value = animationData.easing || easingSelect.value;

    let toggleCheckbox = document.getElementById('toggle-display');
    if (animationData.display) {
        if (animationData.display === "flex"){
          toggleCheckbox.checked = true;
        }else{
            toggleCheckbox.checked = false;
        }
    }else{
      toggleCheckbox.checked = true;
    }
}

if (savedTextAnimationData) {
    try {
        const textData = JSON.parse(savedTextAnimationData);
        const transitionTypes = new Set([
            'none', 'fade', 'crossfade', 'blur', 'slide-left', 'slide-right', 'slide-top', 'slide-bottom',
            'typewriter', 'bounce', 'burst', 'roll', 'skate', 'block', 'mask', 'circular-reveal', 'vertical-split', 'horizontal-split',
            'push', 'pull', 'whip-pan', 'wave', 'liquid-morph', 'pixel-dissolve', 'light-flash',
            'glow', 'staggered-letter', 'zoom-in', 'zoom-out', 'shake'
        ]);
        const easings = new Set(['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out']);
        const legacyDuration = Number(textData.duration);
        const stagger = Number(textData.stagger);
        const normalizeDuration = (value, fallback) => {
            if (value === null || value === undefined) return fallback;
            if (typeof value === 'string' && value.trim() === '') return fallback;
            const numericValue = Number(value);
            return Number.isFinite(numericValue)
                ? Math.min(10, Math.max(0.01, numericValue))
                : fallback;
        };
        const legacyFallback = normalizeDuration(legacyDuration, 0.6);
        const introDuration = normalizeDuration(textData.intro?.duration, legacyFallback);
        const outroDuration = normalizeDuration(textData.outro?.duration, legacyFallback);

        document.getElementById('text-animation-enabled').checked = textData.enabled !== false;
        const textAnimationOptions = document.getElementById('text-animation-options');
        if (textAnimationOptions) {
            textAnimationOptions.hidden = textData.enabled === false;
        }
        document.getElementById('text-intro-animation-type').value =
            transitionTypes.has(textData.intro?.type) ? textData.intro.type : 'crossfade';
        document.getElementById('text-intro-animation-easing').value =
            easings.has(textData.intro?.easing) ? textData.intro.easing : 'ease-in-out';
        document.getElementById('text-outro-animation-type').value =
            transitionTypes.has(textData.outro?.type) ? textData.outro.type : 'crossfade';
        document.getElementById('text-outro-animation-easing').value =
            easings.has(textData.outro?.easing) ? textData.outro.easing : 'ease-in-out';
        document.getElementById('text-intro-animation-duration').value =
            introDuration;
        document.getElementById('text-outro-animation-duration').value =
            outroDuration;
        document.getElementById('text-animation-stagger').value =
            Number.isFinite(stagger) ? Math.min(1, Math.max(0, stagger)) : 0.03;
        document.getElementById('text-effect-enabled').checked = textData.effect?.enabled === true;
        if ([...document.getElementById('text-effect-type').options].some(option => option.value === textData.effect?.type)) {
            document.getElementById('text-effect-type').value = textData.effect.type;
        }
    } catch (error) {
        // Ignore malformed text-animation settings and retain the default controls.
    }
}

if (savedRawBgColor) {
    let defaultBgColor = document.getElementById("bgColor");
    if (defaultBgColor) {
        defaultBgColor.setAttribute("value", savedRawBgColor);
    }
}

if (savedRawFontColor) {
    let defaultFontColor = document.getElementById("fontColor");
    defaultFontColor.setAttribute("value", savedRawFontColor);
}

if (savedFontFamily) {
    let fontOptions = document.getElementById('fontStyle');

    // Loop through each option in the select element
    for (var i = 0; i < fontOptions.options.length; i++) {
        if (fontOptions.options[i].value === savedFontFamily) {
            fontOptions.options[i].selected = true;
            break;
        }
    }
}

if (savedBibleTranslation) {
    let bibleOptions = document.getElementById('bible-version');

    // Loop through each option in the select element
    for (var i = 0; i < bibleOptions.options.length; i++) {
        if (bibleOptions.options[i].value === savedBibleTranslation) {
            bibleOptions.options[i].selected = true;
            break;
        }
    }
}

if (savedBorderRadius !== null) {
    let defaultBorderRadius = document.getElementById("rounded-corner");
    defaultBorderRadius.value = savedBorderRadius;
}

if (savedOpacity !== null) {
    let defaultOpacity = document.getElementById("bg-opacity");
    defaultOpacity.value = savedOpacity;
}

if (savedRawTitleColor) {
    let defaultRawTitle = document.getElementById("titleColor");
    defaultRawTitle.setAttribute("value", savedRawTitleColor);
}

if (savedBoldState){
    let btnBold = document.getElementById("bold");
    btnBold.style.fontWeight = savedBoldState;
    if (savedBoldState === 'bold'){
        btnBold.classList.add("activated");
    }else{
        btnBold.classList.remove("activated");
    }
}

if (savedItalicState){
    let btnItalic = document.getElementById("italic");
    btnItalic.style.fontStyle = savedItalicState;
    if (savedItalicState === 'italic'){
        btnItalic.classList.add("activated");
        btnItalic.style.fontStyle  = 'italic';
    }else{
        btnItalic.classList.remove("activated");
        btnItalic.style.fontStyle  = 'normal';
    }
}

if (savedUnderlineState){
    let btnUnderline = document.getElementById("underline");
    btnUnderline.style.textDecoration = savedUnderlineState;
    if (savedUnderlineState === 'underline'){
        btnUnderline.classList.add("activated");
        btnUnderline.style.textDecoration  = 'underline';
    }else{
        btnUnderline.classList.remove("activated");
        btnUnderline.style.textDecoration  = 'none';
    }
}

if (savedObsBibleTheme) {
    let obsBibleTheme = document.getElementById('obs-bible-panel-theme');
    
    // Loop through each option in the select element
    for (var i = 0; i < obsBibleTheme.options.length; i++) {
        if (obsBibleTheme.options[i].value === savedObsBibleTheme) {
            obsBibleTheme.options[i].selected = true;
            break;
        }
    }
}


if (savedTextAlign) {
    const radios = document.querySelectorAll('input[name="align"]');
    radios.forEach(radio => {
        if (radio.value === savedTextAlign) {
            radio.checked = true; // Check the radio button if it matches the saved value
        }
    });
}

if (savedTextShadowColor) {
    let defaultShadowColor = document.getElementById("shadow-color");
    defaultShadowColor.setAttribute("value", savedTextShadowColor);
}

if (savedTextShadowIntensity !== null) {
    let defaultShadowIntensity = document.getElementById("shadow-intensity");
    defaultShadowIntensity.value = savedTextShadowIntensity;
}

if (savedTextShadowOpacity !== null) {
    let defaultShadowOpacity = document.getElementById("shadow-opacity");
    defaultShadowOpacity.value = savedTextShadowOpacity;
}

if (savedTextShadowHorOffset !== null) {
    let defaultShadowHor = document.getElementById("hor-shadow-offset");
    defaultShadowHor.value = savedTextShadowHorOffset;
}

if (savedTextShadowVerOffset !== null) {
    let defaultShadowVer = document.getElementById("ver-shadow-offset");
    defaultShadowVer.value = savedTextShadowVerOffset;
}

const savedMessagePadding = getSavedMessagePadding();
const messagePaddingVerticalSlider = document.getElementById("message-padding-vertical");
const messagePaddingHorizontalSlider = document.getElementById("message-padding-horizontal");
if (messagePaddingVerticalSlider) {
    messagePaddingVerticalSlider.value = String(savedMessagePadding.vertical);
}
if (messagePaddingHorizontalSlider) {
    messagePaddingHorizontalSlider.value = String(savedMessagePadding.horizontal);
}



document.addEventListener('DOMContentLoaded', function() {
    // Function to set the theme
    function setTheme() {
      const savedBdsBibleTheme = localStorage.getItem('obs-bible-panel-theme');
      const bdsBibleTheme = document.getElementById('obs-bible-panel-theme');
      
      if (savedBdsBibleTheme && bdsBibleTheme) {
        // Try both approaches - setting value directly and selecting the option
        bdsBibleTheme.value = savedBdsBibleTheme;
        
        // Also try to select the option by looping through options
        for (let i = 0; i < bdsBibleTheme.options.length; i++) {
          if (bdsBibleTheme.options[i].value === savedBdsBibleTheme) {
            bdsBibleTheme.options[i].selected = true;
            break;
          }
        }
        
        // Trigger a change event in case any listeners need to know
        const event = new Event('change');
        bdsBibleTheme.dispatchEvent(event);
      }
    }
    
    // Try setting the theme when DOM is loaded
    setTheme();
    
    // In case the select is loaded dynamically, try again after a short delay
    setTimeout(setTheme, 500);
    
    // Add event listener to save theme when changed
    const bdsBibleTheme = document.getElementById('bds-panel-theme');
    if (bdsBibleTheme) {
      bdsBibleTheme.addEventListener('change', function() {
        localStorage.setItem('bds-panel-theme', this.value);
      });
    }
  });
  
  // Also try running the theme setter directly (in case DOMContentLoaded already fired)
  (function() {
    const savedBdsBibleTheme = localStorage.getItem('bds-panel-theme');
    const bdsBibleTheme = document.getElementById('bds-panel-theme');
    
    if (savedBdsBibleTheme && bdsBibleTheme) {
      bdsBibleTheme.value = savedBdsBibleTheme;
    }
  })();


loadCheckboxes();
if (typeof syncBgFormToContentType === "function") {
    syncBgFormToContentType();
}
loadSavedBorder();
loadFontStroke();
if (window.syncControlPanelSliderValues) {
    window.syncControlPanelSliderValues();
}
