import "../scss/style.js";
import * as d3 from "../../node_modules/d3/dist/d3.js";
import { Delaunay } from "d3-delaunay";

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++[|       Constants        |]++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

const btnEditType = d3.select("#btn-edit-type");
const iconEditTypeView = d3.select("#icon-edit-type-view");
const iconEditTypeAll = d3.select("#icon-edit-type-all");
const iconEditTypePoints = d3.select("#icon-edit-type-points");
const iconEditTypeLines = d3.select("#icon-edit-type-lines");
const iconEditTypeFaces = d3.select("#icon-edit-type-faces");
const editTypeIcons = [
	iconEditTypeView,
	iconEditTypeAll,
	iconEditTypePoints,
	iconEditTypeLines,
	iconEditTypeFaces
];

const btnUndo = d3.select("#btn-undo");
const btnRedo = d3.select("#btn-redo");

const btnZoomIn = d3.select("#btn-zoom-in");
const btnZoomReset = d3.select("#btn-zoom-reset");
const btnZoomOut = d3.select("#btn-zoom-out");

const btnBackgroundVis = d3.select("#btn-background-vis");
const btnPointsVis = d3.select("#btn-points-vis");
const btnLinesVis = d3.select("#btn-lines-vis");
const btnFacesVis = d3.select("#btn-faces-vis");

const mainSVG = d3.select("#main-svg");
const sub1SVG = d3.select("#sub-1-svg");

const mainCanvas = d3.select("#main-canvas");
const sub1Canvas = d3.select("#sub-1-canvas");
const sub2Canvas = d3.select("#sub-2-canvas");
const sub3Canvas = d3.select("#sub-3-canvas");
const sub4Canvas = d3.select("#sub-4-canvas");
const sub5Canvas = d3.select("#sub-5-canvas");
const sub6Canvas = d3.select("#sub-6-canvas");
const sub7Canvas = d3.select("#sub-7-canvas");

const backgroundCanvas = d3.select("#background-canvas");
const backForm = d3.select("#backgroundImageLoader");

const zoomFactor = 1.25;

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++[|       Variables        |]++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

var undoHistoryIndex = 0;
var undoHistory = [];

var zoom;

var idAccumulator = 0;
var initial = null;

var threshold = 5;
var downCoord = { x: -1, y: -1 };

var keydown = " ";

var boxSelectStarted = false;
var boxSelectOngoing = false;

var visibleBackground = true;
var visiblePoints = true;
var visibleLines = true;
var visibleFaces = true;

var mouseClientCoords = { x: 0, y: 0 };
var mouseOffsetCoords = { x: 0, y: 0 };

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++[|       Classes          |]++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

class SVGCanvasElement {
	constructor(id, color = "rgba(0,0,0,1)") {
		this.id = id;
		this.color = color;
	}

	htmlElement() {
		return this.d3Selection().node();
	}

	d3Selection() {
		return d3.select(`#${this.id}`);
	}

	isSelected() {
		return false;
	}

	hasSelected() {
		return false;
	}

	toJSON() {
		return this;
	}

	select() {
		return;
	}
	deselect() {
		return;
	}
	toggleSelect() {
		return;
	}

	svgCanvas() {
		return;
	}
	svgOffset(offsetX, offsetY) {
		return;
	}
	svgBasic() {
		return;
	}
	svgExport() {
		return;
	}
}

class Point extends SVGCanvasElement {
	constructor(
		id,
		x,
		y,
		radius = 0.0075,
		color = "rgba(0,0,0,1)",
		selected = false
	) {
		super(id, color);
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.selected = selected;
	}

	isSelected() {
		return this.selected;
	}

	hasSelected() {
		return this.selected;
	}

	select() {
		this.selected = true;
	}
	deselect() {
		this.selected = false;
	}
	toggleSelect() {
		this.selected = !this.selected;
	}

	svgFormat() {
		return `${this.x},${this.y}`;
	}

	svgOffsetFormat(offsetX, offsetY) {
		return `${this.x + offsetX},${this.y + offsetY}`;
	}

	svgCanvas() {
		if (!visiblePoints) {
			return "";
		}
		var selectAttributes = "";
		if (this.selected) {
			var stroke = this.radius / 5;
			var dash = stroke / 3;
			selectAttributes = ` stroke="#ff873d" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="0.00001,${dash}"`;
		} else {
			selectAttributes = ' stroke="rgba" stroke-width="0"';
		}
		return `<circle id="${this.id}" class="svg-points" cx="${this.x}" cy="${this.y}" r="${this.radius}" fill="${this.color}"${selectAttributes}/>`;
	}

	svgOffset(offsetX, offsetY) {
		this.d3Selection()
			.attr("cx", this.x + offsetX)
			.attr("cy", this.y + offsetY);
	}

	svgBasic() {
		var color = "rgba(0,128,0,1)";
		if (this.selected) {
			color = "#ff873d";
		}
		return `<circle cx="${this.x}" cy="${this.y}" r="0.005" fill="${color}"/>`;
	}

	svgExport() {
		return `<circle cx="${this.x}" cy="${this.y}" r="${this.radius}" fill="${this.color}"/>`;
	}
}

class Line extends SVGCanvasElement {
	constructor(
		id,
		point1ID,
		point2ID,
		strokeWidth = 0.005,
		color = "rgba(0,255,0,1)",
		lineCap = "round"
	) {
		super(id, color);
		this.point1ID = point1ID;
		this.point2ID = point2ID;
		this.strokeWidth = strokeWidth;
		this.lineCap = lineCap;
	}

