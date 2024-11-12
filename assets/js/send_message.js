

const channel = new BroadcastChannel("myChannel");

const btnHistory = document.getElementById("history");

var historyOfText = [];

var historyOfBibleVerse = [];


function processMessage(inputMessage) {
  let unEditedMessage = inputMessage;
  let regexBold = /\*(.*?)\*/g;
  let regexItalic = /_(.*?)_/g;
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
  }
}

function doc_keyUp(e) {
  let lastSavedTab = localStorage.getItem("selectedTab");

  // this would test for whichever key is 40 (down arrow) and the ctrl key at the same time
  if (e.ctrlKey && e.code === 'ArrowDown' && lastSavedTab === "text") {
    let messageInput = document.getElementById("messageInput").value;
    const message = processMessage(messageInput);
    channel.postMessage(message);
    historyOfText.push(message);
  }
}



document.addEventListener('keyup', doc_keyUp, false);

const songVerseDiv = document.getElementById("song");
const songElements = songVerseDiv.querySelectorAll("p");

let songVerses = Array.from(songElements);


let currentSongIndex = 0;

songVerses.forEach((verse, index) => {
  verse.addEventListener("click", (event) => {
    if (event.target.tagName === "P") {
      const message = processMessage(event.target.textContent);
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
  let currentLineIndex = -1;
  var songIntervalId;
  var isSongRunning = false;

  songLines.forEach((line, index) => {
    line.addEventListener("click", (event) => {

      currentLine = line;
      currentLineIndex = index;

      if (event.target.tagName === "P") {
        const message = processMessage(event.target.innerHTML);
        channel.postMessage(message);
        event.target.classList.add("selected");
      }
      songLines.forEach((v, i) => {
        if (i !== index) {
          v.classList.remove("selected");
        }
      });
    });
  });

  function moveToPreviousLine(){
    if(currentLineIndex > 0){
      currentLineIndex--;
      const message = songLines[currentLineIndex].innerText;
      channel.postMessage(message);

      // get the height of the display area
      const displayLine = document.getElementById('song');

      const currentLine = songLines[currentLineIndex];
      const nextLine = songLines[currentLineIndex + 1];

      const parentNode = currentLine.parentNode;

      // change the backgroundColor of the current verse
      nextLine.classList.remove("selected");
      currentLine.classList.add("selected");

      const lineHeight = songLines[currentLineIndex].offsetHeight;
      const parentTop = parentNode.offsetTop;

      // Calculate scrollTop to center the current line in the parent container
      const scrollTop = parentTop + currentLine.offsetTop - (lineHeight / 2);

      displayLine.scrollTop = scrollTop;
    }else{
      currentLineIndex = 0;
    }
  }

  // Event listener for Previous button
  document.getElementById("prev-line").addEventListener("click", () => {
    moveToPreviousLine();
  });

  function moveToNextLine(){
    if(currentLineIndex < songLines.length -1){
      currentLineIndex++;
      const message = songLines[currentLineIndex].innerText;
      channel.postMessage(message);

      // get the height of the display area
      const displayLine = document.getElementById('song');

      const currentLine = songLines[currentLineIndex];
      const previousLine = songLines[currentLineIndex - 1];

      const parentNode = currentLine.parentNode;

      // change the backgroundColor of the current verse
      if (currentLineIndex !== 0){
        previousLine.classList.remove("selected");
      }
      currentLine.classList.add("selected");

      const lineHeight = songLines[currentLineIndex].offsetHeight;
      const parentTop = parentNode.offsetTop;

      const scrollTop = parentTop + currentLine.offsetTop - (lineHeight / 2);
      displayLine.scrollTop = scrollTop;


    }else{
      currentLineIndex = 0;
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

  document.getElementById("start-song-button").addEventListener("click", (event) => {
    let timer = parseInt(document.getElementById("song-line-duration").value, 10);

    if(timer > 0){
      if (!isSongRunning) {
        songIntervalId = setInterval(moveToNextLine, timer * 1000);
        document.getElementById("start-song-button").value = "Stop";
        isSongRunning = true;
      } else {
        clearInterval(songIntervalId);
        document.getElementById("start-song-button").value = "Start";
        isSongRunning = false;
      }
    }

  });

  document.addEventListener("keydown", function(event) {
    let lastSavedTab = localStorage.getItem("selectedTab");
    if (event.key === "ArrowDown" && lastSavedTab === "songs") {
      moveToNextLine();
    } else if (event.key === "ArrowUp" && lastSavedTab === "songs") {
      moveToPreviousLine();
    }
  });
}


let currentVerseIndex = -1;


function displayBible() {
  let bibleVerseDiv = document.getElementById("bible-verse");
  let pElements = bibleVerseDiv.querySelectorAll("p");
  let bibleVerses = Array.from(pElements);

  bibleVerses.forEach((verse, index) => {
    verse.addEventListener("click", (event) => {
      if (event.target.tagName === "P") {
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
          v.classList.remove("selected");
        }
      });

    });
  });
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
  if (event.key === "ArrowRight" && lastSavedTab === "bibleText") {
    moveToNextVerse(event);
  } else if (event.key === "ArrowLeft" && lastSavedTab === "bibleText") {
    moveToPreviousVerse(event);
  }
});


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


var btnCopy = document.getElementById("copyHistoryButton");
btnCopy.addEventListener("click", function () {
    let textToCopy;
    textToCopy = historyOfText.join("\n");

    // Remove HTML tags using a regular expression
    textToCopy = textToCopy.replace(/<\/?[^>]+>/gi, '');

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
