
const submitButton = document.getElementById("bible-submit");
const inputField = document.getElementById("bible-input");

function ensureEndsWithColon(str) {
    if (str.includes(':')) {
        return str;  // Return the string as is if it contains a colon
    } else if (!str.endsWith(':')) {
        str += ':';
    }
    return str;
}

function parseBookChapterVerse(name) {
  const lastColonIndex = name.lastIndexOf(':');
  if (lastColonIndex === -1) return null;
  const bookAndChapter = name.substring(0, lastColonIndex).trim();
  const verseNum = parseInt(name.substring(lastColonIndex + 1).trim(), 10);
  const lastSpaceIndex = bookAndChapter.lastIndexOf(' ');
  if (lastSpaceIndex === -1) return null;
  const bookName = bookAndChapter.substring(0, lastSpaceIndex).trim();
  const chapterNum = parseInt(bookAndChapter.substring(lastSpaceIndex + 1).trim(), 10);
  return { bookName, chapterNum, verseNum };
}

function findEnglishBookMatch(query) {
  const queryLower = query.toLowerCase().trim();
  const sortedBooks = englishBooks.map((name, index) => ({ name, index }))
                                  .sort((a, b) => b.name.length - a.name.length);
  for (let i = 0; i < sortedBooks.length; i++) {
    const book = sortedBooks[i];
    const bookLower = book.name.toLowerCase();
    if (queryLower.startsWith(bookLower)) {
      const nextChar = queryLower.charAt(bookLower.length);
      if (nextChar === "" || nextChar === " " || nextChar === ":" || (nextChar >= "0" && nextChar <= "9")) {
        return book;
      }
    }
  }
  return null;
}

function translateEnglishBookToLocal(engBookIdx, bible_data) {
  const prefix = engBookIdx + ":";
  const matchingVerse = bible_data.find(v => v.ari.startsWith(prefix));
  if (!matchingVerse) return null;

  const parsed = parseBookChapterVerse(matchingVerse.name);
  return parsed ? parsed.bookName : null;
}

function findNearestVerseByName(queryName, bible_data) {
  const parsedTarget = parseBookChapterVerse(queryName);
  if (!parsedTarget) return null;
  const { bookName, chapterNum, verseNum: targetVerse } = parsedTarget;

  const bookVerses = [];
  for (let i = 0; i < bible_data.length; i++) {
    const parsed = parseBookChapterVerse(bible_data[i].name);
    if (parsed && parsed.bookName.toLowerCase() === bookName.toLowerCase()) {
      bookVerses.push({
        verse: bible_data[i],
        chapter: parsed.chapterNum,
        verseNum: parsed.verseNum
      });
    }
  }
  if (bookVerses.length === 0) return null;

  let closestChapter = -1;
  let minChapterDist = Infinity;
  for (let i = 0; i < bookVerses.length; i++) {
    const dist = Math.abs(bookVerses[i].chapter - chapterNum);
    if (dist < minChapterDist) {
      minChapterDist = dist;
      closestChapter = bookVerses[i].chapter;
    }
  }

  const chapterVerses = bookVerses.filter(v => v.chapter === closestChapter);

  chapterVerses.sort((a, b) => {
    const aDist = Math.abs(a.verseNum - targetVerse);
    const bDist = Math.abs(b.verseNum - targetVerse);
    if (aDist !== bDist) {
      return aDist - bDist;
    }
    return a.verseNum - b.verseNum;
  });

  return chapterVerses[0].verse;
}

function findNearestVerseByAri(queryAri, bible_data) {
  const parts = queryAri.split(':');
  if (parts.length !== 3) return null;
  const bookIdx = parts[0];
  const chapterNum = parseInt(parts[1], 10);
  const targetVerse = parseInt(parts[2], 10);
  if (isNaN(chapterNum) || isNaN(targetVerse)) return null;

  const bookVerses = [];
  for (let i = 0; i < bible_data.length; i++) {
    const vParts = bible_data[i].ari.split(':');
    if (vParts.length === 3 && vParts[0] === bookIdx) {
      bookVerses.push({
        verse: bible_data[i],
        chapter: parseInt(vParts[1], 10),
        verseNum: parseInt(vParts[2], 10)
      });
    }
  }
  if (bookVerses.length === 0) return null;

  let closestChapter = -1;
  let minChapterDist = Infinity;
  for (let i = 0; i < bookVerses.length; i++) {
    const dist = Math.abs(bookVerses[i].chapter - chapterNum);
    if (dist < minChapterDist) {
      minChapterDist = dist;
      closestChapter = bookVerses[i].chapter;
    }
  }

  const chapterVerses = bookVerses.filter(v => v.chapter === closestChapter);

  chapterVerses.sort((a, b) => {
    const aDist = Math.abs(a.verseNum - targetVerse);
    const bDist = Math.abs(b.verseNum - targetVerse);
    if (aDist !== bDist) {
      return aDist - bDist;
    }
    return a.verseNum - b.verseNum;
  });

  return chapterVerses[0].verse;
}

