const TEXT_ANIMATION_STORAGE_KEY = 'obs-bible-text-animationData';
let textAnimationData = null;
let textAnimationToken = 0;
let cancelActiveTextAnimation = null;
const skipAutoFitElements = new WeakSet();
let activeTypewriterFitState = null;
let fontSizeFitFrame = null;
let queuedFontFitTarget = null;
let lastFontFit = null;
let messageFitResizeObserver = null;
const maximumTextPhaseDuration = 10;
const minimumTypewriterTimerInterval = 0.004;
const overlayTransitionTypes = new Set([
  'bounce', 'burst', 'roll', 'skate', 'block', 'staggered-letter'
]);
const textGraphemeSegmenter = typeof Intl.Segmenter === 'function'
  ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
  : null;

const songBlockLevelTags = new Set([
  "P", "DIV", "BR", "HR", "SECTION", "ARTICLE", "ASIDE", "NAV", "HEADER", "FOOTER",
  "MAIN", "FIGURE", "FIGCAPTION", "BLOCKQUOTE", "PRE", "LI", "UL", "OL",
  "H1", "H2", "H3", "H4", "H5", "H6", "TABLE", "THEAD", "TBODY", "TFOOT",
  "TR", "TD", "TH", "CAPTION"
]);

function isSongBlockNode(node) {
  return node && node.nodeType === Node.ELEMENT_NODE && songBlockLevelTags.has(node.tagName);
}

function isBlankSongNode(node) {
  if (node.nodeType === Node.TEXT_NODE) return node.data.trim() === "";
  if (node.nodeType === Node.ELEMENT_NODE) return node.textContent.trim() === "";
  return false;
}

function normalizeSongMarkup(markup) {
  if (!markup || typeof markup !== "string") return markup;
  const tmp = document.createElement("div");
  tmp.innerHTML = markup;

  const walker = document.createTreeWalker(tmp, NodeFilter.SHOW_TEXT);
  const removable = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.data.trim() === "" &&
        (isSongBlockNode(node.previousSibling) || isSongBlockNode(node.nextSibling))) {
      removable.push(node);
    }
  }
  removable.forEach(node => node.remove());

  while (tmp.firstChild && isBlankSongNode(tmp.firstChild)) tmp.firstChild.remove();
  while (tmp.lastChild && isBlankSongNode(tmp.lastChild)) tmp.lastChild.remove();

  return tmp.innerHTML;
}

function getTextGraphemes(text) {
  return textGraphemeSegmenter
    ? Array.from(textGraphemeSegmenter.segment(text), item => item.segment)
    : Array.from(text);
}

const defaultBrowserTextAnimationData = {
  version: 1,
  enabled: true,
  intro: { type: 'crossfade', easing: 'ease-in-out', duration: 0.6 },
  outro: { type: 'crossfade', easing: 'ease-in-out', duration: 0.6 },
  stagger: 0.03,
  effect: { enabled: false, type: 'none' }
};

