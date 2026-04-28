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
        activatePrimaryTab(button.value);
    });
});

settingsTabButtons.forEach(button => {
    button.addEventListener("click", () => {
        activateSettingsTab(button.dataset.settings);
    });
});

function activatePrimaryTab(tabName) {
  openTab(tabName);
  tabButtons.forEach(button => {
    button.classList.toggle("selected-tab", button.value === tabName);
  });
}

function activateSettingsTab(tabName) {
  openSettingTab(tabName);
  settingsTabButtons.forEach(button => {
    button.classList.toggle("selected-setting-tab", button.dataset.settings === tabName);
  });
}

// Function to retrieve and open the previously selected tab from local storage
function openSavedTab() {
  var savedTab = localStorage.getItem("selectedTab");
  var savedSettingsTab = localStorage.getItem("obs-bible-selectedSettingTab");
  if (savedTab) {
    activatePrimaryTab(savedTab);
  } else {
    activatePrimaryTab("text");
  }
  if (savedSettingsTab) {
    activateSettingsTab(savedSettingsTab);
  } else {
    activateSettingsTab("settings-general");
  }
}

window.obsBibleControl = window.obsBibleControl || {};
window.obsBibleControl.activatePrimaryTab = activatePrimaryTab;
window.obsBibleControl.activateSettingsTab = activateSettingsTab;

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
