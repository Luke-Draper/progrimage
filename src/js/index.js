import "../scss/style.js";
import * as d3 from "../../node_modules/d3/dist/d3.js";
import { Delaunay } from "d3-delaunay";

/*     --==++==--     --==++[| Constants |]++==--     --==++==--     */

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

const mainSVG = d3.select("#main-svg");
const sub1SVG = d3.select("#sub-1-svg");

/*     --==++==--     --==++[| Variables |]++==--     --==++==--     */

var undoHistoryIndex = 0;
var undoHistory = [];
var editType = 0;
var zoom;

var idAccumulator = 0;
var initial = null;
var selectedPoints = [];

var threshold = 5;
var downCoord = { x: -1, y: -1 };

var keydown = " ";

/*     --==++==--     --==++[| Classes |]++==--     --==++==--     */

class Point {
	constructor(
		id,
		x,
		y,
		radius = 0.005,
		color = "rgba(0,0,0,1)",
		selected = false
	) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
		this.selected = selected;
	}

	svgFormat() {
		return `${this.x},${this.y}`;
	}

	svgPoint() {
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

	svgBasicPoint() {
		var color = "rgba(0,128,0,1)";
		if (this.selected) {
			color = "#ff873d";
		}
		return `<circle cx="${this.x}" cy="${this.y}" r="0.005" fill="${color}"/>`;
	}

	svgExportPoint() {
		return `<circle cx="${this.x}" cy="${this.y}" r="${this.radius}" fill="${this.color}"/>`;
	}
}

class Line {
	constructor(
		id,
		point1,
		point2,
		strokeWidth = 0.005,
		color = "rgba(0,0,0,1)",
		lineCap = "round"
	) {
		this.id = id;
		this.point1 = point1;
		this.point2 = point2;
		this.strokeWidth = strokeWidth;
		this.color = color;
		this.lineCap = lineCap;
	}

	svgLine() {
		var p1 = getPointByID(this.point1);
		var p2 = getPointByID(this.point2);
		var selectAttributes = `stroke="${this.color}" stroke-linecap="${this.lineCap}"`;
		if (p1.selected && p2.selected) {
			var dash = this.strokeWidth / 3;
			selectAttributes = ` stroke="#ff873d" stroke-linecap="round" stroke-dasharray="0.00001,${dash}"`;
		}
		return `<line id="${this.id}" class="svg-lines" x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke-width="${this.strokeWidth}" ${selectAttributes}/>`;
	}

	svgBasicLine() {
		var p1 = getPointByID(this.point1);
		var p2 = getPointByID(this.point2);
		var color = "rgba(0,128,0,0.4)";
		if (p1.selected && p2.selected) {
			color = `rgba(255,135,61,0.7)" stroke-dasharray="0.00001,0.0083333`;
		}
		return `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke-width="0.0015" stroke="${color}" stroke-linecap="round"/>`;
	}

	svgExportLine() {
		var p1 = getPointByID(this.point1);
		var p2 = getPointByID(this.point2);
		return `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke-width="${this.strokeWidth}" stroke="${this.color}" stroke-linecap="${lineCap}"/>`;
	}
}

class Face {
	constructor(id, point1, point2, point3, color = "rgba(0,0,0,0.5)") {
		this.id = id;
		this.point1 = point1;
		this.point2 = point2;
		this.point3 = point3;
		this.color = color;
	}

	svgFace() {
		var p1 = getPointByID(this.point1);
		var p2 = getPointByID(this.point2);
		var p3 = getPointByID(this.point3);
		var selectAttributes = "";
		if (p1.selected && p2.selected && p3.selected) {
			var avgX = (p1.x + p2.x + p3.x) / 3;
			var avgY = (p1.y + p2.y + p3.y) / 3;
			selectAttributes = `<circle cx="${avgX}" cy="${avgY}" r="0.05" fill="rgba(255,135,61,0.4)"/>`;
		}
		return `<polygon id="${
			this.id
		}" points="${p1.svgFormat()} ${p2.svgFormat()} ${p3.svgFormat()}" fill="${
			this.color
		}"/>${selectAttributes}`;
	}

