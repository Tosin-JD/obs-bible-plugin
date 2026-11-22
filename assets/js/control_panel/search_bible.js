
const submitButton = document.getElementById("bible-submit");
const inputField = document.getElementById("bible-input");
const BIBLE_REFERENCE_BASE_FONT_SIZE = 16;

function removeAccents(str) {
  if (!str) return "";
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function formatBibleReferenceInput(value) {
  if (value == null) return "";

  const rawValue = String(value).replace(/\s+/g, " ");
  if (!rawValue.trim()) return "";

  const cleanValue = rawValue.trim();
  const bookNames = [
    ...(typeof englishBooks !== "undefined" ? englishBooks : []),
    ...(typeof bibleIndex !== "undefined" ? Array.from(bibleIndex.keys()) : [])
  ];
  const matchedBook = bookNames.find(book =>
    removeAccents(cleanValue).toLowerCase() === removeAccents(book).toLowerCase()
  );
  if (matchedBook) return `${matchedBook} `;

  // Add reference punctuation only for a known book, so ordinary text searches
  // that happen to end in a number are left alone.
  const chapterMatch = cleanValue.match(/^(.+)\s+(\d+)$/);
  const verseMatch = cleanValue.match(/^(.+\s+\d+):(\d+)$/);
  const knownBooks = bookNames.map(book => removeAccents(book).toLowerCase());
  if (chapterMatch && knownBooks.includes(removeAccents(chapterMatch[1]).toLowerCase())) {
    return `${cleanValue}:`;
  }
  if (verseMatch && knownBooks.includes(removeAccents(verseMatch[1].replace(/\s+\d+$/, "")).toLowerCase())) {
    return `${cleanValue}-`;
  }

  return cleanValue;
}

function sanitizeBibleReferenceForSearch(value) {
  if (value == null) return "";

  let cleaned = String(value).replace(/\s+/g, " ").replace(/\s*:\s*/g, ":").replace(/\s*-\s*/g, "-").trim();
  if (!cleaned) return "";

  while (cleaned.endsWith(":") || cleaned.endsWith("-")) {
    cleaned = cleaned.slice(0, -1).trim();
  }

  return cleaned;
}

function ensureEndsWithColon(str) {
    if (str.includes(':')) {
        return str;
    } else if (!str.endsWith(':')) {
        str += ':';
    }
    return str;
}

function parseBookChapterVerse(name) {
  if (!name) return null;
  const trimmed = name.trim();
  const lastColonIndex = trimmed.lastIndexOf(':');
  if (lastColonIndex === -1) return null;
  const bookAndChapter = trimmed.substring(0, lastColonIndex).trim();
  const verseStr = trimmed.substring(lastColonIndex + 1).trim();
  const lastSpaceIndex = bookAndChapter.lastIndexOf(' ');
  if (lastSpaceIndex === -1) return null;
  const bookName = bookAndChapter.substring(0, lastSpaceIndex).trim();
  const chapterNum = parseInt(bookAndChapter.substring(lastSpaceIndex + 1).trim(), 10);
  if (isNaN(chapterNum)) return null;

  let startVerse = 1;
  let endVerse = 1;
  if (verseStr.includes('-')) {
    const parts = verseStr.split('-').map(s => parseInt(s.trim(), 10));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      startVerse = parts[0];
      endVerse = parts[1];
    } else {
      startVerse = parseInt(verseStr, 10);
      endVerse = startVerse;
    }
  } else {
    startVerse = parseInt(verseStr, 10);
    endVerse = startVerse;
  }

  if (isNaN(startVerse)) return null;
  return { bookName, chapterNum, verseNum: startVerse, startVerse, endVerse };
}

function findEnglishBookMatch(query) {
  const cleanQuery = removeAccents(query).trim();
  const sortedBooks = englishBooks.map((name, index) => ({ name, index }))
                                  .sort((a, b) => b.name.length - a.name.length);
  for (let i = 0; i < sortedBooks.length; i++) {
    const book = sortedBooks[i];
    const bookLower = removeAccents(book.name);
    if (cleanQuery.startsWith(bookLower)) {
      const nextChar = cleanQuery.charAt(bookLower.length);
      if (nextChar === "" || nextChar === " " || nextChar === ":" || (nextChar >= "0" && nextChar <= "9")) {
        return book;
      }
    }
    const noSpaceBookLower = bookLower.replace(/\s+/g, "");
    if (cleanQuery.startsWith(noSpaceBookLower)) {
      const nextChar = cleanQuery.charAt(noSpaceBookLower.length);
      if (nextChar === "" || nextChar === " " || nextChar === ":" || (nextChar >= "0" && nextChar <= "9")) {
        return book;
      }
    }
  }
  return null;
}

