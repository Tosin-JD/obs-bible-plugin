const hexToRgba = (hex, alpha = 1) => {
  const cleanedHex = hex.replace(/^#/, '');
  const red = parseInt(cleanedHex.substring(0, 2), 16);
  const green = parseInt(cleanedHex.substring(2, 4), 16);
  const blue = parseInt(cleanedHex.substring(4, 6), 16);

  const normalizedAlpha = isNaN(parseFloat(alpha)) || alpha < 0 || alpha > 1
    ? 1
    : parseFloat(alpha);

  return `rgba(${red}, ${green}, ${blue}, ${normalizedAlpha})`;
};


function getCustomPropertyValue(property) {
  return getComputedStyle(document.body).getPropertyValue(property).trim();
}

// Function to calculate Levenshtein Distance (fuzzy matching)
const levenshteinDistance = (a, b) => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    // Initialize the matrix with rows
    const matrix = Array.from({ length: b.length + 1 }, (_, i) =>
        Array.from({ length: a.length + 1 }, (_, j) =>
            i === 0 ? j : j === 0 ? i : 0
        )
    );

    // Fill the matrix
    return matrix.reduce((mat, row, i) => {
        if (i === 0) return mat;

        return mat.map((r, j) => {
            if (j === 0 || i === 0) return r;

            const cost = b[i - 1] === a[j - 1] ? 0 : 1;

            mat[i][j] = Math.min(
                mat[i - 1][j] + 1,       // Deletion
                mat[i][j - 1] + 1,       // Insertion
                mat[i - 1][j - 1] + cost // Substitution
            );

            return r;
        });
    }, matrix)[b.length][a.length];
};


function fuzzySearch(word, text, threshold = 2) {
  word = word.toLowerCase(); // Normalize input
  const words = text.toLowerCase().split(/\s+/); // Normalize and split text

  return words.some(t => {
    const maxThreshold = Math.ceil(t.length * 0.4); // Allow 40% of the word length as errors
    return t.includes(word) || levenshteinDistance(word, t) <= Math.max(threshold, maxThreshold);
  });
}