	isSelected() {
		return (
			getByID(this.point1ID).isSelected() && getByID(this.point2ID).isSelected()
		);
	}
	hasSelected() {
		return (
			getByID(this.point1ID).isSelected() || getByID(this.point2ID).isSelected()
		);
	}

	select() {
		getByID(this.point1ID).select();
		getByID(this.point2ID).select();
	}
	deselect() {
		getByID(this.point1ID).deselect();
		getByID(this.point2ID).deselect();
	}
	toggleSelect() {
		if (this.isSelected()) {
			this.deselect();
		} else {
			this.select();
		}
	}

	svgCanvas() {
		if (!visibleLines) {
			return "";
		}
		var selectAttributes = `stroke="${this.color}" stroke-linecap="${this.lineCap}"`;
		if (this.isSelected()) {
			var dash = this.strokeWidth / 3;
			selectAttributes = ` stroke="#ff873d" stroke-linecap="round" stroke-dasharray="0.00001,${dash}"`;
		}
		return `<line id="${this.id}" class="svg-lines" x1="${
			getByID(this.point1ID).x
		}" y1="${getByID(this.point1ID).y}" x2="${getByID(this.point2ID).x}" y2="${
			getByID(this.point2ID).y
		}" stroke-width="${this.strokeWidth}" ${selectAttributes}/>`;
	}

	svgOffset(offsetX, offsetY) {
		if (getByID(this.point1ID).isSelected()) {
			this.d3Selection()
				.attr("x1", getByID(this.point1ID).x + offsetX)
				.attr("y1", getByID(this.point1ID).y + offsetY);
			d3.select(`id="#${this.id}-selected"`);
		}
		if (getByID(this.point2ID).isSelected()) {
			this.d3Selection()
				.attr("x2", getByID(this.point2ID).x + offsetX)
				.attr("y2", getByID(this.point2ID).y + offsetY);
		}
	}

	svgBasic() {
		var color = "rgba(0,128,0,0.4)";
		if (this.isSelected()) {
			color = `rgba(255,135,61,0.7)" stroke-dasharray="0.00001,0.0083333`;
		}
		return `<line x1="${getByID(this.point1ID).x}" y1="${
			getByID(this.point1ID).y
		}" x2="${getByID(this.point2ID).x}" y2="${
			getByID(this.point2ID).y
		}" stroke-width="0.005" stroke="${color}" stroke-linecap="round"/>`;
	}

	svgExport() {
		return `<line x1="${getByID(this.point1ID).x}" y1="${
			getByID(this.point1ID).y
		}" x2="${getByID(this.point2ID).x}" y2="${
			getByID(this.point2ID).y
		}"  stroke-width="${this.strokeWidth}" stroke="${
			this.color
		}" stroke-linecap="${lineCap}"/>`;
	}
}

class Face extends SVGCanvasElement {
	constructor(id, point1ID, point2ID, point3ID, color = "rgba(0,0,0,0.5)") {
		super(id, color);
		this.point1ID = point1ID;
		this.point2ID = point2ID;
		this.point3ID = point3ID;
	}

	isSelected() {
		return (
			getByID(this.point1ID).isSelected() &&
			getByID(this.point2ID).isSelected() &&
			getByID(this.point3ID).isSelected()
		);
	}

	hasSelected() {
		return (
			getByID(this.point1ID).isSelected() ||
			getByID(this.point2ID).isSelected() ||
			getByID(this.point3ID).isSelected()
		);
	}

	select() {
		getByID(this.point1ID).select();
		getByID(this.point2ID).select();
		getByID(this.point3ID).select();
	}
	deselect() {
		getByID(this.point1ID).deselect();
		getByID(this.point2ID).deselect();
		getByID(this.point3ID).deselect();
	}
	toggleSelect() {
		if (this.isSelected()) {
			this.deselect();
		} else {
			this.select();
		}
	}

	svgCanvas() {
		if (!visibleFaces) {
			return "";
		}
		var selectAttributes = "";
		if (
			getByID(this.point1ID).isSelected() &&
			getByID(this.point2ID).isSelected() &&
			getByID(this.point3ID).isSelected()
		) {
			var avgX =
				(getByID(this.point1ID).x +
					getByID(this.point2ID).x +
					getByID(this.point3ID).x) /
				3;
			var avgY =
				(getByID(this.point1ID).y +
					getByID(this.point2ID).y +
					getByID(this.point3ID).y) /
				3;
			selectAttributes = `<circle id="${this.id}-selected" cx="${avgX}" cy="${avgY}" r="0.05" fill="rgba(255,135,61,0.4)"/>`;
		}
		return `<polygon id="${this.id}" points="${getByID(
			this.point1ID
		).svgFormat()} ${getByID(this.point2ID).svgFormat()} ${getByID(
			this.point3ID
		).svgFormat()}" fill="${this.color}"/>${selectAttributes}`;
	}

	svgOffset(offsetX, offsetY) {
		var output = "";

		if (getByID(this.point1ID).isSelected()) {
			output = output.concat(
				`${getByID(this.point1ID).svgOffsetFormat(offsetX, offsetY)} `
			);
		} else {
			output = output.concat(`${getByID(this.point1ID).svgFormat()} `);
		}

		if (getByID(this.point2ID).isSelected()) {
			output = output.concat(
				`${getByID(this.point2ID).svgOffsetFormat(offsetX, offsetY)} `
			);
		} else {
			output = output.concat(`${getByID(this.point2ID).svgFormat()} `);
		}

		if (getByID(this.point3ID).isSelected()) {
			output = output.concat(
				`${getByID(this.point3ID).svgOffsetFormat(offsetX, offsetY)}`
			);
		} else {
			output = output.concat(`${getByID(this.point3ID).svgFormat()}`);
		}
		this.d3Selection().attr("points", output);
	}

