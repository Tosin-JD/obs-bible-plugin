// Function to change the theme
function changeTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('obs-bible-panel-theme', theme); // Save the theme to localStorage
}

function savePanelTheme(){
    // Event listener for theme selection
    document.getElementById('obs-bible-panel-theme').addEventListener('change', function() {
        changeTheme(this.value.toLowerCase());
    });

    // Load the saved theme from localStorage
    window.addEventListener('DOMContentLoaded', (event) => {
        const savedTheme = localStorage.getItem('obs-bible-panel-theme') || 'obs-bible-default-yami';
        document.body.setAttribute('data-theme', savedTheme);
        document.getElementById('obs-bible-panel-theme').value = savedTheme.charAt(0).toUpperCase() + savedTheme.slice(1);
    });
}


function saveCheckBoxedOnChange(){
    // Get the checkbox element
    let fadeInCheckbox = document.getElementById("fade-in-checkbox");
    let spaceBarCheckBox = document.getElementById("spacebar-checkbox");

    // Load the saved checkbox state from local storage
    const savedState = localStorage.getItem("obs-bible-fadein-checkbox");
    const spaceBarSavedState = localStorage.getItem("obs-bible-spacebar-checkbox");

    // save the update the checkboxes
    if (savedState !== null) {
        fadeInCheckbox.checked = savedState === "true";
    }
    if (spaceBarSavedState !== null) {
        spaceBarCheckBox.checked = spaceBarSavedState === "true";
    }

    // Add an event listener to save the state when the checkbox is clicked
    fadeInCheckbox.addEventListener("change", () => {
        localStorage.setItem("obs-bible-fadein-checkbox", fadeInCheckbox.checked);
    });
    spaceBarCheckBox.addEventListener("change", () => {
        localStorage.setItem("obs-bible-spacebar-checkbox", spaceBarCheckBox.checked);
    });
}


savePanelTheme();
saveCheckBoxedOnChange();

