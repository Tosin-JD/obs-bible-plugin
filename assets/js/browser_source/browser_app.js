var updateMessage = (messageId, message) => {
  const messageElem = document.getElementById(messageId);
  if (!messageElem) return;

  const isObject = typeof message === "object" && message !== null;
  const isFadeIn = isObject ? !!message.fadein : false;
  let content = isObject ? (message.messageContent ?? "") : (message ?? "");

  if (content === "undefined" || content === "null") {
    content = "";
  }

  if (isFadeIn) {
    messageElem.classList.remove('fade-in');
    messageElem.style.display = 'none';
    messageElem.innerHTML = content;
    void messageElem.offsetWidth;
    messageElem.classList.add('fade-in');
    messageElem.style.display = 'block';
  } else {
    messageElem.innerHTML = content;
  }
  localStorage.setItem('savedMessage', content);
};

function hasVerticalScroll() {
  const message = document.getElementById('messageDisplay');
  if (!message) return false;

  // Measure against the actual screen container or viewport
  const bgContainer = document.getElementById('bg-container');
  const maxHeight = (bgContainer && bgContainer.clientHeight > 0) ? bgContainer.clientHeight : window.innerHeight;
  const maxWidth = (bgContainer && bgContainer.clientWidth > 0) ? bgContainer.clientWidth : window.innerWidth;

  return (
    document.documentElement.clientHeight < document.documentElement.scrollHeight ||
    message.scrollHeight > maxHeight ||
    message.offsetHeight > maxHeight ||
    message.scrollWidth > maxWidth ||
    message.offsetWidth > maxWidth
  );
}

function adjustFontSizeBasedOnScroll() {
  const message = document.getElementById('messageDisplay');
  if (!message) return;

  const text = (message.innerText || message.textContent || "").trim();
  if (!text) {
    message.style.fontSize = "";
    return;
  }

  const bgContainer = document.getElementById('bg-container');
  const maxHeight = (bgContainer && bgContainer.clientHeight > 0) ? bgContainer.clientHeight : window.innerHeight;
  const maxWidth = (bgContainer && bgContainer.clientWidth > 0) ? bgContainer.clientWidth : window.innerWidth;

  let minFontSize = 1;
  // Cap starting upper bound to 300px to avoid single-letter jumps on short words
  let maxFontSize = Math.min(Math.max(maxHeight, maxWidth), 300);

  // Binary search to find optimal font size fitting container cleanly
  while (minFontSize <= maxFontSize) {
    const midFontSize = Math.floor((minFontSize + maxFontSize) / 2);
    message.style.fontSize = midFontSize + 'px';

    if (hasVerticalScroll()) {
      maxFontSize = midFontSize - 1;
    } else {
      minFontSize = midFontSize + 1;
    }
  }

  // Set bounded font size so text never overflows and stays readable
  const finalSize = Math.max(1, maxFontSize);
  message.style.fontSize = finalSize + 'px';
  return finalSize + 'px';
}

// Adjust font size dynamically on window resize
window.addEventListener('resize', adjustFontSizeBasedOnScroll);

// Callback function for the MutationObserver
function handleMutation(mutationsList, observer) {
  for (var mutation of mutationsList) {
    if (mutation.type === 'childList' && mutation.target.id === 'messageDisplay') {
      adjustFontSizeBasedOnScroll();
    }
  }
}

// Create a new MutationObserver instance
var observer = new MutationObserver(handleMutation);

// Start observing changes in the inner HTML of the message display element
const messageTarget = document.getElementById('messageDisplay');
if (messageTarget) {
  observer.observe(messageTarget, { childList: true });
}
