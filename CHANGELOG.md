# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- Added a separate Text Animation section under the Animation settings tab.
- Added configurable text intro and outro animations, durations, easing, and ongoing text effects for switching between text, Bible, and song content.
- Kept the existing display on/off container animation independent from text transitions.

## [5.0.0] - 2026-11-18
### Added
- Added seven Bible translations: ASV, BBE, CSB, NASB, NLT, TPT, and WEB.
- Added an interactive Bible book, chapter, and verse picker, with support for searching local-language books by their English names.
- Added Bible display options for reference layout, capitalization, translation labels, position, and font.
- Added configurable background modes for plain colors, gradients, images, and videos, including file and URL sources, previews, reusable gradient presets, and shared or separate backgrounds for Bible, song, and text content.
- Added numeric value fields alongside settings sliders and expanded keyboard-accessible controls.
- Added previous and next search-match navigation for song lyrics.

### Changed
- Redesigned the control panel settings and background dialogs, with improved theme styling and responsive layouts.
- Improved Bible reference parsing and search across translations, including verse ranges, accented text, English and localized book names, and closest-verse fallback when an exact reference is unavailable.
- Updated Bible output to format verse references and content separately and apply the selected reference display preferences.
- Improved browser output background rendering, including support for video, image, and gradient layers, rounded corners, and background updates from the control panel.
- Improved song and text controls with formatting actions, line timing and countdown, search navigation, and display shortcuts.
- Improved saved settings handling and media persistence for background assets.

### Fixed
- Prevented empty or invalid saved messages and Bible queries from breaking browser output or settings restoration.
- Improved Bible picker and suggestion behavior when changing translations or when the Bible index is rebuilt.
- Corrected text shadow controls so opacity, intensity, and offsets update together.


---
## [4.0.3] - 2025-08-17
### Added
* Added CHANGELOG.md file to the project root.

### Fixed
* Resolved an issue where song lyrics were not rendering correctly on Linux systems.
* Fixed a missing 'rounded' class in the main CSS stylesheet.
* Updated all Bible book names in the Italian New Diodati translation to match canonical formatting.

---
## [4.0.4] - 2026-04-28
### Fixes
* Removed unnecessary debug statements.
* Resolved an issue where song lyrics were not rendering correctly on windows systems.
 
 ---

 ## [4.0.4] - 2026-04-28
### Added
* Added countdown timer to song line duration.
* Added color gradient

### Fixed
* song lyrics search improved.
* Fix ui and ux issues
* Fix songs not displaying porperly on Mac and Linux
* Fix selection and flyout tool not showing properly
* Fix the look of timer input
* made background color and gradient user friendly
---
## [5.0.0] - 2026-11-18
### Added
- Added seven Bible translations: ASV, BBE, CSB, NASB, NLT, TPT, and WEB.
- Added an interactive Bible book, chapter, and verse picker, with support for searching local-language books by their English names.
- Added Bible display options for reference layout, capitalization, translation labels, position, and font.
- Added configurable background modes for plain colors, gradients, images, and videos, including file and URL sources, previews, reusable gradient presets, and shared or separate backgrounds for Bible, song, and text content.
- Added numeric value fields alongside settings sliders and expanded keyboard-accessible controls.
- Added previous and next search-match navigation for song lyrics.

### Changed
- Redesigned the control panel settings and background dialogs, with improved theme styling and responsive layouts.
- Improved Bible reference parsing and search across translations, including verse ranges, accented text, English and localized book names, and closest-verse fallback when an exact reference is unavailable.
- Updated Bible output to format verse references and content separately and apply the selected reference display preferences.
- Improved browser output background rendering, including support for video, image, and gradient layers, rounded corners, and background updates from the control panel.
- Improved song and text controls with formatting actions, line timing and countdown, search navigation, and display shortcuts.
- Improved saved settings handling and media persistence for background assets.

### Fixed
- Prevented empty or invalid saved messages and Bible queries from breaking browser output or settings restoration.
- Improved Bible picker and suggestion behavior when changing translations or when the Bible index is rebuilt.
- Corrected text shadow controls so opacity, intensity, and offsets update together.
