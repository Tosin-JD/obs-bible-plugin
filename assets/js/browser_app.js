function hasVerticalScroll() {
  return document.documentElement.clientHeight < document.documentElement.scrollHeight;
}


function adjustFontSizeBasedOnScroll() {
  // Get the message element by its ID
  var message = document.getElementById('messageDisplay');

  // Get the current font size
  var fontSize = parseInt(window.getComputedStyle(message).fontSize);

  // Check if there is vertical scroll
  if (hasVerticalScroll()) {
    while (hasVerticalScroll() && fontSize > 1) {
      fontSize -= 1;
      message.style.fontSize = fontSize + 'px';
    }
  } else {
    while (!hasVerticalScroll() && fontSize < 90) {
      fontSize += 1;
      message.style.fontSize = fontSize + 'px';
      if(hasVerticalScroll()){
        fontSize -= 1;
        message.style.fontSize = fontSize + 'px';
        break;
      }
    }
  }

  return fontSize + "px";
}


// Callback function for the MutationObserver
function handleMutation(mutationsList, observer) {
  for (var mutation of mutationsList) {
    if (mutation.type === 'childList' && mutation.target.id === 'messageDisplay') {
      // Call the function to adjust font size
      adjustFontSizeBasedOnScroll();
    }
  }
}

// Create a new MutationObserver instance
var observer = new MutationObserver(handleMutation);

// Start observing changes in the inner HTML of the <p> element
observer.observe(document.getElementById('messageDisplay'), { childList: true });
