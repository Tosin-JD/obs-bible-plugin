const channel = new BroadcastChannel("myChannel");

const btnHistory = document.getElementById("history");

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
  }
}

function doc_keyUp(e) {

  // this would test for whichever key is 40 (down arrow) and the ctrl key at the same time
  if (e.ctrlKey && e.code === 'ArrowDown') {
      // call your function to do the thing
      const message = document.getElementById("messageInput").value;
      channel.postMessage(message);
  }
}


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
  let currentLineIndex = 0;

  songLines.forEach((line, index) => {
    line.addEventListener("click", (event) => {
      
      currentLine = line;
      currentLineIndex = index;
      
      if (event.target.tagName === "P") {
        const message = event.target.innerHTML;
        channel.postMessage(message);
        event.target.style.backgroundColor = "#552222";
      }
      songLines.forEach((v, i) => {
        if (i !== index) {
          v.style.backgroundColor = "#222222";
        }
      });
    });
  });

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
      nextLine.style.backgroundColor = "#222222";
      currentLine.style.backgroundColor = "#552222";
      
      const lineHeight = songLines[currentLineIndex].offsetHeight;
      const parentTop = parentNode.offsetTop;
      const parentHeight = parentNode.offsetHeight;

      // Calculate scrollTop to center the current line in the parent container
      const scrollTop = parentTop + currentLine.offsetTop - (parentHeight / 2) + (lineHeight / 2);

      // Set the scrollTop of the display area to scroll to the calculated position
      displayLine.scrollTop = scrollTop;
    }else{
      currentLineIndex = 0;
    }

  });

  // Event listener for Next button
  document.getElementById("next-line").addEventListener("click", () => {
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
      previousLine.style.backgroundColor = "#222222";
      currentLine.style.backgroundColor = "#552222";
      
      const lineHeight = songLines[currentLineIndex].offsetHeight;
      const parentTop = parentNode.offsetTop;
      const parentHeight = parentNode.offsetHeight;

      // Calculate scrollTop to center the current line in the parent container
      const scrollTop = parentTop + currentLine.offsetTop - (parentHeight / 2) + (lineHeight / 2);

      // Set the scrollTop of the display area to scroll to the calculated position
      displayLine.scrollTop = scrollTop;


    }else{
      currentLineIndex = 0;
    }

  });
}

// Call the displaySongs function to set up event listeners
displaySongs();


function displayBible() {
  let bibleVerseDiv = document.getElementById("bible-verse");

  // Use querySelectorAll to select all p elements within the div
  let pElements = bibleVerseDiv.querySelectorAll("p");

  // Convert the NodeList to an array (if needed)
  let bibleVerses = Array.from(pElements);
  let currentVerseIndex = 0;



  bibleVerses.forEach((verse, index) => {
    verse.addEventListener("click", (event) => {
      if (event.target.tagName === "P") {
        currentVerseIndex = index;
        const message = event.target.innerHTML;
        channel.postMessage(message);
        event.target.style.backgroundColor = "#222255";
        
        historyOfBibleVerse.push({name: event.target.id, verse: message});

        const maxHistorySize = 20;
        if (historyOfBibleVerse.length > maxHistorySize) {
          historyOfBibleVerse.shift(); 
        }

      }

      // Set background color of all verses to #222222
      bibleVerses.forEach((v, i) => {
        if (i !== index) {
          v.style.backgroundColor = "#222222";
        }
      });

    });
  });

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


