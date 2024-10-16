function openTab(tabName) {
  var tabs = document.getElementsByClassName("tab-area");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].style.display = "none";
  }
  var selectedTab = document.getElementById(tabName);
  if (selectedTab) {
    selectedTab.style.display = "flex";
    selectedTab.classList.add("selected");
    localStorage.setItem("selectedTab", tabName);
  }
}

const bblVerseDiv = document.getElementById("bible-verse");


const tabButtons = document.getElementsByClassName("tab-button");

Array.from(tabButtons).forEach(button => {
    button.addEventListener("click", () => {
        openTab(button.value); 
        
        // Remove 'selected' class from all buttons
        Array.from(tabButtons).forEach(btn => {
            if (btn !== button) {
                btn.classList.remove("selected");
            }
        });

        // Add 'selected' class to the clicked button
        button.classList.add("selected"); 
    });
});

// Function to retrieve and open the previously selected tab from local storage
function openSavedTab() {
  var savedTab = localStorage.getItem("selectedTab");
  if (savedTab) {
    openTab(savedTab);
    Array.from(tabButtons).forEach(button => {
      if(button.value === savedTab){
        button.classList.add("selected"); 
      }
    });
  } else {
    // If no tab is saved, open a default tab here
    // For example:
    // openTab("defaultTabName");
  }
}

// Call the function to open the saved tab when the webpage loads
window.onload = function() {
  openSavedTab();
  for (let i = 0; i < 31; i++) {
    const name = bible_data[i].name;
  
    const cleanedName = name.replace(/:/g, '-').replace(/\s/g, '').toLowerCase();
    const ariParts = bible_data[i].ari.split(':');
  
    const pElement = document.createElement('p');
    pElement.id = cleanedName;
    pElement.innerHTML = `<span>${name.toUpperCase()}</span> ${bible_data[i].verse}`;
    bblVerseDiv.appendChild(pElement);
  }
  displayBible();
};