	svgBasicFace() {
		var p1 = getPointByID(this.point1);
		var p2 = getPointByID(this.point2);
		var p3 = getPointByID(this.point3);
		var color = "rgba(0,128,128,0.2)";
		if (p1.selected && p2.selected && p3.selected) {
			color = "rgba(255,135,61,0.4)";
		}
		return `<polygon class="svg-faces" points="${p1.svgFormat()} ${p2.svgFormat()} ${p3.svgFormat()}" fill="${color}"/>`;
	}

	svgExportFace() {
		var p1 = getPointByID(this.point1);
		var p2 = getPointByID(this.point2);
		var p3 = getPointByID(this.point3);
		return `<polygon points="${p1.svgFormat()} ${p2.svgFormat()} ${p3.svgFormat()}" fill="${
			this.color
		}"/>`;
	}
}

/*     --==++==--     --==++[| Callbacks |]++==--     --==++==--     */

var btnEditTypePress = function() {
	editType++;
	if (editType >= 2) {
		editType = 0;
		enableZoom();
	} else {
		enableZoom(false);
	}

	updateEditType();
};

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

var btnZoomInPress = function() {
	keydown = "~";
	enableZoom();
	zoom.scaleBy(mainSVG, 1.25);
	mainSVG.call(zoom);
};
var btnZoomOutPress = function() {
	keydown = "~";
	enableZoom();
	zoom.scaleBy(mainSVG, 0.8);
	mainSVG.call(zoom);
};
var btnZoomResetPress = function() {
	enableZoom();
	mainSVG
		.transition()
		.duration(500)
		.call(zoom.transform, d3.zoomIdentity);
};

var zoomStart = function() {
	if (editType == 0) {
		mainSVG.attr("cursor", "grabbing");
	}
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
	if (editType != 0) {
		enableZoom(false);
	}
};
var zoomEnd = function() {
	if (editType == 0) {
		mainSVG.attr("cursor", "grab");
	}
};

var dragPointStart = function() {
	keydown = "~";
	var point = getByID(
		undoHistory[undoHistoryIndex].points,
		d3
			.select(this)
			.raise()
			.attr("id")
	);
	initial = { x: point.x, y: point.y };
	d3.selectAll(".svg-points").attr("cursor", "grabbing");
};
var dragPoint = function() {
	var p = d3.select(this);
	var dx = d3.event.x - initial.x;
	var dy = d3.event.y - initial.y;
	if (dx * dx + dy * dy > p.attr("r") * p.attr("r")) {
		p.attr("cx", d3.event.x).attr("cy", d3.event.y);
	}
};
var dragPointEnd = function() {
	keydown = "~";
	var p = d3.select(this);
	var point = getPointByID(p.attr("id"));
	var dx = d3.event.x - initial.x;
	var dy = d3.event.y - initial.y;
	if (dx * dx + dy * dy > p.attr("r") * p.attr("r")) {
		updatePointLocation(p.attr("id"), d3.event.x, d3.event.y);
	}
	d3.selectAll(".svg-points").attr("cursor", "grab");
	testAndSelectPoint(point);
	draw();
};

var downBack = function() {
	keydown = "~";
	downCoord.x = d3.event.x;
	downCoord.y = d3.event.y;
};

var upBack = function() {
	keydown = "~";
	if (
		editType != 0 &&
		Math.abs(d3.event.x - downCoord.x) < threshold &&
		Math.abs(d3.event.y - downCoord.y) < threshold
	) {
		var coords = eventCoordsToSVG(d3.event);
		addPoint(coords.x, coords.y);
	}
};

var downKey = function() {
	keydown = d3.event.key;
};

var upKey = function() {
	if (d3.event.key == keydown) {
		if (keydown == "l") {
			addDelaunayLine();
		}
	}
};

/*     --==++==--     --==++[| History |]++==--     --==++==--     */

function operation(fn) {
	undoHistory = undoHistory.slice(0, undoHistoryIndex + 1);
	var newVersion = fn(duplicateData(undoHistory[undoHistoryIndex]));

	undoHistory.push(newVersion);
	undoHistoryIndex++;

	draw();
}

