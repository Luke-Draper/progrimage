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

var initial = null;
var selectedPoints = [];

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
			var stroke = this.radius / 10;
			var dash = stroke / 3;
			selectAttributes = ` stroke="#ff873d" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="0.00001,${dash}"`;
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
		var p1 = getByID(undoHistory[undoHistoryIndex].points, this.point1);
		var p2 = getByID(undoHistory[undoHistoryIndex].points, this.point2);
		var selectAttributes = `stroke="${this.color}" stroke-linecap="${this.lineCap}"`;
		if (p1.selected && p2.selected) {
			var dash = this.strokeWidth / 3;
			selectAttributes = ` stroke="#ff873d" stroke-linecap="round" stroke-dasharray="0.00001,${dash}"`;
		}
		return `<line id="${this.id}" class="svg-lines" x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke-width="${this.strokeWidth}" ${selectAttributes}/>`;
	}

	svgBasicLine() {
		var p1 = getByID(undoHistory[undoHistoryIndex].points, this.point1);
		var p2 = getByID(undoHistory[undoHistoryIndex].points, this.point2);
		var color = "rgba(0,128,0,0.4)";
		if (p1.selected && p2.selected) {
			color = `rgba(255,135,61,0.4)" stroke-dasharray="0.00001,0.0083333`;
		}
		return `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke-width="0.0015" stroke="${color}" stroke-linecap="round"/>`;
	}

	svgExportLine() {
		var p1 = getByID(undoHistory[undoHistoryIndex].points, this.point1);
		var p2 = getByID(undoHistory[undoHistoryIndex].points, this.point2);
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
		var p1 = getByID(undoHistory[undoHistoryIndex].points, this.point1);
		var p2 = getByID(undoHistory[undoHistoryIndex].points, this.point2);
		var p3 = getByID(undoHistory[undoHistoryIndex].points, this.point3);
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
		var p1 = getByID(undoHistory[undoHistoryIndex].points, this.point1);
		var p2 = getByID(undoHistory[undoHistoryIndex].points, this.point2);
		var p3 = getByID(undoHistory[undoHistoryIndex].points, this.point3);
		var color = "rgba(0,128,128,0.2)";
		if (p1.selected && p2.selected && p3.selected) {
			color = "rgba(255,135,61,0.2)";
		}
		return `<polygon class="svg-faces" points="${p1.svgFormat()} ${p2.svgFormat()} ${p3.svgFormat()}" fill="${color}"/>`;
	}

	svgExportFace() {
		var p1 = getByID(undoHistory[undoHistoryIndex].points, this.point1);
		var p2 = getByID(undoHistory[undoHistoryIndex].points, this.point2);
		var p3 = getByID(undoHistory[undoHistoryIndex].points, this.point3);
		return `<polygon points="${p1.svgFormat()} ${p2.svgFormat()} ${p3.svgFormat()}" fill="${
			this.color
		}"/>`;
	}
}

/*     --==++==--     --==++[| Callbacks |]++==--     --==++==--     */

var btnEditTypePress = function() {
	editTypeIcons[editType].attr("style", "display:none;");
	editType++;
	if (editType >= 5) {
		editType = 0;
		enableZoom();
	} else {
		enableZoom(false);
	}
	editTypeIcons[editType].attr("style", "display: inline-block");
	btnEditType.attr("title", editTypeIcons[editType].attr("title"));

	if (editType == 0) {
		mainSVG.mainGroup.attr("cursor", "grab");
	} else {
		mainSVG.mainGroup.attr("cursor", null);
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
};

var btnUndoPress = function() {
	if (undoHistoryIndex > 0) undoHistoryIndex--;
	draw();
};
var btnRedoPress = function() {
	if (undoHistoryIndex < undoHistory.length) undoHistoryIndex++;
	draw();
};

var btnZoomInPress = function() {
	enableZoom();
	zoom.scaleBy(mainSVG, 1.25);
	mainSVG.call(zoom);
};
var btnZoomOutPress = function() {
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
		mainSVG.mainGroup.attr("cursor", "grabbing");
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
		mainSVG.mainGroup.attr("cursor", "grab");
	}
};

var dragPointStart = function() {
	var point = getByID(
		undoHistory[undoHistoryIndex].points,
		d3
			.select(this)
			.raise()
			.attr("id")
	);
	initial = { x: point.x, y: point.y };
	if (d3.event.sourceEvent.shiftKey) {
		point.selected = !point.selected;
	} else {
		point.selected = !point.selected;
	}
	d3.selectAll(".svg-points").attr("cursor", "grabbing");
};
var dragPoint = function() {
	var p = d3.select(this);
	dx = d3.event.x - initial.x;
	dy = d3.event.y - initial.y;
	if (dx * dx + dy * dy > p.attr("r") * p.attr("r")) {
		p.attr("cx", d3.event.x).attr("cy", d3.event.y);
	}
};
var dragPointEnd = function() {
	var p = d3.select(this);
	dx = d3.event.x - initial.x;
	dy = d3.event.y - initial.y;
	if (dx * dx + dy * dy > p.attr("r") * p.attr("r")) {
		console.log("Hi");
		updatePointLocation(p.attr("id"), d3.event.x, d3.event.y);
	}
	d3.selectAll(".svg-points").attr("cursor", "grab");
	draw();
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
		data.points.push(new Point(new Date().getTime(), x, y));
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

function addLine(point1, point2) {
	operation(function(data) {
		data.lines.push(new Line(new Date().getTime(), point1, point2));
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
		data.faces.push(new Face(new Date().getTime(), x, y));
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

	mainSVG.mainGroup = mainSVG.append("g").attr("cursor", "grab");
	mainSVG.mainGroup
		.append("rect")
		.attr("x", -borderWidth / 2)
		.attr("y", -borderWidth / 2)
		.attr("width", 1 + borderWidth)
		.attr("height", 1 + borderWidth)
		.attr("fill", "rgba(0,0,0,0)")
		.attr("stroke", "#000000")
		.attr("stroke-width", borderWidth);
	mainSVG.points = mainSVG.mainGroup.append("g");
	mainSVG.lines = mainSVG.mainGroup.append("g");
	mainSVG.faces = mainSVG.mainGroup.append("g");

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
