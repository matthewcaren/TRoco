// start deg, end deg, "tention quotient"
var relations = [
    [1, 2, 1],
    [1, 4, 1],
    [1, 5, 3],
    [1, 6, 2],

    [2, 1, -2],
    [2, 4, 1],
    [2, 5, 5],
    [2, 6, -1],
    
    [4, 1, -3],
    [4, 2, -1],
    [4, 5, 4],
    [4, 6, 2],

    [5, 1, -5],
    [5, 2, 2],
    [5, 4, -2],
    [5, 6, 3],

    [6, 1, 2],
    [6, 2, 3],
    [6, 4, -1],
    [6, 5, 4]
];

var contour = [1, 2, 3, -2, 2, 4, -5];

var currentChord = 1;

var chordSequence = new Array(contour.length + 1);

chordSequence[0] = currentChord;

// cycles through every contour value, chooses two "best fit" options, and randomly chooses
// weighted according to proximity to contour value
for (i = 0; i < contour.length; i++) {
    let bestDiff = Infinity;
    let nextBestDiff = Infinity;
    let weight = 1;
    let bestIndex;
    let nextBestIndex = 0;

    for (j = 0; j < relations.length; j++) {
        if (relations[j][0] == currentChord) {
            if (Math.abs(relations[j][2] - contour[i]) < bestDiff) {
                nextBestDiff = bestDiff;
                bestDiff = Math.abs(relations[j][2] - contour[i]);
                nextBestIndex = bestIndex;
                bestIndex = j;

                weight = Math.sqrt(nextBestDiff - bestDiff)/40 + 0.5;
            }
        }
    }
    
    if (Math.random() < weight) {
        currentChord = relations[bestIndex][1];
    } else {
        currentChord = relations[nextBestIndex][1];
    }

    chordSequence[i+1] = currentChord;

}

printChords();

function printChords() {
	let chordText = "<b>chords:</b><br />";
	for (i = 0; i < chordSequence.length; i++) {
		chordText += chordSequence[i] + " chord<br />";
	}
    document.getElementById("chords").innerHTML = chordText;
}