// Get the input field
const lyricInput = document.getElementById('lyric-search');
const bibleSearchInput = document.getElementById('bible-input');
const clearLyricsBtn = document.getElementById('clear-lyrics-btn');
const clearBibleBtn = document.getElementById('clear-bible-btn');

// Get all the <p> elements inside the verses

// Add event listener for keyup event
lyricInput.addEventListener('keyup', () => {
    if(lyricInput.value.length > 2){
        const searchTerm = lyricInput.value.toLowerCase();
        const verses = document.querySelectorAll('#song-display p');
        
        // Loop through each <p> element
        verses.forEach(verse => {
            // Get the text content of the <p> element and convert it to lowercase
            const verseText = verse.textContent.toLowerCase();
            if (verse.classList.contains("selected"))
                verse.classList.remove("selected");

            // let searchResult = verseText.includes(searchTerm)
            let searchResult =  fuzzySearch(searchTerm, verseText);

            // Check if the verse text contains the search term
            if (searchResult) {
                const displayLine = document.getElementById('song');
                let songDiv = document.getElementById("song-display");
                const parentNode = verse.parentNode;
                verse.classList.add("selected");

                let lineHeight = songDiv.offsetHeight;
                const parentTop = parentNode.offsetTop;
                const scrollTop = parentTop + verse.offsetTop - (lineHeight / 2);
                displayLine.scrollTop = scrollTop;
            }
        });
    }
});


clearLyricsBtn.addEventListener('click', () => {
    lyricInput.value = '';
    lyricInput.focus();
    clearLyricsBtn.style.display = 'none';
});

clearBibleBtn.addEventListener('click', () => {
    bibleInput.value = '';
    bibleInput.focus();
    clearBibleBtn.style.display = 'none';
});


lyricInput.addEventListener('input', () => {
    clearLyricsBtn.style.display = lyricInput.value ? 'block' : 'none';
});

bibleSearchInput.addEventListener('input', () => {
    clearBibleBtn.style.display = bibleSearchInput.value ? 'block' : 'none';
});