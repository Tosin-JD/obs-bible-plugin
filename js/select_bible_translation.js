var bible_data;

// Define your Bible versions
const bibleVersions = {
    kjv: kjvBible,
    nkjv: nkjvBible,
    lo_segond: lo_segondBible,
    spanish: spanishBible
};

// Function to get the selected Bible version
function getSelectedBibleData() {
    let chosenBibleVersion = localStorage.getItem('saved-bible-version');
    return bibleVersions[chosenBibleVersion] || kjvBible;
}

// Function to save the selected Bible version
function saveSelectedBibleVersion(version) {
    localStorage.setItem('saved-bible-version', version);
}

// Function to handle changing Bible versions
function handleBibleVersionChange() {
    const selectBibleVersion = document.getElementById("bible-version");
    const chosenBibleVersion = selectBibleVersion.value;
    saveSelectedBibleVersion(chosenBibleVersion);
    // Load the corresponding Bible data or perform any other actions needed
    bible_data = bibleVersions[chosenBibleVersion];
}

// Load saved Bible version when the page loads
document.addEventListener("DOMContentLoaded", function() {
    const selectedBibleData = getSelectedBibleData();
    // Use selectedBibleData as needed
    bible_data = selectedBibleData;
});

// Listen for changes in the selected Bible version
document.getElementById("bible-version").addEventListener("change", handleBibleVersionChange);
