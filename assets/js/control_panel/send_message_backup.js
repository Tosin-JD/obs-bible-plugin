const channel = new BroadcastChannel("myChannel");
const btnHistory = document.getElementById("history");
var historyOfText = [];
var historyOfBibleVerse = [];
const songVerseDiv = document.getElementById("song");
const songElements = songVerseDiv.querySelectorAll("p");
let songVerses = Array.from(songElements);
let currentSongIndex = 0;
let currentVerseIndex = -1;
var btnCopy = document.getElementById("copyHistoryButton");


function processMessage(inputMessage) {
  let unEditedMessage = inputMessage;
  let regexBold = /\*(.*?)\*/g;
  let regexItalic = /_(.*?)_/g;
  unEditedMessage = unEditedMessage.replace(regexBold, '<span>$1</span>');
  result = unEditedMessage.replace(regexItalic, '<em>$1</em>');
  return result;
}

function sendMessage(senderChannel, message){
  let fadeInCheckbox = document.getElementById("fade-in-checkbox");
  let messageToSend = {
    fadein: fadeInCheckbox.checked,
    messageContent: message
  };
  localStorage.setItem("obs-bible-fadein-checkbox", fadeInCheckbox.checked);
  senderChannel.postMessage(messageToSend);
}

document.getElementById("sendButton").addEventListener("click", () => {
  let messageInput = document.getElementById("messageInput").value;
  const message = processMessage(messageInput);
  sendMessage(channel, message);
  historyOfText.push(message);
});


function doc_keyUp(e) {
  let lastSavedTab = localStorage.getItem("selectedTab");

  // this would test for whichever key is 40 (down arrow) and the ctrl key at the same time
  if (e.ctrlKey && e.code === 'ArrowDown' && lastSavedTab === "text") {
    let messageInput = document.getElementById("messageInput").value;
    const message = processMessage(messageInput);
    sendMessage(channel, message);
    historyOfText.push(message);
  }
}


function doc_spaceBarUp(e) {
  let lastSavedTab = localStorage.getItem("selectedTab");
  let spaceBarCheckBox = document.getElementById("spacebar-checkbox");
  localStorage.setItem("obs-bible-spacebar-checkbox", spaceBarCheckBox.checked);

  // this would test for whichever key is 40 (down arrow) and the ctrl key at the same time
  if (e.code === 'Space' && lastSavedTab === "text" && spaceBarCheckBox.checked === true) {
    let messageInput = document.getElementById("messageInput").value;
    const message = processMessage(messageInput);
    sendMessage(channel, message);
    historyOfText.push(message);
  }
}


// songVerses.forEach((verse, index) => {
//   verse.addEventListener("click", (event) => {
//     if (event.target.tagName === "P") {
//       const message = processMessage(event.target.textContent);
//       sendMessage(channel, message);

//     }
//   });
// });



// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
let displaySongVerseByVerse = ()=>{
  let songDiv = document.getElementById("song-display");

  let divElements = songDiv.querySelectorAll("div");

  let songVerses = Array.from(divElements);

  let currentSongVerse = null;
  let currentVerseIndex= -1;
  var songIntervalId;
  var isSongRunning = false;

  songVerses.forEach((verse, index) => {
    verse.addEventListener("click", (event) => {

      currentSongVerse = verse;
      currentVerseIndex = index;
      
      let verseMessage = processMessage(verse.innerHTML);
      sendMessage(channel, verseMessage);
      verse.classList.add("selected");

      songVerses.forEach((v, i) => {
        if (i !== index) {
          v.classList.remove("selected");
        }
      });
    });
  });

  let moveToPreviousVerse = ()=>{
    if(currentVerseIndex > 0){
      currentVerseIndex--;
      const message = songVerses[currentVerseIndex].innerHTML;
      sendMessage(channel, message);

      // get the height of the display area
      const displayVerse = document.getElementById('song');

      const currentVerse = songVerses[currentVerseIndex];
      const nextVerse = songVerses[currentVerseIndex + 1];

      const parentNode = currentVerse.parentNode;

      // change the backgroundColor of the current verse
      nextVerse.classList.remove("selected");
      currentVerse.classList.add("selected");

      const lineHeight = songVerses[currentVerseIndex].offsetHeight;
      const parentTop = parentNode.offsetTop;

      // Calculate scrollTop to center the current line in the parent container
      const scrollTop = parentTop + currentVerse.offsetTop - (lineHeight / 2);

      displayVerse.scrollTop = scrollTop;
    }else{
      currentVerseIndex = 0;
    }
  }

  // Event listener for Previous button
  document.getElementById("prev-line").addEventListener("click", () => {
    moveToPreviousVerse();
  });

  let moveToNextVerse = ()=>{
    if(currentVerseIndex < songVerses.length -1){
      currentVerseIndex++;
      const message = songVerses[currentVerseIndex].innerHTML;
      sendMessage(channel, message);

      // get the height of the display area
      const displayVerse = document.getElementById('song');

      const currentVerse = songVerses[currentVerseIndex];
      const previousVerse = songVerses[currentVerseIndex - 1];

      const parentNode = currentVerse.parentNode;

      // change the backgroundColor of the current verse
      if (currentVerseIndex !== 0){
        previousVerse.classList.remove("selected");
      }
      currentVerse.classList.add("selected");

      const lineHeight = songVerses[currentVerseIndex].offsetHeight;
      const parentTop = parentNode.offsetTop;

      const scrollTop = parentTop + currentVerse.offsetTop - (lineHeight / 2);
      displayVerse.scrollTop = scrollTop;


    }else{
      currentVerseIndex = 0;
      const message = songVerses[currentVerseIndex].innerHTML;
      sendMessage(channel, message);
      const currentVerse = songVerses[currentVerseIndex];
      const previousVerse = songVerses[songVerses.length - 1];
      previousVerse.classList.remove("selected");
      currentVerse.classList.add("selected");
    }
  }

  // Event listener for Next button
  document.getElementById("next-line").addEventListener("click", () => {
    moveToNextVerse();
  });

}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


// Function to display songs
let displaySongLineByLine = ()=>{
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
        sendMessage(channel, message);
        event.target.classList.add("selected");
      }
      songLines.forEach((v, i) => {
        if (i !== index) {
          v.classList.remove("selected");
        }
      });
    });
  });

  let moveToPreviousLine = ()=>{
    if(currentLineIndex > 0){
      currentLineIndex--;
      const message = songLines[currentLineIndex].innerText;
      sendMessage(channel, message);

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

  let moveToNextLine = ()=>{
    if(currentLineIndex < songLines.length -1){
      currentLineIndex++;
      const message = songLines[currentLineIndex].innerText;
      sendMessage(channel, message);

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
      sendMessage(channel, message);
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

// let displaySong = ()=>{
//   let songElements = document.getElementById("song-display");
//   songElements.addEventListener('click', ()=>{
//     console.log("Clicked")
//     let displayLineByLine = document.getElementById("obs-bible-display-song-line-by-line");
  
//     if (displayLineByLine.checked === true){
//         displaySongLineByLine();
//         console.log("Clicked and Checked");
//       }else{
//         displaySongVerseByVerse();
//         console.log("Clicked and UnChecked");
//     }
//   });
// }

let displaySong = () => {
  let songElements = document.getElementById("song-display");
  
  // Clone the node to remove all event listeners
  const newElement = songElements.cloneNode(true);
  songElements.parentNode.replaceChild(newElement, songElements);
  songElements = newElement;
  
  // Add the new listener to the clean element
  songElements.addEventListener('click', () => {
    console.log("Clicked");
    let displayLineByLine = document.getElementById("obs-bible-display-song-line-by-line");
 
    if (displayLineByLine.checked === true) {
      displaySongLineByLine();
      console.log("Clicked and Checked");
    } else {
      displaySongVerseByVerse();
      console.log("Clicked and UnChecked");
    }
  });
}


function displayBible() {
  let bibleVerseDiv = document.getElementById("bible-verse");
  let pElements = bibleVerseDiv.querySelectorAll("p");
  let bibleVerses = Array.from(pElements);

  bibleVerses.forEach((verse, index) => {
    verse.addEventListener("click", (event) => {
      if (event.target.tagName === "P") {
        currentVerseIndex = index;
        const message = event.target.innerHTML;
        sendMessage(channel, message);
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
    sendMessage(channel, message);

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
    sendMessage(channel, message);
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

displayBible();
document.addEventListener('keyup', doc_keyUp, false);
document.addEventListener('keyup', doc_spaceBarUp, false);