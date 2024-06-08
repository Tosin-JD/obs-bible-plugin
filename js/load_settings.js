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
<<<<<<< HEAD
var savedDisplay = localStorage.getItem('toggleDisplay');
=======
>>>>>>> 011b7423a553ca7018aa38c82443b16038a60b75

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
<<<<<<< HEAD
    bgContainer.style.color = savedFontColor;
}

if (savedBorderRadius) {
    bgContainer.style.borderRadius = savedBorderRadius + "px";
=======
    messageDisplay.style.fontColor = savedFontColor;
}

if (savedBorderRadius) {
    bgContainer.style.borderRadius = savedBorderRadius;
>>>>>>> 011b7423a553ca7018aa38c82443b16038a60b75
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
<<<<<<< HEAD
    var body = document.body;
    body.style.display = savedDisplay;
=======
    messageDisplay.style.textAlign = savedTextAlign;
>>>>>>> 011b7423a553ca7018aa38c82443b16038a60b75
}