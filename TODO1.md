# Slider Value Inputs and Interaction — Implementation Plan

## Goal

Give every slider a compact, editable numeric value field at the **top-left of
its slider control**. Typing a valid value must update the slider and its
preview/output immediately; dragging or keyboard-operating the slider must
update the field and output immediately. Reject non-numeric input, keep values
within each control's supported range, make the margin slider update in real
time, and provide a subtle scale response while a slider is hovered, focused,
or being used.

Keep the existing project structure and styling responsibilities:

- [control_panel.html](./control_panel.html): slider markup and accessible
  labels.
- [settings.js](./assets/js/control_panel/settings.js): value synchronization,
  validation, live updates, and existing settings output.
- [load_panel_settings.js](./assets/js/control_panel/load_panel_settings.js):
  restoration of saved values and initial field synchronization.
- [cp_style.css](./assets/css/control_panel/cp_style.css): layout, sizing,
  transitions, and scale behavior only.
- [cp_themes.css](./assets/css/control_panel/cp_themes.css): themed foreground,
  background, border, hover, and focus colors using existing theme variables.

Do not add color values to `cp_style.css`.

## Repository findings and current baseline

There are nine native `input[type="range"].slider` controls:

| Setting | Range | Existing live-output behavior |
| --- | ---: | --- |
| Rounded corners (`rounded-corner`) | 0–120 | Broadcasts on `input` |
| Background margin (`bg-margin`) | 0–200 | Currently broadcasts on `change`; must become live |
| Shadow opacity (`shadow-opacity`) | 0–10 | Broadcasts on `input` |
| Shadow intensity (`shadow-intensity`) | 0–10 | Broadcasts on `input` |
| Horizontal shadow offset (`hor-shadow-offset`) | -10–10 | Broadcasts on `input` |
| Vertical shadow offset (`ver-shadow-offset`) | -10–10 | Broadcasts on `input` |
| Main border width (`main-border`) | 0–20 | Broadcasts on `input` |
| Font outline (`font-outline`) | 0–50 | Broadcasts on `input` |
| Background opacity (`bg-opacity`) | 0–20 | Updates opacity and broadcasts on `input` |

The gradient editor also has a custom, keyboard-accessible slider
(`gradient-opacity-track`) with a 0–100 percent value. It is not a native range
input, so it needs to keep its own value synchronization while sharing the same
top-left field layout and numeric validation expectations.

The current worktree already contains uncommitted slider-related edits. These
include numeric fields for the native sliders and gradient opacity, slider
input synchronization and partial validation in `settings.js`, initial
resynchronization from `load_panel_settings.js`, and slider/field styling in
both CSS files. Treat these edits as the starting point when implementing;
review and complete them rather than duplicating them. Do not overwrite or
discard the existing changes.

Specific gaps to address during implementation:

- `.slider-control-header` currently uses `justify-content: space-between`,
  which positions the value field opposite the label rather than guaranteeing
  the requested top-left placement. Adjust the layout so the value field is at
  the control's upper-left edge, while retaining a clear associated label.
- `bg-margin` currently emits its update from a `change` listener. Change the
  interaction path so drag, keyboard, and typed-value updates all emit
  immediately via the existing `input`-based update behavior.
- Initialization restores values in `load_panel_settings.js`, while the value
  fields are initialized in `settings.js`. Verify that the final displayed
  value always reflects the restored/clamped slider value.
- Margin persistence currently uses `bgMargin` when writing but reads
  `savedBgMargin` when restoring. Trace and reconcile this existing key path so
  real-time updates do not regress save/restore behavior.
- The native slider scale styling currently emphasizes hover and active
  states; ensure keyboard focus is also visible and the custom gradient slider
  behaves consistently.

## Step-by-step implementation

### 1. Confirm slider inventory, semantics, and bounds

1. Recheck all slider markup in `control_panel.html`; use the range attributes
   as the single source of truth for each native slider's minimum, maximum, and
   step.
2. Keep the two signed shadow-offset controls capable of entering negative
   values. Other native controls and gradient opacity are non-negative.
