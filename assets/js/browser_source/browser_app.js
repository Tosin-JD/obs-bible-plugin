const TEXT_ANIMATION_STORAGE_KEY = 'obs-bible-text-animationData';
let textAnimationData = null;
let textAnimationToken = 0;

const defaultBrowserTextAnimationData = {
  version: 1,
  enabled: true,
  intro: { type: 'crossfade', easing: 'ease-in-out' },
  outro: { type: 'crossfade', easing: 'ease-in-out' },
  duration: 0.6,
  stagger: 0.03,
  effect: { enabled: false, type: 'none' }
};

const browserTransitionTypes = new Set([
  'none', 'fade', 'crossfade', 'blur', 'slide-left', 'slide-right', 'slide-top', 'slide-bottom',
  'flip', 'spin', 'rotate', 'mask', 'circular-reveal', 'vertical-split', 'horizontal-split',
  'push', 'pull', 'whip-pan', 'wave', 'liquid-morph', 'pixel-dissolve', 'light-flash',
  'glow', 'staggered-letter', 'perspective', '3d-rotation', 'zoom-in', 'zoom-out', 'bounce', 'shake'
]);
const browserEffectTypes = new Set([
  'none', 'pulsating', 'breathing', 'shaking', 'wiggling', 'floating', 'swinging', 'waving',
  'stretching', 'squeezing', '3d-extrusion', 'metallic-reflection', 'reflection', 'shadow-animation',
  'gradient-colour', 'rainbow', 'neon-flicker', 'light-sweep', 'glowing-outline', 'fire', 'smoke',
  'particle', 'liquid-distortion', 'chromatic-aberration', 'rgb-split', 'text-scrambling', 'text-shuffling'
]);
const browserEasings = new Set(['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out']);

function loadTextAnimationData() {
  let parsed = null;
  try {
    parsed = JSON.parse(localStorage.getItem(TEXT_ANIMATION_STORAGE_KEY));
  } catch (error) {
    parsed = null;
  }
  textAnimationData = parsed && typeof parsed === 'object'
    ? parsed
    : JSON.parse(JSON.stringify(defaultBrowserTextAnimationData));
  const duration = Number(textAnimationData.duration);
  textAnimationData.duration = Number.isFinite(duration) ? Math.min(10, Math.max(0.1, duration)) : 0.6;
  textAnimationData.enabled = textAnimationData.enabled !== false;
  const introType = browserTransitionTypes.has(textAnimationData.intro?.type)
    ? textAnimationData.intro.type : 'crossfade';
  const outroType = browserTransitionTypes.has(textAnimationData.outro?.type)
    ? textAnimationData.outro.type : 'crossfade';
  textAnimationData.intro = {
    type: introType,
    easing: browserEasings.has(textAnimationData.intro?.easing)
      ? textAnimationData.intro.easing : 'ease-in-out'
  };
  textAnimationData.outro = {
    type: outroType,
    easing: browserEasings.has(textAnimationData.outro?.easing)
      ? textAnimationData.outro.easing : 'ease-in-out'
  };
  const stagger = Number(textAnimationData.stagger);
  textAnimationData.stagger = Number.isFinite(stagger) ? Math.min(1, Math.max(0, stagger)) : 0.03;
  const effectType = browserEffectTypes.has(textAnimationData.effect?.type)
    ? textAnimationData.effect.type : 'none';
  textAnimationData.effect = {
    enabled: textAnimationData.effect?.enabled === true,
    type: effectType
  };
  return textAnimationData;
}

loadTextAnimationData();

const textAnimationReceiveChannel = new BroadcastChannel('obs-bible-text-animation');
textAnimationReceiveChannel.onmessage = (event) => {
  if (event.data && event.data.type === 'preview') {
    const messageElem = document.getElementById('messageDisplay');
    if (!messageElem) return;
    const previewToken = ++textAnimationToken;
    const settings = loadTextAnimationData();
    (async () => {
      clearTextTransitionClasses(messageElem);
      await runTextAnimationPhase(messageElem, settings.outro.type, settings.outro.easing, settings.duration, 'out');
      if (previewToken !== textAnimationToken) return;
      clearTextTransitionClasses(messageElem);
      await runTextAnimationPhase(messageElem, settings.intro.type, settings.intro.easing, settings.duration, 'in');
      if (previewToken !== textAnimationToken) return;
      clearTextTransitionClasses(messageElem);
      applyTextEffect(messageElem, settings);
    })();
    return;
  }
  if (event.data && typeof event.data === 'object') {
    localStorage.setItem(TEXT_ANIMATION_STORAGE_KEY, JSON.stringify(event.data));
    textAnimationData = loadTextAnimationData();
    const messageElem = document.getElementById('messageDisplay');
    if (messageElem) {
      if (textAnimationData.effect.enabled) {
        applyTextEffect(messageElem, textAnimationData);
      } else {
        applyTextEffect(messageElem, { effect: { enabled: false, type: 'none' } });
      }
    }
  }
};

window.addEventListener('beforeunload', () => textAnimationReceiveChannel.close());