	svgBasic() {
		var color = "rgba(0,128,128,0.2)";
		if (
			getByID(this.point1ID).isSelected() &&
			getByID(this.point2ID).isSelected() &&
			getByID(this.point3ID).isSelected()
		) {
			color = "rgba(255,135,61,0.4)";
		}
		return `<polygon class="svg-faces" points="${getByID(
			this.point1ID
		).svgFormat()} ${getByID(this.point2ID).svgFormat()} ${getByID(
			this.point3ID
		).svgFormat()}" fill="${color}"/>`;
	}

	svgExport() {
		return `<polygon points="${getByID(this.point1ID).svgFormat()} ${getByID(
			this.point2ID
		).svgFormat()} ${getByID(this.point3ID).svgFormat()}" fill="${
			this.color
		}"/>`;
	}
}

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++[|    Button Callbacks    |]++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

var btnUndoPress = function() {
	keydown = "~";
	if (undoHistoryIndex > 0) undoHistoryIndex--;
	draw();
};
var btnRedoPress = function() {
	keydown = "~";
	if (undoHistoryIndex < undoHistory.length) undoHistoryIndex++;
	draw();
};

var btnBackgroundVisPress = function() {
	keydown = "~";
	visibleBackground = !visibleBackground;
	if (visibleBackground) {
		backgroundCanvas.classed("invisible", false);
		btnBackgroundVis.classed("btn-extra", false);
	} else {
		backgroundCanvas.classed("invisible", true);
		btnBackgroundVis.classed("btn-extra", true);
	}
};
var btnPointsVisPress = function() {
	keydown = "~";
	visiblePoints = !visiblePoints;
	if (visiblePoints) {
		btnPointsVis.classed("btn-extra", false);
	} else {
		btnPointsVis.classed("btn-extra", true);
	}
	draw();
};
var btnLinesVisPress = function() {
	keydown = "~";
	visibleLines = !visibleLines;
	if (visibleLines) {
		btnLinesVis.classed("btn-extra", false);
	} else {
		btnLinesVis.classed("btn-extra", true);
	}
	draw();
};
var btnFacesVisPress = function() {
	keydown = "~";
	visibleFaces = !visibleFaces;
	if (visibleFaces) {
		btnFacesVis.classed("btn-extra", false);
	} else {
		btnFacesVis.classed("btn-extra", true);
	}
	draw();
};

var btnZoomInPress = function() {
	keydown = "~";
	zoom.scaleBy(mainSVG, zoomFactor);
	mainSVG.call(zoom);
};
var btnZoomOutPress = function() {
	keydown = "~";
	zoom.scaleBy(mainSVG, 1 / zoomFactor);
	mainSVG.call(zoom);
};
var btnZoomResetPress = function() {
	mainSVG
		.transition()
		.duration(500)
		.call(zoom.transform, d3.zoomIdentity);
};

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++[| Interaction  Callbacks |]++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

var zoomStart = function() {
	mainSVG.attr("cursor", "grabbing");
};
var zooming = function() {
	mainSVG.mainGroup.attr("transform", d3.event.transform);
	sub1SVG.viewGroup.attr(
		"transform",
		"translate(" +
			-d3.event.transform.x / d3.event.transform.k +
			"," +
			-d3.event.transform.y / d3.event.transform.k +
			") scale(" +
			1 / d3.event.transform.k +
			")"
	);
	var tl = d3.event.transform.apply([0, 0]);
	var br = d3.event.transform.apply([1, 1]);
	var tlSect = svgCoordsToSection(tl[0], tl[1]);
	var brSect = svgCoordsToSection(br[0], br[1]);
	backgroundCanvas.style("left", `${tlSect.x}px`);
	backgroundCanvas.style("top", `${tlSect.y}px`);
	backgroundCanvas.style("width", `${brSect.x - tlSect.x}px`);
	backgroundCanvas.style("height", `${brSect.y - tlSect.y}px`);
};
var zoomEnd = function() {
	mainSVG.attr("cursor", null);
};

var dragPointStart = function() {
	keydown = "~";
	initial = {
		x: d3.event.x,
		y: d3.event.y
	};

	d3.selectAll(".svg-points").attr("cursor", "grabbing");
};
var dragPoint = function() {
	var point = getPointByID(d3.select(this).attr("id"));
	var offsetX = d3.event.x - initial.x;
	var offsetY = d3.event.y - initial.y;
	if (
		offsetX * offsetX + offsetY * offsetY >
		(point.radius * point.radius) / 2
	) {
		point.select();
		renderSVGOffset(offsetX, offsetY);
	}
};
var dragPointEnd = function() {
	keydown = "~";

	var point = getPointByID(d3.select(this).attr("id"));
	var offsetX = d3.event.x - initial.x;
	var offsetY = d3.event.y - initial.y;
	var moved = false;
	if (
		offsetX * offsetX + offsetY * offsetY >
		(point.radius * point.radius) / 2
	) {
		moveSelected(offsetX, offsetY);
		moved = true;
	}
	d3.selectAll(".svg-points").attr("cursor", "grab");

	if (
		!moved &&
		!(
			d3.event.shiftKey ||
			(d3.event.sourceEvent && d3.event.sourceEvent.shiftKey)
		)
	) {
		for (var i = 0; i < undoHistory[undoHistoryIndex].points.length; i++) {
			if (undoHistory[undoHistoryIndex].points[i].hasSelected()) {
				undoHistory[undoHistoryIndex].points[i].deselect();
			}
		}
	}
	point.select();

	draw();
};