const browserTransitionTypes = new Set([
  'none', 'fade', 'crossfade', 'blur', 'slide-left', 'slide-right', 'slide-top', 'slide-bottom',
  'typewriter', 'bounce', 'burst', 'roll', 'skate', 'block', 'mask', 'circular-reveal', 'vertical-split', 'horizontal-split',
  'push', 'pull', 'whip-pan', 'wave', 'liquid-morph', 'pixel-dissolve', 'light-flash',
  'glow', 'staggered-letter', 'zoom-in', 'zoom-out', 'shake'
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
  const normalizeDuration = (value, fallback) => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'string' && value.trim() === '') return fallback;
    const numericValue = Number(value);
    return Number.isFinite(numericValue)
      ? Math.min(10, Math.max(0.01, numericValue))
      : fallback;
  };
  const legacyFallback = normalizeDuration(textAnimationData.duration, 0.6);
  const introDuration = normalizeDuration(textAnimationData.intro?.duration, legacyFallback);
  const outroDuration = normalizeDuration(textAnimationData.outro?.duration, legacyFallback);
  textAnimationData.enabled = textAnimationData.enabled !== false;
  const introType = browserTransitionTypes.has(textAnimationData.intro?.type)
    ? textAnimationData.intro.type : 'crossfade';
  const outroType = browserTransitionTypes.has(textAnimationData.outro?.type)
    ? textAnimationData.outro.type : 'crossfade';
  textAnimationData.intro = {
    type: introType,
    easing: browserEasings.has(textAnimationData.intro?.easing)
      ? textAnimationData.intro.easing : 'ease-in-out',
    duration: introDuration
  };
  textAnimationData.outro = {
    type: outroType,
    easing: browserEasings.has(textAnimationData.outro?.easing)
      ? textAnimationData.outro.easing : 'ease-in-out',
    duration: outroDuration
  };
  delete textAnimationData.duration;
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
    if (!settings.enabled) {
      clearTextTransitionClasses(messageElem);
      applyTextEffect(messageElem, { effect: { enabled: false, type: 'none' } });
      return;
    }
    clearTextTransitionClasses(messageElem);
    const originalContent = messageElem.innerHTML;
    (async () => {
      await runTextAnimationPhase(messageElem, settings.outro.type, settings.outro.easing, settings.outro.duration, 'out');
      if (previewToken !== textAnimationToken) return;
      clearTextTransitionClasses(messageElem);
      messageElem.innerHTML = originalContent;
      await runTextAnimationPhase(messageElem, settings.intro.type, settings.intro.easing, settings.intro.duration, 'in');
      if (previewToken !== textAnimationToken) return;
      clearTextTransitionClasses(messageElem);
      applyTextEffect(messageElem, settings);
    })();
    return;
  }
  if (event.data && typeof event.data === 'object') {
    const settings = event.data.type === 'settings' ? event.data.settings : event.data;
    if (!settings || typeof settings !== 'object') return;
    localStorage.setItem(TEXT_ANIMATION_STORAGE_KEY, JSON.stringify(settings));
    textAnimationData = loadTextAnimationData();
    const messageElem = document.getElementById('messageDisplay');
    const activeEffect = Array.from(messageElem?.classList || [])
      .find((className) => className.startsWith('text-effect-'));
    const configuredEffect = `text-effect-${textAnimationData.effect.type}`;
    if (messageElem && (!textAnimationData.enabled ||
        !textAnimationData.effect.enabled ||
        textAnimationData.effect.type === 'none' ||
        (activeEffect && activeEffect !== configuredEffect))) {
      applyTextEffect(messageElem, { effect: { enabled: false, type: 'none' } });
    }
  }
};

window.addEventListener('beforeunload', () => {
  textAnimationReceiveChannel.close();
  messageFitResizeObserver?.disconnect();
  window.removeEventListener('resize', handleFontFitResize);
  if (fontSizeFitFrame !== null) cancelAnimationFrame(fontSizeFitFrame);
});

function clearTextTransitionClasses(messageElem) {
  cancelActiveTextAnimation?.();
  Array.from(messageElem.classList).forEach((className) => {
    if (className.startsWith('text-') && !className.startsWith('text-effect-')) {
      messageElem.classList.remove(className);
    }
  });
  messageElem.querySelector('.typewriter-caret')?.remove();
  messageElem.querySelector('.text-animation-overlay')?.remove();
  messageElem.classList.remove('text-animation-source-hidden');
  messageElem.style.removeProperty('--text-animation-duration');
  messageElem.style.removeProperty('--text-animation-easing');
  messageElem.style.removeProperty('--text-stagger-delay');
}

