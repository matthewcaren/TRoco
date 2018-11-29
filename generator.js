// https://github.com/danigb/tonal/blob/master/README.md
var contour = [1, 2, 3, -2, 2, 4, -5];

var currentChord = 1;

var chordSequence = new Array(contour.length + 1);

chordSequence[0] = currentChord;

function generate() {
	for (i = 0; i < contour.length; i++) {
		// TODO write generation algorithm
	}
}

function findtrq(chord1, chord2) {
	// trq = tension/release quotient
	// integer from -10 to 10
	// positive = tense, negative = release
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

	// find number of common tones, subtract double that number from trq
	trq -= (Tonal.Chord.notes(chord1).filter(value => -1 !== Tonal.Chord.notes(chord2).indexOf(value))).length() * 2;


	return Math.min(Math.max(trq, -10), 10);
}

function printChords() {
	let chordText = "<b>chords:</b><br />";
	for (i = 0; i < chordSequence.length; i++) {
		chordText += chordSequence[i] + " chord<br />";
	}
	document.getElementById("chords").innerHTML = chordText;
}


printChords(generate());