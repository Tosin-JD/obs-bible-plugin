const englishBooks = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
  "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
  "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel",
  "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
  "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
  "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon",
  "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
];

var localToEnglishBookMap = new Map();
var englishToLocalBookMap = new Map();

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
  if (!reference) throw new Error("Invalid reference format");
  const trimmed = reference.trim();
  const lastColon = trimmed.lastIndexOf(':');
  if (lastColon === -1) throw new Error("Invalid reference format");

  const bookAndChapter = trimmed.substring(0, lastColon).trim();
  const verse = trimmed.substring(lastColon + 1).trim();

  const lastSpace = bookAndChapter.lastIndexOf(' ');
  if (lastSpace === -1) throw new Error("Invalid reference format");

  const book = bookAndChapter.substring(0, lastSpace).trim();
  const chapter = bookAndChapter.substring(lastSpace + 1).trim();

  if (!book || !chapter || !verse || isNaN(parseInt(chapter, 10)) || isNaN(parseInt(verse, 10))) {
    throw new Error("Invalid reference format");
  }

  return { book, chapter, verse };
}


function generateIndexForBibleBooks(){
  localToEnglishBookMap.clear();
  englishToLocalBookMap.clear();
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

      // Populate bilingual book maps
      const bookIdx = parseInt(verse.ari.split(':')[0], 10);
      const englishBookName = englishBooks[bookIdx];
      if (englishBookName) {
        localToEnglishBookMap.set(book.toLowerCase(), englishBookName.toLowerCase());
        englishToLocalBookMap.set(englishBookName.toLowerCase(), book.toLowerCase());
      }
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

function fuzzySearchWeight(word, text, threshold = 2) {
  word = word.toLowerCase(); // Normalize input
  const words = text.toLowerCase().split(/\s+/); // Normalize and split text
  
  if (text.toLowerCase().includes(word)) {
      return 100; // Exact substring match gets highest score
  }

  let bestWeight = 0;
  
  words.forEach(t => {
    const maxThreshold = Math.ceil(t.length * 0.4); // Allow 40% of the word length as errors
    const dist = levenshteinDistance(word, t);
    const allowed = Math.max(threshold, maxThreshold);
    
    if (dist <= allowed) {
        // Calculate weight: lower distance = higher weight
        // If distance is 0 (exact word), weight is 100
        // Weight decreases as dist increases
        let weight = Math.max(10, 100 - (dist * (100 / allowed)));
        if (weight > bestWeight) bestWeight = weight;
    }
  });
  
  return bestWeight;
}

function fuzzySearch(word, text, threshold = 2) {
  return fuzzySearchWeight(word, text, threshold) > 0;
}