3. Keep the background opacity's 0–20 slider scale as-is; its conversion to
   opacity percentage is part of existing behavior, not a reason to change its
   range.
4. Treat the custom gradient opacity as a separate 0–100 slider. Preserve its
   existing mouse/touch, keyboard, selected-gradient, and apply/persist
   behavior.
5. Confirm every numeric field has a unique ID linked to its control, an
   accessible name, and a label association that remains meaningful after
   moving the field to the top-left.

### 2. Finalize the markup and value-field placement

1. Ensure every native range slider has exactly one compact value input next to
   its label and above its track; include the custom gradient opacity control.
2. Put the numeric field at the top-left edge of the slider control as
   requested. Keep the setting label visible and programmatically associated
   with the slider/value field; do not hide or replace the label with a number.
3. Retain the existing numeric-oriented input mode. Keep fields as text inputs
   if needed to avoid number-input exponent, spinner, and browser-specific
   behavior; enforce actual validity in JavaScript rather than relying on
   `pattern` alone.
4. Check the two-column shadow controls and modal opacity controls at narrow
   widths so the value field does not overlap labels, shrink the slider
   unusably, or overflow its parent.

### 3. Implement a shared native-range value contract

1. Keep one initialization path in `settings.js` that finds every
   `input[type="range"].slider` and its matching `-value` input; avoid
   duplicating per-control handlers.
2. On initialization and every native slider `input` event, set the value
   field from the slider's normalized current value.
3. On value-field typing, allow digits only for non-negative sliders; permit a
   single leading minus sign only when that slider's minimum is negative.
   Reject letters, whitespace, extra signs, decimal points for integer-step
   controls, and other unsupported characters. If a slider later uses a
   fractional step, validate according to that step instead of silently
   treating it as an integer.
4. Handle intermediate edit states (empty text and a lone minus sign for
   signed controls) without sending `NaN` or changing the output. On blur,
   restore the current slider value if the field is still empty or incomplete.
5. For complete numeric input, validate it against the associated slider's
   minimum, maximum, and step. Prevent out-of-range values from being applied;
   use the control's declared bounds and normalize to a valid step. Keep the
   field and slider synchronized to the same normalized result.
6. When a typed value changes the slider, dispatch one bubbling `input` event
   so existing setting listeners remain the single route to previews,
   BroadcastChannel updates, and storage. Avoid separate output logic in the
   numeric-input handler.
7. Avoid redundant event dispatch when the normalized value is already the
   slider's current value.

### 4. Make margin updates genuinely real-time

1. Change the `bg-margin` output listener from `change` to `input` so dragging
   updates the displayed browser source during the drag, rather than only when
   the pointer is released.
2. Ensure typed values use the same `input` event route and therefore update
   the preview/output immediately as well.
3. Preserve the existing `selectedBgMargin` message payload and browser-source
   padding behavior.
4. Trace the existing persistence flow end-to-end. Align the control-panel
   write key with the key read during restoration/browser-source initialization
   (`bgMargin` versus `savedBgMargin`) without changing the externally visible
   margin semantics.
5. Verify the initial saved margin appears in both slider and value field, and
   verify a later drag or typed update survives the existing save/reload path.

### 5. Keep special opacity controls synchronized

1. For `bg-opacity`, synchronize the numeric field whenever either linked
   background-opacity range emits `input`; preserve its current 0–20 scale,
   storage behavior, plain-color mode selection, and preview updates.
2. For `gradient-opacity`, validate integer percentages from 0 to 100. On
   valid typing, update the selected gradient stop, track position,
   `aria-valuenow`, and rendered gradient immediately using the existing
   helpers.
3. On pointer/touch movement or keyboard operation of the custom gradient
   track, update the percentage field immediately from the selected stop's
   opacity.
4. Keep incomplete or invalid edits from changing the gradient; restore the
   actual selected opacity on blur.
5. Ensure switching selected gradient stops refreshes the field to the newly
   selected stop instead of retaining the prior stop's displayed value.

