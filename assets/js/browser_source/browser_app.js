var updateMessage = (messageId, message) =>{
  const messageElem = document.getElementById(messageId)
  if (message.fadein === true){
    messageElem.classList.remove('fade-in');
    messageElem.style.display = 'none';
    messageElem.innerHTML = message.messageContent;;
    void messageElem.offsetWidth;
    messageElem.classList.add('fade-in');
    messageElem.style.display = 'block';
  }else{
    messageElem.innerHTML = message.messageContent;
  }
  localStorage.setItem('savedMessage', message.messageContent);
};

// function hasVerticalScroll() {
//   return document.documentElement.clientHeight < document.documentElement.scrollHeight;
// }


// function adjustFontSizeBasedOnScroll() {
//   // Get the message element by its ID
//   var message = document.getElementById('messageDisplay');

//   // Get the current font size
//   var fontSize = parseInt(window.getComputedStyle(message).fontSize);

//   // Check if there is vertical scroll
//   if (hasVerticalScroll()) {
//     while (hasVerticalScroll() && fontSize > 1) {
//       fontSize -= 1;
//       message.style.fontSize = fontSize + 'px';
//     }
//   } else {
//     while (!hasVerticalScroll() && fontSize < 90) {
//       fontSize += 1;
//       message.style.fontSize = fontSize + 'px';
//       if(hasVerticalScroll()){
//         fontSize -= 1;
//         message.style.fontSize = fontSize + 'px';
//         break;
//       }
//     }
//   }

//   return fontSize + "px";
// }




// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// new code on adjustable text.

// function hasVerticalScroll() {
//   return document.documentElement.clientHeight < document.documentElement.scrollHeight;
// }


// function adjustFontSizeBasedOnScroll() {
//   // Get the message element by its ID
//   var message = document.getElementById('messageDisplay');

//   // Get the current font size
//   var fontSize = parseInt(window.getComputedStyle(message).fontSize);

//   // Check if there is vertical scroll
//   if (hasVerticalScroll()) {
//     while (hasVerticalScroll() && fontSize > 1) {
//       fontSize -= 1;
//       message.style.fontSize = fontSize + 'px';
//     }
//   } else {
//     while (!hasVerticalScroll() && fontSize < 90) {
//       fontSize += 1;
//       message.style.fontSize = fontSize + 'px';
//       if(hasVerticalScroll()){
//         fontSize -= 1;
//         message.style.fontSize = fontSize + 'px';
//         break;
//       }
//     }
//   }

//   return fontSize + "px";
// }




// function hasVerticalScroll() {
//   return document.documentElement.clientHeight < document.documentElement.scrollHeight;
// }

// function adjustFontSizeBasedOnScroll() {
//   const message = document.getElementById('messageDisplay');
//   const container = message.parentElement; // Ensure the container is the parent of the message
//   let minFontSize = 1; // Minimum font size
//   let maxFontSize = Math.max(container.clientWidth, container.clientHeight); // Dynamic starting point
//   let fontSize = parseInt(window.getComputedStyle(message).fontSize);

//   // Limit the number of iterations to prevent infinite loops
//   const maxIterations = 20;
//   let iterations = 0;

//   // Binary search to find the optimal font size
//   while (minFontSize <= maxFontSize && iterations < maxIterations) {
//     const midFontSize = Math.floor((minFontSize + maxFontSize) / 2);
//     message.style.fontSize = midFontSize + 'px';

//     if (hasVerticalScroll()) {
//       // If there's a scroll, reduce the font size
//       maxFontSize = midFontSize - 1;
//     } else {
//       // If there's no scroll, increase the font size
//       minFontSize = midFontSize + 1;
//     }

//     iterations++;
//   }

//   // Set the final font size
//   message.style.fontSize = maxFontSize + 'px';
//   return maxFontSize + 'px';
// }




function hasVerticalScroll() {
  return document.documentElement.clientHeight < document.documentElement.scrollHeight;
}

function adjustFontSizeBasedOnScroll() {
  const message = document.getElementById('messageDisplay');
  let minFontSize = 1; // Minimum font size
  let maxFontSize = 1000; // A large enough upper limit (can be adjusted)
  let fontSize = parseInt(window.getComputedStyle(message).fontSize);

  // Binary search to find the optimal font size
  while (minFontSize <= maxFontSize) {
    const midFontSize = Math.floor((minFontSize + maxFontSize) / 2);
    message.style.fontSize = midFontSize + 'px';

    if (hasVerticalScroll()) {
      // If there's a scroll, reduce the font size
      maxFontSize = midFontSize - 1;
    } else {
      // If there's no scroll, increase the font size
      minFontSize = midFontSize + 1;
    }
  }

  // Set the final font size
  message.style.fontSize = maxFontSize + 'px';
  return maxFontSize + 'px';
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++




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
