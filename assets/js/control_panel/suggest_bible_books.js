const bibleInput = document.getElementById("bible-input");
const suggestionsList = document.getElementById("suggestions");
const bookPickerButton = document.getElementById("bible-book-picker-button");
const bookPicker = document.getElementById("bible-book-picker");
const searchGroup = bibleInput.closest(".search-group");
let selectedSuggestionIndex = -1;
let pickerBook = "";
let pickerChapter = "";

var bibleIndex = new Map();

const bibleBookAbbreviations = {
  Genesis: "Gen", Exodus: "Exo", Leviticus: "Lev", Numbers: "Num", Deuteronomy: "Deu",
  Joshua: "Jos", Judges: "Jdg", Ruth: "Rut", "1 Samuel": "1Sa", "2 Samuel": "2Sa",
  "1 Kings": "1Ki", "2 Kings": "2Ki", "1 Chronicles": "1Ch", "2 Chronicles": "2Ch",
  Ezra: "Ezr", Nehemiah: "Neh", Esther: "Est", Job: "Job", Psalms: "Psa", Proverbs: "Pro",
  Ecclesiastes: "Ecc", "Song of Solomon": "Sng", Isaiah: "Isa", Jeremiah: "Jer",
  Lamentations: "Lam", Ezekiel: "Eze", Daniel: "Dan", Hosea: "Hos", Joel: "Joe", Amos: "Amo",
  Obadiah: "Oba", Jonah: "Jon", Micah: "Mic", Nahum: "Nah", Habakkuk: "Hab",
  Zephaniah: "Zep", Haggai: "Hag", Zechariah: "Zec", Malachi: "Mal", Matthew: "Mat",
  Mark: "Mar", Luke: "Luk", John: "Joh", Acts: "Act", Romans: "Rom", "1 Corinthians": "1Co",
  "2 Corinthians": "2Co", Galatians: "Gal", Ephesians: "Eph", Philippians: "Php",
  Colossians: "Col", "1 Thessalonians": "1Th", "2 Thessalonians": "2Th", "1 Timothy": "1Ti",
  "2 Timothy": "2Ti", Titus: "Tit", Philemon: "Phm", Hebrews: "Heb", James: "Jas",
  "1 Peter": "1Pe", "2 Peter": "2Pe", "1 John": "1Jo", "2 John": "2Jo", "3 John": "3Jo",
  Jude: "Jud", Revelation: "Rev"
};

function updateInput(index) {
  if (index < 0 || index >= suggestionsList.children.length) return;
  Array.from(suggestionsList.children).forEach(item => item.classList.remove("activated"));
  const selected = suggestionsList.children[index];
  bibleInput.value = `${selected.dataset.book || selected.textContent} `;
  bibleInput.focus();
  selected.classList.add("activated");
  suggestionsList.scrollTop = selected.offsetTop - selected.offsetHeight * 2;
}

function setPickerExpanded(expanded) {
  bookPickerButton.setAttribute("aria-expanded", String(expanded));
  bookPicker.setAttribute("aria-hidden", String(!expanded));
}

function isPickerReady() {
  return typeof bibleIndex !== "undefined" && bibleIndex.size > 0 &&
    typeof englishBooks !== "undefined" && typeof englishToLocalBookMap !== "undefined";
}

function getIndexedBook(bookName) {
  if (!bookName) return null;
  if (bibleIndex.has(bookName)) return bookName;
  const normalizedName = removeAccents(bookName).toLowerCase();
  return Array.from(bibleIndex.keys()).find(name => removeAccents(name).toLowerCase() === normalizedName) || null;
}

function closeBookPicker() {
  bookPicker.innerHTML = "";
  bookPicker.classList.remove("is-open");
  pickerBook = "";
  pickerChapter = "";
  setPickerExpanded(false);
}

function closeSuggestions() {
  suggestionsList.innerHTML = "";
  suggestionsList.classList.remove("is-open");
  selectedSuggestionIndex = -1;
}

function getOrderedBooks() {
  if (!isPickerReady()) return [];
  return englishBooks.flatMap(englishBook => {
    const localBook = englishToLocalBookMap.get(englishBook.toLowerCase());
    if (localBook && bibleIndex.has(localBook) && bibleIndex.get(localBook)?.size) {
      return [{ englishBook, localBook }];
    }
    // English translations may use canonical book names without a populated map.
    if (bibleIndex.has(englishBook) && bibleIndex.get(englishBook)?.size) return [{ englishBook, localBook: englishBook }];
    return [];
  });
}

