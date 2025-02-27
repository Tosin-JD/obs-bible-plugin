// Function to toggle delimiters around selected text
function toggleDelimiters(textarea, delimiter) {
    // Get the selected text and its start/end positions
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
    const newText = textarea.value.substring(0, startPos) + selectedText + textarea.value.substring(endPos);
    textarea.value = newText;
    textarea.selectionStart = startPos + delimiter.length;
    textarea.selectionEnd = endPos + delimiter.length;
}

// Event listener for key press
document.getElementById('messageInput').addEventListener('keydown', function(event) {
    let firstCondition = event.ctrlKey && (event.key === 'b' || event.key === 'i');
    let secondCondition = event.ctrlKey && (event.key === 'B' || event.key === 'I');
    if (firstCondition || secondCondition){
        // event.preventDefault();
        const textarea = event.target;
        const delimiter = (event.key === 'b' || event.key === 'B') ? '*' : '_';
        toggleDelimiters(textarea, delimiter);
    }
});