var dragLineStart = function() {
	d3.selectAll(".svg-lines").attr("cursor", "grabbing");
	var line = getLineByID(d3.select(this).attr("id"));
	dragPointStart.call(d3.select(`#${line.point1.id}`).node());
};
var dragLine = function() {
	var line = getLineByID(d3.select(this).attr("id"));
	dragPoint.call(d3.select(`#${line.point1}`).node());
};
var dragLineEnd = function() {
	var line = getLineByID(d3.select(this).attr("id"));
	d3.selectAll(".svg-lines").attr("cursor", "grab");
	dragPointEnd.call(d3.select(`#${line.point1}`).node());
};

var boxSelectStart = function() {
	keydown = "~";
	if (d3.event.button == 0) {
		initial = screenCoordsToSVG(d3.event.offsetX, d3.event.offsetY);
		boxSelectStarted = true;
	}
};

var boxSelecting = function() {
	if (boxSelectStarted && d3.event.buttons > 0) {
		boxSelectOngoing = true;
		var current = screenCoordsToSVG(d3.event.offsetX, d3.event.offsetY);
		var maxX = Math.max(initial.x, current.x);
		var minX = Math.min(initial.x, current.x);
		var maxY = Math.max(initial.y, current.y);
		var minY = Math.min(initial.y, current.y);
		var width = maxX - minX;
		var height = maxY - minY;
		mainSVG.selectRect
			.attr("x", minX)
			.attr("y", minY)
			.attr("width", width)
			.attr("height", height);
	} else {
		boxSelectStarted = false;
	}
};

var boxSelectEnd = function() {
	if (boxSelectOngoing) {
		boxSelectStarted = false;
		boxSelectOngoing = false;
		mainSVG.selectRect
			.attr("x", -100)
			.attr("y", -100)
			.attr("width", 0)
			.attr("height", 0);
		var current = screenCoordsToSVG(d3.event.offsetX, d3.event.offsetY);
		var maxX = Math.max(initial.x, current.x);
		var minX = Math.min(initial.x, current.x);
		var maxY = Math.max(initial.y, current.y);
		var minY = Math.min(initial.y, current.y);

		if (
			!(
				d3.event.shiftKey ||
				(d3.event.sourceEvent && d3.event.sourceEvent.shiftKey)
			)
		) {
			for (var i = 0; i < undoHistory[undoHistoryIndex].points.length; i++) {
				if (undoHistory[undoHistoryIndex].points[i].hasSelected()) {
					undoHistory[undoHistoryIndex].points[i].deselect();
				}
			}
		}
		for (var i = 0; i < undoHistory[undoHistoryIndex].points.length; i++) {
			if (
				undoHistory[undoHistoryIndex].points[i].x < maxX &&
				undoHistory[undoHistoryIndex].points[i].x > minX &&
				undoHistory[undoHistoryIndex].points[i].y < maxY &&
				undoHistory[undoHistoryIndex].points[i].y > minY
			) {
				undoHistory[undoHistoryIndex].points[i].select();
			}
		}
		draw();
	}
};

var mouseDownAll = function() {
	keydown = "~";
	downCoord.x = d3.event.x;
	downCoord.y = d3.event.y;
};
var mouseUpAll = function() {
	keydown = "~";
	if (
		Math.abs(d3.event.x - downCoord.x) < threshold &&
		Math.abs(d3.event.y - downCoord.y) < threshold
	) {
		addPoint();
	}
};

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++[|   Keyboard Callbacks   |]++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

var downKey = function() {
	d3.event.preventDefault();
	keydown = d3.event.key;
};

var upKey = function() {
	if (d3.event.key == keydown) {
		if (keydown == "z" || keydown == "Z") {
			if (d3.event.ctrlKey) {
				if (d3.event.shiftKey) {
					btnRedoPress();
				} else {
					btnUndoPress();
				}
			}
		}
		if (keydown == "y" || keydown == "Y") {
			if (d3.event.ctrlKey) {
				btnRedoPress();
			}
		}
		if (keydown == "p" || keydown == "P") {
			if (d3.event.ctrlKey) {
				removeSelectedPoints();
			} else if (d3.event.altKey) {
				btnPointsVisPress();
			} else {
				addPoint();
			}
		}
		if (keydown == "l" || keydown == "L") {
			if (d3.event.ctrlKey) {
				removeSelectedLines();
			} else if (d3.event.altKey) {
				btnLinesVisPress();
			} else {
				addDelaunayLines();
			}
		}
		if (keydown == "f" || keydown == "F") {
			if (d3.event.ctrlKey) {
				removeSelectedFaces();
			} else if (d3.event.altKey) {
				btnFacesVisPress();
			} else {
				addSelectedFaces();
			}
		}
		if (keydown == "b" || keydown == "B") {
			if (d3.event.altKey) {
				btnBackgroundVisPress();
			}
		}
		if (keydown == "Backspace" || keydown == "Delete") {
			removeSelectedPoints();
		}
	}
};

var mouseMove = function() {
	mouseClientCoords = { x: d3.event.clientX, y: d3.event.clientY };
	mouseOffsetCoords = { x: d3.event.offsetX, y: d3.event.offsetY };
};

