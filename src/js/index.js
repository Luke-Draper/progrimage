import '../scss/style.scss';

const {
	List,
	Map
} = require('immutable');

var dots = document.getElementById('dots');
var undo = document.getElementById('undo');
var redo = document.getElementById('redo');

var history = [List([])];
var historyIndex = 0;

// wrap an operation: given a function, apply it
// the history list
function operation(fn) {
	// first, make sure that there is no future
	// in the history list. for instance, if the user
	// draws something, clicks undo, and then
	// draws something else, we need to dispose of the
	// future state
	history = history.slice(0, historyIndex + 1);

	// create a new version of the data by applying
	// a given function to the current head
	var newVersion = fn(history[historyIndex]);

	// add the new version to the history list and increment
	// the index to match
	history.push(newVersion);
	historyIndex++;

	// redraw the dots
	draw();
}

// here are our two operations: addDot is what
// you trigger by clicking the blank
function addDot(x, y) {
	operation(function (data) {
		return data.push(Immutable.Map({
			x: x,
			y: y,
			id: +new Date()
		}));
	});
}

function removeDot(id) {
	operation(function (data) {
		return data.filter(function (dot) {
			return dot.get('id') !== id;
		});
	});
}

function draw() {
	dots.innerHTML = '';
	history[historyIndex].forEach(function (dot) {
		var elem = dots.appendChild(document.createElement('div'));
		elem.className = 'dot';
		elem.style.left = dot.get('x') + 'px';
		elem.style.top = dot.get('y') + 'px';

		// clicking on a dot removes it.
		elem.addEventListener('click', function (e) {
			removeDot(dot.get('id'));
			e.stopPropagation();
		});

	});
	undo.disabled = (historyIndex != 0) ? '' : 'disabled';
	redo.disabled = (historyIndex !== history.length - 1) ? '' : 'disabled';
}

// clicking the background adds a dot
dots.addEventListener('click', function (e) {
	addDot(e.pageX, e.pageY);
});

// clicking undo goes back in time, unless
// there is no history left.
undo.addEventListener('click', function () {
	if (historyIndex > 0) historyIndex--;
	draw();
});

// clicking redo goes forward in time, unless
// there is no future left.
redo.addEventListener('click', function () {
	if (historyIndex < history.length) historyIndex++;
	draw();
});

draw();
