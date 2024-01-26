function openTab(tabName) {
  var tabs = document.getElementsByClassName("tab-area");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].style.display = "none";
  }
  var selectedTab = document.getElementById(tabName);
  if (selectedTab) {
    selectedTab.style.display = "block";
  }
}

const bblVerseDiv = document.getElementById("bible-verse");

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

