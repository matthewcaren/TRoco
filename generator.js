// TODO add CanvasJS
// https://canvasjs.com/docs/charts/chart-options/data/click/

//var contour = [1,0,-1,5,-6];
var contour;
var startChord = "Dm7";
var threads = 1;
var numGenerations;
var color = 1;
var repeatChordsOk = false;

var toneDomain = Tonal.Scale.notes("C major");
var chordQualityDomain = ["6", "maj7", "maj9", "m7", "m9", "7", "7b9", "mM7"];

var chords;
var trqArray;


// main generation function
// iterates through each element of contour array
// first rows are better fit, next best
// each row represents one chord sequence
// i = rows
// j = columns
function generate() {
	chords[0][0] = startChord;
	//fillArray(0, 8);

	let streakLength = numGenerations;
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
			[bestChord, bestTrq] = findBestChord(chords[i-1][j*streakLength], usedChords, contour[i-1]);
			usedChords.push(bestChord);
			chords[i][j*streakLength] = bestChord;
			trqArray[i][j*streakLength] = bestTrq;
		}
	}

}

function findtrq(last, current) {
	// trq = tension-release quotient
	// integer from -10 to 10
	// positive = tense
    // negative = release
	let trq = 0;

	// trq offset based on root interval

	let rootInterval = 0;
	let posRootInterval = Tonal.Note.chroma(Tonal.Chord.notes(current)[0]) - Tonal.Note.chroma(Tonal.Chord.notes(last)[0]);
	if (posRootInterval >= 0) {
		rootInterval = posRootInterval;
	} else {
		rootInterval = posRootInterval + 12;
	}


	switch (rootInterval) {
		case 0:
			trq += 1;
			break;
		case 1:
			trq += 4;
			break;
		case 2:
			trq += 1;
			break;
		case 3:
			trq += 2;
			break;
		case 4:
			trq += 3;
			break;
		case 5:
			trq += -7;
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
			trq += -2;
			break;
		case 11:
			trq += -1;
			break;
		default:
			console.warn("TRQ calculation: unknown root interval change: " + rootInterval);
	}

	let chordColor = current.substr(Tonal.Chord.notes(current)[0].length);

	// trq offset based on chord quality
	switch (chordColor) {
		case "":
			trq += 0;
			break;
		case "6":
			trq += -1;
			break;
		case "Maj7":
			trq += 1;
			break;
		case "M9":
			trq += -1;
			break;
		case "m":
			trq += 0;
			break;
		case "m7":
			trq += -0.5;
			break;
		case "m9":
			trq += 0;
			break;
		case "7":
			trq += 2;
			break;
		case "7b9":
			trq += 2.5;
			break;
		case "7#9":
			trq += 3.5;
			break;
		case "7#9#5":
			trq += 3.5;
			break;
		case "7#9#11":
			trq += 4;
			break;
		case "9":
			trq +=2;
			break;
		case "mMaj7":
			trq +=4.5;
			break;
		default:
			console.warn("TRQ calculation: unknown chord quality: " + chordColor);
	}

	// check for dominant V to I
	let dominant = ["7", "9", "11", "13"]
	let major = ["", "6", "M"]
	if (dominant.includes(last.substr(Tonal.Chord.notes(last)[0].length, Tonal.Chord.notes(last)[0].length +1))) {
		if (rootInterval = 11) {
			trq -= 1;
		}
		if (rootInterval = 5 && dominant.includes(chordColor.substr(0,1))) {
			trq -= 3;
		}
	}

	// find number of common tones
	//(Tonal.Chord.notes(last).filter(value => -1 !== Tonal.Chord.notes(current).indexOf(value))).length;

	// find number of tones not in key, add 2 times that number to TRQ
	trq += (Tonal.Chord.notes(current).length - (toneDomain.filter(value => -1 !== Tonal.Chord.notes(current).indexOf(value))).length) * 2;

	return Math.min(Math.max(trq, -10), 10);
}

// cycle through every possible chord, find best trq & return corresponding chord
// do not return banned chords
function findBestChord(last, banned, goalTrq) {
	var nextBestChord;
	var nextBestTrqDiff = Infinity;
	var nextBestTrq;
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

				if(!isBanned && last != currentChord) {
					nextBestChord = currentChord;
					nextBestTrqDiff = currentTrqDiff;

					nextBestTrq = findtrq(last, currentChord);
				}
			}
		}
	}

	return [nextBestChord, nextBestTrq];
}


// create n-dimentional chord array
function createChordArray(length) {
	console.log(length);
    var chords = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) chords[length-1 - i] = createChordArray.apply(this, args);
    }

    return chords;
}

// create n-dimentional TRQ array
function createTRQArray(length) {
    var trqArray = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) trqArray[length-1 - i] = createTRQArray.apply(this, args);
    }

    return trqArray;
}

function fillArray (i, streakLength) {
	// fill in rest of streak
	let chordsToPush = [ ];
	for(a = 0; a < threads**i; a++) {
		chordsToPush.push(chords[i][a*streakLength]);
	}
	console.log(i + " " + chordsToPush);

	for(b = 0; b < chords[i].length; b++) {
		chords[i][b] = chordsToPush[Math.floor(b/streakLength)];
	}
}

function prune() {
	// check for chords with too many color tones
	for (i = 0; i < chords.length; i++) {
		for (j = 0; j < chords[i].length; j++) {
			if ((Tonal.Chord.notes(chords[i][j]).length - (toneDomain.filter(value => -1 !== Tonal.Chord.notes(chords[i][j]).indexOf(value))).length) > color) {
				for (c = 0; c < chords.length; c++) {
					chords[c].splice(j, 1);
				}
			}
		}
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


// GENERATE CHORDS!
function main(form) {
	contour = form.inputbox.value.split(",");
	toneDomain = Tonal.Scale.notes(form.tonic.value + " " + form.scale.value);
	startChord = form.startChord.value;

	for(a = 0; a < contour.length; a++) {
		contour[a] = parseInt(contour[a]);

		if(Number.isNaN(contour[a]) || contour[a] > 10 || contour[a] < -10) {
			alert("Invalid input. Please input a list of integers between -10 and 10 separated by commas.")
			return;
		}
	}

	numGenerations = threads*contour.length;
	console.log("target profile: " + contour);

	if (typeof contour == "undefined") {
		alert("Please input a target profile before starting generation.")
		return;
	}

	if (startChord == "") {
		alert("Please input a starting chord before starting generation.")
		return;
	} else if (Tonal.Chord.notes(startChord).length == 0) {
		alert(startChord + " is not a recognized chord. Please input a valid starting chord.")
		return;
	}

	console.log("beginning chord generation...");

	// create chord array
	// chords[x][y], rows = sequences
	chords = createChordArray(contour.length+1, numGenerations);
	console.log("created empty array " + chords.length + " by " + chords[0].length);

	trqArray = createTRQArray(contour.length+1, numGenerations);

	generate();


	console.log("beginning pruning...");
	//prune();
	console.log(chords);
	console.log(trqArray);

	// print chords to page
	printChords();
}


document.getElementById("userinputform").onkeypress = function(e) {
  var key = e.charCode || e.keyCode || 0;
  if (key == 13) {
    main(document.getElementById("userinputform"));
    e.preventDefault();
  }
}
