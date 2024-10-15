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
var savedDisplay = localStorage.getItem('toggleDisplay');
var savedBibleTranslation = localStorage.getItem('saved-bible-version');

let savedTextShadowColor = localStorage.getItem('rawShadowColor');
let savedTextShadowOpacity = localStorage.getItem('savedTextOpacity');
let savedTextShadowIntensity = localStorage.getItem('savedTextIntensity');
let savedTextShadowHorOffset = localStorage.getItem('savedHorOffset');
let savedTextShadowVerOffset = localStorage.getItem('savedVerOffset');
let savedBgMargin = localStorage.getItem('savedShadowColor');


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

if (savedTextAlign){
    let textAlignOptions = document.getElementById('textAlign');

    for (var i = 0; i <textAlignOptions.options.length; i++) {
        if (textAlignOptions.options[i].value === savedTextAlign) {
            textAlignOptions.options[i].selected = true;
            break;
        }
    }
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
    defaultMargin.setAttribute("value", savedBgMargin);
}

