// Sender webpage
const channelBg = new BroadcastChannel('bg-channel');


var firstBgColor = localStorage.getItem('firstBgColor') || "#222222";
var firstOpacity = localStorage.getItem('firstOpacity');
var firstFontColor = localStorage.getItem('firstFontColor');
var firstTitleColor = localStorage.getItem('firstTitleColor') || "ffff00";
var firstSelectedFont = localStorage.getItem('firstFontStyle');
var firstBorderRadius = localStorage.getItem('firstBorderRadius');

var bgColorInput = document.getElementById("bgColor");
var opacityInput = document.getElementById("opacity");
var fontColorInput = document.getElementById("fontColor");
var titleColorInput = document.getElementById("titleColor");
var selectedFontInput = document.getElementById("fontStyle");
var borderRadiusInput = document.getElementById("borderRadius");

bgColorInput.addEventListener("input", function(event) {
    firstBgColor = event.target.value;
});

opacityInput.addEventListener("input", function(event) {
    firstOpacity = Number(event.target.value)/ 10;
});

fontColorInput.addEventListener("input", function(event) {
    firstFontColor = event.target.value;
});

titleColorInput.addEventListener("input", function(event) {
    firstTitleColor = event.target.value;
});

selectedFontInput.addEventListener("input", function(event) {
    firstSelectedFont = event.target.value;
});

borderRadiusInput.addEventListener("input", function(event) {
    firstBorderRadius = Number(event.target.value) + "px";
});

document.getElementById('saveSettings').addEventListener('click', () => {
    bgColorAndOpacity = hexToRgba(firstBgColor, firstOpacity);
    localStorage.setItem('firstBgColor', firstBgColor);
    localStorage.setItem('firstFontColor', firstFontColor);
    localStorage.setItem('firstTitleColor', firstTitleColor);
    localStorage.setItem('firstOpacity', firstOpacity);
    localStorage.setItem('firstBorderRadius', firstBorderRadius);
    
    let settings = { action: 'save', 
                     bgColor: bgColorAndOpacity, 
                     fontFamily: firstSelectedFont,
                     fontColor: hexToRgba(firstFontColor, 1),
                     titleColor: hexToRgba(firstTitleColor, 1),
                     borderRadius: firstBorderRadius
                   };
    channelBg.postMessage(settings);
});

document.getElementById('resetSettings').addEventListener('click', () => {
    firstBgColor = "#222222";
    firstOpacity = 1;
    firstFontColor = "#ffffff";
    firstTitleColor = "#ffff22";
    firstSelectedFont = "sans-serif";
    firstBorderRadius = "0px"
    bgColorAndOpacity = hexToRgba(firstBgColor, firstOpacity);
    let settings = { action: 'save', 
                     bgColor: bgColorAndOpacity, 
                     fontFamily: firstSelectedFont,
                     fontColor: firstFontColor,
                     titleColor: firstTitleColor,
                     borderRadius: firstBorderRadius
                   };
    channelBg.postMessage(settings);
    localStorage.setItem('firstBgColor', firstBgColor);
    localStorage.setItem('firstFontColor', firstFontColor);
    localStorage.setItem('firstTitleColor', firstTitleColor);
    localStorage.setItem('firstOpacity', firstOpacity);
    localStorage.setItem('firstBorderRadius', firstBorderRadius);
});


function hexToRgba(hex, alpha) {
  hex = hex.replace(/^#/, '');

  let red = parseInt(hex.substring(0, 2), 16);
  let green = parseInt(hex.substring(2, 4), 16);
  let blue = parseInt(hex.substring(4, 6), 16);

  alpha = parseFloat(alpha);
  if (isNaN(alpha) || alpha < 0 || alpha > 1) {
    alpha = 1;
  }
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

