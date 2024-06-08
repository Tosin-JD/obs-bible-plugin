const channel = new BroadcastChannel("myChannel");

const btnHistory = document.getElementById("history");

<<<<<<< HEAD
var historyOfText = [];

var historyOfBibleVerse = [];


function processMessage(inputMessage) {
  let unEditedMessage = inputMessage;
  let regexBold = /\*\*(.*?)\*\*/g;
  let regexItalic = /__(.*?)__/g;
  unEditedMessage = unEditedMessage.replace(regexBold, '<span>$1</span>');
  result = unEditedMessage.replace(regexItalic, '<em>$1</em>');
  return result;
}

document.getElementById("sendButton").addEventListener("click", () => {
  let messageInput = document.getElementById("messageInput").value;
  const message = processMessage(messageInput);
  channel.postMessage(message);
  historyOfText.push(message);
});

function doc_keyUp(e) {
  let lastSavedTab = localStorage.getItem("selectedTab");

  // this would test for whichever key is 40 (down arrow) and the ctrl key at the same time
  if (e.ctrlKey && e.code === 'ArrowDown' && lastSavedTab === "text") {
    let messageInput = document.getElementById("messageInput").value;
    const message = processMessage(messageInput);
    channel.postMessage(message);
    historyOfText.push(message);
=======
var historyOfBibleVerse = [];


document.getElementById("sendButton").addEventListener("click", () => {
  const message = document.getElementById("messageInput").value;
  channel.postMessage(message);
});

function doc_keyUp(e) {

  // this would test for whichever key is 40 (down arrow) and the ctrl key at the same time
  if (e.ctrlKey && e.code === 'ArrowDown') {
      // call your function to do the thing
      const message = document.getElementById("messageInput").value;
      channel.postMessage(message);
>>>>>>> 011b7423a553ca7018aa38c82443b16038a60b75
  }
}

function doc_keyUp(e) {
<<<<<<< HEAD
  let lastSavedTab = localStorage.getItem("selectedTab");

  // this would test for whichever key is 40 (down arrow) and the ctrl key at the same time
  if (e.ctrlKey && e.code === 'ArrowDown' && lastSavedTab === "text") {
    let messageInput = document.getElementById("messageInput").value;
    const message = processMessage(messageInput);
    channel.postMessage(message);
    historyOfText.push(message);
=======

  // this would test for whichever key is 40 (down arrow) and the ctrl key at the same time
  if (e.ctrlKey && e.code === 'ArrowDown') {
      // call your function to do the thing
      const message = document.getElementById("messageInput").value;
      channel.postMessage(message);
>>>>>>> 011b7423a553ca7018aa38c82443b16038a60b75
  }
}


<<<<<<< HEAD
=======
document.getElementById("sendList").addEventListener("click", () => {
  const listTitle = document.getElementById("listTitle").value;
  const listItems = document.getElementById("listItems").value;

  const listArray = listItems.split("\n");

  // Create a new unordered list (<ul>)
  const ulElement = document.createElement("ul");

  listArray.forEach((itemText) => {
      // Create a list item (<li>)
      const liElement = document.createElement("li");

      // Set the text content of the list item
      liElement.textContent = itemText;

      // Append the list item to the unordered list
      ulElement.appendChild(liElement);
  });

  const ulHtml = ulElement.outerHTML;

    // Create a string to represent the entire message
    const message = `<span>${listTitle}</span>\n${ulHtml}`;
  channel.postMessage(message);
});

>>>>>>> 011b7423a553ca7018aa38c82443b16038a60b75

document.addEventListener('keyup', doc_keyUp, false);

const songVerseDiv = document.getElementById("song");
const songElements = songVerseDiv.querySelectorAll("p");

let songVerses = Array.from(songElements);


let currentSongIndex = 0;

songVerses.forEach((verse, index) => {
  verse.addEventListener("click", (event) => {
    if (event.target.tagName === "P") {
      const message = event.target.textContent;
      channel.postMessage(message);

    }
  });
});


// Function to display songs
function displaySongs() {
  let songDiv = document.getElementById("song-display");

  let pElements = songDiv.querySelectorAll("p");

  let songLines = Array.from(pElements);

  let currentLine = null;
<<<<<<< HEAD
  let currentLineIndex = -1;
=======
  let currentLineIndex = 0;
>>>>>>> 011b7423a553ca7018aa38c82443b16038a60b75

  songLines.forEach((line, index) => {
    line.addEventListener("click", (event) => {
      
      currentLine = line;
      currentLineIndex = index;
      
      if (event.target.tagName === "P") {
        const message = event.target.innerHTML;
        channel.postMessage(message);
<<<<<<< HEAD
        event.target.classList.add("selected");
      }
      songLines.forEach((v, i) => {
        if (i !== index) {
          v.classList.remove("selected");
=======
        event.target.style.backgroundColor = "#552222";
      }
      songLines.forEach((v, i) => {
        if (i !== index) {
          v.style.backgroundColor = "#222222";
>>>>>>> 011b7423a553ca7018aa38c82443b16038a60b75
        }
      });
    });
  });

<<<<<<< HEAD
  function moveToPreviousLine(){
=======
  // // Event listener for arrow up key
  // window.addEventListener("keydown", (event) => {
  //   if (event.key === "ArrowRight") {
  //     if(currentLineIndex < songLines.length){
  //       currentLineIndex++;
  //       const message = songLines[currentLineIndex].innerText;
  //       channel.postMessage(message);
  //     }else{
  //       currentLineIndex = 0;
  //     }
      
  //   }
  //   if (event.key === "ArrowLeft") {
  //     if(currentLineIndex >= 0){
  //       currentLineIndex--;
  //       const message = songLines[currentLineIndex].innerText;
  //       channel.postMessage(message);
  //     }else{
  //       currentLineIndex = 0;
  //     }
  //   }
  //   if (event.key === "ArrowRight" && event.ctrlKey) {
  //     if (currentLineIndex < songLines.length) {
  //       currentLineIndex++;
  //       const message = songLines[currentLineIndex].innerText;
  //       channel.postMessage(message);
  //     } else {
  //       currentLineIndex = 0;
  //     }
  //   }
  //   if (event.key === "ArrowLeft" && event.ctrlKey) {
  //     if(currentLineIndex >= 0){
  //       currentLineIndex--;
  //       const message = songLines[currentLineIndex].innerText;
  //       channel.postMessage(message);
  //     }else{
  //       currentLineIndex = 0;
  //     }
  //   }
  // });

  // Event listener for Previous button
  document.getElementById("prev-line").addEventListener("click", () => {
>>>>>>> 011b7423a553ca7018aa38c82443b16038a60b75
    if(currentLineIndex > 0){
      currentLineIndex--;
      const message = songLines[currentLineIndex].innerText;
      channel.postMessage(message);

      // get the height of the display area
      const displayLine = document.getElementById('song');

      const currentLine = songLines[currentLineIndex];
      const nextLine = songLines[currentLineIndex + 1];

      const parentNode = currentLine.parentNode;

<<<<<<< HEAD
      // change the backgroundColor of the current verse      
      nextLine.classList.remove("selected");
      currentLine.classList.add("selected");
      
      const lineHeight = songLines[currentLineIndex].offsetHeight;
      const parentTop = parentNode.offsetTop;
      
      // Calculate scrollTop to center the current line in the parent container
      const scrollTop = parentTop + currentLine.offsetTop - (lineHeight / 2);

=======
      // change the backgroundColor of the current verse
      nextLine.style.backgroundColor = "#222222";
      currentLine.style.backgroundColor = "#552222";
      
      const lineHeight = songLines[currentLineIndex].offsetHeight;
      const parentTop = parentNode.offsetTop;
      const parentHeight = parentNode.offsetHeight;

      // Calculate scrollTop to center the current line in the parent container
      const scrollTop = parentTop + currentLine.offsetTop - (parentHeight / 2) + (lineHeight / 2);

      // Set the scrollTop of the display area to scroll to the calculated position
>>>>>>> 011b7423a553ca7018aa38c82443b16038a60b75
      displayLine.scrollTop = scrollTop;
    }else{
      currentLineIndex = 0;
    }
<<<<<<< HEAD
  }

  // Event listener for Previous button
  document.getElementById("prev-line").addEventListener("click", () => {
    moveToPreviousLine();
  });

  function moveToNextLine(){
=======

  });

  // Event listener for Next button
  document.getElementById("next-line").addEventListener("click", () => {
>>>>>>> 011b7423a553ca7018aa38c82443b16038a60b75
    if(currentLineIndex < songLines.length -1){
      currentLineIndex++;
      const message = songLines[currentLineIndex].innerText;
      channel.postMessage(message);

      // get the height of the display area
      const displayLine = document.getElementById('song');
      
      const currentLine = songLines[currentLineIndex];
      const previousLine = songLines[currentLineIndex - 1];

      const parentNode = currentLine.parentNode;
<<<<<<< HEAD
    
      // change the backgroundColor of the current verse
      if (currentLineIndex !== 0){
        previousLine.classList.remove("selected");
      }
      currentLine.classList.add("selected");
      
      const lineHeight = songLines[currentLineIndex].offsetHeight;
      const parentTop = parentNode.offsetTop;
      
      const scrollTop = parentTop + currentLine.offsetTop - (lineHeight / 2);
=======

      // change the backgroundColor of the current verse
      previousLine.style.backgroundColor = "#222222";
      currentLine.style.backgroundColor = "#552222";
      
      const lineHeight = songLines[currentLineIndex].offsetHeight;
      const parentTop = parentNode.offsetTop;
      const parentHeight = parentNode.offsetHeight;

      // Calculate scrollTop to center the current line in the parent container
      const scrollTop = parentTop + currentLine.offsetTop - (parentHeight / 2) + (lineHeight / 2);

      // Set the scrollTop of the display area to scroll to the calculated position
>>>>>>> 011b7423a553ca7018aa38c82443b16038a60b75
      displayLine.scrollTop = scrollTop;


    }else{
      currentLineIndex = 0;
<<<<<<< HEAD
      const message = songLines[currentLineIndex].innerText;
      channel.postMessage(message);
      const currentLine = songLines[currentLineIndex];
      const previousLine = songLines[songLines.length - 1];
      previousLine.classList.remove("selected");
      currentLine.classList.add("selected");
    }
  }

  // Event listener for Next button
  document.getElementById("next-line").addEventListener("click", () => {
    moveToNextLine();
  });

  document.addEventListener("keydown", function(event) {
    let lastSavedTab = localStorage.getItem("selectedTab");
    if (event.key === "ArrowDown" && lastSavedTab === "songs") {
      moveToNextLine();
    } else if (event.key === "ArrowUp" && lastSavedTab === "songs") {
      moveToNextLine();
    }
=======
    }

>>>>>>> 011b7423a553ca7018aa38c82443b16038a60b75
  });
}

// Call the displaySongs function to set up event listeners
displaySongs();


<<<<<<< HEAD
let currentVerseIndex = -1;


function displayBible() {
  let bibleVerseDiv = document.getElementById("bible-verse");
  let pElements = bibleVerseDiv.querySelectorAll("p");
  let bibleVerses = Array.from(pElements);
=======
function displayBible() {
  let bibleVerseDiv = document.getElementById("bible-verse");

  // Use querySelectorAll to select all p elements within the div
  let pElements = bibleVerseDiv.querySelectorAll("p");

  // Convert the NodeList to an array (if needed)
  let bibleVerses = Array.from(pElements);
  let currentVerseIndex = 0;


>>>>>>> 011b7423a553ca7018aa38c82443b16038a60b75

  bibleVerses.forEach((verse, index) => {
    verse.addEventListener("click", (event) => {
      if (event.target.tagName === "P") {
        currentVerseIndex = index;
        const message = event.target.innerHTML;
        channel.postMessage(message);
<<<<<<< HEAD
        event.target.classList.add("selected");
        
        historyOfBibleVerse.push({name: event.target.id, verse: message});
        historyOfText.push(message);
=======
        event.target.style.backgroundColor = "#222255";
        
        historyOfBibleVerse.push({name: event.target.id, verse: message});
>>>>>>> 011b7423a553ca7018aa38c82443b16038a60b75

        const maxHistorySize = 20;
        if (historyOfBibleVerse.length > maxHistorySize) {
          historyOfBibleVerse.shift(); 
        }

      }

      // Set background color of all verses to #222222
      bibleVerses.forEach((v, i) => {
        if (i !== index) {
<<<<<<< HEAD
          v.classList.remove("selected");
=======
          v.style.backgroundColor = "#222222";
>>>>>>> 011b7423a553ca7018aa38c82443b16038a60b75
        }
      });

    });
  });
<<<<<<< HEAD
}


  // Event listener for Previous button
  document.getElementById("prev-verse").addEventListener("click", (event) => {
    moveToPreviousVerse(event); 
  });

  // Event listener for Next button
  document.getElementById("next-verse").addEventListener("click", (event) => {
    moveToNextVerse(event);
  });
  
function moveToNextVerse(event){
  let bibleVerseDiv = document.getElementById("bible-verse");
  let pElements = bibleVerseDiv.querySelectorAll("p");
  let bibleVerses = Array.from(pElements);

  if(currentVerseIndex < bibleVerses.length - 1){
    currentVerseIndex++;
    const message = bibleVerses[currentVerseIndex].innerHTML;
    channel.postMessage(message);
    
    const displayVerse = document.getElementById('bible');
    const currentVerse = bibleVerses[currentVerseIndex];
    
    const previousVerse = bibleVerses[currentVerseIndex - 1];

    // change the backgroundColor of the current verse
    if(currentVerseIndex !== 0){
      previousVerse.classList.remove("selected");
    }
    currentVerse.classList.add("selected");
    
    // Calculate the scroll position to ensure the selected item is visible
    const verseHeight = bibleVerses[currentVerseIndex].offsetHeight;
    const scrollTop = currentVerse.offsetTop - (verseHeight * 2); // Adjust as needed
    displayVerse.scrollTop = scrollTop;

    historyOfBibleVerse.push({name: event.target.id, verse: message});
    historyOfText.push(message);
    const maxHistorySize = 20;
    if (historyOfBibleVerse.length > maxHistorySize) {
      historyOfBibleVerse.shift(); 
    }
  }
}
  
function moveToPreviousVerse(event){
  let bibleVerseDiv = document.getElementById("bible-verse");
  let pElements = bibleVerseDiv.querySelectorAll("p");
  let bibleVerses = Array.from(pElements);

  if(currentVerseIndex > 0){
    currentVerseIndex--;
    const message = bibleVerses[currentVerseIndex].innerHTML;
    channel.postMessage(message);
    const displayVerse = document.getElementById('bible');
    const currentVerse = bibleVerses[currentVerseIndex];
    
    const nextVerse = bibleVerses[currentVerseIndex + 1];

    // change the backgroundColor of the current verse
    nextVerse.classList.remove("selected");
    currentVerse.classList.add("selected");
    
    // Calculate the scroll position to ensure the selected item is visible
    const verseHeight = bibleVerses[currentVerseIndex].offsetHeight;
    const scrollTop = currentVerse.offsetTop - (verseHeight * 2); // Adjust as needed
    displayVerse.scrollTop = scrollTop;

    historyOfBibleVerse.push({name: event.target.id, verse: message});
    historyOfText.push(message);
    const maxHistorySize = 20;
    if (historyOfBibleVerse.length > maxHistorySize) {
      historyOfBibleVerse.shift(); 
    }
  }
}

document.addEventListener("keydown", function(event) {
  let lastSavedTab = localStorage.getItem("selectedTab");
  if (event.key === "ArrowDown" && lastSavedTab === "bibleText") {
    moveToNextVerse(event);
  } else if (event.key === "ArrowUp" && lastSavedTab === "bibleText") {
    moveToPreviousVerse(event);
  }
});

=======

  // // Event listener for arrow up key
  // window.addEventListener("keydown", (event) => {
  //   if (event.key === "ArrowDown") {
  //     if(currentVerseIndex < bibleVerses.length){
  //       currentVerseIndex++;
  //       const message = bibleVerses[currentVerseIndex].innerText;
  //       channel.postMessage(message);
  //     }else{
  //       currentVerseIndex = 0;
  //     }
      
  //   }
  //   if (event.key === "ArrowUp") {
  //     if(currentVerseIndex >= 0){
  //       currentVerseIndex--;
  //       const message = bibleVerses[currentVerseIndex].innerText;
  //       channel.postMessage(message);
  //     }else{
  //       currentVerseIndex = 0;
  //     }
  //   }
  //   if (event.key === "ArrowDown" && event.ctrlKey) {
  //     if (currentVerseIndex < bibleVerses.length) {
  //       currentVerseIndex++;
  //       const message = bibleVerses[currentVerseIndex].innerText;
  //       channel.postMessage(message);
  //     } else {
  //       currentVerseIndex = 0;
  //     }
  //   }
  //   if (event.key === "ArrowUp" && event.ctrlKey) {
  //     if(currentVerseIndex >= 0){
  //       currentVerseIndex--;
  //       const message = bibleVerses[currentVerseIndex].innerText;
  //       channel.postMessage(message);
  //     }else{
  //       currentVerseIndex = 0;
  //     }
  //   }
  // });
    // Event listener for Previous button
  document.getElementById("prev-verse").addEventListener("click", () => {
    if(currentVerseIndex >= 0){
      currentVerseIndex--;
      const message = bibleVerses[currentVerseIndex].innerHTML;
      channel.postMessage(message);

      // get the height of the display area
      const displayVerse = document.getElementById('bible');
      const currentVerse = bibleVerses[currentVerseIndex];
      
      const nextVerse = bibleVerses[currentVerseIndex + 1];

      // change the backgroundColor of the current verse
      nextVerse.style.backgroundColor = "#222222";
      currentVerse.style.backgroundColor = "#222255";
      
      // Calculate the scroll position to ensure the selected item is visible
      const verseHeight = bibleVerses[currentVerseIndex].offsetHeight;
      const scrollTop = currentVerse.offsetTop - (verseHeight * 2); // Adjust as needed
      displayVerse.scrollTop = scrollTop;

      historyOfBibleVerse.push({name: event.target.id, verse: message});
      const maxHistorySize = 20;
      if (historyOfBibleVerse.length > maxHistorySize) {
        historyOfBibleVerse.shift(); 
      }
    }
  });

  // Event listener for Next button
  document.getElementById("next-verse").addEventListener("click", () => {
    if(currentVerseIndex < bibleVerses.length){
      currentVerseIndex++;
      const message = bibleVerses[currentVerseIndex].innerHTML;
      channel.postMessage(message);
      historyOfBibleVerse.push({name: event.target.id, verse: message});

      // get the height of the display area
      const displayVerse = document.getElementById('bible');
      const currentVerse = bibleVerses[currentVerseIndex];
      
      const previousVerse = bibleVerses[currentVerseIndex - 1];

      // change the backgroundColor of the current verse
      previousVerse.style.backgroundColor = "#222222";
      currentVerse.style.backgroundColor = "#222255";
      
      // Calculate the scroll position to ensure the selected item is visible
      const verseHeight = bibleVerses[currentVerseIndex].offsetHeight;
      const scrollTop = currentVerse.offsetTop - (verseHeight * 2); // Adjust as needed
      displayVerse.scrollTop = scrollTop;

      const maxHistorySize = 20;
      if (historyOfBibleVerse.length > maxHistorySize) {
        historyOfBibleVerse.shift(); 
      }
    }else{
      currentVerseIndex = 0;
    }
  });
}
>>>>>>> 011b7423a553ca7018aa38c82443b16038a60b75

displayBible();

btnHistory.addEventListener("click", function () {
  bblVerseDiv.innerHTML = "";
  historyOfBibleVerse.forEach(entry => {
    const pElement = document.createElement('p');
    pElement.id = entry.name;
    pElement.innerHTML = entry.verse;
    bblVerseDiv.appendChild(pElement);
    displayBible();
  });
});


<<<<<<< HEAD
var btnCopy = document.getElementById("copyHistoryButton");
btnCopy.addEventListener("click", function () {
    let textToCopy; 
    textToCopy = historyOfText.join("\n");
    
    let textarea = document.getElementById("messageInput");
    textarea.value = textToCopy;
});


btnCopy.addEventListener("dblclick", function () {
  historyOfText = []
});


var instructions = document.getElementById("instructions");

// // Add event listener for mouseover to show instructions
// btnCopy.addEventListener("mouseover", function () {
//     instructions.style.display = "block";
// });

=======
>>>>>>> 011b7423a553ca7018aa38c82443b16038a60b75