function translateEnglishBookToLocal(engBookIdx, bible_data) {
  const prefix = engBookIdx + ":";
  const matchingVerse = bible_data.find(v => v.ari && v.ari.startsWith(prefix));
  if (!matchingVerse) return null;

  const parsed = parseBookChapterVerse(matchingVerse.name);
  return parsed ? parsed.bookName : null;
}

function findNearestVerseByName(queryName, bible_data) {
  const parsedTarget = parseBookChapterVerse(queryName);
  if (!parsedTarget) return null;
  const { bookName, chapterNum, verseNum: targetVerse } = parsedTarget;
  const targetNorm = removeAccents(bookName);

  const bookVerses = [];
  for (let i = 0; i < bible_data.length; i++) {
    const parsed = parseBookChapterVerse(bible_data[i].name);
    if (parsed && removeAccents(parsed.bookName) === targetNorm) {
      if (parsed.chapterNum === chapterNum && targetVerse >= parsed.startVerse && targetVerse <= parsed.endVerse) {
        return bible_data[i];
      }
      bookVerses.push({
        verse: bible_data[i],
        chapter: parsed.chapterNum,
        startVerse: parsed.startVerse,
        endVerse: parsed.endVerse
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
  const precedingVerses = chapterVerses.filter(v => v.startVerse <= targetVerse);
  if (precedingVerses.length > 0) {
    precedingVerses.sort((a, b) => b.startVerse - a.startVerse);
    return precedingVerses[0].verse;
  }

  chapterVerses.sort((a, b) => a.startVerse - b.startVerse);
  return chapterVerses[0] ? chapterVerses[0].verse : null;
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
      const parsed = parseBookChapterVerse(bible_data[i].name);
      const startV = parsed ? parsed.startVerse : parseInt(vParts[2], 10);
      const endV = parsed ? parsed.endVerse : startV;

      if (parseInt(vParts[1], 10) === chapterNum && targetVerse >= startV && targetVerse <= endV) {
        return bible_data[i];
      }

      bookVerses.push({
        verse: bible_data[i],
        chapter: parseInt(vParts[1], 10),
        startVerse: startV,
        endVerse: endV
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
  const precedingVerses = chapterVerses.filter(v => v.startVerse <= targetVerse);
  if (precedingVerses.length > 0) {
    precedingVerses.sort((a, b) => b.startVerse - a.startVerse);
    return precedingVerses[0].verse;
  }

  chapterVerses.sort((a, b) => a.startVerse - b.startVerse);
  return chapterVerses[0] ? chapterVerses[0].verse : null;
}

function getBibleDisplayPreferences() {
  const lineLayout = localStorage.getItem("obs-bible-reference-line-layout");
  const savedReferenceAlignment = localStorage.getItem("obs-bible-reference-alignment");
  const bookCase = localStorage.getItem("obs-bible-reference-book-case");
  const position = localStorage.getItem("obs-bible-reference-position");
  const savedReferenceFont = localStorage.getItem("obs-bible-reference-font-family") || "";
  const referenceFontSelect = document.getElementById("bible-reference-font-family");
  const referenceFont = referenceFontSelect &&
    Array.from(referenceFontSelect.options).some(option => option.value === savedReferenceFont)
    ? savedReferenceFont
    : "";
  const savedReferenceBackgroundColor = localStorage.getItem("obs-bible-reference-background-color");
  const referenceBackgroundColor = /^#[0-9A-Fa-f]{6}$/.test(savedReferenceBackgroundColor || "")
    ? savedReferenceBackgroundColor
    : "";
  const getReferenceNumber = (key, min, max, fallback) => {
    const savedValue = localStorage.getItem(key);
    const numericValue = Number(savedValue);
    return savedValue !== null && Number.isFinite(numericValue)
      ? Math.min(max, Math.max(min, numericValue))
      : fallback;
  };

  return {
    lineLayout: lineLayout === "separate-line" ? lineLayout : "same-line",
    referenceAlignment: ["left", "center", "right", "justify"].includes(savedReferenceAlignment)
      ? savedReferenceAlignment
      : "left",
    bookCase: bookCase === "title-case" ? bookCase : "uppercase",
    showTranslation: localStorage.getItem("obs-bible-reference-show-translation") === "true",
    position: position === "below" ? position : "above",
    referenceFont,
    referenceBackgroundColor,
    referenceBackgroundOpacity: getReferenceNumber("obs-bible-reference-background-opacity", 0, 100, 100),
    referencePadding: getReferenceNumber("obs-bible-reference-padding", 0, 80, 0),
    referenceMargin: getReferenceNumber("obs-bible-reference-margin", 0, 100, 0),
    referenceRadius: getReferenceNumber("obs-bible-reference-radius", 0, 80, 0)
  };
}

function titleCaseBookName(bookName) {
  return bookName
    .toLocaleLowerCase()
    .split(/(\s+|-|')/)
    .map(part => {
      if (!part || /^\s+$|^-|^'$/.test(part)) return part;
      return part.charAt(0).toLocaleUpperCase() + part.slice(1);
    })
    .join("");
}

function formatBibleReference(verseName, preferences) {
  const parsed = parseBookChapterVerse(verseName);
  let reference = verseName.trim();
  if (parsed) {
    const colonIndex = verseName.lastIndexOf(":");
    const verseRange = verseName.slice(colonIndex + 1).trim();
    const bookName = preferences.bookCase === "uppercase"
      ? parsed.bookName.toLocaleUpperCase()
      : titleCaseBookName(parsed.bookName);
    reference = `${bookName} ${parsed.chapterNum}:${verseRange}`;
  } else if (preferences.bookCase === "uppercase") {
    reference = reference.toLocaleUpperCase();
  }

  if (preferences.showTranslation) {
    const translationSelect = document.getElementById("bible-version");
    const selectedOption = translationSelect?.options[translationSelect.selectedIndex];
    const abbreviation = selectedOption?.dataset.abbreviation;
    if (abbreviation) {
      reference += ` (${abbreviation})`;
    } else {
      console.error("The selected Bible translation is missing its reference abbreviation.");
    }
  }
  return reference;
}

function createBibleVerseElement(verseObj, preferences, renderTarget = "preview") {
  const pElement = document.createElement("p");
  pElement.classList.add("verse", "bible-verse");
  pElement.id = verseObj.name.replace(/:/g, "-").replace(/\s/g, "").toLowerCase();
  pElement.dataset.ari = verseObj.ari;

  const messageElement = document.createElement("span");
  messageElement.classList.add("bible-message");
  if (renderTarget === "browser") {
    messageElement.classList.add(
      `bible-layout-${preferences.lineLayout}`,
      `bible-position-${preferences.position}`
    );
  }
  const referenceElement = document.createElement("span");
  referenceElement.classList.add("bible-reference");
  if (renderTarget === "browser" && preferences.lineLayout === "separate-line") {
    referenceElement.classList.add(`bible-reference-align-${preferences.referenceAlignment}`);
  }
  referenceElement.textContent = formatBibleReference(verseObj.name, preferences);
  if (renderTarget === "browser" && preferences.referenceFont) {
    referenceElement.style.fontFamily = preferences.referenceFont;
  }
  if (renderTarget === "browser") {
    if (preferences.referenceBackgroundColor) {
      referenceElement.style.backgroundColor = hexToRgba(
        preferences.referenceBackgroundColor,
        preferences.referenceBackgroundOpacity / 100
      );
    }
    referenceElement.style.padding = `${preferences.referencePadding / BIBLE_REFERENCE_BASE_FONT_SIZE}em`;
    referenceElement.style.margin = `${preferences.referenceMargin / BIBLE_REFERENCE_BASE_FONT_SIZE}em`;
    referenceElement.style.borderRadius = `${preferences.referenceRadius / BIBLE_REFERENCE_BASE_FONT_SIZE}em`;
  }

  const contentElement = document.createElement("span");
  contentElement.classList.add("bible-content");
  contentElement.textContent = verseObj.verse;

  if (renderTarget === "preview" || preferences.position === "above") {
    messageElement.appendChild(referenceElement);
    messageElement.appendChild(document.createTextNode(" "));
    messageElement.appendChild(contentElement);
  } else {
    messageElement.appendChild(contentElement);
    if (preferences.lineLayout === "same-line") {
      messageElement.appendChild(document.createTextNode(" "));
    }
    messageElement.appendChild(referenceElement);
  }

  pElement.appendChild(messageElement);
  if (renderTarget === "preview") {
    const browserElement = createBibleVerseElement(verseObj, preferences, "browser");
    pElement.dataset.browserMessageHtml = browserElement.innerHTML;
  }
  return pElement;
}

function getBibleVerseOutputMessage(verseElement) {
  return verseElement?.dataset.browserMessageHtml || verseElement?.innerHTML || "";
}

function searchBible(query, bible_data) {
  if (!query || !bible_data || bible_data.length === 0) return;

  // Translate English book names to the active translation's local book name
  const englishMatch = findEnglishBookMatch(query);
  if (englishMatch) {
    const localBookName = translateEnglishBookToLocal(englishMatch.index, bible_data);
    if (localBookName && removeAccents(localBookName) !== removeAccents(englishMatch.name)) {
      let matchLen = englishMatch.name.length;
      const cleanQ = removeAccents(query).trim();
      const noSpaceEng = removeAccents(englishMatch.name).replace(/\s+/g, "");
      if (cleanQ.startsWith(noSpaceEng) && !cleanQ.startsWith(removeAccents(englishMatch.name))) {
        matchLen = noSpaceEng.length;
      }
      const remainder = query.trim().substring(matchLen).trim();
      query = localBookName + (remainder ? " " + remainder : "");
    }
  }

  bblVerseDiv.innerHTML = "";
  let savedBibleVerse = [];
  const displayPreferences = getBibleDisplayPreferences();

  // Normalize spacing around colons and dashes and drop incomplete trailing punctuation
  let normQuery = sanitizeBibleReferenceForSearch(query);
  const normQueryLower = normQuery.toLowerCase();
  const accentlessQuery = removeAccents(normQueryLower);

  function appendVerseElement(verseObj) {
    if (!verseObj || !verseObj.ari) return;
    if (!savedBibleVerse.includes(verseObj.ari)) {
      savedBibleVerse.push(verseObj.ari);
      bblVerseDiv.appendChild(createBibleVerseElement(verseObj, displayPreferences));
    }
  }

  // 1. Verse Range Search (e.g. "John 1:1-5")
  if (normQueryLower.includes('-') && normQueryLower.includes(':')) {
    const colonIndex = normQuery.lastIndexOf(':');
    const bookAndChapter = normQuery.substring(0, colonIndex).trim();
    const verseRangeStr = normQuery.substring(colonIndex + 1).trim();
    const rangeParts = verseRangeStr.split('-').map(s => parseInt(s.trim(), 10));

    if (rangeParts.length === 2 && !isNaN(rangeParts[0]) && !isNaN(rangeParts[1])) {
      const startVerse = rangeParts[0];
      const endVerse = rangeParts[1];

      for (let i = startVerse; i <= endVerse; i++) {
        const targetRef = `${bookAndChapter}:${i}`;
        const targetNorm = removeAccents(targetRef.toLowerCase());

        let matchingVerse = bible_data.find(v => removeAccents(v.name.toLowerCase()) === targetNorm);
        if (!matchingVerse) {
          matchingVerse = findNearestVerseByName(targetRef, bible_data);
        }
        if (matchingVerse) {
          appendVerseElement(matchingVerse);
        }
      }
    }
  }
  // 2. Specific Verse Search (e.g. "John 1:1")
  else if (normQueryLower.includes(':')) {
    let matched = false;

    for (let i = 0; i < bible_data.length; i++) {
      const vNameNorm = removeAccents(bible_data[i].name.toLowerCase());
      const vVerseNorm = removeAccents(bible_data[i].verse.toLowerCase());

      if (vNameNorm === accentlessQuery || vVerseNorm === accentlessQuery) {
        matched = true;
        appendVerseElement(bible_data[i]);
      }
    }

    if (!matched) {
      const nearestVerse = findNearestVerseByName(normQuery, bible_data);
      if (nearestVerse) {
        appendVerseElement(nearestVerse);
      }
    }
  }
  // 3. Chapter Search (e.g. "John 1")
  else if (/\d/.test(normQueryLower)) {
    const accentlessWithColon = accentlessQuery + ":";

    for (let i = 0; i < bible_data.length; i++) {
      const vNameNorm = removeAccents(bible_data[i].name.toLowerCase());

      if (vNameNorm.startsWith(accentlessWithColon) || vNameNorm.includes(" " + accentlessWithColon)) {
        appendVerseElement(bible_data[i]);
      }
    }
  }
  // 4. Book-Only Search (e.g. "John" -> displays Chapter 1)
  else {
    const targetBookNorm = accentlessQuery;
    let matchedBookVerses = [];

    for (let i = 0; i < bible_data.length; i++) {
      const parsed = parseBookChapterVerse(bible_data[i].name);
      if (parsed && removeAccents(parsed.bookName.toLowerCase()) === targetBookNorm) {
        if (parsed.chapterNum === 1) {
          matchedBookVerses.push(bible_data[i]);
        }
      }
    }

    if (matchedBookVerses.length > 0) {
      matchedBookVerses.forEach(v => appendVerseElement(v));
    } else {
      // 5. Keyword Search (e.g. "For God so loved the world")
      const searchWords = accentlessQuery.split(/\s+/).filter(w => w.length > 0);

      for (let i = 0; i < bible_data.length; i++) {
        const vNameNorm = removeAccents(bible_data[i].name.toLowerCase());
        const vVerseNorm = removeAccents(bible_data[i].verse.toLowerCase());

        const isMatchInName = searchWords.every(word => fuzzySearch(word, vNameNorm, 1));
        const isMatchInVerse = searchWords.every(word => vVerseNorm.includes(word));

        if (isMatchInName || isMatchInVerse) {
          appendVerseElement(bible_data[i]);
        }
      }
    }
  }

  localStorage.setItem('savedBibleVerse', savedBibleVerse);
}

function getBibeAri(query) {
  bblVerseDiv.innerHTML = "";
  let savedBibleVerse = [];
  const displayPreferences = getBibleDisplayPreferences();
  if (query) {
    savedBibleVerse = [];
    for (let i = 0; i < query.length; i++) {
      let matchingVerse = bible_data.find(bible_data => bible_data.ari === query[i]);
      if (!matchingVerse) {
        matchingVerse = findNearestVerseByAri(query[i], bible_data);
      }
      if (matchingVerse) {
        if (!savedBibleVerse.includes(matchingVerse.ari)) {
          savedBibleVerse.push(matchingVerse.ari);
          bblVerseDiv.appendChild(createBibleVerseElement(matchingVerse, displayPreferences));
        }
      }
    }
  }
  localStorage.setItem('savedBibleVerse', savedBibleVerse);
}

function refreshBibleDisplayPreferences() {
  if (!Array.isArray(bible_data) || bible_data.length === 0) return;

  const activeAri = window.lastDisplayedBibleVerseAri;
  getSavedBible();
  displayBible();

  if (!activeAri) return;
  const verses = Array.from(bblVerseDiv.querySelectorAll("p.bible-verse"));
  const activeVerseIndex = verses.findIndex(verse => verse.dataset.ari === activeAri);
  currentVerseIndex = activeVerseIndex;
  if (activeVerseIndex >= 0) {
    verses[activeVerseIndex].classList.add("selected");
  }
  if (window.lastSentMessageType === "bible") {
    const activeVerse = bible_data.find(verse => verse.ari === activeAri) ||
      findNearestVerseByAri(activeAri, bible_data);
    if (activeVerse) {
      const formattedVerse = createBibleVerseElement(activeVerse, getBibleDisplayPreferences(), "browser");
      sendMessage(channel, formattedVerse.innerHTML, "bible", activeVerse.ari, { animate: false });
    }
  }
}

document.addEventListener("bible-display-settings-change", refreshBibleDisplayPreferences);

submitButton.addEventListener("click", function (event) {
  event.preventDefault();

  const inputField = document.getElementById("bible-input");
  const searchQuery = sanitizeBibleReferenceForSearch(inputField.value);

  if (searchQuery !== "") {
    searchBible(searchQuery, bible_data);
    displayBible();
  }
});

inputField.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    const searchQuery = sanitizeBibleReferenceForSearch(inputField.value);

    if (searchQuery !== "") {
      searchBible(searchQuery, bible_data);
      displayBible();
    }
  }
});
