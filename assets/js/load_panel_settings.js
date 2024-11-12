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

let savedTextShadowColor = localStorage.getItem('rawShadowColor');
let savedTextShadowOpacity = localStorage.getItem('savedTextOpacity');
let savedTextShadowIntensity = localStorage.getItem('savedTextIntensity');
let savedTextShadowHorOffset = localStorage.getItem('savedHorOffset');
let savedTextShadowVerOffset = localStorage.getItem('savedVerOffset');
let savedBgMargin = localStorage.getItem('savedBgMargin');
const savedAnimationData = localStorage.getItem('obs-bible-animationData');


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
loadSavedBorder();

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
loadFontStroke();

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

if (savedRawBgColor) {
    let defaultBgColor = document.getElementById("bgColor");
    defaultBgColor.setAttribute("value", savedRawBgColor);
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

if (savedBorderRadius) {
    let defaultBorderRadius = document.getElementById("rounded-corner");
    defaultBorderRadius.setAttribute("value", savedBorderRadius);
}

if (savedOpacity) {
    let defaultOpacity = document.getElementById("bg-opacity");
    defaultOpacity.setAttribute("value", savedOpacity);
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

if (savedTextShadowIntensity) {
    let defaultShadowIntensity = document.getElementById("shadow-intensity");
    defaultShadowIntensity.setAttribute("value", savedTextShadowIntensity);
}

if (savedTextShadowOpacity) {
    let defaultShadowOpacity = document.getElementById("shadow-opacity");
    defaultShadowOpacity.setAttribute("value", savedTextShadowOpacity);
}

if (savedTextShadowHorOffset) {
    let defaultShadowHor = document.getElementById("hor-shadow-offset");
    defaultShadowHor.setAttribute("value", savedTextShadowHorOffset);
}

if (savedTextShadowVerOffset) {
    let defaultShadowVer = document.getElementById("ver-shadow-offset");
    defaultShadowVer.setAttribute("value", savedTextShadowVerOffset);
}

if (savedBgMargin) {
    let defaultMargin = document.getElementById("bg-margin");
    defaultMargin.value = savedBgMargin;
}
