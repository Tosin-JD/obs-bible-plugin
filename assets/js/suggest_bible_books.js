const bibleInput = document.getElementById("bible-input");
const suggestionsList = document.getElementById("suggestions");
let selectedSuggestionIndex = -1;


var bibleIndex = new Map();

function updateInput(index) {
  if (index >= 0 && index < suggestionsList.children.length) {
    for (let item = suggestionsList.children.length - 1; item >= 0; item--) {
      suggestionsList.children[item].classList.remove("activated");;
    }

    const selectedSuggestion = suggestionsList.children[index];
    bibleInput.value = selectedSuggestion.textContent;
    selectedSuggestion.classList.add("activated");

    // Calculate the scroll position to ensure the selected item is visible
    const suggestionHeight = selectedSuggestion.offsetHeight;
    const scrollTop = selectedSuggestion.offsetTop - (suggestionHeight * 2);74
    suggestionsList.scrollTop = scrollTop;
  }
}

bibleInput.addEventListener("input", function() {

  const inputValue = bibleInput.value.toLowerCase();
  const filteredBooks = Array.from(bibleIndex.keys()).filter(book =>book.toLowerCase().includes(inputValue));

  suggestionsList.innerHTML = "";
  if(inputValue.length > 0){

    filteredBooks.forEach((book, index) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `${book} `;
      // Add a click event listener to each suggestion
      listItem.addEventListener("click", () => {
        updateInput(index);
        suggestionsList.innerHTML = "";
      });
      suggestionsList.appendChild(listItem);
    });
  }
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
