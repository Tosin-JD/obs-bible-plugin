(function (global) {
  const SHOW_QR_STORAGE_KEY = "obs-bible-show-route-bible-qr";
  const SAVED_MESSAGE_TYPE_KEY = "obs-bible-saved-message-type";
  const SAVED_REFERENCE_KEY = "obs-bible-saved-route-bible-reference";
  const BUILT_IN_TRANSLATION_CODES = new Set([
    "amplified",
    "crtb",
    "esv",
    "kjv",
    "nkjv",
    "niv",
    "segond_1910",
    "es_rvr",
    "swahili_bible",
    "yoruba_bible",
  ]);

  function normalizeTranslationCode(code) {
    if (!code || !BUILT_IN_TRANSLATION_CODES.has(code)) {
      return "";
    }

    return code;
  }

  function buildRouteBibleQrUrl(referenceLabel, translationCode) {
    if (!referenceLabel) {
      return "";
    }

    const params = new URLSearchParams({
      passage: referenceLabel,
      format: "svg",
      utm_source: "obs_bible_plugin",
      utm_medium: "qr",
      mode: "launcher",
    });

    const normalizedTranslationCode = normalizeTranslationCode(translationCode);
    if (normalizedTranslationCode) {
      params.set("translation", normalizedTranslationCode);
    }

    return `https://route.bible/qr?${params.toString()}`;
  }

  function extractReferenceLabelFromMessage(messageContent) {
    const match = String(messageContent || "").match(/<span[^>]*>(.*?)<\/span>/i);
    if (!match) {
      return "";
    }

    return match[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  }

  function getSelectedTranslationCode(storage) {
    if (!storage || typeof storage.getItem !== "function") {
      return "";
    }

    return normalizeTranslationCode(storage.getItem("saved-bible-version") || "");
  }

  function getRouteBibleQrState(options) {
    const {
      enabled,
      messageContent,
      contentType,
      referenceLabel,
      translationCode,
    } = options || {};

    if (!enabled || contentType !== "bible") {
      return null;
    }

    const resolvedReferenceLabel =
      (referenceLabel && String(referenceLabel).trim()) ||
      extractReferenceLabelFromMessage(messageContent);
    if (!resolvedReferenceLabel) {
      return null;
    }

    return {
      referenceLabel: resolvedReferenceLabel,
      url: buildRouteBibleQrUrl(resolvedReferenceLabel, translationCode),
      alt: `Route Bible QR for ${resolvedReferenceLabel}`,
    };
  }

  function renderQrOverlay(imageEl, options) {
    if (!imageEl) {
      return null;
    }

    const state = getRouteBibleQrState(options);
    if (!state) {
      imageEl.hidden = true;
      if (typeof imageEl.removeAttribute === "function") {
        imageEl.removeAttribute("src");
      }
      if (imageEl.style) {
        imageEl.style.display = "none";
      }
      return null;
    }

    imageEl.src = state.url;
    imageEl.alt = state.alt;
    imageEl.hidden = false;
    if (imageEl.style) {
      imageEl.style.display = "block";
    }
    return state;
  }

  function renderSavedQrOverlay(imageEl, storage) {
    if (!storage || typeof storage.getItem !== "function") {
      return renderQrOverlay(imageEl, { enabled: false });
    }

    return renderQrOverlay(imageEl, {
      enabled: storage.getItem(SHOW_QR_STORAGE_KEY) === "true",
      messageContent: storage.getItem("savedMessage") || "",
      contentType: storage.getItem(SAVED_MESSAGE_TYPE_KEY) || "",
      referenceLabel: storage.getItem(SAVED_REFERENCE_KEY) || "",
      translationCode: getSelectedTranslationCode(storage),
    });
  }

  const api = {
    SHOW_QR_STORAGE_KEY,
    SAVED_MESSAGE_TYPE_KEY,
    SAVED_REFERENCE_KEY,
    buildRouteBibleQrUrl,
    extractReferenceLabelFromMessage,
    getSelectedTranslationCode,
    getRouteBibleQrState,
    renderQrOverlay,
    renderSavedQrOverlay,
  };

  global.ObsBibleRouteBible = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
