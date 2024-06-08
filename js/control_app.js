function openTab(tabName) {
  var tabs = document.getElementsByClassName("tab-area");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].style.display = "none";
  }
  var selectedTab = document.getElementById(tabName);
  if (selectedTab) {
<<<<<<< HEAD
    selectedTab.style.display = "flex";
    localStorage.setItem("selectedTab", tabName);
=======
    selectedTab.style.display = "block";
>>>>>>> 011b7423a553ca7018aa38c82443b16038a60b75
  }
}

const bblVerseDiv = document.getElementById("bible-verse");

<<<<<<< HEAD



// Function to retrieve and open the previously selected tab from local storage
function openSavedTab() {
  var savedTab = localStorage.getItem("selectedTab");
  if (savedTab) {
    openTab(savedTab);
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
=======
for (let i = 0; i < 31; i++) {
  const name = bible_data[i].name;

  const cleanedName = name.replace(/:/g, '-').replace(/\s/g, '').toLowerCase();
  const ariParts = bible_data[i].ari.split(':');
  const middleAriPart = ariParts[2];

  const pElement = document.createElement('p');
  pElement.id = cleanedName;
  pElement.innerHTML = `<span>${name.toUpperCase()}</span> ${bible_data[i].verse}`;
  bblVerseDiv.appendChild(pElement);
}

>>>>>>> 011b7423a553ca7018aa38c82443b16038a60b75