function renderBookPicker(mode) {
  closeSuggestions();
  if (!isPickerReady()) {
    closeBookPicker();
    return;
  }
  bookPicker.innerHTML = "";
  bookPicker.classList.add("is-open");
  setPickerExpanded(true);

  const heading = document.createElement("div");
  heading.className = "picker-heading";
  heading.id = "picker-heading";
  const grid = document.createElement("div");
  grid.className = "picker-grid";
  grid.setAttribute("role", "group");

  let options;
  if (mode === "books") {
    heading.textContent = "Choose a book";
    options = getOrderedBooks().flatMap(book => {
      const option = {
        label: bibleBookAbbreviations[book.englishBook],
        value: book.localBook,
        accessibleName: book.localBook === book.englishBook ? book.englishBook : `${book.localBook} (${book.englishBook})`
      };
      return book.englishBook === "Malachi" ? [option, { isDivider: true }] : [option];
    }).filter(option => option.isDivider || option.label);
  } else if (mode === "chapters") {
    const indexedBook = getIndexedBook(pickerBook);
    if (!indexedBook || !bibleIndex.get(indexedBook)?.size) { closeBookPicker(); return; }
    pickerBook = indexedBook;
    const englishBook = localToEnglishBookMap.get(pickerBook.toLowerCase());
    const formattedEnglishBook = englishBook?.replace(/\b\w/g, character => character.toUpperCase());
    heading.textContent = `Choose a chapter · ${pickerBook}${formattedEnglishBook && formattedEnglishBook !== pickerBook ? ` (${formattedEnglishBook})` : ""}`;
    options = Array.from(bibleIndex.get(indexedBook)?.keys() || [])
      .sort((a, b) => Number(a) - Number(b))
      .map(chapter => ({ label: chapter, value: chapter, accessibleName: `Chapter ${chapter}` }));
  } else {
    const indexedBook = getIndexedBook(pickerBook);
    const chapters = indexedBook && bibleIndex.get(indexedBook);
    if (!chapters?.get(String(pickerChapter))?.size) { closeBookPicker(); return; }
    pickerBook = indexedBook;
    heading.textContent = `Choose a verse · ${pickerBook} ${pickerChapter}`;
    const verseNumbers = new Set();
    for (const verseKey of chapters.get(String(pickerChapter)).keys()) {
      const verseRange = String(verseKey).match(/^(\d+)(?:-(\d+))?$/);
      if (!verseRange) {
        console.error(`Ignoring invalid verse index "${verseKey}" for ${pickerBook} ${pickerChapter}.`);
        continue;
      }
      const firstVerse = Number(verseRange[1]);
      const lastVerse = Number(verseRange[2] || verseRange[1]);
      for (let verse = firstVerse; verse <= lastVerse; verse++) {
        verseNumbers.add(String(verse));
      }
    }
    options = Array.from(verseNumbers)
      .sort((a, b) => Number(a) - Number(b))
      .map(verse => ({ label: verse, value: verse, accessibleName: `Verse ${verse}` }));
  }

  bookPicker.append(heading, grid);
  bookPicker.setAttribute("aria-labelledby", heading.id);
  if (!options.length) { closeBookPicker(); return; }
  options.forEach(option => {
    if (option.isDivider) {
      const divider = document.createElement("div");
      divider.className = "picker-divider";
      divider.setAttribute("role", "separator");
      divider.setAttribute("aria-label", "New Testament");
      grid.appendChild(divider);
      return;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "picker-option";
    button.textContent = option.label;
    button.setAttribute("aria-label", option.accessibleName || option.label);
    button.title = option.accessibleName || option.label;
    button.addEventListener("click", () => {
      if (mode === "books") {
        pickerBook = option.value;
        bibleInput.value = pickerBook;
        renderBookPicker("chapters");
        bookPicker.querySelector(".picker-option")?.focus();
      } else if (mode === "chapters") {
        pickerChapter = String(option.value);
        bibleInput.value = `${pickerBook} ${pickerChapter}`;
        renderBookPicker("verses");
        bookPicker.querySelector(".picker-option")?.focus();
      } else {
        openPickedVerse(String(option.value));
      }
    });
    grid.appendChild(button);
  });
}

function openPickedVerse(verseNumber) {
  const book = getIndexedBook(pickerBook);
  const chapter = String(pickerChapter);
  const verseEntries = book && bibleIndex.get(book)?.get(chapter);
  const selectedVerse = Number(verseNumber);
  const hasVerse = verseEntries && Array.from(verseEntries.keys()).some(key => {
    const range = String(key).match(/^(\d+)(?:-(\d+))?$/);
    return range && selectedVerse >= Number(range[1]) && selectedVerse <= Number(range[2] || range[1]);
  });
  if (!book || !hasVerse || typeof bible_data === "undefined" || !Array.isArray(bible_data)) {
    console.error(`Unable to open Bible verse ${pickerBook} ${chapter}:${verseNumber}; it is not present in the active translation.`);
    return;
  }

  const selectedData = bible_data.find(item => {
    const parsed = parseBookChapterVerse(item.name);
    return parsed && removeAccents(parsed.bookName) === removeAccents(book) &&
      Number(parsed.chapterNum) === Number(chapter) &&
      selectedVerse >= parsed.startVerse && selectedVerse <= parsed.endVerse;
  });
  if (!selectedData) {
    console.error(`Unable to resolve Bible verse ${book} ${chapter}:${verseNumber} in the active translation.`);
    return;
  }

  const reference = `${book} ${chapter}:${verseNumber}`;
  bibleInput.value = reference;
  closeBookPicker();
  bibleInput.focus();

  searchBible(`${book} ${chapter}`, bible_data);
  displayBible();

  const targetId = selectedData?.name.replace(/:/g, "-").replace(/\s/g, "").toLowerCase();
  const verseContainer = document.getElementById("bible-verse");
  const targetElement = targetId && document.getElementById(targetId);
  if (!targetElement || !verseContainer.contains(targetElement)) {
    console.error(`Displayed chapter does not contain the selected verse ${reference}.`);
    return;
  }

  const renderedVerses = Array.from(verseContainer.querySelectorAll("p"));
  const selectedIndex = renderedVerses.indexOf(targetElement);
  if (selectedIndex === -1) {
    console.error(`Could not locate the rendered verse ${reference}.`);
    return;
  }
  renderedVerses.forEach(verse => verse.classList.remove("selected"));
  targetElement.classList.add("selected");
  currentVerseIndex = selectedIndex;
  requestAnimationFrame(() => targetElement.scrollIntoView({ behavior: "smooth", block: "center" }));
}

bookPickerButton.addEventListener("click", () => {
  if (bookPicker.classList.contains("is-open")) {
    closeBookPicker();
    return;
  }
  if (isPickerReady()) {
    renderBookPicker("books");
    bookPicker.querySelector(".picker-option")?.focus();
  }
});

bibleInput.addEventListener("input", () => {
  closeBookPicker();
  const inputValue = removeAccents(bibleInput.value);
  const filteredBooks = Array.from(bibleIndex.keys()).filter(book => {
    const localName = removeAccents(book);
    const englishName = removeAccents(localToEnglishBookMap.get(book.toLowerCase()) || "");
    return fuzzySearch(inputValue, localName) || (englishName && fuzzySearch(inputValue, englishName));
  });

  suggestionsList.innerHTML = "";
  suggestionsList.classList.toggle("is-open", inputValue.length > 0);
  if (inputValue.length) {
    filteredBooks.forEach((book, index) => {
      const item = document.createElement("li");
      item.dataset.book = book;
      const englishName = localToEnglishBookMap.get(book.toLowerCase());
      item.textContent = englishName && englishName !== book.toLowerCase()
        ? `${book} (${englishName.charAt(0).toUpperCase()}${englishName.slice(1)})`
        : book;
      item.addEventListener("click", () => {
        updateInput(index);
        closeSuggestions();
      });
      suggestionsList.appendChild(item);
    });
  }
  selectedSuggestionIndex = -1;
});

bibleInput.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    if (bookPicker.classList.contains("is-open")) closeBookPicker();
    closeSuggestions();
    bookPickerButton.focus();
    return;
  }
  if (!suggestionsList.children.length) return;
  if (event.key === "ArrowDown") {
    event.preventDefault();
    selectedSuggestionIndex = (selectedSuggestionIndex + 1) % suggestionsList.children.length;
    updateInput(selectedSuggestionIndex);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    selectedSuggestionIndex = (selectedSuggestionIndex - 1 + suggestionsList.children.length) % suggestionsList.children.length;
    updateInput(selectedSuggestionIndex);
  } else if (event.key === "Enter") {
    closeSuggestions();
  }
});

