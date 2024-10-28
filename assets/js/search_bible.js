function ensureEndsWithColon(str) {
    if (str.includes(':')) {
        return str;  // Return the string as is if it contains a colon
    } else if (!str.endsWith(':')) {
        str += ':';
    }
    return str;
}

function searchBible(query) {
  bblVerseDiv.innerHTML = "";
  let savedBibleVerse = [];
  const lowercaseQuery = query.toLowerCase();

  if (lowercaseQuery.includes('-')) {
    // for searches like John 1: 1-5
    savedBibleVerse = [];
    const [bookAndChapter, verseRange] = lowercaseQuery.split(':');

    const [book, chapter] = bookAndChapter.split(':');
    const [startVerse, endVerse] = verseRange.split('-').map(Number);
    for (let i = startVerse; i <= endVerse; i++) {
      let verseName = `${book} ${chapter}:${i}`;
      verseName = bookAndChapter + ":" + i;
      const matchingVerse = bible_data.find(bible_data => bible_data.name.toLowerCase() === verseName.toLowerCase());

      if (matchingVerse) {
        savedBibleVerse.push(matchingVerse.ari);
        const pElement = document.createElement('p');
        const cleanedName = matchingVerse.name.replace(/:/g, '-').replace(/\s/g, '').toLowerCase();
        pElement.id = cleanedName;
        pElement.innerHTML = `<span>${matchingVerse.name.toUpperCase()}</span> ${matchingVerse.verse}`;
        bblVerseDiv.appendChild(pElement);
      }
    }
  } else if (lowercaseQuery.includes(':')) {
    // for searches like "John 1:1"
    savedBibleVerse = [];
    for (let i = 0; i < bible_data.length; i++) {
      const name = bible_data[i].name.toLowerCase();
      const verse = bible_data[i].verse.toLowerCase();

      if (name === lowercaseQuery || verse === lowercaseQuery) {
        const cleanedName = bible_data[i].name.replace(/:/g, '-').replace(/\s/g, '').toLowerCase();
        const ariParts = bible_data[i].ari.split(':');
        const middleAriPart = ariParts[2];
        savedBibleVerse.push(bible_data[i].ari);

        const pElement = document.createElement('p');
        pElement.classList.add("verse");
        pElement.id = cleanedName;
        pElement.innerHTML = `<span>${name.toUpperCase()}</span> ${bible_data[i].verse}`;

        bblVerseDiv.appendChild(pElement);
      }
    }
  } else if (!/\d/.test(lowercaseQuery)){
    //for searches like "For God so loved the world"
    savedBibleVerse = [];
    let cleanedLowercaseQuery = lowercaseQuery.replace(/\s{2,}/g, ' ');
    cleanedLowercaseQuery = lowercaseQuery.replace(/\s{2,}/g, ' ').trim();

    const searchWords = cleanedLowercaseQuery.split(' ');

    for (let i = 0; i < bible_data.length; i++) {
        const name = bible_data[i].name.toLowerCase();
        const verse = bible_data[i].verse.toLowerCase();

        // Check if all words in the search query are present in either the name or the verse
        const isMatchInName = searchWords.every(word => name.includes(word));
        const isMatchInVerse = searchWords.every(word => verse.includes(word));

        if (isMatchInName || isMatchInVerse) {
            const cleanedName = bible_data[i].name.replace(/:/g, '-').replace(/\s/g, '').toLowerCase();
            const pElement = document.createElement('p');
            pElement.classList.add("verse");
            pElement.id = cleanedName;
            pElement.innerHTML = `<span>${name.toUpperCase()}</span> ${bible_data[i].verse}`;
            const ariParts = bible_data[i].ari;
            savedBibleVerse.push(ariParts);

            // Append the result to the bibleDiv
            bblVerseDiv.appendChild(pElement);
        }
      }
    } else {
      // for searches like "John 1"
      savedBibleVerse = [];
      let lowercaseQueryWithColon = ensureEndsWithColon(lowercaseQuery);
      for (let i = 0; i < bible_data.length; i++) {
        const name = bible_data[i].name.toLowerCase();
        const verse = bible_data[i].verse.toLowerCase();

        if (name.includes(lowercaseQueryWithColon) || verse.includes(lowercaseQueryWithColon)) {
          const cleanedName = bible_data[i].name.replace(/:/g, '-').replace(/\s/g, '').toLowerCase();
          const ariParts = bible_data[i].ari;
          const middleAriPart = ariParts[2];
          savedBibleVerse.push(ariParts);

          const pElement = document.createElement('p');
          pElement.id = cleanedName;
          pElement.innerHTML = `<span>${name.toUpperCase()}</span> ${bible_data[i].verse}`;
          bblVerseDiv.appendChild(pElement);
        }
      }
  }
  localStorage.setItem('savedBibleVerse', savedBibleVerse);
}


function getBibeAri(query) {
  bblVerseDiv.innerHTML = "";
  let savedBibleVerse = [];
  if (query) {
    // for searches like 1:1:1
    savedBibleVerse = [];
    for (let i = 0; i < query.length; i++) {
      const matchingVerse = bible_data.find(bible_data => bible_data.ari === query[i]);
      if (matchingVerse) {
        savedBibleVerse.push(matchingVerse.ari);
        const pElement = document.createElement('p');
        const cleanedName = matchingVerse.name.replace(/:/g, '-').replace(/\s/g, '').toLowerCase();
        pElement.id = cleanedName;
        pElement.innerHTML = `<span>${matchingVerse.name.toUpperCase()}</span> ${matchingVerse.verse}`;
        bblVerseDiv.appendChild(pElement);
      }
    }
  }
  localStorage.setItem('savedBibleVerse', savedBibleVerse);
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
