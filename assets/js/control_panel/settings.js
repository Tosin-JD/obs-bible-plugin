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