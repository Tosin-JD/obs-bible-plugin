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

// Function to calculate Levenshtein Distance (fuzzy matching)
function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  // Initialize the matrix
  for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
  }

  // Fill the matrix
  for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
          if (b.charAt(i - 1) === a.charAt(j - 1)) {
              matrix[i][j] = matrix[i - 1][j - 1];
          } else {
              matrix[i][j] = Math.min(
                  matrix[i - 1][j - 1] + 1, // Substitution
                  matrix[i][j - 1] + 1,    // Insertion
                  matrix[i - 1][j] + 1     // Deletion
              );
          }
      }
  }

  return matrix[b.length][a.length];
}

function fuzzySearch(word, text, threshold = 2) {
  word = word.toLowerCase(); // Normalize input
  const words = text.toLowerCase().split(/\s+/); // Normalize and split text

  return words.some(t => {
    const maxThreshold = Math.ceil(t.length * 0.4); // Allow 40% of the word length as errors
    return t.includes(word) || levenshteinDistance(word, t) <= Math.max(threshold, maxThreshold);
  });
}


