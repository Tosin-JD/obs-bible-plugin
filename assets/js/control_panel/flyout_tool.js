document.addEventListener('DOMContentLoaded', function () {
    const textArea = document.getElementById('messageInput');
    const toolbar = document.getElementById('message-toolbar');
    const boldButton = document.getElementById('message-boldButton');
    const italicButton = document.getElementById('message-italicButton');

    // --- SHOW / HIDE TOOLBAR BASED ON SELECTION ---
    function updateToolbarPosition() {
        const start = textArea.selectionStart;
        const end = textArea.selectionEnd;

        const hasSelection = start !== end;
        const isFocused = document.activeElement === textArea;

        if (hasSelection && isFocused) {
            const rect = textArea.getBoundingClientRect();

            toolbar.style.display = 'flex';
            toolbar.style.top = `${rect.top + window.scrollY - 40}px`;
            toolbar.style.left = `${rect.left + window.scrollX + 10}px`;
        } else {
            toolbar.style.display = 'none';
        }
    }

    // --- CLEAR SELECTION + HIDE TOOLBAR ---
    function clearSelection() {
        textArea.selectionStart = textArea.selectionEnd; // collapse selection
        toolbar.style.display = 'none';
    }

    // Mouse selection
    textArea.addEventListener('mouseup', updateToolbarPosition);

    // Keyboard selection
    textArea.addEventListener('keyup', updateToolbarPosition);

    // Click outside → clear selection + hide toolbar
    document.addEventListener('mousedown', function (e) {
        if (!textArea.contains(e.target) && !toolbar.contains(e.target)) {
            clearSelection();
            textArea.blur();
        }
    });

    // Escape key → clear selection + hide toolbar
    textArea.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            event.preventDefault();
            clearSelection();
            textArea.blur();
            return;
        }

        const isModifier = event.ctrlKey || event.metaKey;
        if (!isModifier) return;

        const key = event.key.toLowerCase();

        if (key === 'b') {
            event.preventDefault();
            toggleDelimiters(textArea, '*');
        } else if (key === 'i') {
            event.preventDefault();
            toggleDelimiters(textArea, '_');
        }
    });

    // --- BUTTON ACTIONS ---
    boldButton.addEventListener('click', function () {
        toggleDelimiters(textArea, '*');
    });

    italicButton.addEventListener('click', function () {
        toggleDelimiters(textArea, '_');
    });

    // --- TOGGLE FORMAT FUNCTION ---
    function toggleDelimiters(textarea, delimiter) {
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;

        if (startPos === endPos) return;

        let selectedText = textarea.value.substring(startPos, endPos);

        if (
            selectedText.startsWith(delimiter) &&
            selectedText.endsWith(delimiter)
        ) {
            selectedText = selectedText.substring(
                delimiter.length,
                selectedText.length - delimiter.length
            );
        } else {
            selectedText = delimiter + selectedText + delimiter;
        }

        const newText =
            textarea.value.substring(0, startPos) +
            selectedText +
            textarea.value.substring(endPos);

        textarea.value = newText;

        textarea.focus();
        textarea.selectionStart = startPos + delimiter.length;
        textarea.selectionEnd = endPos + delimiter.length;

        updateToolbarPosition();
    }
});