function createCharacterAnimationOverlay(messageElem, type, direction, duration, stagger) {
  const walker = document.createTreeWalker(messageElem, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  const characterCount = textNodes.reduce((count, textNode) => {
    return count + getTextGraphemes(textNode.data).filter(character => !/\s/u.test(character)).length;
  }, 0);
  if (characterCount === 0) return { characterCount: 0, stagger: 0, duration };

  const effectiveStagger = characterCount > 1
    ? Math.min(Math.max(0, stagger), duration / characterCount)
    : 0;
  const characterDuration = characterCount > 1
    ? duration - effectiveStagger * (characterCount - 1)
    : duration;
  const messageRect = messageElem.getBoundingClientRect();
  const overlay = document.createElement('span');
  overlay.className = 'text-animation-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  let index = 0;

  textNodes.forEach((textNode) => {
    const graphemes = getTextGraphemes(textNode.data);
    const computed = window.getComputedStyle(textNode.parentElement);
    let textOffset = 0;
    graphemes.forEach((grapheme) => {
      const startOffset = textOffset;
      textOffset += grapheme.length;
      if (/\s/u.test(grapheme)) return;

      const range = document.createRange();
      range.setStart(textNode, startOffset);
      range.setEnd(textNode, textOffset);
      const rect = range.getBoundingClientRect();
      if (!rect.width && !rect.height) return;

      const character = document.createElement('span');
      character.className = 'text-animation-char';
      character.textContent = grapheme;
      const sourceParent = textNode.parentElement;
      character.dataset.titleColor = String(
        Boolean(sourceParent.closest('.bible-reference')) ||
        Boolean(sourceParent.closest(
          'span:not(.bible-content):not(.bible-message):not(.bible-reference)'
        ))
      );
      const animationIndex = direction === 'out' ? characterCount - index - 1 : index;
      character.style.setProperty('--text-stagger-index', String(animationIndex));
      character.style.left = `${rect.left - messageRect.left - messageElem.clientLeft}px`;
      character.style.top = `${rect.top - messageRect.top - messageElem.clientTop}px`;
      character.style.color = computed.color;
      character.style.font = computed.font;
      character.style.fontKerning = computed.fontKerning;
      character.style.fontFeatureSettings = computed.fontFeatureSettings;
      character.style.fontVariant = computed.fontVariant;
      character.style.fontVariantCaps = computed.fontVariantCaps;
      character.style.letterSpacing = computed.letterSpacing;
      character.style.lineHeight = computed.lineHeight;
      character.style.textDecoration = computed.textDecoration;
      character.style.textDecorationColor = computed.textDecorationColor;
      character.style.textTransform = computed.textTransform;
      character.style.textShadow = computed.textShadow;
      character.style.webkitTextFillColor = computed.webkitTextFillColor;
      character.style.webkitTextStroke = computed.webkitTextStroke;
      character.style.direction = computed.direction;
      character.style.writingMode = computed.writingMode;

      if (type === 'burst') {
        const angle = index * 2.399963229728653;
        const x = Math.cos(angle) * 18;
        const y = Math.sin(angle) * 18;
        character.style.setProperty('--text-burst-x', `${x}px`);
        character.style.setProperty('--text-burst-y', `${y}px`);
        character.style.setProperty('--text-burst-from-x', `${-x}px`);
        character.style.setProperty('--text-burst-from-y', `${-y}px`);
      }

      index += 1;
      overlay.appendChild(character);
    });
  });

  if (index === 0) return { characterCount: 0, stagger: 0, duration };
  messageElem.appendChild(overlay);
  messageElem.classList.add('text-animation-source-hidden');
  return { characterCount: index, stagger: effectiveStagger, duration: characterDuration };
}

function getTextNodesForTypewriter(messageElem) {
  const bibleContent = Array.from(messageElem.querySelectorAll('.bible-content'));
  const roots = bibleContent.length > 0 ? bibleContent : [messageElem];
  const nodes = [];
  roots.forEach((root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      if (walker.currentNode.parentElement?.closest('.typewriter-caret')) continue;
      nodes.push(walker.currentNode);
    }
  });
  return nodes;
}

function positionTypewriterCaret(caret, messageElem, textNode) {
  const range = document.createRange();
  range.setStart(textNode, textNode.length);
  range.collapse(true);
  const rect = range.getBoundingClientRect();
  const messageRect = messageElem.getBoundingClientRect();
  const computed = window.getComputedStyle(messageElem);
  const fontSize = Number.parseFloat(computed.fontSize) || 16;
  const lineHeight = Number.parseFloat(computed.lineHeight) || fontSize;
  caret.style.left = `${rect.left - messageRect.left}px`;
  caret.style.top = `${rect.top - messageRect.top}px`;
  caret.style.height = `${lineHeight}px`;
  caret.style.color = window.getComputedStyle(textNode.parentElement).color;
}

