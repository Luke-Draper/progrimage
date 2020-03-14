class Point {
	constructor(x, y, radius = 10, color = "#000000") {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
	}

	svgFormat() {
		return `${this.x},${this.y}`;
	}
	svgCircle() {
		return `<circle cx="${this.x}" cy="${this.y}" r="${this.radius}" fill="${this.color}"/>`;
	}
}

class Line {
	constructor(point1, point2, strokeWidth = 10, color = "#000000", lineCap = "round") {
		this.point1 = point1;
		this.point2 = point2;
		this.strokeWidth = strokeWidth;
		this.color = color;
		this.lineCap = lineCap;
	}

	svgLine() {
		return `<circle x1="${this.point1.x}" y1="${this.point1.y}" x2="${this.point2.x}" y2="${this.point2.y}" stroke-width="${this.strokeWidth}" stroke="${this.color}" stroke-linecap="${lineCap}"/>`;
	}
}

class Face {
	constructor(point1, point2, point3, color = "rgba(0,0,0,0.5)") {
		this.point1 = point1;
		this.point2 = point2;
		this.point3 = point3;
		this.color = color;
	}

	svgFace() {
		return `<polygon points="${this.point1.svgFormat()} ${this.point2.svgFormat()} ${this.point3.svgFormat()}" fill="${this.color}"/>`;
	}
}

const btnUndo = d3.select("#btn-undo");
const btnRedo = d3.select("#btn-redo");
const btnZoomIn = d3.select("#btn-zoom-in");
const btnZoomReset = d3.select("#btn-zoom-reset");
const btnZoomOut = d3.select("#btn-zoom-out");

const mainSVG = d3.select("#main-svg");
const sub1SVG = d3.select("#sub-1-svg");

var zoom = d3.zoom();

function setupMainSVG() {

	var borderWidth = 0.01;

	mainSVG.mainGroup = mainSVG.append("g")
		.attr("cursor", "grab");
	mainSVG.mainGroup.append("rect")
		.attr("x", -borderWidth / 2)
		.attr("y", -borderWidth / 2)
		.attr("width", 1 + borderWidth)
		.attr("height", 1 + borderWidth)
		.attr("fill", "rgba(0,0,0,0)")
		.attr("stroke", "#000000")
		.attr("stroke-width", borderWidth);

	sub1SVG.viewGroup = sub1SVG.append("g");
	sub1SVG.viewGroup.viewBoxRect = sub1SVG.viewGroup.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", 1)
		.attr("height", 1)
		.attr("fill", "rgba(0,0,0,0)")
		.attr("stroke", "rgba(0,64,128,0.5)")
		.attr("stroke-width", borderWidth);

	mainSVG.call(zoom
		.extent([[0, 0], [1, 1]])
		.scaleExtent([0.512, 3.0517578125])
		.on("zoom", function () {
			mainSVG.mainGroup.attr("transform", d3.event.transform);
			sub1SVG.viewGroup.attr("transform", "translate(" + -d3.event.transform.x / d3.event.transform.k + "," + -d3.event.transform.y / d3.event.transform.k + ") scale(" + 1 / d3.event.transform.k + ")");
		}));

}

btnZoomIn.on("click", function () {
	zoom.scaleBy(mainSVG, 1.25);
	mainSVG.call(zoom);
});

btnZoomOut.on("click", function () {
	zoom.scaleBy(mainSVG, 0.8);
	mainSVG.call(zoom);
});

btnZoomReset.on("click", function () {
	mainSVG.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
});

btnUndo.on("click", function () {
	if (historyIndex > 0) historyIndex--;
	draw();
});

btnRedo.on("click", function () {
	if (historyIndex < history.length) historyIndex++;
	draw();
});

setupMainSVG();

var history = [Immutable.Map()];
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


//draw();
