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
    if (tabName !== "setBg") {
      localStorage.setItem("lastContentTab", tabName);
    } else {
      const savedSettingsTab = localStorage.getItem("obs-bible-selectedSettingTab") || "settings-background";
      openSettingTab(savedSettingsTab);
    }
  }
}

function openSettingTab(tabName) {
  if (!tabName) tabName = "settings-background";
  var tabs = document.getElementsByClassName("settings-tab-area");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].style.display = "none";
  }
  var selectedTab = document.getElementById(tabName);
  if (!selectedTab) {
    selectedTab = document.getElementById("settings-background");
    tabName = "settings-background";
  }
  if (selectedTab) {
    selectedTab.style.display = "flex";
    selectedTab.classList.add("selected-setting-tab");
    localStorage.setItem("obs-bible-selectedSettingTab", tabName);

    Array.from(document.getElementsByClassName("settings-tab-button")).forEach(btn => {
      if (btn.dataset.settings === tabName) {
        btn.classList.add("selected-setting-tab");
      } else {
        btn.classList.remove("selected-setting-tab");
      }
    });
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
    openTab("text");
    tabButtons.forEach(button => {
      if(button.value === "text"){
        button.classList.add("selected-tab");
      }
    });
  }
  if (savedSettingsTab) {
    openSettingTab(savedSettingsTab);
  } else {
    openSettingTab("settings-background");
  }
}

// Call the function to open the saved tab when the webpage loads
window.onload = function() {
  openSavedTab();
  // get the bible Translation
  const savedScriptFile = localStorage.getItem('selectedScriptFile');
  if (savedScriptFile) {
      document.getElementById('bible-version').value = savedScriptFile;
      loadScriptFile(savedScriptFile).then(() => {
          getSavedBible();
          displayBible();
          generateIndexForBibleBooks();
      });
  }
}
