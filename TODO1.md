# Bible Reference Display Customization — Implementation Plan

## Goal

Add configurable Bible-reference formatting without changing how ordinary text
or songs are displayed. The settings should control reference placement,
reference line layout, book-name casing, translation suffixes, and a
reference-only font family. Existing users should retain the current output
until they choose different settings.

## Findings from the current project

- The settings panel is embedded in `control_panel.html`. Its “Font” settings
  sub-tab is `#settings-font`; the selected sub-tab is persisted as
  `obs-bible-selectedSettingTab`.
- The existing font controls are under `#settings-font`. `settings.js` sends
  the selected font over the `settings` `BroadcastChannel`; the browser source
  applies it to the whole overlay background container. This is the verse
  content font to preserve.
- `search_bible.js` creates displayed verse markup in both `appendVerseElement`
  (search results) and `getBibeAri` (restored results). Both currently use an
  uppercase reference span followed by verse text.
- `send_message.js` sends a selected Bible paragraph's `innerHTML` to the
  browser source. `getSavedBible()` in `utils.js` restores the displayed verses
  from saved ARIs. Bible history currently retains the rendered HTML.
- The Bible translation `<select>` in `control_panel.html` uses script paths as
  option values and human-readable translation names as labels. Those labels
  are not consistently the short abbreviations shown in the requested
  examples, so suffixes need explicit abbreviations rather than deriving them
  from a path or guessing from a label.
- Stylesheets are `assets/css/control_panel/cp_style.css`,
  `assets/css/control_panel/cp_themes.css`, and
  `assets/css/browser/browser_style.css`. Structural/layout rules belong in
  `cp_style.css` (and overlay typography/layout in `browser_style.css`);
  theme colors belong in `cp_themes.css`. Do not add color rules to the
  structural stylesheet or change theme palettes for this feature.

## Proposed settings and backward-compatible defaults

Persist the new preferences separately from existing general text settings:

| Preference | Suggested storage key | Default | Behavior |
| --- | --- | --- | --- |
| Reference line layout | `obs-bible-reference-line-layout` | `same-line` | `same-line` keeps the reference and verse together; `separate-line` puts the reference on its own line. |
| Book-name casing | `obs-bible-reference-book-case` | `uppercase` | `uppercase` retains today's all-uppercase reference; `title-case` uses the book name's title case and leaves chapter/verse numerals unchanged. |
| Translation suffix | `obs-bible-reference-show-translation` | `false` | When enabled, append the selected translation abbreviation in parentheses, e.g. `(KJV)`. |
| Reference position | `obs-bible-reference-position` | `above` | `above` preserves today's reference-before-content order; `below` places the reference after the verse text. |
| Reference font family | `obs-bible-reference-font-family` | unset / match verse text | An unset value inherits the current verse-content font; a selected value applies to references only. |
| Reference color | Existing `titleColor` preference | Existing title color (default `#ff6450`) | References use the Title color setting; verse content continues to use the Font color setting. |

Use explicit short abbreviations for every translation option in
`control_panel.html` (for example, option metadata), including translations
that do not have a conventional English abbreviation. The suffix should be
the selected option's abbreviation, not the script path or an inferred label.

Keep the existing `#settings-font` element ID and persisted tab-selection key
when changing the visible tab name from “Font” to “Text”. This avoids
invalidating a previously saved settings-tab selection.

## Step-by-step implementation

1. **Restructure the settings UI in `control_panel.html`.**
   - Change the settings sub-tab's visible label from “Font” to “Text”, while
     retaining its current `data-settings="settings-font"` target and
     `#settings-font` ID.
   - Within that panel, put the existing text font selector and its related
     text-formatting controls in a clearly labeled **Fonts** group.
   - Place a **Verse display** group directly after **Fonts**. Add labeled,
     accessible controls for same-line/separate-line layout, uppercase/title
     case book names, showing/hiding the translation suffix, above/below
     reference position, and a separate reference font-family selector.
   - Reuse the existing font-family option list where practical. The
     reference-font selector must include a “Same as verse text” option.
   - Use native labels and radio/checkbox/select controls consistent with
     existing settings markup; give every control a unique ID and associate
     its label.

2. **Add non-color group layout styling.**
   - Add only the minimal structural styles needed for the two groups in
     `assets/css/control_panel/cp_style.css`, following its existing
     `.row`, `.column`, and settings-panel patterns.
   - Keep all theme-dependent colors in `cp_themes.css`; this feature should
     not introduce color declarations or theme changes.

