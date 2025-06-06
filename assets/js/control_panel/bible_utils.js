const extractBookChapterVerse = (reference) => {
  const regex = /^([\d\s\w\u00c0-\u017f]+(?:\s\([\d\s\w\u00c0-\u017f]+\))?)\s(\d+):(\d+)$/iu;
  const match = reference.match(regex);

  if (!match) throw new Error("Invalid reference format");

  const [_, bookRaw, chapter, verse] = match;
  return {
    book: bookRaw.trim(),
    chapter,
    verse,
  };
};

const parseSavedBibleVerse = (verseString) => verseString.split(',');

const getSavedBiblePure = (verseString) => {
    return {
        savedBibleQuery: parseSavedBibleVerse(verseString),
    };
};

function getSavedBible() {
    const savedBibleVerse = localStorage.getItem('savedBibleVerse');

    if (!savedBibleVerse) return;

    const { savedBibleQuery } = getSavedBiblePure(savedBibleVerse);

    // Clear existing children from the verse container
    while (bblVerseDiv.firstChild) {
        bblVerseDiv.removeChild(bblVerseDiv.firstChild);
    }

    // Pass to your existing logic
    getBibeAri(savedBibleQuery);
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
