// function searchBible(query) {
//   bblVerseDiv.innerHTML = ""; 
//   const lowercaseQuery = query.toLowerCase();

//   for (let i = 0; i < bible_data.length; i++) {
//     const name = bible_data[i].name.toLowerCase(); 
//     const verse = bible_data[i].verse.toLowerCase();

//     if (name.includes(lowercaseQuery) || verse.includes(lowercaseQuery)) {
//       const cleanedName = bible_data[i].name.replace(/:/g, '-').replace(/\s/g, '').toLowerCase();
//       const ariParts = bible_data[i].ari.split(':');
//       const middleAriPart = ariParts[2];

//       const pElement = document.createElement('p');
//       pElement.id = cleanedName;
//       pElement.innerHTML = `<span>${name.toUpperCase()}</span> ${bible_data[i].verse}`;
//       bblVerseDiv.appendChild(pElement);
//     }
//   }
// }


function searchBible(query) {
  bblVerseDiv.innerHTML = "";
  const lowercaseQuery = query.toLowerCase();

  // if lowercaseQuery contains '-' split it.
  if (lowercaseQuery.includes('-')) {
     // if lowerCaseQuery contains - split it.
  // // if the arraay contains something like this Esther 1:2-5
  // //  create an array that will contain the following: 
  /////////  Esther 1:2, Esther 1:3, Esther 1:4, and Esther 1:5
  /////////// get bible_data.name  that is exactly equal to each of them and display it.

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
  } else {
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
  event.preventDefault(); // Prevent the form from submitting

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