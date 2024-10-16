<<<<<<< HEAD
=======
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


>>>>>>> 011b7423a553ca7018aa38c82443b16038a60b75
const bibleInput = document.getElementById("bible-input");


const suggestionsList = document.getElementById("suggestions");
let selectedSuggestionIndex = -1; // Index of the currently selected suggestion


function updateInput(index) {
  if (index >= 0 && index < suggestionsList.children.length) {
    for (let item = suggestionsList.children.length - 1; item >= 0; item--) {
<<<<<<< HEAD
      suggestionsList.children[item].classList.remove("activated");
    }
    
    const selectedSuggestion = suggestionsList.children[index];
    // bibleInput.value = selectedSuggestion.textContent;
    const selectedBookName = selectedSuggestion.querySelector('strong').textContent;
    bibleInput.value = selectedBookName;
    selectedSuggestion.classList.add("activated");
=======
      suggestionsList.children[item].style.backgroundColor = "#222";
    }
    
    const selectedSuggestion = suggestionsList.children[index];
    bibleInput.value = selectedSuggestion.textContent;
    selectedSuggestion.style.backgroundColor = "#444";
>>>>>>> 011b7423a553ca7018aa38c82443b16038a60b75

    // Calculate the scroll position to ensure the selected item is visible
    const suggestionHeight = selectedSuggestion.offsetHeight;
    const scrollTop = selectedSuggestion.offsetTop - (suggestionHeight * 2); // Adjust as needed
    suggestionsList.scrollTop = scrollTop;
<<<<<<< HEAD
    return bibleInput.value;
  }
}
// Define a debounce function
function debounce(func, delay) {
  let timer;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

// Wrap your input event listener with debounce
bibleInput.addEventListener("input", debounce(function() {
  if(bibleInput.value.length > 2){
    const inputValue = bibleInput.value.toLowerCase();
    const filteredBooks = bible_data.filter(book => 
      book.name.toLowerCase().includes(inputValue) || 
      book.verse.toLowerCase().includes(inputValue)
    );
    
    suggestionsList.innerHTML = "";
    if(inputValue.length > 0){
      filteredBooks.forEach((book, index) => {
        const listItem = document.createElement("li");
        // listItem.textContent = book.name;
        listItem.innerHTML = `<strong>${book.name}</strong>: ${book.verse}`;
        // Add a click event listener to each suggestion
        listItem.addEventListener("click", () => {
          searchBible(updateInput(index));
          displayBible();
          suggestionsList.innerHTML = "";
        });
        suggestionsList.appendChild(listItem);
      });
    }
    // Reset the selected suggestion index
    displayBibleSuggestions();
    selectedSuggestionIndex = -1;
  }
}, 300)); // Adjust the delay (in milliseconds) as needed

=======
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
>>>>>>> 011b7423a553ca7018aa38c82443b16038a60b75

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
<<<<<<< HEAD
});


// make the suggestions disappear if clicked outside
// Add a click event listener to the document
document.addEventListener("click", function(event) {
  const clickedElement = event.target;
  const isSuggestionClicked = suggestionsList.contains(clickedElement);
  const isInputClicked = clickedElement === bibleInput;

  // If the clicked element is neither a suggestion nor the input, hide suggestions
  if (!isSuggestionClicked && !isInputClicked) {
    suggestionsList.innerHTML = "";
  }
});

function displayBibleSuggestions() {
  let bibleVerseDiv = document.getElementById("suggestions");

  // Use querySelectorAll to select all p elements within the div
  let pElements = bibleVerseDiv.querySelectorAll("li");

  // Convert the NodeList to an array (if needed)
  let bibleVerses = Array.from(pElements);
  let currentVerseIndex = -1;

  bibleVerses.forEach((verse, index) => {
    verse.addEventListener("click", (event) => {
      if (event.target.tagName === "LI") {
        currentVerseIndex = index;
        const message = event.target.innerHTML;
        channel.postMessage(message);
        event.target.classList.add("selected");
        
        historyOfBibleVerse.push({name: event.target.id, verse: message});
        historyOfText.push(message);

        const maxHistorySize = 20;
        if (historyOfBibleVerse.length > maxHistorySize) {
          historyOfBibleVerse.shift(); 
        }
      }

      // Set background color of all verses to #222222
      bibleVerses.forEach((v, i) => {
        if (i !== index) {
          // v.style.backgroundColor = "#222222";
          v.classList.remove("selected");
        }
      });

    });
  });
}
=======
});
>>>>>>> 011b7423a553ca7018aa38c82443b16038a60b75
