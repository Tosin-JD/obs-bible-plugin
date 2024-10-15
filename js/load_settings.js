// Check if a background color is saved in localStorage
const savedBgColor = localStorage.getItem('bgColor');
const savedFontFamily = localStorage.getItem('fontFamily');
const savedFontColor = localStorage.getItem('fontColor');
const savedBorderRadius = localStorage.getItem('borderRadius');
const savedTitleColor = localStorage.getItem('titleColor');
var savedMessage = localStorage.getItem('savedMessage');
var savedBoldState = localStorage.getItem('boldState');
var savedItalicState = localStorage.getItem('italicState');
var savedUnderlineState = localStorage.getItem('underlineState');
var savedTextAlign = localStorage.getItem('textAlign');
var savedDisplay = localStorage.getItem('toggleDisplay');
var savedShadowColor = localStorage.getItem('savedShadowColor');
let savedBgMargin = localStorage.getItem('savedShadowColor');

if (savedMessage){
    messageDisplay.innerHTML = savedMessage;
}

if (savedBgColor) {
    bgContainer.style.backgroundColor = savedBgColor;
}

if (savedFontFamily) {
    bgContainer.style.fontFamily = savedFontFamily;
}

if (savedFontColor) {
    bgContainer.style.color = savedFontColor;
}

if (savedBorderRadius) {
    bgContainer.style.borderRadius = savedBorderRadius + "px";
}

if (savedTitleColor) {
    const dspans = document.querySelectorAll("#messageDisplay span");
    dspans.forEach(dspan => dspan.style.color = savedTitleColor);
}

if (savedBoldState){
    messageDisplay.style.fontWeight = savedBoldState;
}

if (savedItalicState){
    messageDisplay.style.fontStyle = savedItalicState;
}

if (savedUnderlineState){
    messageDisplay.style.textDecoration = savedUnderlineState;
}

if (savedTextAlign){
    var body = document.body;
    body.style.display = savedDisplay;
}


if (savedShadowColor) {
    messageDisplay.style.textShadow = savedShadowColor;
}

if (savedMessage){
    messageDisplay.style.padding = savedBgMargin + "px";
}