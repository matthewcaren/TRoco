var contour = [1, 2, 3, -2, 2, 4, -5];
var startChord = "C";
var threads = 4;
var rootDomain = Tonal.Scale.notes("C major");
var chordQualityDomain = ["", "m", "7"];


// main generation function
// iterates through each element of contour array
// first rows are better fit, next best
// i = rows = time
// j = columns = threads
function generate() {
	// 2nd chord is special bc can't be 2 of the same
	let usedChords = [ 0 ];
	for (j = 0; j < threads; j++) {
		let currentChord = findBestChord(chords[0, j], usedChords, contour[0]);

		usedChords.push(currentChord);
		chords[1][j] = currentChord;
	}

	// for each element of contour after 2, generate chords
	// (1st is predefined, 2nd is special case, above)
	for (i = 2; i < contour.length+1; i++) {
		// for each thread
		for (j = 0; j < threads^2 % threads; j++) {
			chords[i][j] = findBestChord(chords[i-1, j % threads], chords.slice(0, j), contour[i-1]);
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

	// find number of common tones, subtract 1.5 times that number from trq
	//trq -= (Tonal.Chord.notes(chord1).filter(value => -1 !== Tonal.Chord.notes(chord2).indexOf(value))).length() * 2;


	return Math.min(Math.max(trq, -10), 10);
}

// cycle through every possible chord, find best trq & return corresponding chord
// do not return banned chords
function findBestChord(last, banned, trq) {
	var nextBestChord;
	var nextBestTrqDiff = Infinity;
	var currentChord;
	var currentTrqDiff;

	for(i = 0; i < rootDomain.length; i++) {
		for(j = 0; j < chordQualityDomain.length; j++) {
			currentChord = rootDomain[i] + chordQualityDomain[j];
			currentTrqDiff = Math.abs(findtrq(last, currentChord)-trq);

			if(currentTrqDiff <= nextBestTrqDiff) {
				if(banned != null) {
					var isBanned = false;
					for (k = banned.length - 1; k >= 0; k--) {
						if(banned[i] == currentChord) {
							console.log("found banned chord")
							isBanned = true;
						}
					}

					if(isBanned == false) {
						nextBestChord = currentChord;
						nextBestTrqDiff = currentTrqDiff;
					}
				}
			}
		}
	}

	return currentChord;
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

// print chords to "chord" HTML element
function printChords() {
	chordText = "";
	for (i = 0; i < chords.length; i++) {
		chordText += chords[i][0] + "<br />";
	}
	document.getElementById("chords").innerHTML = chordText;
	console.log("chords successfully generated and printed")
}



// GENERATE CHORDS!

// create chord array
// chords[x][y], rows = sequences
var chords = createChordArray(contour.length+1, threads^2);

for (var i = threads - 1; i >= 0; i--) {
	chords[0][i] = startChord;
}

generate();

console.log(chords);

printChords();
