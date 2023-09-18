// Check if a background color is saved in localStorage
const savedBgColor = localStorage.getItem('bgColor');
const savedFontFamily = localStorage.getItem('fontFamily');
const savedFontColor = localStorage.getItem('fontColor');
const savedBorderRadius = localStorage.getItem('borderRadius');
const savedTitleColor = localStorage.getItem('titleColor');

if (savedBgColor) {
    bgContainer.style.backgroundColor = savedBgColor;
}

if (savedFontFamily) {
    bgContainer.style.fontFamily = savedFontFamily;
}

if (savedFontColor) {
    messageDisplay.style.fontColor = savedFontColor;
}

if (savedBorderRadius) {
    bgContainer.style.borderRadius = savedBorderRadius;
}

if (savedTitleColor) {
    changeSpanColors(localStorage.getItem('titleColor'));
    // messageTitle.style.color = savedTitleColor;
}