bookPicker.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    event.preventDefault();
    closeBookPicker();
    bookPickerButton.focus();
  }
});

document.addEventListener("click", event => {
  const eventPath = event.composedPath();
  if (!eventPath.includes(bookPicker) && !eventPath.includes(bookPickerButton) && !eventPath.includes(searchGroup)) {
    closeBookPicker();
  }
  if (!eventPath.includes(suggestionsList) && event.target !== bibleInput) closeSuggestions();
});

document.getElementById("bible-version")?.addEventListener("change", () => {
  closeBookPicker();
  closeSuggestions();
});

// Translation scripts load asynchronously; expose a small lifecycle hook so a
// picker opened before the first index build cannot retain stale selection.
document.addEventListener("bible-index-updated", () => {
  closeBookPicker();
  closeSuggestions();
});

function displayBibleSuggestions() {
  const bibleVerses = Array.from(suggestionsList.querySelectorAll("li"));
  bibleVerses.forEach((verse, index) => {
    verse.addEventListener("click", event => {
      if (event.target.tagName === "LI") {
        const message = event.target.innerHTML;
        channel.postMessage(message);
        event.target.classList.add("selected");
        historyOfBibleVerse.push({ name: event.target.id, verse: message });
        historyOfText.push(message);
        if (historyOfBibleVerse.length > 20) historyOfBibleVerse.shift();
      }
      bibleVerses.forEach((item, itemIndex) => {
        if (itemIndex !== index) item.classList.remove("selected");
      });
    });
  });
}
