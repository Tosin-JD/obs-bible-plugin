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
var savedShadowColor = localStorage.getItem('savedShadowColor');
let savedBgMargin = localStorage.getItem('savedBgMargin');
const savedAnimationData = localStorage.getItem('obs-bible-animationData');

function loadSavedBorder() {
  let savedMainBorder = localStorage.getItem('obs-bible-saved-main-border');
  let savedMainBorderColor = localStorage.getItem('obs-bible-saved-main-border-color');
  let savedMainBorderType = localStorage.getItem('obs-bible-saved-main-border-type');

  // Apply saved settings if they exist
  if (savedMainBorder !== null) {
    bgContainer.style.border = `${savedMainBorder}px ${savedMainBorderColor || '#000000'} ${ savedMainBorderType || 'solid'}`;
  }
  if (savedMainBorderColor !== null) {
    bgContainer.style.border = `${savedMainBorder || 0}px ${savedMainBorderColor}  ${ savedMainBorderType || 'solid'}`;
  }
  if (savedMainBorderType !== null) {
    bgContainer.style.border = `${savedMainBorder}px ${savedMainBorderColor} ${savedMainBorderType}`;
  }
}
loadSavedBorder();

function loadFontStroke() {
  let savedStrokeWidth = localStorage.getItem('obs-bible-saved-font-outline');
  let savedStrokeColor = localStorage.getItem('obs-bible-saved-font-outline-color');

  // Apply saved settings if they exist
  if (savedStrokeWidth !== null) {
    // fontOutlineSlider.value = savedStrokeWidth;
    messageDisplay.style.webkitTextStroke = `${savedStrokeWidth}px ${savedStrokeColor || '#000000'}`;
  }
  if (savedStrokeColor !== null) {
    messageDisplay.style.webkitTextStroke = `${savedStrokeWidth || 0}px ${savedStrokeColor}`;
  }
}
loadFontStroke();

if (savedAnimationData) {
    let animationData = JSON.parse(savedAnimationData);
    if (animationData.display) {
        if (animationData.display === "flex"){
          bgContainer.style.display = 'flex';
        }else{
            bgContainer.style.display = 'none';
        }
    }else{
      bgContainer.style.display = 'flex';
    }

}

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
    messageDisplay.textAlign = savedTextAlign;
}


if (savedShadowColor) {
    messageDisplay.style.textShadow = savedShadowColor;
}

if (savedBgMargin){
    messageDisplay.style.padding = savedBgMargin;
}
adjustFontSizeBasedOnScroll();