var uploadBackground = function() {
	if (this.files && this.files[0]) {
		var canvas = backgroundCanvas.node();
		var ctx = canvas.getContext("2d");

		var reader = new FileReader();
		reader.onload = function(e) {
			var img = new Image();
			img.onload = function() {
				if (img.width > img.height) {
					canvas.width = img.width;
					canvas.height = img.width;
					ctx.drawImage(img, 0, (img.width - img.height) / 2);
				} else {
					canvas.width = img.height;
					canvas.height = img.height;
					ctx.drawImage(img, (img.height - img.width) / 2, 0);
				}
			};
			img.src = e.target.result;
		};
		reader.readAsDataURL(this.files[0]);
	}
};

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++[|       History          |]++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

function operation(fn) {
	undoHistory = undoHistory.slice(0, undoHistoryIndex + 1);
	var newVersion = fn(duplicateData(undoHistory[undoHistoryIndex]));
	setupNewData(newVersion);

	undoHistory.push(newVersion);
	undoHistoryIndex++;

	draw();
}

function duplicateData(data) {
	var newData = {
		points: [],
		lines: [],
		faces: []
	};

	data.points.forEach(function(point) {
		newData.points.push(
			new Point(
				point.id,
				point.x,
				point.y,
				point.radius,
				point.color,
				point.selected
			)
		);
	});

	data.lines.forEach(function(line) {
		newData.lines.push(
			new Line(
				line.id,
				line.point1,
				line.point2,
				line.strokeWidth,
				line.color,
				line.lineCap
			)
		);
	});

	data.faces.forEach(function(face) {
		newData.faces.push(
			new Face(face.id, face.point1, face.point2, face.point3, face.color)
		);
	});

	return newData;
}

function setupNewData(newData) {
	newData.pointMap = {};
	newData.lineMap = {};
	newData.faceMap = {};

	for (var i = 0; i < newData.points.length; i++) {
		newData.pointMap.set(newData.points[i].id, i);
	}

	for (var i = 0; i < newData.lines.length; i++) {
		newData.lineMap.set(newData.lines[i].id, i);
	}

	for (var i = 0; i < newData.points.length; i++) {
		newData.faceMap.set(newData.faces[i].id, i);
	}
}

function addPoint() {
	operation(function(data) {
		if (
			!(
				d3.event.shiftKey ||
				(d3.event.sourceEvent && d3.event.sourceEvent.shiftKey)
			)
		) {
			for (var i = 0; i < data.points.length; i++) {
				data.points[i].deselect();
			}
		}

		var id = `p${new Date().getTime()}-${(idAccumulator++)
			.toString()
			.padStart(8, "0")}`;
		var coords = screenCoordsToSVG(mouseOffsetCoords.x, mouseOffsetCoords.y);
		var newPoint = new Point(id, coords.x, coords.y);
		newPoint.select();
		data.points.push(newPoint);

		return data;
	});
}

function removeSelectedPoints() {
	operation(function(data) {
		var newPoints = [];
		for (var i = 0; i < data.points.length; i++) {
			if (!data.points[i].isSelected()) {
				newPoints.push(data.points[i]);
			}
		}

		for (var i = 0; i < newPoints.length; i++) {
			for (var j = 0; j < data.lines.length; j++) {
				if (data.lines[j].point1.id == newPoints[i].id) {
					data.lines[j].point1 = newPoints[i];
				} else if (data.lines[j].point2.id == newPoints[i].id) {
					data.lines[j].point2 = newPoints[i];
				}
			}
			for (var j = 0; j < data.faces.length; j++) {
				if (data.faces[j].point1.id == newPoints[i].id) {
					data.faces[j].point1 = newPoints[i];
				} else if (data.faces[j].point2.id == newPoints[i].id) {
					data.faces[j].point2 = newPoints[i];
				} else if (data.faces[j].point3.id == newPoints[i].id) {
					data.faces[j].point3 = newPoints[i];
				}
			}
		}
		data.points = newPoints;

		var newLines = [];
		for (var i = 0; i < data.lines.length; i++) {
			if (!data.lines[i].hasSelected()) {
				newLines.push(data.lines[i]);
			}
		}
		data.lines = newLines;

		var newFaces = [];
		for (var i = 0; i < data.faces.length; i++) {
			if (!data.faces[i].hasSelected()) {
				newFaces.push(data.faces[i]);
			}
		}
		data.faces = newFaces;

		return data;
	});
}

function moveSelected(offsetX, offsetY) {
	operation(function(data) {
		var newPoints = [];
		for (var i = 0; i < data.points.length; i++) {
			if (data.points[i].isSelected()) {
				newPoints.push(
					new Point(
						data.points[i].id,
						data.points[i].x + offsetX,
						data.points[i].y + offsetY,
						data.points[i].radius,
						data.points[i].color,
						data.points[i].selected
					)
				);
				for (var j = 0; j < data.lines.length; j++) {
					if (data.lines[j].point1.id == newPoints[i].id) {
						data.lines[j].point1 = newPoints[i];
					} else if (data.lines[j].point2.id == newPoints[i].id) {
						data.lines[j].point2 = newPoints[i];
					}
				}
				for (var j = 0; j < data.faces.length; j++) {
					if (data.faces[j].point1.id == newPoints[i].id) {
						data.faces[j].point1 = newPoints[i];
					} else if (data.faces[j].point2.id == newPoints[i].id) {
						data.faces[j].point2 = newPoints[i];
					} else if (data.faces[j].point3.id == newPoints[i].id) {
						data.faces[j].point3 = newPoints[i];
					}
				}
			} else {
				newPoints.push(data.points[i]);
			}
		}
		data.points = newPoints;
		return data;
	});
}

