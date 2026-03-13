const test = require("node:test");
const assert = require("node:assert/strict");

const {
  buildRouteBibleQrUrl,
  getRouteBibleQrState,
  renderQrOverlay,
} = require("../assets/js/shared/route_bible.js");

test("builds the expected route.bible QR URL", () => {
  const url = buildRouteBibleQrUrl("Psalm 23", "kjv");

  assert.equal(
    url,
    "https://route.bible/qr?passage=Psalm+23&format=svg&utm_source=obs_bible_plugin&utm_medium=qr&mode=launcher&translation=kjv"
  );
});

test("overlay is absent when disabled", () => {
  const imageEl = {
    hidden: false,
    style: {},
    removeAttribute(name) {
      delete this[name];
    },
  };

  const state = renderQrOverlay(imageEl, {
    enabled: false,
    contentType: "bible",
    referenceLabel: "John 3:16",
    translationCode: "niv",
  });

  assert.equal(state, null);
  assert.equal(imageEl.hidden, true);
  assert.equal(imageEl.style.display, "none");
  assert.equal(imageEl.src, undefined);
});

test("overlay is present and points to the launcher QR endpoint when enabled", () => {
  const imageEl = {
    hidden: true,
    style: {},
    removeAttribute(name) {
      delete this[name];
    },
  };

  const state = renderQrOverlay(imageEl, {
    enabled: true,
    contentType: "bible",
    referenceLabel: "Romans 8:28-29",
    translationCode: "esv",
  });

  assert.ok(state);
  assert.equal(
    state.url,
    "https://route.bible/qr?passage=Romans+8%3A28-29&format=svg&utm_source=obs_bible_plugin&utm_medium=qr&mode=launcher&translation=esv"
  );
  assert.equal(imageEl.hidden, false);
  assert.equal(imageEl.style.display, "block");
  assert.match(imageEl.src, /\/qr\?/);
  assert.match(imageEl.src, /mode=launcher/);
});

test("overlay state stays absent for non-bible content", () => {
  const state = getRouteBibleQrState({
    enabled: true,
    contentType: "song",
    messageContent: "<span>1 JOHN 4:7-8</span> Beloved, let us love one another",
    translationCode: "kjv",
  });

  assert.equal(state, null);
});
