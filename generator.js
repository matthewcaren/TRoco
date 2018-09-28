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
    
    [4, 1, -2],
    [4, 2, -1],
    [4, 5, 4],
    [4, 6, 2],

    [5, 1, -5],
    [5, 2, 2],
    [5, 4, -3],
    [5, 6, 3],

    [6, 1, 2],
    [6, 2, 3],
    [6, 4, -2],
    [6, 5, 4]
];

var contour = [1, 2, 3, -2, 2, 4, 5, -5];

var chord = 1;

printChord(chord);

for (i = 0; i < contour.length; i++) {
    let bestDiff = Infinity;
    let nextBestDiff = Infinity;
    let weight = 0.7;
    let bestIndex;
    let nextBestIndex = 0;

    for (j = 0; j < relations.length; j++) {
        if (relations[j][0] == chord) {
            if (Math.abs(relations[j][2] - contour[i]) < bestDiff) {
                nextBestDiff = bestDiff;
                bestDiff = Math.abs(relations[j][2] - contour[i]);
                nextBestIndex = bestIndex;
                bestIndex = j;

                weight = Math.sqrt(nextBestDiff - bestDiff)/4 + 0.4;
            }
        }
    }

    if (Math.random() < weight) {
        chord = relations[bestIndex][1];
    } else {
        chord = relations[nextBestIndex][1];
    }

    printChord(chord);

}

function printChord(degree) {
    console.log(degree + " chord");
}