### 6. Restore saved state in a deterministic order

1. Preserve the current script structure in `control_panel.html` unless testing
   proves a load-order change is necessary.
2. Apply saved values to the range controls, then synchronize their numeric
   fields from the actual resulting range values. Do not make the field's
   default markup value override saved settings.
3. Clamp or normalize stale saved values that fall outside current slider
   bounds before exposing them as the synchronized value.
4. Keep initialization safe if a control or its paired field is absent, as can
   occur when a control is intentionally optional, without hiding unrelated
   initialization errors.

### 7. Refine interaction styling in the correct CSS files

1. In `cp_style.css`, put the value field at the slider control's upper-left
   and define its compact width, spacing, alignment, and focus outline. Define
   track scale and transition behavior there; do not add theme color literals.
2. Wrap native range inputs in a dedicated track wrapper and scale that
   wrapper on pointer hover, active press, and keyboard focus. Scaling the
   wrapper avoids inconsistent transform behavior on native range controls.
   Also cover focus/focus-visible so keyboard users receive a comparable
   indication.
3. Use a minimal vertical scale (not a layout-expanding change) and a suitable
   transform origin. Verify that parent overflow/clipping does not hide the
   scaled track or thumb.
4. Apply equivalent hover, focus, and active feedback to the custom gradient
   opacity track.
5. Respect `prefers-reduced-motion` by disabling or reducing the scale
   transition/effect.
6. In `cp_themes.css`, set the value field's foreground, background, border,
   hover, and focus colors using existing theme variables so it remains legible
   in every supported theme.

### 8. Validate behavior and regressions

1. For every native range, drag with the pointer and operate with the keyboard;
   confirm the field and existing output update on every `input` event.
2. Type a valid value into every field; confirm slider position, displayed
   value, preview, and existing persistence/output agree immediately.
3. Test alphabetic and punctuation input, a negative number on each signed
   offset, a negative number on an unsigned slider, empty input, a lone minus
   sign, values below minimum, values above maximum, and step boundaries.
   Confirm invalid or oversized values never reach output and the field
   recovers to a valid value on blur.
4. Specifically drag and type margin values while observing the browser
   source; confirm padding changes before pointer release and after each valid
   typed change. Reload and verify the saved margin restoration path.
5. Exercise background opacity and gradient opacity separately, including
   changing selected gradient stops, pointer/touch movement, keyboard
   controls, and their boundary values.
6. Check each supported theme, narrow modal layout, pointer hover/press,
   keyboard focus, and reduced-motion behavior.
7. Run any repository-provided checks if present. The repository currently has
   no package manifest or obvious automated test runner, so supplement with
   focused browser/OBS control-panel checks rather than introducing tooling
   just for this change.

## Completion criteria

- Every native and custom slider has a compact numeric field at the top-left
  of its control and a clear accessible label.
- Text entry accepts only values valid for that control and cannot apply
  values beyond its supported bounds.
- Editing the field and operating the slider keep each other synchronized in
  real time without bypassing existing setting update behavior.
- Margin visibly updates during drag and typed edits, and its saved value
  restores consistently.
- Hover, focus, and active slider interactions show a subtle scale effect;
  theme colors remain in `cp_themes.css`, and reduced-motion preferences are
  respected.
- Existing opacity, shadow, border, font-outline, gradient, and saved-setting
  behaviors continue to work.

## Implementation notes

- Shadow update messages use the live opacity, intensity, and offset slider
  values plus the selected shadow color, with control defaults as fallbacks.
  This keeps the controls functional before all shadow preferences have been
  stored.
- Margin persistence uses the same key in the control panel and browser source,
  including the valid zero value.

## Implementation status

Implemented in the control panel and browser source. Browser validation
confirmed all nine native slider/value pairs, signed and bounded input,
immediate margin persistence, gradient opacity clamping, and reduced-motion
handling. The repository has no package manifest or automated test runner;
syntax/runtime checks were performed by loading and exercising the pages in
the browser.