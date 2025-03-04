document.addEventListener('DOMContentLoaded', function () {
    const textArea = document.getElementById('messageInput');
    const toolbar = document.getElementById('message-toolbar');
    const boldButton = document.getElementById('message-boldButton');
    const italicButton = document.getElementById('message-italicButton');
    // const underlineButton = document.getElementById('message-underlineButton');

    textArea.addEventListener('mouseup', function (event) {
        const selectedText = window.getSelection().toString();
        if (selectedText.length > 0) {
            const rect = textArea.getBoundingClientRect();
            toolbar.style.display = 'flex';
            toolbar.style.top = `${event.clientY - rect.top - 40}px`;
            toolbar.style.left = `${event.clientX - rect.left}px`;
        } else {
            toolbar.style.display = 'none';
        }
    });

    boldButton.addEventListener('click', function () {
        toggleDelimiters(textArea, '*');
    });

    italicButton.addEventListener('click', function () {
        toggleDelimiters(textArea, '_');
    });

    // Function to toggle delimiters around selected text
    function toggleDelimiters(textarea, delimiter) {
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
        let selectedText = textarea.value.substring(startPos, endPos);

        // Check if selected text is already surrounded by the same delimiter
        if (selectedText.startsWith(delimiter) && selectedText.endsWith(delimiter)) {
            // Remove delimiters
            selectedText = selectedText.substring(delimiter.length, selectedText.length - delimiter.length);
        } else {
            // Add delimiters
            selectedText = delimiter + selectedText + delimiter;
        }

        // Update the textarea value
        const newText = textarea.value.substring(0, startPos) + selectedText + textarea.value.substring(endPos);
        textarea.value = newText;

        // Adjust the selection
        textarea.selectionStart = startPos + delimiter.length;
        textarea.selectionEnd = endPos + delimiter.length;
    }

    // Event listener for key press (Ctrl + B for bold, Ctrl + I for italic)
    textArea.addEventListener('keydown', function (event) {
        const isCtrlPressed = event.ctrlKey || event.metaKey; // Support both Ctrl and Cmd (Mac)
        if (isCtrlPressed && (event.key === 'b' || event.key === 'B' || event.key === 'i' || event.key === 'I')) {
            event.preventDefault(); // Prevent default browser behavior
            const delimiter = (event.key === 'b' || event.key === 'B') ? '*' : '_';
            toggleDelimiters(textArea, delimiter);
        }
    });
});