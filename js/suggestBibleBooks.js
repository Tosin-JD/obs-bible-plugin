const booksOfTheBible = [
  "Genesis ", "Exodus ", "Leviticus ", "Numbers ", "Deuteronomy ",
  "Joshua ", "Judges ", "Ruth ", "1 Samuel ", "2 Samuel ", "1 Kings ",
  "2 Kings ", "1 Chronicles ", "2 Chronicles ", "Ezra ", "Nehemiah ",
  "Esther ", "Job ", "Psalms ", "Proverbs ",
  "Ecclesiastes ", "Song of Solomon ", "Isaiah ", "Jeremiah ", "Lamentations ",
  "Ezekiel ", "Daniel ", "Hosea ", "Joel ","Amos ",
  "Obadiah ", "Jonah ", "Micah ", "Nahum ", "Habakkuk ",
  "Zephaniah ", "Haggai ", "Zechariah ", "Malachi ",
  "Matthew ", "Mark ", "Luke ", "John ", "Acts ",
  "Romans ", "1 Corinthians ", "2 Corinthians ", "Galatians ",
  "Ephesians ", "Philippians ", "Colossians ", "1 Thessalonians ", "2 Thessalonians ",
  "1 Timothy ",  "2 Timothy ", "Titus ", "Philemon ", "Hebrews", "James ", "1 Peter ",
  "2 Peter ", "1 John ", "2 John ", "3 John ", "Jude ", "Revelation "
];


const bibleInput = document.getElementById("bible-input");


const suggestionsList = document.getElementById("suggestions");
let selectedSuggestionIndex = -1; // Index of the currently selected suggestion


function updateInput(index) {
  if (index >= 0 && index < suggestionsList.children.length) {
    for (let item = suggestionsList.children.length - 1; item >= 0; item--) {
      suggestionsList.children[item].style.backgroundColor = "#222";
    }
    
    const selectedSuggestion = suggestionsList.children[index];
    bibleInput.value = selectedSuggestion.textContent;
    selectedSuggestion.style.backgroundColor = "#444";

    // Calculate the scroll position to ensure the selected item is visible
    const suggestionHeight = selectedSuggestion.offsetHeight;
    const scrollTop = selectedSuggestion.offsetTop - (suggestionHeight * 2); // Adjust as needed
    suggestionsList.scrollTop = scrollTop;
  }
}

bibleInput.addEventListener("input", function() {
  const inputValue = bibleInput.value.toLowerCase();
  const filteredBooks = booksOfTheBible.filter(book => book.toLowerCase().includes(inputValue));

  suggestionsList.innerHTML = "";

  filteredBooks.forEach((book, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = book;
    // Add a click event listener to each suggestion
    listItem.addEventListener("click", () => {
      updateInput(index);
      suggestionsList.innerHTML = "";
    });
    suggestionsList.appendChild(listItem);
  });

  // Reset the selected suggestion index
  selectedSuggestionIndex = -1;
});

bibleInput.addEventListener("keydown", function(event) {
  if (event.key === "ArrowDown") {
    
    event.preventDefault();
    selectedSuggestionIndex =
      (selectedSuggestionIndex + 1) % suggestionsList.children.length;
    updateInput(selectedSuggestionIndex);
  } else if (event.key === "ArrowUp") {
    // Handle Arrow Up key press
    event.preventDefault();
    selectedSuggestionIndex =
      (selectedSuggestionIndex - 1 + suggestionsList.children.length) %
      suggestionsList.children.length;
    updateInput(selectedSuggestionIndex);
  } else if (event.key === "Enter") {
    // Handle Enter key press to clear suggestions
    event.preventDefault();
    suggestionsList.innerHTML = "";
  }
});