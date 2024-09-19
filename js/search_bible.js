function searchBible(query) {
  bblVerseDiv.innerHTML = "";
  const lowercaseQuery = query.toLowerCase();

  if (lowercaseQuery.includes('-')) {
    const [bookAndChapter, verseRange] = lowercaseQuery.split(':');

    const [book, chapter] = bookAndChapter.split(':');
    const [startVerse, endVerse] = verseRange.split('-').map(Number);
    for (let i = startVerse; i <= endVerse; i++) {
    let verseName = `${book} ${chapter}:${i}`;
      verseName = bookAndChapter + ":" + i;
      const matchingVerse = bible_data.find(data => data.name.toLowerCase() === verseName.toLowerCase());
      
      
      if (matchingVerse) {
        const pElement = document.createElement('p');
        const cleanedName = matchingVerse.name.replace(/:/g, '-').replace(/\s/g, '').toLowerCase();
        pElement.id = cleanedName;
        pElement.innerHTML = `<span>${matchingVerse.name.toUpperCase()}</span> ${matchingVerse.verse}`;
        bblVerseDiv.appendChild(pElement);
      }
    }
  }else{
    for (let i = 0; i < bible_data.length; i++) {
      const name = bible_data[i].name.toLowerCase(); 
      const verse = bible_data[i].verse.toLowerCase();

      if (name.includes(lowercaseQuery) || verse.includes(lowercaseQuery)) {
        const cleanedName = bible_data[i].name.replace(/:/g, '-').replace(/\s/g, '').toLowerCase();
        const ariParts = bible_data[i].ari.split(':');
        const middleAriPart = ariParts[2];

        const pElement = document.createElement('p');
        pElement.id = cleanedName;
        pElement.innerHTML = `<span>${name.toUpperCase()}</span> ${bible_data[i].verse}`;
        bblVerseDiv.appendChild(pElement);
      }
    }
  }
}


const submitButton = document.getElementById("bible-submit");
submitButton.addEventListener("click", function (event) {
  event.preventDefault();

  const inputField = document.getElementById("bible-input");
  const searchQuery = inputField.value.trim();

  if (searchQuery !== "") {
    searchBible(searchQuery);
    displayBible();
  }
});


const inputField = document.getElementById("bible-input");

inputField.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    const searchQuery = inputField.value.trim();

    if (searchQuery !== "") {
      searchBible(searchQuery);
      displayBible();
    }
  }
});