function clearTextTransitionClasses(messageElem) {
  Array.from(messageElem.classList).forEach((className) => {
    if (className.startsWith('text-') && !className.startsWith('text-effect-')) {
      messageElem.classList.remove(className);
    }
    if (className.startsWith('text-effect-')) {
      messageElem.classList.remove(className);
    }
  });
  messageElem.style.removeProperty('--text-animation-duration');
  messageElem.style.removeProperty('--text-animation-easing');
  messageElem.style.removeProperty('--text-stagger-delay');
  unwrapStaggeredText(messageElem);
  const wrapper = document.getElementById('message-transition-wrapper');
  if (wrapper) {
    wrapper.style.removeProperty('--text-animation-duration');
    wrapper.style.removeProperty('--text-animation-easing');
    wrapper.style.removeProperty('--text-stagger-delay');
  }
}

function unwrapStaggeredText(messageElem) {
  messageElem.querySelectorAll('.text-stagger-char').forEach((span) => {
    span.replaceWith(document.createTextNode(span.textContent));
  });
  messageElem.normalize();
}

function splitTextNodesForStagger(messageElem) {
  unwrapStaggeredText(messageElem);
  let index = 0;
  const walker = document.createTreeWalker(messageElem, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach((textNode) => {
    if (!textNode.textContent) return;
    const fragment = document.createDocumentFragment();
    Array.from(textNode.textContent).forEach((character) => {
      const span = document.createElement('span');
      span.className = 'text-stagger-char';
      span.style.setProperty('--text-stagger-index', String(index++));
      span.textContent = character === ' ' ? '\u00a0' : character;
      fragment.appendChild(span);
    });
    textNode.replaceWith(fragment);
  });
}

function applyTextEffect(messageElem, settings) {
  Array.from(messageElem.classList).forEach((className) => {
    if (className.startsWith('text-effect-')) messageElem.classList.remove(className);
  });
  if (settings?.effect?.enabled && settings.effect.type !== 'none') {
    messageElem.classList.add(`text-effect-${settings.effect.type}`);
  }
}

function waitForTextAnimation(messageElem, duration) {
  return new Promise((resolve) => {
    let settled = false;
    let timeoutId = null;
    const finish = () => {
      if (settled) return;
      settled = true;
      if (timeoutId) clearTimeout(timeoutId);
      messageElem.removeEventListener('animationend', finishFromEvent, true);
      resolve();
    };
    const finishFromEvent = (event) => {
      if (event && event.target !== messageElem) return;
      finish();
    };
    messageElem.addEventListener('animationend', finishFromEvent, true);
    timeoutId = setTimeout(finish, Math.max(100, duration * 1000 + 100));
  });
}

function runTextAnimationPhase(messageElem, type, easing, duration, direction) {
  clearTextTransitionClasses(messageElem);
  if (!type || type === 'none') return Promise.resolve();
  messageElem.style.setProperty('--text-animation-duration', `${duration}s`);
  messageElem.style.setProperty('--text-animation-easing', easing || 'ease-in-out');
  messageElem.style.setProperty('--text-stagger-delay', `${textAnimationData?.stagger || 0.03}s`);
  const wrapper = document.getElementById('message-transition-wrapper');
  if (wrapper) {
    wrapper.style.setProperty('--text-animation-duration', `${duration}s`);
    wrapper.style.setProperty('--text-animation-easing', easing || 'ease-in-out');
    wrapper.style.setProperty('--text-stagger-delay', `${textAnimationData?.stagger || 0.03}s`);
  }
  if (type === 'staggered-letter' && direction === 'in') {
    splitTextNodesForStagger(messageElem);
  }
  messageElem.classList.add(`text-${type}-${direction}`);
  void messageElem.offsetWidth;
  return waitForTextAnimation(messageElem, duration);
}

var updateMessage = async (messageId, message) =>{
  const messageElem = document.getElementById(messageId);
  if (!messageElem) return;

  const settings = loadTextAnimationData();
  const token = ++textAnimationToken;
  const newContent = message.messageContent;

  if (!settings.enabled) {
    clearTextTransitionClasses(messageElem);
    if (message.fadein === true) {
      messageElem.classList.remove('fade-in');
      messageElem.style.display = 'none';
      messageElem.innerHTML = newContent;
      void messageElem.offsetWidth;
      messageElem.classList.add('fade-in');
      messageElem.style.display = 'block';
    } else {
      messageElem.innerHTML = newContent;
    }
  } else {
    const hasCurrentText = messageElem.innerHTML.trim().length > 0;
    if (hasCurrentText && settings.outro?.type !== 'none') {
      await runTextAnimationPhase(messageElem, settings.outro.type, settings.outro.easing, settings.duration, 'out');
    }
    if (token !== textAnimationToken) return;

    clearTextTransitionClasses(messageElem);
    messageElem.innerHTML = newContent;
    localStorage.setItem('savedMessage', newContent);

    if (typeof adjustFontSizeBasedOnScroll === 'function') {
      adjustFontSizeBasedOnScroll();
    }

    if (settings.intro?.type !== 'none') {
      await runTextAnimationPhase(messageElem, settings.intro.type, settings.intro.easing, settings.duration, 'in');
    }
    if (token !== textAnimationToken) return;
    clearTextTransitionClasses(messageElem);
    applyTextEffect(messageElem, settings);
  }
  localStorage.setItem('savedMessage', newContent);
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