function addDelaunayLines() {
	operation(function(data) {
		var lines = delaunayLines(getSelectedPoints());
		for (var i = 0; i < lines.length; i++) {
			data.lines.push(lines[i]);
		}
		return data;
	});
}
function removeSelectedLines() {
	operation(function(data) {
		var newLines = [];
		for (var i = 0; i < data.lines.length; i++) {
			if (!data.lines[i].isSelected()) {
				newLines.push(data.lines[i]);
			}
		}
		data.lines = newLines;
		return data;
	});
}

function addSelectedFaces() {
	operation(function(data) {
		var selectedLines = getSelectedLines();

		for (var i = 0; i < selectedLines.length - 2; i++) {
			for (var j = i + 1; j < selectedLines.length - 1; j++) {
				for (var k = j + 1; k < selectedLines.length; k++) {
					if (
						(selectedLines[i].point1.id == selectedLines[j].point1.id &&
							selectedLines[i].point2.id == selectedLines[k].point1.id &&
							selectedLines[j].point2.id == selectedLines[k].point2.id) ||
						(selectedLines[i].point2.id == selectedLines[j].point1.id &&
							selectedLines[i].point1.id == selectedLines[k].point1.id &&
							selectedLines[j].point2.id == selectedLines[k].point2.id) ||
						(selectedLines[i].point1.id == selectedLines[j].point2.id &&
							selectedLines[i].point2.id == selectedLines[k].point1.id &&
							selectedLines[j].point1.id == selectedLines[k].point2.id) ||
						(selectedLines[i].point2.id == selectedLines[j].point2.id &&
							selectedLines[i].point1.id == selectedLines[k].point1.id &&
							selectedLines[j].point1.id == selectedLines[k].point2.id) ||
						(selectedLines[i].point1.id == selectedLines[j].point1.id &&
							selectedLines[i].point2.id == selectedLines[k].point2.id &&
							selectedLines[j].point2.id == selectedLines[k].point1.id) ||
						(selectedLines[i].point2.id == selectedLines[j].point1.id &&
							selectedLines[i].point1.id == selectedLines[k].point2.id &&
							selectedLines[j].point2.id == selectedLines[k].point1.id) ||
						(selectedLines[i].point1.id == selectedLines[j].point2.id &&
							selectedLines[i].point2.id == selectedLines[k].point2.id &&
							selectedLines[j].point1.id == selectedLines[k].point1.id) ||
						(selectedLines[i].point2.id == selectedLines[j].point2.id &&
							selectedLines[i].point1.id == selectedLines[k].point2.id &&
							selectedLines[j].point1.id == selectedLines[k].point1.id)
					) {
						var p1 = selectedLines[i].point1;
						var p2 = selectedLines[i].point2;
						var p3 = selectedLines[j].point1;
						if (p3 == p1 || p3 == p2) {
							p3 = selectedLines[j].point2;
						}
						var id = `f${new Date().getTime()}-${(idAccumulator++)
							.toString()
							.padStart(8, "0")}`;

						data.faces.push(new Face(id, p1, p2, p3));
					}
				}
			}
		}

		return data;
	});
}
function removeSelectedFaces() {
	operation(function(data) {
		var newFaces = [];
		for (var i = 0; i < data.faces.length; i++) {
			if (!data.faces[i].isSelected()) {
				newFaces.push(data.faces[i]);
			}
		}
		data.faces = newFaces;
		return data;
	});
}

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++[|       Utilities        |]++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

function getSelectedPoints() {
	var selectedPoints = [];
	for (var i = 0; i < undoHistory[undoHistoryIndex].points.length; i++) {
		if (undoHistory[undoHistoryIndex].points[i].isSelected()) {
			selectedPoints.push(undoHistory[undoHistoryIndex].points[i]);
		}
	}
	return selectedPoints;
}

function getSelectedLines() {
	var selectedLines = [];
	for (var i = 0; i < undoHistory[undoHistoryIndex].lines.length; i++) {
		if (undoHistory[undoHistoryIndex].lines[i].isSelected()) {
			selectedLines.push(undoHistory[undoHistoryIndex].lines[i]);
		}
	}
	return selectedLines;
}

function getSelectedFaces() {
	var selectedFaces = [];
	for (var i = 0; i < undoHistory[undoHistoryIndex].faces.length; i++) {
		if (undoHistory[undoHistoryIndex].faces[i].isSelected()) {
			selectedFaces.push(undoHistory[undoHistoryIndex].faces[i]);
		}
	}
	return selectedFaces;
}

function lineExists(point1, point2) {
	var output = false;
	for (var i = 0; i < undoHistory[undoHistoryIndex].lines.length; i++) {
		if (
			(undoHistory[undoHistoryIndex].lines[i].point1.id == point1.id &&
				undoHistory[undoHistoryIndex].lines[i].point2.id == point2.id) ||
			(undoHistory[undoHistoryIndex].lines[i].point1.id == point2.id &&
				undoHistory[undoHistoryIndex].lines[i].point2.id == point1.id)
		) {
			output = true;
			break;
		}
	}
	return output;
}