function addPoint(x, y) {
	operation(function(data) {
		var id = `p${new Date().getTime()}|${(idAccumulator++)
			.toString()
			.padStart(8, "0")}`;
		var newPoint = new Point(id, x, y);
		data.points.push(newPoint);

		var pointIsSelected = !newPoint.selected;
		if (d3.event.shiftKey) {
			newPoint.selected = pointIsSelected;
			if (pointIsSelected) {
				selectedPoints.push(newPoint);
			} else {
				selectedPoints = selectedPoints.filter(function(p) {
					return p.id != newPoint.id;
				});
			}
		} else {
			for (var i = 0; i < data.points.length; i++) {
				data.points[i].selected = false;
			}
			selectedPoints = [];
			newPoint.selected = pointIsSelected;
			if (newPoint.selected) {
				selectedPoints.push(newPoint);
			}
		}
		return data;
	});
}

function removePoint(id) {
	operation(function(data) {
		var newPoints = [];
		data.points.forEach(function(point) {
			if (point.id != id) {
				newPoints.push(point);
			}
		});
		data.points = newPoints;
		return data;
	});
}

function updatePointLocation(id, x, y) {
	operation(function(data) {
		var oldPoint = null;
		var newPoints = [];
		data.points.forEach(function(point) {
			if (point.id != id) {
				newPoints.push(point);
			} else {
				oldPoint = point;
			}
		});
		if (oldPoint) {
			newPoints.push(
				new Point(
					oldPoint.id,
					x,
					y,
					oldPoint.radius,
					oldPoint.color,
					oldPoint.selected
				)
			);
		}
		data.points = newPoints;
		return data;
	});
}

function addLine() {
	operation(function(data) {
		for (var i = 0; i < selectedPoints.length - 1; i++) {
			for (var j = 1; j < selectedPoints.length; j++) {
				if (!lineExists(selectedPoints[i].id, selectedPoints[j].id)) {
					var id = `l${new Date().getTime()}|${(idAccumulator++)
						.toString()
						.padStart(8, "0")}`;
					data.lines.push(
						new Line(id, selectedPoints[i].id, selectedPoints[j].id)
					);
				}
			}
		}
		return data;
	});
}
function addDelaunayLine() {
	operation(function(data) {
		var lines = delaunayLines(selectedPoints);
		for (var i = 0; i < lines.length; i++) {
			data.lines.push(lines[i]);
		}
		return data;
	});
}
function removeLine(id) {
	operation(function(data) {
		var newLines = [];
		data.lines.forEach(function(line) {
			if (line.id != id) {
				newLines.push(line);
			}
		});
		data.lines = newLines;
		return data;
	});
}

function addFace(x, y) {
	operation(function(data) {
		var id = `f${new Date().getTime()}|${(idAccumulator++)
			.toString()
			.padStart(8, "0")}`;
		data.faces.push(new Face(id, x, y));
		return data;
	});
}
function removeFace(id) {
	operation(function(data) {
		var newFaces = [];
		data.faces.forEach(function(face) {
			if (face.id != id) {
				newFaces.push(face);
			}
		});
		data.faces = newFaces;
		return data;
	});
}

/*     --==++==--     --==++[| Utilities |]++==--     --==++==--     */

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

function testAndSelectPoint(point) {
	var shift;
	if (d3.event.sourceEvent) {
		shift = d3.event.sourceEvent.shiftKey;
	} else {
		shift = d3.event.shiftKey;
	}
	if (shift) {
		andSelectPoint(point);
	} else {
		selectPoint(point);
	}
}

function selectPoint(point) {
	var pointIsSelected = !point.selected;
	for (var i = 0; i < undoHistory[undoHistoryIndex].points.length; i++) {
		undoHistory[undoHistoryIndex].points[i].selected = false;
	}
	selectedPoints = [];
	point.selected = pointIsSelected;
	if (point.selected) {
		selectedPoints.push(point);
	}
}

function andSelectPoint(point) {
	point.selected = !point.selected;
	if (point.selected) {
		selectedPoints.push(point);
	} else {
		selectedPoints = selectedPoints.filter(function(p) {
			return p.id != point.id;
		});
	}
}

