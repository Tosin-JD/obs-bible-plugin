// Get the input field
const lyricInput = document.getElementById('lyric-search');
const bibleSearchInput = document.getElementById('bible-input');
const clearLyricsBtn = document.getElementById('clear-lyrics-btn');
const clearBibleBtn = document.getElementById('clear-bible-btn');
const lyricsSearchNav = document.getElementById('lyrics-search-nav');
const prevMatchBtn = document.getElementById('prev-match-btn');
const nextMatchBtn = document.getElementById('next-match-btn');

let currentMatches = [];
let currentMatchIndex = -1;

function scrollToVerse(verse) {
    const displayLine = document.getElementById('song');
    let songDiv = document.getElementById("song-display");
    const parentNode = verse.parentNode;
    
    let lineHeight = songDiv.offsetHeight;
    const parentTop = parentNode.offsetTop;
    const scrollTop = parentTop + verse.offsetTop - (lineHeight / 2);
    displayLine.scrollTop = scrollTop;
}

function updateNavigationUI() {
    if (currentMatches.length > 0) {
        lyricsSearchNav.style.display = 'flex';
        // Highlight current match
        currentMatches.forEach((match, index) => {
            if (index === currentMatchIndex) {
                 match.element.classList.add('selected');
                 scrollToVerse(match.element);
            } else {
                 match.element.classList.remove('selected');
                 // Keep a secondary highlight for other matches if desired, or let them just be normal
            }
        });
    } else {
        lyricsSearchNav.style.display = 'none';
        const verses = document.querySelectorAll('#song-display p');
        verses.forEach(v => v.classList.remove('selected'));
    }
}

// Add event listener for keyup event
lyricInput.addEventListener('keyup', () => {
    if(lyricInput.value.length > 2){
        const searchTerm = lyricInput.value.toLowerCase();
        const verses = document.querySelectorAll('#song-display p');
        
        currentMatches = [];
        
        // Loop through each <p> element
        verses.forEach(verse => {
            const verseText = verse.textContent.toLowerCase();
            verse.classList.remove("selected");

            let searchWeight = fuzzySearchWeight(searchTerm, verseText);

            if (searchWeight > 0) {
                currentMatches.push({ element: verse, weight: searchWeight });
            }
        });
        
        if (currentMatches.length > 0) {
            // Sort matches by weight descending
            currentMatches.sort((a, b) => b.weight - a.weight);
            currentMatchIndex = 0; // Scroll to best match first
        } else {
            currentMatchIndex = -1;
        }
        
        updateNavigationUI();
    } else {
        // Clear search if too short
        currentMatches = [];
        currentMatchIndex = -1;
        updateNavigationUI();
    }
});


prevMatchBtn.addEventListener('click', () => {
    if (currentMatches.length > 0) {
        currentMatchIndex--;
        if (currentMatchIndex < 0) currentMatchIndex = currentMatches.length - 1;
        updateNavigationUI();
    }
});

nextMatchBtn.addEventListener('click', () => {
    if (currentMatches.length > 0) {
        currentMatchIndex++;
        if (currentMatchIndex >= currentMatches.length) currentMatchIndex = 0;
        updateNavigationUI();
    }
});

clearLyricsBtn.addEventListener('click', () => {
    lyricInput.value = '';
    lyricInput.focus();
    clearLyricsBtn.style.display = 'none';
    currentMatches = [];
    currentMatchIndex = -1;
    updateNavigationUI();
});

clearBibleBtn.addEventListener('click', () => {
    bibleSearchInput.value = '';
    bibleSearchInput.focus();
    clearBibleBtn.style.display = 'none';
});


lyricInput.addEventListener('input', () => {
    clearLyricsBtn.style.display = lyricInput.value ? 'block' : 'none';
});

bibleSearchInput.addEventListener('input', () => {
    clearBibleBtn.style.display = bibleSearchInput.value ? 'block' : 'none';
});