function searchBible(query, bible_data) {
  const match = findEnglishBookMatch(query);
  if (match) {
    const localBookName = translateEnglishBookToLocal(match.index, bible_data);
    if (localBookName && localBookName.toLowerCase() !== match.name.toLowerCase()) {
      const bookLower = match.name.toLowerCase();
      const chapterAndVerse = query.substring(bookLower.length);
      query = localBookName + chapterAndVerse;
    }
  }

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
      let matchingVerse = bible_data.find(bible_data => bible_data.name.toLowerCase() === verseName.toLowerCase());

      if (!matchingVerse) {
        matchingVerse = findNearestVerseByName(verseName, bible_data);
      }

      if (matchingVerse) {
        if (!savedBibleVerse.includes(matchingVerse.ari)) {
          savedBibleVerse.push(matchingVerse.ari);
          const pElement = document.createElement('p');
          const cleanedName = matchingVerse.name.replace(/:/g, '-').replace(/\s/g, '').toLowerCase();
          pElement.id = cleanedName;
          pElement.innerHTML = `<span>${matchingVerse.name.toUpperCase()}</span> ${matchingVerse.verse}`;
          bblVerseDiv.appendChild(pElement);
        }
      }
    }
  } else if (lowercaseQuery.includes(':')) {
    // for searches like "John 1:1"
    savedBibleVerse = [];
    let matched = false;
    for (let i = 0; i < bible_data.length; i++) {
      const name = bible_data[i].name.toLowerCase();
      const verse = bible_data[i].verse.toLowerCase();

      if (name === lowercaseQuery || verse === lowercaseQuery) {
        matched = true;
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
    if (!matched) {
      const nearestVerse = findNearestVerseByName(lowercaseQuery, bible_data);
      if (nearestVerse) {
        const cleanedName = nearestVerse.name.replace(/:/g, '-').replace(/\s/g, '').toLowerCase();
        savedBibleVerse.push(nearestVerse.ari);

        const pElement = document.createElement('p');
        pElement.classList.add("verse");
        pElement.id = cleanedName;
        pElement.innerHTML = `<span>${nearestVerse.name.toUpperCase()}</span> ${nearestVerse.verse}`;

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
        // const isMatchInName = searchWords.every(word => name.includes(word));
        // const isMatchInVerse = searchWords.every(word => verse.includes(word));
        const isMatchInName = searchWords.every(word => fuzzySearch(word, name, threshold=1));
        // const isMatchInVerse = searchWords.every(word => fuzzySearch(word, verse, threshold=0));
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
      let matchingVerse = bible_data.find(bible_data => bible_data.ari === query[i]);
      if (!matchingVerse) {
        matchingVerse = findNearestVerseByAri(query[i], bible_data);
      }
      if (matchingVerse) {
        if (!savedBibleVerse.includes(matchingVerse.ari)) {
          savedBibleVerse.push(matchingVerse.ari);
          const pElement = document.createElement('p');
          const cleanedName = matchingVerse.name.replace(/:/g, '-').replace(/\s/g, '').toLowerCase();
          pElement.id = cleanedName;
          pElement.innerHTML = `<span>${matchingVerse.name.toUpperCase()}</span> ${matchingVerse.verse}`;
          bblVerseDiv.appendChild(pElement);
        }
      }
    }
  }
  localStorage.setItem('savedBibleVerse', savedBibleVerse);
}


submitButton.addEventListener("click", function (event) {
  event.preventDefault();

  const inputField = document.getElementById("bible-input");
  const searchQuery = inputField.value.trim();

  if (searchQuery !== "") {
    searchBible(searchQuery, bible_data);
    displayBible();
  }
});



inputField.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    const searchQuery = inputField.value.trim();

    if (searchQuery !== "") {
      searchBible(searchQuery, bible_data);
      displayBible();
    }
  }
});
