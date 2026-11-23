const OBS_BIBLE_MESSAGE_PADDING_DEFAULT = 20;
const OBS_BIBLE_MESSAGE_PADDING_MIN = 0;
const OBS_BIBLE_MESSAGE_PADDING_MAX = 200;
const OBS_BIBLE_MESSAGE_PADDING_KEYS = {
  vertical: "savedBgPaddingVertical",
  horizontal: "savedBgPaddingHorizontal"
};
const OBS_BIBLE_LEGACY_MESSAGE_PADDING_KEY = "savedBgMargin";

function normalizeObsBibleMessagePaddingValue(value, fallback = OBS_BIBLE_MESSAGE_PADDING_DEFAULT) {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string" && value.trim() === "") return fallback;
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return fallback;
  return Math.round(Math.min(
    OBS_BIBLE_MESSAGE_PADDING_MAX,
    Math.max(OBS_BIBLE_MESSAGE_PADDING_MIN, numericValue)
  ));
}

function resolveObsBibleMessagePaddingAxis(storageKey, legacyValue) {
  const savedValue = normalizeObsBibleMessagePaddingValue(
    localStorage.getItem(storageKey),
    null
  );
  if (savedValue !== null) return savedValue;
  return legacyValue !== null ? legacyValue : OBS_BIBLE_MESSAGE_PADDING_DEFAULT;
}

function getSavedMessagePadding() {
  const legacyValue = normalizeObsBibleMessagePaddingValue(
    localStorage.getItem(OBS_BIBLE_LEGACY_MESSAGE_PADDING_KEY),
    null
  );
  return {
    vertical: resolveObsBibleMessagePaddingAxis(
      OBS_BIBLE_MESSAGE_PADDING_KEYS.vertical,
      legacyValue
    ),
    horizontal: resolveObsBibleMessagePaddingAxis(
      OBS_BIBLE_MESSAGE_PADDING_KEYS.horizontal,
      legacyValue
    )
  };
}

function setSavedMessagePadding(padding = {}) {
  const current = getSavedMessagePadding();
  const normalized = {
    vertical: normalizeObsBibleMessagePaddingValue(padding.vertical, current.vertical),
    horizontal: normalizeObsBibleMessagePaddingValue(padding.horizontal, current.horizontal)
  };
  localStorage.setItem(OBS_BIBLE_MESSAGE_PADDING_KEYS.vertical, String(normalized.vertical));
  localStorage.setItem(OBS_BIBLE_MESSAGE_PADDING_KEYS.horizontal, String(normalized.horizontal));
  return normalized;
}

function normalizeMessagePaddingInput(input, fallback = getSavedMessagePadding()) {
  const source = input && typeof input === "object" ? input : {};
  return {
    vertical: normalizeObsBibleMessagePaddingValue(source.vertical, fallback.vertical),
    horizontal: normalizeObsBibleMessagePaddingValue(source.horizontal, fallback.horizontal)
  };
}

function applyMessagePadding(element, padding = getSavedMessagePadding()) {
  if (!element) return padding;
  element.style.padding = `${padding.vertical}px ${padding.horizontal}px`;
  return padding;
}

const OBS_BIBLE_REFERENCE_SPACING_SIDES = ["top", "right", "bottom", "left"];
const OBS_BIBLE_REFERENCE_SPACING_RANGES = {
  padding: { min: 0, max: 80 },
  margin: { min: 0, max: 100 }
};
const OBS_BIBLE_REFERENCE_SPACING_KEYS = {
  padding: {
    top: "obs-bible-reference-padding-top",
    right: "obs-bible-reference-padding-right",
    bottom: "obs-bible-reference-padding-bottom",
    left: "obs-bible-reference-padding-left"
  },
  margin: {
    top: "obs-bible-reference-margin-top",
    right: "obs-bible-reference-margin-right",
    bottom: "obs-bible-reference-margin-bottom",
    left: "obs-bible-reference-margin-left"
  },
  legacy: {
    padding: "obs-bible-reference-padding",
    margin: "obs-bible-reference-margin"
  }
};

function getBibleReferenceSpacingKey(kind, side) {
  return OBS_BIBLE_REFERENCE_SPACING_KEYS[kind]?.[side] || null;
}

function normalizeObsBibleReferenceSpacingValue(kind, value, fallback = null) {
  const range = OBS_BIBLE_REFERENCE_SPACING_RANGES[kind];
  if (!range) return fallback;
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string" && value.trim() === "") return fallback;
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return fallback;
  return Math.min(range.max, Math.max(range.min, numericValue));
}

function getBibleReferenceSpacingValue(kind, side) {
  const range = OBS_BIBLE_REFERENCE_SPACING_RANGES[kind];
  if (!range || !OBS_BIBLE_REFERENCE_SPACING_SIDES.includes(side)) return 0;

  const sideKey = getBibleReferenceSpacingKey(kind, side);
  const sideValue = normalizeObsBibleReferenceSpacingValue(
    kind,
    localStorage.getItem(sideKey),
    null
  );
  if (sideValue !== null) return sideValue;

  const legacyValue = normalizeObsBibleReferenceSpacingValue(
    kind,
    localStorage.getItem(OBS_BIBLE_REFERENCE_SPACING_KEYS.legacy[kind]),
    null
  );
  return legacyValue !== null ? legacyValue : 0;
}

function getBibleReferenceSpacing(kind) {
  return OBS_BIBLE_REFERENCE_SPACING_SIDES.reduce((spacing, side) => {
    spacing[side] = getBibleReferenceSpacingValue(kind, side);
    return spacing;
  }, {});
}