function delaunayLines(pointArray) {
	var lineArray = [];
	var pointValueArray = [];
	for (var i = 0; i < pointArray.length; i++) {
		pointValueArray.push(pointArray[i].x);
		pointValueArray.push(pointArray[i].y);
	}
	var delaunay = new Delaunay(pointValueArray);
	var { points, halfedges, triangles, hull } = delaunay;
	for (let i = 0; i < halfedges.length; ++i) {
		var j = halfedges[i];
		if (j < i) continue;
		var ti = triangles[i];
		var tj = triangles[j];
		var point1 = null;
		var point2 = null;
		for (var j = 0; j < pointArray.length; j++) {
			if (
				(points[ti * 2] == pointValueArray[2 * j] &&
					points[ti * 2 + 1] == pointValueArray[2 * j + 1]) ||
				(points[ti * 2] == pointValueArray[2 * j + 1] &&
					points[ti * 2 + 1] == pointValueArray[2 * j])
			) {
				point1 = pointArray[j];
			}
			if (
				(points[tj * 2] == pointValueArray[2 * j] &&
					points[tj * 2 + 1] == pointValueArray[2 * j + 1]) ||
				(points[tj * 2] == pointValueArray[2 * j + 1] &&
					points[tj * 2 + 1] == pointValueArray[2 * j])
			) {
				point2 = pointArray[j];
			}
		}
		if (point1 && point2 && !lineExists(point1, point2)) {
			var id = `l${new Date().getTime()}-${(idAccumulator++)
				.toString()
				.padStart(8, "0")}`;
			lineArray.push(new Line(id, point1, point2));
		}
	}
	for (let i = -1; i < hull.length; ++i) {
		var point1 = null;
		var point2 = null;
		var point1index;
		if (i == 0) {
			point1index = hull[hull.length - 1];
		} else {
			point1index = hull[i - 1];
		}
		var point2index = hull[i];
		for (var j = 0; j < pointArray.length; j++) {
			if (
				(points[point1index * 2] == pointValueArray[2 * j] &&
					points[point1index * 2 + 1] == pointValueArray[2 * j + 1]) ||
				(points[point1index * 2] == pointValueArray[2 * j + 1] &&
					points[point1index * 2 + 1] == pointValueArray[2 * j])
			) {
				point1 = pointArray[j];
			}
			if (
				(points[point2index * 2] == pointValueArray[2 * j] &&
					points[point2index * 2 + 1] == pointValueArray[2 * j + 1]) ||
				(points[point2index * 2] == pointValueArray[2 * j + 1] &&
					points[point2index * 2 + 1] == pointValueArray[2 * j])
			) {
				point2 = pointArray[j];
			}
		}
		if (point1 && point2 && !lineExists(point1, point2)) {
			var id = `l${new Date().getTime()}-${(idAccumulator++)
				.toString()
				.padStart(8, "0")}`;
			lineArray.push(new Line(id, point1, point2));
		}
	}

	return lineArray;
}

function getByID(id) {
	if (id.startsWith("f")) {
		return getInternalByID(
			undoHistory[undoHistoryIndex].faces,
			undoHistory[undoHistoryIndex].faceMap,
			id
		);
	} else if (id.startsWith("l")) {
		return getInternalByID(
			undoHistory[undoHistoryIndex].lines,
			undoHistory[undoHistoryIndex].lineMap,
			id
		);
	} else if (id.startsWith("p")) {
		return getInternalByID(
			undoHistory[undoHistoryIndex].points,
			undoHistory[undoHistoryIndex].pointMap,
			id
		);
	} else {
		return null;
	}
}

function getInternalByID(dataArray, dataMap, id) {
	return dataArray[dataMap.get(id)];
}

function screenCoordsToSVG(offsetX, offsetY) {
	var svg = mainSVG.node();
	var group = mainSVG.mainGroup.node();
	var positionInfo = svg.getBoundingClientRect();
	var h = positionInfo.height;
	var w = positionInfo.width;
	var trans = d3.zoomTransform(group);

	return {
		x: (offsetX / w - trans.x) / trans.k,
		y: (offsetY / h - trans.y) / trans.k
	};
}

function svgCoordsToSection(x, y) {
	var svg = mainSVG.node();
	var group = mainSVG.mainGroup.node();
	var positionInfo = svg.getBoundingClientRect();
	var h = positionInfo.height;
	var w = positionInfo.width;

	return { x: (x + 0.005) * w, y: (y + 0.005) * h };
}

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++[|       Rendering        |]++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

function draw() {
	var pointCanvasHTML = "";
	var pointBasicHTML = "";
	undoHistory[undoHistoryIndex].points.forEach(function(point) {
		pointCanvasHTML = pointCanvasHTML.concat(point.svgCanvas());
		pointBasicHTML = pointBasicHTML.concat(point.svgBasic());
	});
	mainSVG.points.html(pointCanvasHTML);
	sub1SVG.points.html(pointBasicHTML);

	var lineCanvasHTML = "";
	var lineBasicHTML = "";
	undoHistory[undoHistoryIndex].lines.forEach(function(line) {
		lineCanvasHTML = lineCanvasHTML.concat(line.svgCanvas());
		lineBasicHTML = lineBasicHTML.concat(line.svgBasic());
	});
	mainSVG.lines.html(lineCanvasHTML);
	sub1SVG.lines.html(lineBasicHTML);

	var faceCanvasHTML = "";
	var faceBasicHTML = "";
	undoHistory[undoHistoryIndex].faces.forEach(function(face) {
		faceCanvasHTML = faceCanvasHTML.concat(face.svgCanvas());
		faceBasicHTML = faceBasicHTML.concat(face.svgBasic());
	});
	mainSVG.faces.html(faceCanvasHTML);
	sub1SVG.faces.html(faceBasicHTML);

	d3.selectAll(".svg-points").call(
		d3
			.drag()
			.filter(function() {
				return (
					!d3.event.ctrlKey && !d3.event.button //&&
					//(editType == 1)
				);
			})
			.on("start", dragPointStart)
			.on("drag", dragPoint)
			.on("end", dragPointEnd)
	);
	/*
	d3.selectAll(".svg-lines").call(
		d3
			.drag()
			.filter(function() {
				return (
					!d3.event.ctrlKey &&
					!d3.event.button &&
					(editType == 1 || editType == 2)
				);
			})
			.on("start", dragLineStart)
			.on("drag", dragLine)
			.on("end", dragLineEnd)
	);

	/*d3.selectAll(".svg-faces").call(
		d3
			.drag()
			.filter(function() {
				return (
					!d3.event.ctrlKey &&
					!d3.event.button &&
					(editType == 1 || editType == 2)
				);
			})
			.on("start", dragFaceStart)
			.on("drag", dragFace)
			.on("end", dragFaceEnd)
	);*/

	btnUndo.classed("btn-extra", undoHistoryIndex != 0 ? false : true);
	btnRedo.classed(
		"btn-extra",
		undoHistoryIndex !== undoHistory.length - 1 ? false : true
	);
}

