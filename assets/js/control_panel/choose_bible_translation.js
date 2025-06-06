const getElementById = (id) => document.getElementById(id);

const createScriptElement = (src, id = 'dynamicScript') => {
    const script = document.createElement('script');
    script.src = src;
    script.id = id;
    return script;
};

const removeExistingScript = (id = 'dynamicScript') => {
    const existingScript = getElementById(id);
    if (existingScript) existingScript.remove();
};

const saveScriptPath = (path) => localStorage.setItem('selectedScriptFile', path);

const loadScriptFile = (scriptFile) => new Promise((resolve, reject) => {
    removeExistingScript();

    const script = createScriptElement(scriptFile);
    document.body.appendChild(script);
    saveScriptPath(scriptFile);

    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Bible file"));
});

const onScriptLoadSuccess = () => {
    getSavedBible();
    generateIndexForBibleBooks();
    displayBible();
};

const extractSelectedValue = (event) => event.target.value;

const handleBibleVersionChange = (event) => {
    const selectedScriptFile = extractSelectedValue(event);
    loadScriptFile(selectedScriptFile)
        .then(onScriptLoadSuccess)
        .catch(console.error); // Optional: handle error gracefully
};

const initializeBibleVersionListener = () => {
    const bibleVersionSelect = getElementById("bible-version");
    bibleVersionSelect.addEventListener("change", handleBibleVersionChange);
};

initializeBibleVersionListener();
