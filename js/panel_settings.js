// Function to change the theme
function changeTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme); // Save the theme to localStorage
}

// Event listener for theme selection
document.getElementById('panelTheme').addEventListener('change', function() {
    changeTheme(this.value.toLowerCase());
});

// Load the saved theme from localStorage
window.addEventListener('DOMContentLoaded', (event) => {
    const savedTheme = localStorage.getItem('theme') || 'default';
    document.body.setAttribute('data-theme', savedTheme);
    document.getElementById('panelTheme').value = savedTheme.charAt(0).toUpperCase() + savedTheme.slice(1);
});
