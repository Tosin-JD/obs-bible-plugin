(function(){
    const clipboardKeys = new Set(["a", "c", "v", "x"]);
    const remoteChannel = new BroadcastChannel("obs-bible-remote");

    const getModifierPressed = (event) => event.ctrlKey || event.metaKey;

    const applyTextAlignment = (selectedValue) => {
        let sendSettingsChannel = new BroadcastChannel("settings");
        sendSettingsChannel.postMessage({ selectedTextAlignment: selectedValue });
        sendSettingsChannel.close();
        localStorage.setItem('selectedAlign', selectedValue);

        const alignmentMap = {
            Left: "left-align",
            Center: "center-align",
            Right: "right-align",
            Justify: "justify-align"
        };
        const radio = document.getElementById(alignmentMap[selectedValue]);
        if (radio) {
            radio.checked = true;
        }
    };

    const executeShortcutAction = (action) => {
        const control = window.obsBibleControl || {};
        const primaryTabActions = {
            open_edit_tab: () => control.activatePrimaryTab?.("text"),
            open_bible_tab: () => control.activatePrimaryTab?.("bibleText"),
            open_song_tab: () => control.activatePrimaryTab?.("songs"),
            open_settings_tab: () => control.activatePrimaryTab?.("setBg")
        };

        const alignmentActions = {
            align_left: () => applyTextAlignment("Left"),
            align_center: () => applyTextAlignment("Center"),
            align_right: () => applyTextAlignment("Right"),
            align_justify: () => applyTextAlignment("Justify")
        };

        if (primaryTabActions[action]) {
            primaryTabActions[action]();
            return;
        }

        if (alignmentActions[action]) {
            alignmentActions[action]();
            return;
        }

        switch (action) {
            case "send_text":
                control.sendCurrentText?.();
                break;
            case "toggle_display":
                control.toggleDisplay?.();
                break;
            case "song_previous":
                control.songPrevious?.();
                break;
            case "song_next":
                control.songNext?.();
                break;
            case "song_toggle_autoplay":
                control.songToggleAutoplay?.();
                break;
            case "bible_previous":
                control.biblePrevious?.();
                break;
            case "bible_next":
                control.bibleNext?.();
                break;
            default:
                break;
        }
    };

    const isEditableElement = (element) => {
        if (!element) {
            return false;
        }

        if (element.isContentEditable) {
            return true;
        }

        if (element.tagName === "TEXTAREA") {
            return !element.disabled && !element.readOnly;
        }

        if (element.tagName === "INPUT") {
            const supportedTypes = new Set([
                "text",
                "search",
                "url",
                "tel",
                "password",
                "email",
                "number"
            ]);
            const inputType = (element.type || "text").toLowerCase();
            return supportedTypes.has(inputType) && !element.disabled && !element.readOnly;
        }

        return false;
    };

    const insertTextAtSelection = (element, text) => {
        const start = element.selectionStart ?? 0;
        const end = element.selectionEnd ?? start;
        const value = element.value ?? "";
        element.value = value.slice(0, start) + text + value.slice(end);
        const nextCaret = start + text.length;
        element.selectionStart = nextCaret;
        element.selectionEnd = nextCaret;
        element.dispatchEvent(new Event("input", { bubbles: true }));
    };

    const handleClipboardShortcut = async (event) => {
        const isModifier = getModifierPressed(event);
        if (!isModifier || event.altKey) {
            return;
        }

        const key = event.key.toLowerCase();
        if (!clipboardKeys.has(key)) {
            return;
        }

        const activeElement = document.activeElement;
        if (!isEditableElement(activeElement)) {
            return;
        }

        event.stopPropagation();

        if (key === "a") {
            event.preventDefault();
            if (typeof activeElement.select === "function") {
                activeElement.select();
            } else if (activeElement.isContentEditable) {
                const range = document.createRange();
                range.selectNodeContents(activeElement);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
            return;
        }

        if (key === "c") {
            if (activeElement.isContentEditable) {
                return;
            }

            const selectedText = activeElement.value.substring(activeElement.selectionStart ?? 0, activeElement.selectionEnd ?? 0);
            if (!selectedText) {
                return;
            }

            event.preventDefault();
            try {
                await navigator.clipboard.writeText(selectedText);
            } catch (error) {
            }
            return;
        }

        if (key === "x") {
            if (activeElement.isContentEditable) {
                return;
            }

            const start = activeElement.selectionStart ?? 0;
            const end = activeElement.selectionEnd ?? 0;
            const selectedText = activeElement.value.substring(start, end);
            if (!selectedText) {
                return;
            }

            event.preventDefault();
            try {
                await navigator.clipboard.writeText(selectedText);
            } catch (error) {
            }
            insertTextAtSelection(activeElement, "");
            return;
        }

        if (key === "v") {
            if (activeElement.isContentEditable) {
                return;
            }

            event.preventDefault();
            try {
                const pastedText = await navigator.clipboard.readText();
                insertTextAtSelection(activeElement, pastedText);
            } catch (error) {
            }
        }
    };

    let alignContent = function(event) {
        // Check if the Control key is pressed and the 'L' key (key code 76) is pressed
        if (getModifierPressed(event) && event.shiftKey && (event.key === 'L' || event.key === 'l')) {
            event.preventDefault();
            executeShortcutAction("align_left");
        }
        if (getModifierPressed(event) && event.shiftKey && (event.key === 'R' || event.key === 'r')) {
            event.preventDefault(); 
            executeShortcutAction("align_right");
        }
        if (getModifierPressed(event) && event.shiftKey && (event.key === 'E' || event.key === 'e')) {
            event.preventDefault(); 
            executeShortcutAction("align_center");
        }
        if (getModifierPressed(event) && event.shiftKey && (event.key === 'J' || event.key === 'j')) {
            event.preventDefault();
            executeShortcutAction("align_justify");
        }
    };

    const handlePluginShortcuts = (event) => {
        const key = event.key;
        const lowerKey = key.toLowerCase();

        if (event.altKey && !getModifierPressed(event) && !event.shiftKey) {
            const tabActions = {
                "1": "open_edit_tab",
                "2": "open_bible_tab",
                "3": "open_song_tab",
                "4": "open_settings_tab"
            };
            if (tabActions[key]) {
                event.preventDefault();
                event.stopPropagation();
                executeShortcutAction(tabActions[key]);
                return;
            }
        }

        if (getModifierPressed(event) && !event.shiftKey && !event.altKey) {
            if (key === "ArrowDown") {
                const lastSavedTab = localStorage.getItem("selectedTab");
                if (lastSavedTab === "text") {
                    event.preventDefault();
                    event.stopPropagation();
                    executeShortcutAction("send_text");
                    return;
                }
            }

            if (key === "ArrowUp") {
                event.preventDefault();
                event.stopPropagation();
                executeShortcutAction("toggle_display");
                return;
            }
        }
    };

    remoteChannel.onmessage = (event) => {
        const action = event?.data?.action;
        if (typeof action === "string") {
            executeShortcutAction(action);
        }
    };

    document.addEventListener('keydown', handleClipboardShortcut, true);
    document.addEventListener('keydown', handlePluginShortcuts, true);
    document.addEventListener('keydown', alignContent);
})();
