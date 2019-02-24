var contour = [1, 2, -2, 2, 4, 6, -5];
var startChord = "C";
var threads = 2;
var numGenerations = threads**contour.length;

var toneDomain = Tonal.Scale.notes("C major");
var chordQualityDomain = ["", "m", "7"];


// main generation function
// iterates through each element of contour array
// first rows are better fit, next best
// each row represents one chord sequence
// i = rows
// j = columns
function generate() {
	chords[0][0] = startChord;
	//fillArray(0, 8);

	let streakLength = 9;
	let usedChords = [ ];

	for(i = 1; i < contour.length+1; i++) {
		console.log("i=" + i);
		fillArray(i-1, streakLength);

		usedChords.length = 0;

		// "streak" = duplicated chords
		// so any row is a valid chord sequence
		streakLength = threads**(contour.length-i);

		// set first element in streak
		for(j = 0; j < threads**i; j++) {
			bestChord = findBestChord(chords[i-1][j*streakLength], usedChords, contour[i-1]);
			usedChords.push(bestChord);
			chords[i][j*streakLength] = bestChord;
		}
	}
	
}

function findtrq(chord1, chord2) {
	// trq = tension-release quotient
	// integer from -10 to 10
	// positive = tense
    // negative = release
	let trq = 0;
	
	let rootInterval = Math.abs(Tonal.Note.chroma(Tonal.Chord.notes(chord1)[0]) - Tonal.Note.chroma(Tonal.Chord.notes(chord2)[0]))%12;

	// change trq based on root interval
	switch (rootInterval) {
		case 0:
			trq += 1;
			break;
		case 1:
			trq += 4;
			break;
		case 2:
			trq += 3;
			break;
		case 3:
			trq += 2;
			break;
		case 4:
			trq += 3;
			break;
		case 5:
			trq += -6;
			break;
		case 6:
			trq += 9;
			break;
		case 7:
			trq += 0;
			break;
		case 8:
			trq += 1;
			break;
		case 9:
			trq += -2;
			break;
		case 10:
			trq += -3;
			break;
		case 11:
			trq += -2;
			break;
		default:
			console.warn("root interval change not understood");
	}

	// find number of common tones, divide TRQ by that number
	trq /= (Tonal.Chord.notes(chord1).filter(value => -1 !== Tonal.Chord.notes(chord2).indexOf(value))).length;
	
	// find number of tones not in key, add half that number to TRQ
	//trq += (toneDomain.filter(value => -1 !== Tonal.Chord.notes(chord2).indexOf(value))).length /2;

	return Math.min(Math.max(trq, -10), 10);
}

// cycle through every possible chord, find best trq & return corresponding chord
// do not return banned chords
function findBestChord(last, banned, goalTrq) {
	var nextBestChord;
	var nextBestTrqDiff = Infinity;
	var currentChord;
	var currentTrqDiff;
	var isBanned;

	for(m = 0; m < toneDomain.length; m++) {
		for(n = 0; n < chordQualityDomain.length; n++) {
			currentChord = toneDomain[m] + chordQualityDomain[n];
			currentTrqDiff = Math.abs(findtrq(last, currentChord)-goalTrq);

			if(currentTrqDiff <= nextBestTrqDiff) {
				isBanned = false;
				for (k = 0; k < banned.length; k++) {
					if(banned[k] == currentChord) {
						isBanned = true;
					}
				}

				if(!isBanned) {
					nextBestChord = currentChord;
					nextBestTrqDiff = currentTrqDiff;
				}
			}
		}
	}

	return nextBestChord;
}


// create n-dimentional chord array
function createChordArray(length) {
    var chords = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) chords[length-1 - i] = createChordArray.apply(this, args);
    }

    return chords;
}

function fillArray (i, streakLength) {
	// fill in rest of streak
	let chordsToPush = [ ];
	for(a = 0; a < threads**i; a++) {
		chordsToPush.push(chords[i][a*streakLength]);
	}
	console.log("chords to push " + chordsToPush);

	for(b = 0; b < chords[i].length; b++) {
		chords[i][b] = chordsToPush[Math.floor(b/streakLength)];
	}
}

// print chords to "chord" HTML element
function printChords() {
	chordText = "";
	for (i = 0; i < chords.length; i++) {
		chordText += chords[i][0] + "<br />";
	}
	document.getElementById("chords").innerHTML = chordText;
	console.log("chords successfully generated and printed")
}


// create chord array
// chords[x][y], rows = sequences
var chords = createChordArray(contour.length+1, numGenerations);
console.log("created empty array " + chords.length + " by " + chords[0].length);
console.log(chords);

// GENERATE CHORDS!
function main() {
	console.log("beginning chord generation...");

	generate();
	console.log(chords);

	// print chords to page
	printChords();
}
