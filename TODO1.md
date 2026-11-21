# Separate-line Bible reference alignment implementation plan

## Goal

Let users place a Bible reference on the same line as the verse or on a separate line. When **Separate line** is selected, let them align that reference left, center, right, or justify. The alignment controls must be hidden for **Same line**, shown for **Separate line**, and the chosen alignment must be reflected in the browser source without changing the verse text's existing alignment.

## Project findings

- The settings UI is in the **Verse display** section of [control_panel.html](control_panel.html). It already has same-line/separate-line options and a separate-line alignment radio group.
- The control panel stylesheet [cp_style.css](assets/css/control_panel/cp_style.css) owns layout and component styling. It defines `.column` with `display: flex`; the alignment group also uses this class.
- The panel theme stylesheet [cp_themes.css](assets/css/control_panel/cp_themes.css) owns theme colors. Keep any visibility/layout fix in `cp_style.css`, and do not add theme colors for this feature.
- [settings.js](assets/js/control_panel/settings.js) restores reference preferences from `localStorage`, updates alignment-control visibility when the line-layout radio changes, and dispatches `bible-display-settings-change`.
- [search_bible.js](assets/js/control_panel/search_bible.js) reads these preferences, creates the verse/reference elements, and refreshes the active verse when that event fires. Reference alignment is saved separately and only needs to affect the reference when the layout is separate-line.
- The verse markup is sent through [send_message.js](assets/js/control_panel/send_message.js) and displayed in [browser_source.html](browser_source.html).
- Browser layout rules belong in [browser_style.css](assets/css/browser/browser_style.css). It already makes a separate-line reference a block element; alignment classes can style that block independently of the overall message alignment.
- The current worktree already has uncommitted feature changes in the files above. Treat those changes as the starting point; inspect and integrate them rather than replacing or reverting them.

## Regression diagnosis

The alignment wrapper has the `hidden` attribute, and the script toggles that attribute. However, the wrapper also has class `column`, whose author stylesheet rule sets `display: flex`. An author rule can override the browser's default styling for `[hidden]`, leaving the alignment controls visible even when the script sets `hidden`.

Add a narrowly targeted rule for the alignment wrapper when it has `hidden` (for example, `#bible-reference-alignment-control[hidden] { display: none; }`) in `cp_style.css`. Avoid a broad `[hidden]` rule unless a repository-wide check confirms that changing all hidden elements is safe. Removing the attribute should allow the existing `.column` flex layout to show the controls normally.

## Implementation steps

1. **Confirm the settings markup and IDs**
   - Keep the existing same-line/separate-line radio values and IDs consistent with the settings script.
   - Keep the alignment options in one radio group with the four supported values: `left`, `center`, `right`, and `justify`.
   - Keep the alignment group labeled and keyboard-operable. Its labels should continue to target their corresponding radio input IDs.

2. **Make visibility reliable**
   - In `cp_style.css`, add the targeted hidden-state rule for `#bible-reference-alignment-control`.
   - In `settings.js`, use the selected line-layout radio as the single source of truth: show the alignment wrapper only for `separate-line`; hide it for `same-line`.
   - Run the visibility update immediately after restoring the saved line-layout value, and on every line-layout change. This covers initial load, saved preferences, and user interaction.
   - Do not clear the saved alignment when switching to same-line. It should remain available if the user switches back to separate-line.

3. **Persist and restore alignment**
   - Store the selected alignment under the dedicated Bible-reference alignment key in `localStorage`.
   - On startup, accept only the four supported values and default invalid or missing values to `left`.
   - Preserve the existing line-layout key and default to `same-line` for absent or invalid values.
   - Changing the alignment should dispatch the existing Bible display settings event so the current displayed Bible verse can be refreshed.

4. **Apply alignment to reference markup only**
   - In `search_bible.js`, read the saved alignment with validation and use it only when building a separate-line reference.
   - Keep the reference text in its own element and add a class corresponding to the selected alignment only in separate-line mode.
   - Preserve the existing same-line output and other reference preferences (book casing, translation abbreviation, position, and font).
   - Ensure switching from separate-line back to same-line removes the separate-line layout/alignment effects on newly generated verse markup.

5. **Style the browser output**
   - In `browser_style.css`, retain the block display for the separate-line reference and add/apply alignment rules for left, center, right, and justify.
   - Scope the rules to the separate-line reference element so they do not alter same-line references, song/text messages, or the overall verse text alignment.
   - Keep color styling in its existing theme/color mechanisms; no new color declarations belong in `cp_style.css` for this change.
   - Remember that `text-align: justify` may look identical to left alignment for a short reference that occupies only one line. Validate it with a sufficiently long or wrapped reference as well.

6. **Keep the currently displayed verse in sync**
   - Verify that changing line layout or alignment refreshes an already displayed Bible verse through the existing `bible-display-settings-change` flow.
   - Confirm that the active verse remains selected and that the refresh does not change the active reference or break verse navigation.
   - Confirm that a verse displayed after changing settings uses the same preferences as one that was already on screen.

## Verification checklist

### Control-panel behavior

- With no saved line-layout preference, the default is same-line and the alignment group is not visible.
- Selecting **Separate line** shows the alignment group immediately.
- Selecting **Same line** hides the group immediately.
- Reloading with same-line saved keeps the group hidden; reloading with separate-line saved shows it.
- The alignment choice remains selected after reload and is retained when toggling between line layouts.
- The control remains hidden despite `.column` using `display: flex`; keyboard and label-based radio selection still work.

### Browser rendering and persistence

- For separate-line references, verify left, center, right, and justify using a displayed verse.
- Verify each choice affects the reference only, not the verse body or unrelated text/song output.
- Switch to same-line and verify the existing inline presentation remains unchanged.
- Change layout and alignment while a Bible verse is already displayed; verify it refreshes immediately and preserves the active verse.
- Reload both the control panel and browser source with saved preferences; verify the saved layout/alignment are restored.
- Check reference position above/below, optional translation abbreviation, book casing, and reference font alongside alignment to avoid regressions.
- Confirm normal control-panel themes retain their existing colors, with no color-specific changes added to `cp_style.css`.

### Validation commands

- There is no root package manifest or existing test runner in the repository. Use a focused manual check in the OBS browser source/control panel for the behavior above.
- If automated checks are introduced later, keep them focused on the visibility state for both layout choices, preference restoration/validation, and alignment class/rendering for the four supported values.

## Scope boundaries

- Do not redesign the Verse display section or change unrelated text alignment controls.
- Do not add Bible-reference colors or move theme/color responsibilities into `cp_style.css`.
- Do not implement per-book or per-reference formatting beyond the requested line layout and four alignment choices.
