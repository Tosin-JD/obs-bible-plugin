// Get the input field
const lyricInput = document.getElementById('lyric-search');

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

            // Check if the verse text contains the search term
            if (verseText.includes(searchTerm)) {
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
