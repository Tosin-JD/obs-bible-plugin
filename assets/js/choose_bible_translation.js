function loadScriptFile(scriptFile) {
    return new Promise((resolve, reject) => {
        // Remove any previously loaded script
        const existingScript = document.getElementById('dynamicScript');
        if (existingScript) {
            existingScript.remove();
        }

        // Create a new script element
        const script = document.createElement('script');
        script.src = scriptFile;
        script.id = 'dynamicScript';

        // Append the script to the body
        document.body.appendChild(script);

        // Save the selected script to localStorage
        localStorage.setItem('selectedScriptFile', scriptFile);

        // Resolve the promise when the script loads successfully
        script.onload = function() {
            resolve();
        };

        // Reject the promise if there's an error loading the script
        script.onerror = function() {
            reject(new Error("Failed to load Bible file"));
        };
    });
}

// Listen for changes in the selected Bible version
document.getElementById("bible-version").addEventListener("change", function() {
    const selectedScriptFile = this.value;

    loadScriptFile(selectedScriptFile).then(() => {
        getSavedBible();
        generateIndexForBibleBooks();
        displayBible();
    });
});