function runTypewriterPhase(messageElem, direction, duration) {
  const records = getTextNodesForTypewriter(messageElem).map((node) => {
    const graphemes = getTextGraphemes(node.data);
    return { node, graphemes, visibleCount: graphemes.length };
  });
  const characterCount = records.reduce((count, record) => count + record.graphemes.length, 0);
  if (characterCount === 0) return Promise.resolve();

  const originalMarkup = messageElem.innerHTML;
  const fitState = { messageElem, originalMarkup };
  activeTypewriterFitState = fitState;
  if (typeof adjustFontSizeBasedOnScroll === 'function') {
    adjustFontSizeBasedOnScroll(messageElem);
  }
  const reservedHeight = messageElem.getBoundingClientRect().height;
  const segments = records.flatMap((record) =>
    record.graphemes.map((grapheme, index) => ({ record, index, grapheme }))
  );
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  if (direction === 'in') {
    records.forEach((record) => {
      record.visibleCount = 0;
      record.node.data = '';
    });
  }
  if (reducedMotion) {
    records.forEach((record) => {
      record.visibleCount = direction === 'in' ? record.graphemes.length : 0;
      record.node.data = record.graphemes.slice(0, record.visibleCount).join('');
    });
    if (activeTypewriterFitState === fitState) activeTypewriterFitState = null;
    return Promise.resolve();
  }

  const requestedDuration = Number.isFinite(Number(duration))
    ? Math.min(maximumTextPhaseDuration, Math.max(0.01, Number(duration)))
    : 0.6;
  const totalDuration = requestedDuration;
  const previousMinHeight = messageElem.style.minHeight;
  if (reservedHeight > 0) messageElem.style.minHeight = `${reservedHeight}px`;
  const stepCount = Math.max(
    1,
    Math.min(characterCount, Math.ceil(totalDuration / minimumTypewriterTimerInterval))
  );
  const segmentsPerStep = Math.ceil(characterCount / stepCount);
  const stepDelay = totalDuration / stepCount;
  const orderedSegments = direction === 'out' ? segments.slice().reverse() : segments;
  const caret = document.createElement('span');
  caret.className = 'typewriter-caret';
  caret.setAttribute('aria-hidden', 'true');
  messageElem.appendChild(caret);

  return new Promise((resolve) => {
    let segmentIndex = 0;
    let stepIndex = 0;
    let timeoutId = null;
    let settled = false;
    const removeCaret = () => {
      caret.remove();
      messageElem.classList.remove('text-typewriter-active');
    };
    const finish = (restoreText) => {
      if (settled) return;
      settled = true;
      if (timeoutId !== null) clearTimeout(timeoutId);
      if (restoreText) {
        records.forEach((record) => {
          record.node.data = record.graphemes.join('');
        });
      }
      if (previousMinHeight) {
        messageElem.style.minHeight = previousMinHeight;
      } else {
        messageElem.style.removeProperty('min-height');
      }
      if (activeTypewriterFitState === fitState) activeTypewriterFitState = null;
      removeCaret();
      if (cancelActiveTextAnimation === cancel) cancelActiveTextAnimation = null;
      resolve();
    };
    const cancel = () => finish(true);
    cancelActiveTextAnimation = cancel;
    messageElem.classList.add('text-typewriter-active');

    const advance = () => {
      if (segmentIndex >= orderedSegments.length) {
        finish(false);
        return;
      }
      const stepEnd = Math.min(orderedSegments.length, segmentIndex + segmentsPerStep);
      while (segmentIndex < stepEnd) {
        const { record } = orderedSegments[segmentIndex];
        record.visibleCount += direction === 'in' ? 1 : -1;
        record.node.data = record.graphemes.slice(0, record.visibleCount).join('');
        segmentIndex += 1;
      }
      const { record } = orderedSegments[segmentIndex - 1];
      positionTypewriterCaret(caret, messageElem, record.node);
      stepIndex += 1;
      if (segmentIndex >= orderedSegments.length) {
        timeoutId = setTimeout(() => finish(false), stepDelay * 1000);
      } else {
        timeoutId = setTimeout(advance, stepDelay * 1000);
      }
    };

    positionTypewriterCaret(caret, messageElem, orderedSegments[0].record.node);
    advance();
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

function applyMessageTitleColor(message) {
  if (typeof message.titleColor === 'string' && typeof applyTitleColor === 'function') {
    applyTitleColor(message.titleColor);
  }
}

function waitForTextAnimation(messageElem, duration, startAnimation) {
  return new Promise((resolve) => {
    let settled = false;
    let timeoutId = null;
    const expectedDuration = duration;
    const finish = () => {
      if (settled) return;
      settled = true;
      if (timeoutId !== null) clearTimeout(timeoutId);
      if (cancelActiveTextAnimation === cancel) cancelActiveTextAnimation = null;
      resolve();
    };
    const cancel = finish;
    cancelActiveTextAnimation = cancel;
    timeoutId = setTimeout(finish, Math.max(16, expectedDuration * 1000 + 16));
    startAnimation();
    const relevantAnimations = messageElem.getAnimations?.({ subtree: true }).filter((animation) => {
      const target = animation.effect?.target;
      return target === messageElem
        ? !animation.animationName?.startsWith('text-effect-')
        : target?.classList?.contains('text-animation-char');
    }) || [];
    if (relevantAnimations.length > 0) {
      Promise.allSettled(relevantAnimations.map(animation => animation.finished)).then(finish);
    }
  });
}

function runTextAnimationPhase(messageElem, type, easing, duration, direction) {
  clearTextTransitionClasses(messageElem);
  if (!type || type === 'none') return Promise.resolve();
  if (typeof adjustFontSizeBasedOnScroll === 'function') {
    adjustFontSizeBasedOnScroll(messageElem);
  }
  if (type === 'typewriter') {
    return runTypewriterPhase(messageElem, direction, duration);
  }
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  const normalizedDuration = Number.isFinite(Number(duration))
    ? Math.min(maximumTextPhaseDuration, Math.max(0.01, Number(duration)))
    : 0.6;
  const phaseDuration = reducedMotion ? Math.min(normalizedDuration, 0.05) : normalizedDuration;
  let characterAnimation = { characterCount: 0, stagger: 0, duration: phaseDuration };
  if (overlayTransitionTypes.has(type)) {
    characterAnimation = createCharacterAnimationOverlay(
      messageElem,
      type,
      direction,
      phaseDuration,
      textAnimationData?.stagger ?? 0.03
    );
    if (characterAnimation.characterCount === 0) return Promise.resolve();
  }
  messageElem.style.setProperty('--text-animation-duration', `${characterAnimation.duration}s`);
  messageElem.style.setProperty('--text-animation-easing', easing || 'ease-in-out');
  messageElem.style.setProperty('--text-stagger-delay', `${characterAnimation.stagger}s`);
  const waitDuration = characterAnimation.duration +
    (reducedMotion ? 0 : Math.max(0, characterAnimation.characterCount - 1) * characterAnimation.stagger);
  return waitForTextAnimation(
    messageElem,
    waitDuration,
    () => {
      messageElem.classList.add(`text-${type}-${direction}`);
      void messageElem.offsetWidth;
    }
  );
}

var updateMessage = async (messageId, message) =>{
  const messageElem = document.getElementById(messageId);
  if (!messageElem) return;

  const isSongMessage = message.contentType === "song" || message.messageType === "song";
  const fitContainer = messageElem.closest('.message-transition-wrapper') || messageElem.parentElement;
  fitContainer?.classList.toggle('content-song', isSongMessage);

  const settings = loadTextAnimationData();
  const token = ++textAnimationToken;
  const newContent = isSongMessage && typeof message.messageContent === "string"
    ? normalizeSongMarkup(message.messageContent)
    : message.messageContent;
  const shouldAnimate = message.animate !== false;

  if (!shouldAnimate) {
    clearTextTransitionClasses(messageElem);
    const contentChanged = messageElem.innerHTML !== newContent;
    if (contentChanged) skipAutoFitElements.add(messageElem);
    messageElem.innerHTML = newContent;
    applyMessageTitleColor(message);
    if (contentChanged && typeof adjustFontSizeBasedOnScroll === 'function') {
      adjustFontSizeBasedOnScroll(messageElem);
    }
  } else if (!settings.enabled) {
    clearTextTransitionClasses(messageElem);
    if (message.fadein === true) {
      messageElem.classList.remove('fade-in');
      messageElem.style.display = 'none';
      messageElem.innerHTML = newContent;
      applyMessageTitleColor(message);
      void messageElem.offsetWidth;
      messageElem.classList.add('fade-in');
      messageElem.style.display = 'block';
    } else {
      messageElem.innerHTML = newContent;
      applyMessageTitleColor(message);
    }
    applyTextEffect(messageElem, { effect: { enabled: false, type: 'none' } });
    if (typeof adjustFontSizeBasedOnScroll === 'function') {
      adjustFontSizeBasedOnScroll(messageElem);
    }
  } else {
    const previousContent = messageElem.innerHTML;
    const previousTitleColor = messageElem.style.getPropertyValue('--title-color');
    const hasCurrentText = messageElem.innerHTML.trim().length > 0;

    skipAutoFitElements.add(messageElem);
    messageElem.innerHTML = newContent;
    applyMessageTitleColor(message);
    if (typeof adjustFontSizeBasedOnScroll === 'function') {
      adjustFontSizeBasedOnScroll(messageElem);
    }

    skipAutoFitElements.add(messageElem);
    messageElem.innerHTML = previousContent;
    if (previousTitleColor && typeof applyTitleColor === 'function') {
      applyTitleColor(previousTitleColor);
    }
    if (typeof adjustFontSizeBasedOnScroll === 'function') {
      adjustFontSizeBasedOnScroll(messageElem);
    }

    if (hasCurrentText && settings.outro?.type !== 'none') {
      await runTextAnimationPhase(messageElem, settings.outro.type, settings.outro.easing, settings.outro.duration, 'out');
    }
    if (token !== textAnimationToken) return;

    clearTextTransitionClasses(messageElem);
    messageElem.innerHTML = newContent;
    applyMessageTitleColor(message);
    localStorage.setItem('savedMessage', newContent);

    if (typeof adjustFontSizeBasedOnScroll === 'function') {
      adjustFontSizeBasedOnScroll(messageElem);
    }

    if (settings.intro?.type !== 'none') {
      await runTextAnimationPhase(messageElem, settings.intro.type, settings.intro.easing, settings.intro.duration, 'in');
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




function getFontFitStyleSignature(messageElem) {
  const style = window.getComputedStyle(messageElem);
  const bibleElementStyles = Array.from(
    messageElem.querySelectorAll('.bible-reference, .bible-content')
  ).map(element => {
    const elementStyle = window.getComputedStyle(element);
    return [
      elementStyle.fontFamily,
      elementStyle.fontWeight,
      elementStyle.fontStyle,
      elementStyle.whiteSpace,
      elementStyle.padding,
      elementStyle.margin,
      elementStyle.borderRadius
    ].join('\u0000');
  }).join('\u0001');
  return [
    style.fontFamily,
    style.fontWeight,
    style.fontStyle,
    style.fontStretch,
    style.fontVariant,
    style.fontKerning,
    style.fontFeatureSettings,
    style.textTransform,
    style.textAlign,
    style.whiteSpace,
    style.wordBreak,
    style.overflowWrap,
    style.hyphens,
    style.direction,
    style.writingMode,
    messageElem.style.lineHeight,
    messageElem.style.letterSpacing,
    messageElem.style.wordSpacing,
    messageElem.style.textIndent,
    messageElem.style.padding,
    messageElem.style.paddingTop,
    messageElem.style.paddingRight,
    messageElem.style.paddingBottom,
    messageElem.style.paddingLeft,
    messageElem.closest('.message-transition-wrapper')?.className || '',
    bibleElementStyles
  ].join('\u0000');
}

function getMessageFitBounds(messageElem) {
  return messageElem.closest('.message-transition-wrapper') || messageElem.parentElement;
}

function syncBibleReferenceFontSize(messageElem) {
  if (!messageElem) return;
  messageElem.querySelectorAll('.bible-reference').forEach((referenceElem) => {
    referenceElem.style.fontSize = 'inherit';
  });
}

function createFontFitMeasurement(messageElem, originalMarkup, bounds) {
  const measurement = messageElem.cloneNode(true);
  measurement.removeAttribute('id');
  measurement.classList.add('font-fit-measurement');
  measurement.innerHTML = originalMarkup;
  syncBibleReferenceFontSize(measurement);
  Array.from(measurement.classList).forEach((className) => {
    if (className.startsWith('text-') || className === 'fade-in') {
      measurement.classList.remove(className);
    }
  });
  measurement.querySelectorAll('.text-animation-overlay, .typewriter-caret')
    .forEach((node) => node.remove());
  measurement.setAttribute('aria-hidden', 'true');
  Object.assign(measurement.style, {
    position: 'absolute',
    left: '0',
    top: '0',
    width: `${bounds.width}px`,
    height: `${bounds.height}px`,
    minHeight: '0',
    maxHeight: 'none',
    display: 'block',
    overflow: 'hidden',
    visibility: 'hidden',
    pointerEvents: 'none',
    opacity: '0',
    transform: 'none',
    filter: 'none',
    animation: 'none',
    transition: 'none'
  });
  messageElem.parentElement.appendChild(measurement);
  return measurement;
}

function adjustFontSizeBasedOnScroll(messageElem = document.getElementById('messageDisplay')) {
  if (!messageElem) return null;

  const activeFitState = activeTypewriterFitState?.messageElem === messageElem
    ? activeTypewriterFitState : null;
  const originalMarkup = activeFitState?.originalMarkup ?? messageElem.innerHTML;
  if (!originalMarkup.trim()) return messageElem.style.fontSize || null;

  const fitBounds = getMessageFitBounds(messageElem);
  if (!fitBounds) return messageElem.style.fontSize || null;
  const bounds = fitBounds.getBoundingClientRect();
  if (bounds.width <= 0 || bounds.height <= 0) {
    return messageElem.style.fontSize || null;
  }

  const styleSignature = getFontFitStyleSignature(messageElem);
  if (lastFontFit &&
      lastFontFit.messageElem === messageElem &&
      lastFontFit.originalMarkup === originalMarkup &&
      lastFontFit.width === bounds.width &&
      lastFontFit.height === bounds.height &&
      lastFontFit.styleSignature === styleSignature &&
      lastFontFit.fontSize === messageElem.style.fontSize) {
    syncBibleReferenceFontSize(messageElem);
    return lastFontFit.fontSize;
  }

  const measurement = createFontFitMeasurement(messageElem, originalMarkup, bounds);
  let low = 1;
  let high = 1000;
  let bestFit = 1;
  let minimumFits = false;
  try {
    measurement.style.fontSize = `${low}px`;
    minimumFits = measurement.scrollWidth <= measurement.clientWidth &&
      measurement.scrollHeight <= measurement.clientHeight;

    while (low <= high) {
      const candidate = Math.floor((low + high) / 2);
      measurement.style.fontSize = `${candidate}px`;
      const fits = measurement.scrollWidth <= measurement.clientWidth &&
        measurement.scrollHeight <= measurement.clientHeight;
      if (fits) {
        bestFit = candidate;
        low = candidate + 1;
      } else {
        high = candidate - 1;
      }
    }
  } finally {
    measurement.remove();
  }

  messageElem.style.fontSize = `${bestFit}px`;
  syncBibleReferenceFontSize(messageElem);
  lastFontFit = {
    messageElem,
    originalMarkup,
    width: bounds.width,
    height: bounds.height,
    styleSignature,
    fontSize: messageElem.style.fontSize
  };
  if (!minimumFits) {
    console.warn('Message content still overflows the browser source at the minimum font size.');
  }
  return lastFontFit.fontSize;
}

function scheduleFontSizeAdjustment(messageElem) {
  queuedFontFitTarget = messageElem;
  if (fontSizeFitFrame !== null) return;
  fontSizeFitFrame = requestAnimationFrame(() => {
    fontSizeFitFrame = null;
    const target = queuedFontFitTarget;
    queuedFontFitTarget = null;
    adjustFontSizeBasedOnScroll(target);
  });
}

function handleFontFitResize() {
  const messageElem = document.getElementById('messageDisplay');
  if (messageElem) scheduleFontSizeAdjustment(messageElem);
}

window.addEventListener('resize', handleFontFitResize);
const messageFitBounds = document.getElementById('message-transition-wrapper') ||
  document.getElementById('messageDisplay')?.parentElement;
if (messageFitBounds && typeof ResizeObserver === 'function') {
  messageFitResizeObserver = new ResizeObserver(handleFontFitResize);
  messageFitResizeObserver.observe(messageFitBounds);
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++




// Callback function for the MutationObserver
function handleMutation(mutationsList, observer) {
  let shouldAdjustFontSize = false;
  const skippedTargets = new Set();
  for (var mutation of mutationsList) {
    if (mutation.type === 'childList' && mutation.target.id === 'messageDisplay') {
      const changedContent = [...mutation.addedNodes, ...mutation.removedNodes].some((node) => {
        return node.nodeType !== Node.ELEMENT_NODE ||
          (!node.classList.contains('text-animation-overlay') &&
           !node.classList.contains('typewriter-caret'));
      });
      if (!changedContent) continue;
      if (skipAutoFitElements.has(mutation.target)) {
        skippedTargets.add(mutation.target);
      } else {
        shouldAdjustFontSize = true;
      }
    }
  }
  skippedTargets.forEach(target => skipAutoFitElements.delete(target));
  if (shouldAdjustFontSize) adjustFontSizeBasedOnScroll();
}

// Create a new MutationObserver instance
var observer = new MutationObserver(handleMutation);

// Start observing changes in the inner HTML of the <p> element
observer.observe(document.getElementById('messageDisplay'), { childList: true });