function lineExists(point1, point2) {
	var output = false;
	for (var i = 0; i < undoHistory[undoHistoryIndex].lines.length; i++) {
		if (
			(undoHistory[undoHistoryIndex].lines[i].point1 == point1 &&
				undoHistory[undoHistoryIndex].lines[i].point2 == point2) ||
			(undoHistory[undoHistoryIndex].lines[i].point1 == point2 &&
				undoHistory[undoHistoryIndex].lines[i].point2 == point1)
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
	console.log(pointArray);
	console.log(pointValueArray);
	var delaunay = new Delaunay(pointValueArray);
	var { points, halfedges, triangles, hull } = delaunay;
	for (let i = 0; i < halfedges.length; ++i) {
		var j = halfedges[i];
		if (j < i) continue;
		var ti = triangles[i];
		var tj = triangles[j];
		var point1id = null;
		var point2id = null;
		for (var j = 0; j < pointArray.length; j++) {
			if (
				(points[ti * 2] == pointValueArray[2 * j] &&
					points[ti * 2 + 1] == pointValueArray[2 * j + 1]) ||
				(points[ti * 2] == pointValueArray[2 * j + 1] &&
					points[ti * 2 + 1] == pointValueArray[2 * j])
			) {
				point1id = pointArray[j].id;
			}
			if (
				(points[tj * 2] == pointValueArray[2 * j] &&
					points[tj * 2 + 1] == pointValueArray[2 * j + 1]) ||
				(points[tj * 2] == pointValueArray[2 * j + 1] &&
					points[tj * 2 + 1] == pointValueArray[2 * j])
			) {
				point2id = pointArray[j].id;
			}
		}
		if (point1id && point2id && !lineExists(point1id, point2id)) {
			var id = `l${new Date().getTime()}|${(idAccumulator++)
				.toString()
				.padStart(8, "0")}`;
			lineArray.push(new Line(id, point1id, point2id));
		}
	}
	for (let i = -1; i < hull.length; ++i) {
		var point1id = null;
		var point2id = null;
		var point1index = i;
		var point2index = i + 1;
		if (point1index == -1) {
			point1index = hull.length;
		}
		for (var j = 0; j < pointArray.length; j++) {
			if (
				(points[i * 2] == pointArray[point1index].x &&
					points[i * 2 + 1] == pointArray[point1index].y) ||
				(points[i * 2] == pointArray[point1index].y &&
					points[i * 2 + 1] == pointArray[point1index].x)
			) {
				point1id = pointArray[j].id;
			}
			if (
				(points[i * 2] == pointArray[point2index].x &&
					points[i * 2 + 1] == pointArray[point2index].y) ||
				(points[i * 2] == pointArray[point2index].y &&
					points[i * 2 + 1] == pointArray[point2index].x)
			) {
				point2id = pointArray[j].id;
			}
		}
		if (point1id && point2id && !lineExists(point1id, point2id)) {
			var id = `l${new Date().getTime()}|${(idAccumulator++)
				.toString()
				.padStart(8, "0")}`;
			lineArray.push(new Line(id, point1id, point2id));
		}
	}

	return lineArray;
}

function getPointByID(id) {
	return getByID(undoHistory[undoHistoryIndex].points, id);
}
function getLineByID(id) {
	return getByID(undoHistory[undoHistoryIndex].lines, id);
}
function getFaceByID(id) {
	return getByID(undoHistory[undoHistoryIndex].faces, id);
}
function getAnyByID(id) {
	if (id.contains("f")) {
		return getFaceByID(id);
	} else if (id.contains("l")) {
		return getLineByID(id);
	} else {
		return getPointByID(id);
	}
}

function getByID(dataArray, id) {
	var output = null;
	for (var i = 0; i < dataArray.length; i++) {
		if (dataArray[i].id == id) {
			output = dataArray[i];
			break;
		}
	}
	return output;
}

function eventCoordsToSVG(e) {
	return screenCoordsToSVG(e.offsetX, e.offsetY);
}

function screenCoordsToSVG(x, y) {
	var svg = mainSVG.node();
	var group = mainSVG.mainGroup.node();
	var positionInfo = svg.getBoundingClientRect();
	var h = positionInfo.height;
	var w = positionInfo.width;
	var trans = d3.zoomTransform(group);

	return { x: (x / w - trans.x) / trans.k, y: (y / h - trans.y) / trans.k };
}

function enableZoom(allowed = true) {
	if (allowed) {
		zoom.filter(function() {
			return (
				!d3.event.ctrlKey && !d3.event.button && d3.event.type != "dblclick"
			);
		});
	} else {
		zoom.filter(function() {
			return false;
		});
	}
}

function updateEditType() {
	for (var i = 0; i < editTypeIcons.length; i++) {
		editTypeIcons[i].attr("style", "display:none;");
	}

	editTypeIcons[editType].attr("style", "display: inline-block");
	btnEditType.attr("title", editTypeIcons[editType].attr("title"));

	if (editType == 0) {
		mainSVG.attr("cursor", "grab");
	} else {
		mainSVG.attr("cursor", null);
	}

	if (editType == 1 || editType == 2) {
		d3.selectAll(".svg-points").attr("cursor", "grab");
	} else {
		d3.selectAll(".svg-points").attr("cursor", null);
	}

	if (editType == 1 || editType == 3) {
		d3.selectAll(".svg-lines").attr("cursor", "grab");
	} else {
		d3.selectAll(".svg-lines").attr("cursor", null);
	}

	if (editType == 1 || editType == 4) {
		d3.selectAll(".svg-faces").attr("cursor", "grab");
	} else {
		d3.selectAll(".svg-faces").attr("cursor", null);
	}
}

/* --==++==-- --==++[| Rendering |]++==--     --==++==--     */

function draw() {
	var pointHTML = "";
	var pointBasicHTML = "";
	undoHistory[undoHistoryIndex].points.forEach(function(point) {
		pointHTML = pointHTML.concat(point.svgPoint());
		pointBasicHTML = pointBasicHTML.concat(point.svgBasicPoint());
	});
	mainSVG.points.html(pointHTML);
	sub1SVG.points.html(pointBasicHTML);

	var lineHTML = "";
	var lineBasicHTML = "";
	undoHistory[undoHistoryIndex].lines.forEach(function(line) {
		lineHTML = lineHTML.concat(line.svgLine());
		lineBasicHTML = lineBasicHTML.concat(line.svgBasicLine());
	});
	mainSVG.lines.html(lineHTML);
	sub1SVG.lines.html(lineBasicHTML);

	var faceHTML = "";
	var faceBasicHTML = "";
	undoHistory[undoHistoryIndex].faces.forEach(function(face) {
		faceHTML = faceHTML.concat(face.svgFace());
		faceBasicHTML = faceBasicHTML.concat(face.svgBasicFace());
	});
	mainSVG.faces.html(faceHTML);
	sub1SVG.faces.html(faceBasicHTML);

	d3.selectAll(".svg-points").call(
		d3
			.drag()
			.filter(function() {
				return (
					!d3.event.ctrlKey &&
					!d3.event.button &&
					(editType == 1 || editType == 2)
				);
			})
			.on("start", dragPointStart)
			.on("drag", dragPoint)
			.on("end", dragPointEnd)
	);

	d3.selectAll(".svg-lines").on("click", function(e) {});

	d3.selectAll(".svg-faces").on("click", function(e) {});

	btnUndo.attr("disabled", undoHistoryIndex != 0 ? null : "disabled");
	btnRedo.attr(
		"disabled",
		undoHistoryIndex !== undoHistory.length - 1 ? null : "disabled"
	);
}

/*     --==++==--     --==++[| Setup |]++==--     --==++==--     */

$(document).ready(function() {
	undoHistory.push({
		points: [],
		lines: [],
		faces: []
	});
	zoom = d3.zoom();
	enableZoom();

	var borderWidth = 0.01;

	btnEditType.on("click", btnEditTypePress);

	btnZoomIn.on("click", btnZoomInPress);
	btnZoomOut.on("click", btnZoomOutPress);
	btnZoomReset.on("click", btnZoomResetPress);

	btnUndo.on("click", btnUndoPress);
	btnRedo.on("click", btnRedoPress);

	d3.select("body")
		.on("keydown", downKey)
		.on("keyup", upKey);

	mainSVG
		.attr("cursor", "grab")
		.on("mousedown", downBack)
		.on("mouseup", upBack);
	mainSVG.mainGroup = mainSVG.append("g");
	mainSVG.mainGroup
		.append("rect")
		.attr("x", -borderWidth / 2)
		.attr("y", -borderWidth / 2)
		.attr("width", 1 + borderWidth)
		.attr("height", 1 + borderWidth)
		.attr("fill", "rgba(0,0,0,0)")
		.attr("stroke", "#000000")
		.attr("stroke-width", borderWidth);
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
				[-0.75, -0.75],
				[1.75, 1.75]
			])
			.scaleExtent([0.512, 3.0517578125])
			.on("start", zoomStart)
			.on("zoom", zooming)
			.on("end", zoomEnd)
	);
});