3. **Centralize Bible reference formatting in `search_bible.js`.**
   - Add a small formatter for a verse entry and current preferences. It
     should preserve the book name, chapter, and verse information, then apply
     casing and optional translation suffix without altering verse text.
   - Produce distinct reference and verse-content elements/classes so the
     reference can have its own font and the browser source can format the
     currently displayed message consistently.
   - Apply the configured reference position and same-line/separate-line
     layout using semantic markup/classes. Avoid relying on uppercase text or
     broad styling of every `span`, since title color and existing overlay
     styling currently target spans.
   - Use this same formatter in both `appendVerseElement` and `getBibeAri`;
     otherwise search results and restored results will diverge.
   - Keep each paragraph's existing stable ID and ARI-based saved-verse
     behavior so selection, navigation, and restoration continue to work.

4. **Wire persistence and live settings in `settings.js`.**
   - Load the stored values into the Verse display controls, falling back to
     the defaults above when a key is absent or invalid.
   - On control changes, save the corresponding preference and make the new
     formatting take effect without requiring a restart.
   - Preserve the existing `fontStyle` behavior for verse content. Send the
     independent reference font preference separately so changing it does not
     change song or ordinary-message typography.

5. **Apply the preferences to restored and currently displayed verses.**
   - Use the existing saved ARI list and `getSavedBible()`/`getBibeAri()` path
     to rebuild the Bible panel when a formatting preference changes.
   - Ensure a verse already sent to the browser source updates when the user
     changes a display preference while that Bible verse is on screen. Keep
     enough Bible-message context to re-render/re-send the active Bible verse;
     do not reformat or otherwise alter the last manually entered message or
     song.
   - Ensure the current translation used for the suffix is the selected
     translation from `#bible-version`, and that changing the translation
     refreshes verses through the same formatter.

6. **Keep the browser-source update scoped to Bible references.**
   - Update `browser_source.html`'s `settings` message handling and, if needed,
     `assets/js/browser_source/browser_app.js` so the reference font applies
     only to the reference element, not the whole `#messageDisplay`. Bind the
     reference color to the existing Title color preference and keep verse
     content on the separate Font color path.
   - Add only typography/layout rules in `assets/css/browser/browser_style.css`
     where markup styling requires them; do not move theme colors or existing
     global font color behavior.
   - Ensure click-to-display, previous/next verse, Bible history, and restored
     verses all send markup with the same reference/content structure.

7. **Preserve and verify existing behavior.**
   - No preference key should be required for old installations. With no
     stored preferences, output should remain reference-first, uppercase,
     same-line, without a translation suffix, and with the reference inheriting
     the existing text font.
   - Confirm songs and manually entered text still use the existing global
     font controls and are not given Bible references or suffixes.
   - Keep the existing Bible-history snapshot behavior unless implementation
     finds that history is rebuilt from verse data; if history is rebuilt,
     confirm it uses the intended translation and preferences consistently.

## Validation checklist for implementation

- Search a single verse, a verse range, a chapter, and a book; confirm every
  path formats references identically.
- Exercise all combinations of same-line/separate-line and above/below. Check
  that “above” yields `John 11:35 Jesus wept.` and “below” yields
  `Jesus wept. John 11:35` when same-line is selected, and that separate-line
  mode keeps the reference on its own line in either position.
- Confirm uppercase and title-case book names do not change the chapter/verse
  numerals or verse content.
- Confirm suffix off/on behavior for representative abbreviated translations
  (e.g. `John 11:35 (KJV)` and `Psalms 1:2 (NLT)`), and verify every available
  translation has an intentional abbreviation.
- Confirm reference font changes independently from verse font; “Same as
  verse text” follows later verse-font changes.
- Confirm settings load after panel reload, survive reload, update the active
  browser-source verse, and do not alter manually entered text or songs.
- Check Bible search restoration, previous/next navigation, and Bible history.
- Run the repository's available validation. There is no package manifest or
  test runner in the current repository root, so select a focused manual or
  browser validation unless project tooling is added separately.

## Implementation status

Implemented in the control-panel settings, Bible formatting and restoration
paths, overlay presentation, and related structural styles. The validation
checklist above remains the regression checklist for follow-up manual
verification.
