(function(){
    const clipboardKeys = new Set(["a", "c", "v", "x"]);

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
        const isModifier = event.ctrlKey || event.metaKey;
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
        if (event.ctrlKey && event.shiftKey && event.key === 'L' || event.ctrlKey && event.shiftKey && event.key === 'l') {
            event.preventDefault();
            let selectedValue = "Left"
        
            let sendSettingsChannel = new BroadcastChannel("settings");
            sendSettingsChannel.postMessage({ selectedTextAlignment: selectedValue });
            sendSettingsChannel.close();
        }
        if (event.ctrlKey && event.shiftKey && event.key === 'R' || event.ctrlKey && event.shiftKey && event.key === 'r') {
            event.preventDefault(); 

            let selectedValue = "Right";
            let sendSettingsChannel = new BroadcastChannel("settings");
            sendSettingsChannel.postMessage({ selectedTextAlignment: selectedValue });
            sendSettingsChannel.close();
        }
        if (event.ctrlKey && event.shiftKey && event.key === 'E' || event.ctrlKey && event.shiftKey && event.key === 'e') {
            event.preventDefault(); 
            let selectedValue = "Center"
        
            let sendSettingsChannel = new BroadcastChannel("settings");
            sendSettingsChannel.postMessage({ selectedTextAlignment: selectedValue });
            sendSettingsChannel.close();
        }
        if (event.ctrlKey && event.shiftKey && event.key === 'J' || event.ctrlKey && event.shiftKey && event.key === 'j') {
            event.preventDefault();
            let selectedValue = "Justify"
        
            let sendSettingsChannel = new BroadcastChannel("settings");
            sendSettingsChannel.postMessage({ selectedTextAlignment: selectedValue });
            sendSettingsChannel.close();
        }
    }

    document.addEventListener('keydown', handleClipboardShortcut, true);
    document.addEventListener('keydown', alignContent);
})();
