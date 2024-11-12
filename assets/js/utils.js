function hexToRgba(hex, alpha) {
  hex = hex.replace(/^#/, '');

  let red = parseInt(hex.substring(0, 2), 16);
  let green = parseInt(hex.substring(2, 4), 16);
  let blue = parseInt(hex.substring(4, 6), 16);

  alpha = parseFloat(alpha);
  if (isNaN(alpha) || alpha < 0 || alpha > 1) {
    alpha = 1;
  }
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function getCustomPropertyValue(property) {
  return getComputedStyle(document.body).getPropertyValue(property).trim();
}


// Function to extract book, chapter, and verse from a reference string
function extractBookChapterVerse(reference) {
  // Regular expression pattern to capture book name, chapter, and verse
  // const regex = /^([\d\s\w\u00c0-\u017f]+)\s(\d+):(\d+)$/u;
  const regex = /^([\d\s\w\u00c0-\u017f]+(?:\s\([\d\s\w\u00c0-\u017f]+\))?)\s(\d+):(\d+)$/iu;

  const match = reference.match(regex);

  if (!match) {
    throw new Error("Invalid reference format");
  }

  if (match) {
    const book = match[1].trim();
    const chapter = match[2];
    const verse = match[3];
    return { book, chapter, verse };
  } else {
    throw new Error("Invalid reference format");
  }
}


function generateIndexForBibleBooks(){
  bible_data.forEach(verse => {
    try {
      const { book, chapter, verse: verseNum } = extractBookChapterVerse(verse.name);

      if (!bibleIndex.has(book)) {
        bibleIndex.set(book, new Map());
      }

      let bookIndex = bibleIndex.get(book);

      if (!bookIndex.has(chapter)) {
        bookIndex.set(chapter, new Map());
      }

      bookIndex.get(chapter).set(verseNum, verse.verse);
    } catch (error) {
      console.error(error.message);
    }
  });
}

function getSavedBible(){
  let savedBibleVerse = localStorage.getItem('savedBibleVerse');
  savedBibleQuery = savedBibleVerse.split(',');
  while (bblVerseDiv.firstChild) {
      bblVerseDiv.removeChild(bblVerseDiv.firstChild);
  }
  getBibeAri(savedBibleQuery);
}
