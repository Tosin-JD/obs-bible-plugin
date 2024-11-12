function splitAndOrganizeText(text) {
    const verses = text.split('\r\n\r\n');

    const container = document.getElementById('song-display');
    const songDiv = document.getElementById('song');

    // empty the
    songDiv.innerHTML = null;
    let chorusDiv = null; // Initialize a variable to hold the chorus div

    verses.forEach((verse, index) => {
        const div = document.createElement('div');
        const paragraph = verse.split('\n'); // Split each verse by single newline

        // Assign an id based on content
        if (paragraph[0].includes('CHORUS')) {
            div.id = 'song-chorus';
            div.classList.add("chorus");
            chorusDiv = div; // Store the chorus div
        } else {
            div.id = `song-verse-${index + 1}`;
            div.classList.add("verse");
        }

        paragraph.forEach(line => {
            const p = document.createElement('p');
            p.textContent = line;
            div.appendChild(p);
        });

        container.appendChild(div);

        // Append the chorus div after verse divs
        if (chorusDiv && div.id.startsWith('song-verse-')) {
            container.appendChild(chorusDiv.cloneNode(true));
        }
    });
    songDiv.appendChild(container);
}

const handleFileSelect = (event) => {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const songDisplay = document.getElementById('song-display');
            const content = e.target.result;
            const lines = content.split('\n');

            // Clear the previous content
            songDisplay.innerHTML = '';

            splitAndOrganizeText(content);
            displaySongs();
        };

        reader.readAsText(file);
    }
}

// Add an event listener to the file input element
document.getElementById('song-file-upload').addEventListener('change', (event) =>{
    handleFileSelect(event);
});