function renderSVGOffset(offsetX, offsetY) {
	for (var i = 0; i < undoHistory[undoHistoryIndex].points.length; i++) {
		if (undoHistory[undoHistoryIndex].points[i].hasSelected()) {
			undoHistory[undoHistoryIndex].points[i].svgOffset(offsetX, offsetY);
		}
	}
	for (var i = 0; i < undoHistory[undoHistoryIndex].lines.length; i++) {
		if (undoHistory[undoHistoryIndex].lines[i].hasSelected()) {
			undoHistory[undoHistoryIndex].lines[i].svgOffset(offsetX, offsetY);
		}
	}
	for (var i = 0; i < undoHistory[undoHistoryIndex].faces.length; i++) {
		if (undoHistory[undoHistoryIndex].faces[i].hasSelected()) {
			undoHistory[undoHistoryIndex].faces[i].svgOffset(offsetX, offsetY);
		}
	}
}

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++[|         Setup          |]++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

$(document).ready(function() {
	undoHistory.push({
		points: [],
		lines: [],
		faces: []
	});
	zoom = d3.zoom();

	var borderWidth = 0.01;

	btnZoomIn.on("click", btnZoomInPress);
	btnZoomOut.on("click", btnZoomOutPress);
	btnZoomReset.on("click", btnZoomResetPress);

	btnBackgroundVis.on("click", btnBackgroundVisPress);
	btnPointsVis.on("click", btnPointsVisPress);
	btnLinesVis.on("click", btnLinesVisPress);
	btnFacesVis.on("click", btnFacesVisPress);

	btnUndo.on("click", btnUndoPress);
	btnRedo.on("click", btnRedoPress);

	$("#backgroundImageLoader").on("change", uploadBackground);

	d3.select("body")
		.on("keydown", downKey)
		.on("keyup", upKey)
		.on("mousemove", mouseMove);

	window.addEventListener("contextmenu", function(e) {
		e.preventDefault();
	});

	mainSVG.mainGroup = mainSVG
		.append("g")
		.on("mousedown", mouseDownAll)
		.on("mouseup", mouseUpAll);
	mainSVG.mainGroup
		.append("rect")
		.attr("x", -borderWidth / 2)
		.attr("y", -borderWidth / 2)
		.attr("width", 1 + borderWidth)
		.attr("height", 1 + borderWidth)
		.attr("fill", "rgba(0,0,0,0)")
		.attr("stroke", "#000000")
		.attr("stroke-width", borderWidth)
		.on("mousedown", boxSelectStart)
		.on("mousemove", boxSelecting)
		.on("mouseup", boxSelectEnd);
	mainSVG.selectRect = mainSVG.mainGroup
		.append("rect")
		.attr("x", -100)
		.attr("y", -100)
		.attr("width", 0)
		.attr("height", 0)
		.attr("fill", "rgba(80, 180, 220, 0.3)")
		.attr("stroke", "rgba(80, 180, 220, 0.6)")
		.attr("stroke-width", borderWidth / 3)
		.style("pointer-events", "none");
	mainSVG.faces = mainSVG.mainGroup.append("g");
	mainSVG.lines = mainSVG.mainGroup.append("g");
	mainSVG.points = mainSVG.mainGroup.append("g");

	sub1SVG.viewGroup = sub1SVG.append("g");
	sub1SVG.points = sub1SVG.append("g");
	sub1SVG.lines = sub1SVG.append("g");
	sub1SVG.faces = sub1SVG.append("g");
	sub1SVG.viewGroup.viewBoxRect = sub1SVG.viewGroup
		.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", 1)
		.attr("height", 1)
		.attr("fill", "rgba(0,0,0,0)")
		.attr("stroke", "rgba(0,64,128,0.5)")
		.attr("stroke-width", borderWidth);

	mainSVG.call(
		zoom
			.extent([
				[0, 0],
				[1, 1]
			])
			.translateExtent([
				[-2, -2],
				[3, 3]
			])
			.scaleExtent([Math.pow(1 / zoomFactor, 8), Math.pow(zoomFactor, 8)])
			.filter(function() {
				return (
					!d3.event.ctrlKey &&
					(d3.event.button == 2 || d3.event.type == "wheel") &&
					d3.event.type != "dblclick"
				);
			})
			.on("start", zoomStart)
			.on("zoom", zooming)
			.on("end", zoomEnd)
	);
});
