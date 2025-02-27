const bblVerseDiv = document.getElementById("bible-verse");
const tabButtons = Array.from(document.getElementsByClassName("tab-button"));
const settingsTabButtons = Array.from(document.getElementsByClassName("settings-tab-button"));


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

function openSettingTab(tabName) {
  var tabs = document.getElementsByClassName("settings-tab-area");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].style.display = "none";
  }
  var selectedTab = document.getElementById(tabName);
  if (selectedTab) {
    selectedTab.style.display = "flex";
    selectedTab.classList.add("selected-setting-tab");
    localStorage.setItem("obs-bible-selectedSettingTab", tabName);
  }
}


tabButtons.forEach(button => {
    button.addEventListener("click", () => {
        openTab(button.value);

        // Remove 'selected' class from all buttons
        Array.from(tabButtons).forEach(btn => {
            if (btn !== button) {
                btn.classList.remove("selected-tab");
            }
        });

        // Add 'selected' class to the clicked button
        button.classList.add("selected-tab");
    });
});

settingsTabButtons.forEach(button => {
    button.addEventListener("click", () => {
        openSettingTab(button.dataset.settings);

        // Remove 'selected' class from all buttons
        settingsTabButtons.forEach(btn => {
            if (btn !== button) {
                btn.classList.remove("selected-setting-tab");
            }
        });

        // Add 'selected' class to the clicked button
        button.classList.add("selected-setting-tab");
    });
});

// Function to retrieve and open the previously selected tab from local storage
function openSavedTab() {
  var savedTab = localStorage.getItem("selectedTab");
  var savedSettingsTab = localStorage.getItem("obs-bible-selectedSettingTab");
  if (savedTab) {
    openTab(savedTab);
    tabButtons.forEach(button => {
      if(button.value === savedTab){
        button.classList.add("selected-tab");
      }
    });
  } else {
    // If no tab is saved, open a default tab here
    // For example:
    // openTab("defaultTabName");
  }
  if (savedSettingsTab) {
    openSettingTab(savedSettingsTab);
    settingsTabButtons.forEach(settingsButton => {
      if(settingsButton.dataset.settings === savedSettingsTab){
        settingsButton.classList.add("selected-setting-tab");
      }
    });
  }
}

// Call the function to open the saved tab when the webpage loads
window.onload = function() {
  // get the bible Translation
  const savedScriptFile = localStorage.getItem('selectedScriptFile');
  if (savedScriptFile) {
      document.getElementById('bible-version').value = savedScriptFile;
      openSavedTab();
      loadScriptFile(savedScriptFile).then(() => {
          getSavedBible();
          displayBible();
          generateIndexForBibleBooks();
      });
  }
}
