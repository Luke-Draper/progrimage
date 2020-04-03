import "../scss/style.js";
import * as d3 from "../../node_modules/d3/dist/d3.js";
import { Delaunay } from "d3-delaunay";
import iro from "@jaames/iro";
import $ from "jquery/dist/jquery";
import "jquery-ui/ui/widgets/sortable.js";
import fast9 from "fast9/fast9.js";

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++[|       Constants        |]++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

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
const btnAddPoints = d3.select("#btn-back-add-points");
const btnPointsVis = d3.select("#btn-points-vis");
const btnLinesVis = d3.select("#btn-lines-vis");
const btnFacesVis = d3.select("#btn-faces-vis");

const mainSVG = d3.select("#main-svg");
const miniDisplaySVG = d3.select("#mini-display-svg");

const tabSidebarBackground = d3.select("#tab-sidebar-background");
const thresholdNumber = d3.select("#threshold-number");

const backgroundCanvas = d3.select("#main-background");
const imageBase = d3.select("#image-base");
const backForm = d3.select("#backgroundImageLoader");

const miniDisplay = d3.select("#mini-display");
const miniDisplayToggle = d3.select("#mini-display-toggle");
const btnMiniDisplay = d3.select("#btn-mini-display-toggle");
const btnMiniDisplayOpenIcon = d3.select("#btn-mini-display-toggle-open");
const btnMiniDisplayCloseIcon = d3.select("#btn-mini-display-toggle-close");

const btnTabs = [
	d3.select("#point-tab"),
	d3.select("#line-tab"),
	d3.select("#face-tab"),
	d3.select("#layer-tab"),
	d3.select("#background-tab")
];

const btnTabContents = [
	d3.select("#point-tab-content"),
	d3.select("#line-tab-content"),
	d3.select("#face-tab-content"),
	d3.select("#layer-tab-content"),
	d3.select("#background-tab-content")
];

const pointRadiusNumber = d3.select("#point-radius-number");
const lineWidthNumber = d3.select("#line-width-number");

const pointHueNumber = d3.select("#point-hue-number");
const pointSaturationNumber = d3.select("#point-saturation-number");
const pointValueNumber = d3.select("#point-value-number");
const pointAlphaNumber = d3.select("#point-alpha-number");

const lineHueNumber = d3.select("#line-hue-number");
const lineSaturationNumber = d3.select("#line-saturation-number");
const lineValueNumber = d3.select("#line-value-number");
const lineAlphaNumber = d3.select("#line-alpha-number");

const faceHueNumber = d3.select("#face-hue-number");
const faceSaturationNumber = d3.select("#face-saturation-number");
const faceValueNumber = d3.select("#face-value-number");
const faceAlphaNumber = d3.select("#face-alpha-number");

const btnPointApply = d3.select("#btn-point-apply");
const btnLineApply = d3.select("#btn-line-apply");
const btnFaceApply = d3.select("#btn-face-apply");

const zoomFactor = 1.25;

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++[|       Variables        |]++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

var undoHistoryIndex = 0;
var undoHistory = [];

var zoom;

var currentLayer = "Layer1";
var redrawLayers = true;

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

var miniDisplayVisible = true;

var mouseClientCoords = { x: 0, y: 0 };
var mouseOffsetCoords = { x: 0, y: 0 };

var pointColorPicker;
var lineColorPicker;
var faceColorPicker;

var pointColorEdited = false;
var lineColorEdited = false;
var faceColorEdited = false;

var pointOtherEdited = false;
var lineOtherEdited = false;

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++[|       Classes          |]++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

class SVGCanvasElement {
	constructor(id, color = "rgba(0,0,0,1)", layer = currentLayer) {
		this.id = id;
		this.color = color;
		this.layer = layer;
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
		layer = currentLayer,
		selected = false
	) {
		super(id, color, layer);
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
		if (currentLayer == this.layer) {
			this.selected = true;
		}
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
		if (this.isSelected()) {
			var stroke = this.radius / 5;
			var dash = stroke / 3;
			selectAttributes = ` stroke="#ff873d" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="0.00001,${stroke}"`;
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
		if (this.isSelected()) {
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
		layer = currentLayer
	) {
		super(id, color, layer);
		this.point1ID = point1ID;
		this.point2ID = point2ID;
		this.strokeWidth = strokeWidth;
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
		if (currentLayer == this.layer) {
			getByID(this.point1ID).select();
			getByID(this.point2ID).select();
		}
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
		var selectAttributes = `stroke="${this.color}" stroke-linecap="round"`;
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
		}" stroke-linecap="round"/>`;
	}
}

class Face extends SVGCanvasElement {
	constructor(
		id,
		point1ID,
		point2ID,
		point3ID,
		color = "rgba(0,0,0,0.5)",
		layer = currentLayer
	) {
		super(id, color, layer);
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
		if (currentLayer == this.layer) {
			getByID(this.point1ID).select();
			getByID(this.point2ID).select();
			getByID(this.point3ID).select();
		}
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
		return `<polygon id="${this.id}" class="svg-faces" points="${getByID(
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

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

var btnUndoPress = function() {
	keydown = "~";
	if (undoHistoryIndex > 0) undoHistoryIndex--;
	redrawLayers = true;
	draw();
};
var btnRedoPress = function() {
	keydown = "~";
	if (undoHistoryIndex < undoHistory.length) undoHistoryIndex++;
	redrawLayers = true;
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

var btnMiniDisplayPress = function() {
	miniDisplayVisible = !miniDisplayVisible;
	if (miniDisplayVisible) {
		miniDisplay.style("display", "inherit");
		btnMiniDisplayOpenIcon.style("display", "none");
		btnMiniDisplayCloseIcon.style("display", "inherit");
		miniDisplayToggle.style("left", "19.7%");
	} else {
		miniDisplay.style("display", "none");
		btnMiniDisplayOpenIcon.style("display", "inherit");
		btnMiniDisplayCloseIcon.style("display", "none");
		miniDisplayToggle.style("left", "0");
	}
};

var btnTabPress = function() {
	var btn = d3.select(this);
	btnTabs.forEach(function(btnOff) {
		btnOff.attr("aria-selected", "false");
		btnOff.classed("active", false);
	});
	btn.attr("aria-selected", "true");
	btn.classed("active", true);

	btnTabContents.forEach(function(btnContent) {
		btnContent.classed("active", false);
	});
	d3.select(`#${btn.attr("aria-controls")}`).classed("active", true);
};

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++[| Interaction  Callbacks |]++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

var zoomStart = function() {
	mainSVG.attr("cursor", "grabbing");
};
var zooming = function() {
	mainSVG.mainGroup.attr("transform", d3.event.transform);
	miniDisplaySVG.viewGroup.attr(
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
	var point = getByID(d3.select(this).attr("id"));
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

	var point = getByID(d3.select(this).attr("id"));
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
		deselectAll();
	}
	point.select();

	draw();
};

var dragLineStart = function() {
	d3.selectAll(".svg-lines").attr("cursor", "grabbing");
	var line = getByID(d3.select(this).attr("id"));
	if (
		!(
			d3.event.shiftKey ||
			(d3.event.sourceEvent && d3.event.sourceEvent.shiftKey)
		)
	) {
		deselectAll();
	}
	line.select();
	draw();
	dragPointStart.call(d3.select(`#${line.point1ID}`).node());
};
var dragLine = function() {
	var line = getByID(d3.select(this).attr("id"));
	dragPoint.call(d3.select(`#${line.point1ID}`).node());
};
var dragLineEnd = function() {
	var line = getByID(d3.select(this).attr("id"));
	d3.selectAll(".svg-lines").attr("cursor", "grab");
	dragPointEnd.call(d3.select(`#${line.point1ID}`).node());

	var offsetX = d3.event.x - initial.x;
	var offsetY = d3.event.y - initial.y;
	if (
		!(offsetX * offsetX + offsetY * offsetY > threshold) &&
		!(
			d3.event.shiftKey ||
			(d3.event.sourceEvent && d3.event.sourceEvent.shiftKey)
		)
	) {
		deselectAll();
	}
	line.select();
	draw();
};

var dragFaceStart = function() {
	d3.selectAll(".svg-faces").attr("cursor", "grabbing");
	var face = getByID(d3.select(this).attr("id"));
	if (
		!(
			d3.event.shiftKey ||
			(d3.event.sourceEvent && d3.event.sourceEvent.shiftKey)
		)
	) {
		deselectAll();
	}
	face.select();
	draw();
	dragPointStart.call(d3.select(`#${face.point1ID}`).node());
};
var dragFace = function() {
	var face = getByID(d3.select(this).attr("id"));
	dragPoint.call(d3.select(`#${face.point1ID}`).node());
};
var dragFaceEnd = function() {
	var face = getByID(d3.select(this).attr("id"));
	d3.selectAll(".svg-faces").attr("cursor", "grab");
	dragPointEnd.call(d3.select(`#${face.point1ID}`).node());

	var offsetX = d3.event.x - initial.x;
	var offsetY = d3.event.y - initial.y;
	if (
		!(offsetX * offsetX + offsetY * offsetY > threshold) &&
		!(
			d3.event.shiftKey ||
			(d3.event.sourceEvent && d3.event.sourceEvent.shiftKey)
		)
	) {
		deselectAll();
	}
	face.select();
	draw();
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
		var current = screenCoordsToSVG(d3.event.offsetX, d3.event.offsetY);
		if (
			(initial.x - current.x) * (initial.x - current.x) +
				(initial.y - current.y) * (initial.y - current.y) <
			0.00001
		) {
			addPoint();
		} else {
			boxSelectStarted = false;
			boxSelectOngoing = false;
			mainSVG.selectRect
				.attr("x", -100)
				.attr("y", -100)
				.attr("width", 0)
				.attr("height", 0);
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
				deselectAll();
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
	}
};

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++[|     Color Callbacks    |]++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

function btnPointApplyUpdate() {
	if (pointColorEdited || pointOtherEdited) {
		btnPointApply.attr("disabled", null);
		btnPointApply.classed("disabled", false);
	} else {
		btnPointApply.attr("disabled", true);
		btnPointApply.classed("disabled", true);
	}
}

var btnPointApplyPress = function() {
	applyToSelectedPoints(
		pointColorPicker.color.rgbaString,
		parseFloat(pointRadiusNumber.property("value"))
	);
	pointColorEdited = false;
	pointOtherEdited = false;
	btnPointApplyUpdate();
};

var pointOtherChange = function() {
	pointOtherEdited = true;
	btnPointApplyUpdate();
};

var pointColorChange = function(color) {
	pointColorEdited = true;
	pointHueNumber.property("value", color.hsva.h);
	pointSaturationNumber.property("value", color.hsva.s);
	pointValueNumber.property("value", color.hsva.v);
	pointAlphaNumber.property("value", color.hsva.a);
	btnPointApplyUpdate();
};

var pointNumberChange = function() {
	pointColorEdited = true;
	if (
		parseFloat(pointHueNumber.property("value")) >
		parseFloat(pointHueNumber.attr("max"))
	) {
		parseFloat(
			pointHueNumber.property("value", parseFloat(pointHueNumber.attr("max")))
		);
	} else if (
		parseFloat(pointHueNumber.property("value")) <
		parseFloat(pointHueNumber.attr("min"))
	) {
		parseFloat(
			pointHueNumber.property("value", parseFloat(pointHueNumber.attr("min")))
		);
	}
	if (
		parseFloat(pointSaturationNumber.property("value")) >
		parseFloat(pointSaturationNumber.attr("max"))
	) {
		parseFloat(
			pointSaturationNumber.property(
				"value",
				parseFloat(pointSaturationNumber.attr("max"))
			)
		);
	} else if (
		parseFloat(pointSaturationNumber.property("value")) <
		parseFloat(pointSaturationNumber.attr("min"))
	) {
		parseFloat(
			pointSaturationNumber.property(
				"value",
				parseFloat(pointSaturationNumber.attr("min"))
			)
		);
	}
	if (
		parseFloat(pointValueNumber.property("value")) >
		parseFloat(pointValueNumber.attr("max"))
	) {
		parseFloat(
			pointValueNumber.property(
				"value",
				parseFloat(pointValueNumber.attr("max"))
			)
		);
	} else if (
		parseFloat(pointValueNumber.property("value")) <
		parseFloat(pointValueNumber.attr("min"))
	) {
		parseFloat(
			pointValueNumber.property(
				"value",
				parseFloat(pointValueNumber.attr("min"))
			)
		);
	}
	if (
		parseFloat(pointAlphaNumber.property("value")) >
		parseFloat(pointAlphaNumber.attr("max"))
	) {
		parseFloat(
			pointAlphaNumber.property(
				"value",
				parseFloat(pointAlphaNumber.attr("max"))
			)
		);
	} else if (
		parseFloat(pointAlphaNumber.property("value")) <
		parseFloat(pointAlphaNumber.attr("min"))
	) {
		parseFloat(
			pointAlphaNumber.property(
				"value",
				parseFloat(pointAlphaNumber.attr("min"))
			)
		);
	}
	pointColorPicker.color.hsva = {
		h: pointHueNumber.property("value"),
		s: pointSaturationNumber.property("value"),
		v: pointValueNumber.property("value"),
		a: pointAlphaNumber.property("value")
	};
	btnPointApplyUpdate();
};

function btnLineApplyUpdate() {
	if (lineColorEdited || lineOtherEdited) {
		btnLineApply.attr("disabled", null);
		btnLineApply.classed("disabled", false);
	} else {
		btnLineApply.attr("disabled", true);
		btnLineApply.classed("disabled", true);
	}
}

var btnLineApplyPress = function() {
	applyToSelectedLines(
		lineColorPicker.color.rgbaString,
		parseFloat(lineWidthNumber.property("value"))
	);
	lineColorEdited = false;
	lineOtherEdited = false;
	btnLineApplyUpdate();
};

var lineOtherChange = function() {
	lineOtherEdited = true;
	btnLineApplyUpdate();
};

var lineColorChange = function(color) {
	lineColorEdited = true;
	lineHueNumber.property("value", color.hsva.h);
	lineSaturationNumber.property("value", color.hsva.s);
	lineValueNumber.property("value", color.hsva.v);
	lineAlphaNumber.property("value", color.hsva.a);
	btnLineApplyUpdate();
};

var lineNumberChange = function() {
	lineColorEdited = true;
	if (
		parseFloat(lineHueNumber.property("value")) >
		parseFloat(lineHueNumber.attr("max"))
	) {
		parseFloat(
			lineHueNumber.property("value", parseFloat(lineHueNumber.attr("max")))
		);
	} else if (
		parseFloat(lineHueNumber.property("value")) <
		parseFloat(lineHueNumber.attr("min"))
	) {
		parseFloat(
			lineHueNumber.property("value", parseFloat(lineHueNumber.attr("min")))
		);
	}
	if (
		parseFloat(lineSaturationNumber.property("value")) >
		parseFloat(lineSaturationNumber.attr("max"))
	) {
		parseFloat(
			lineSaturationNumber.property(
				"value",
				parseFloat(lineSaturationNumber.attr("max"))
			)
		);
	} else if (
		parseFloat(lineSaturationNumber.property("value")) <
		parseFloat(lineSaturationNumber.attr("min"))
	) {
		parseFloat(
			lineSaturationNumber.property(
				"value",
				parseFloat(lineSaturationNumber.attr("min"))
			)
		);
	}
	if (
		parseFloat(lineValueNumber.property("value")) >
		parseFloat(lineValueNumber.attr("max"))
	) {
		parseFloat(
			lineValueNumber.property("value", parseFloat(lineValueNumber.attr("max")))
		);
	} else if (
		parseFloat(lineValueNumber.property("value")) <
		parseFloat(lineValueNumber.attr("min"))
	) {
		parseFloat(
			lineValueNumber.property("value", parseFloat(lineValueNumber.attr("min")))
		);
	}
	if (
		parseFloat(lineAlphaNumber.property("value")) >
		parseFloat(lineAlphaNumber.attr("max"))
	) {
		parseFloat(
			lineAlphaNumber.property("value", parseFloat(lineAlphaNumber.attr("max")))
		);
	} else if (
		parseFloat(lineAlphaNumber.property("value")) <
		parseFloat(lineAlphaNumber.attr("min"))
	) {
		parseFloat(
			lineAlphaNumber.property("value", parseFloat(lineAlphaNumber.attr("min")))
		);
	}
	lineColorPicker.color.hsva = {
		h: lineHueNumber.property("value"),
		s: lineSaturationNumber.property("value"),
		v: lineValueNumber.property("value"),
		a: lineAlphaNumber.property("value")
	};
	btnLineApplyUpdate();
};

function btnFaceApplyUpdate() {
	if (faceColorEdited) {
		btnFaceApply.attr("disabled", null);
		btnFaceApply.classed("disabled", false);
	} else {
		btnFaceApply.attr("disabled", true);
		btnFaceApply.classed("disabled", true);
	}
}

var btnFaceApplyPress = function() {
	applyToSelectedFaces(faceColorPicker.color.rgbaString);
	faceColorEdited = false;
	btnFaceApplyUpdate();
};

var faceColorChange = function(color) {
	faceColorEdited = true;
	faceHueNumber.property("value", color.hsva.h);
	faceSaturationNumber.property("value", color.hsva.s);
	faceValueNumber.property("value", color.hsva.v);
	faceAlphaNumber.property("value", color.hsva.a);
	btnFaceApplyUpdate();
};

var faceNumberChange = function() {
	faceColorEdited = true;
	if (
		parseFloat(faceHueNumber.property("value")) >
		parseFloat(faceHueNumber.attr("max"))
	) {
		parseFloat(
			faceHueNumber.property("value", parseFloat(faceHueNumber.attr("max")))
		);
	} else if (
		parseFloat(faceHueNumber.property("value")) <
		parseFloat(faceHueNumber.attr("min"))
	) {
		parseFloat(
			faceHueNumber.property("value", parseFloat(faceHueNumber.attr("min")))
		);
	}
	if (
		parseFloat(faceSaturationNumber.property("value")) >
		parseFloat(faceSaturationNumber.attr("max"))
	) {
		parseFloat(
			faceSaturationNumber.property(
				"value",
				parseFloat(faceSaturationNumber.attr("max"))
			)
		);
	} else if (
		parseFloat(faceSaturationNumber.property("value")) <
		parseFloat(faceSaturationNumber.attr("min"))
	) {
		parseFloat(
			faceSaturationNumber.property(
				"value",
				parseFloat(faceSaturationNumber.attr("min"))
			)
		);
	}
	if (
		parseFloat(faceValueNumber.property("value")) >
		parseFloat(faceValueNumber.attr("max"))
	) {
		parseFloat(
			faceValueNumber.property("value", parseFloat(faceValueNumber.attr("max")))
		);
	} else if (
		parseFloat(faceValueNumber.property("value")) <
		parseFloat(faceValueNumber.attr("min"))
	) {
		parseFloat(
			faceValueNumber.property("value", parseFloat(faceValueNumber.attr("min")))
		);
	}
	if (
		parseFloat(faceAlphaNumber.property("value")) >
		parseFloat(faceAlphaNumber.attr("max"))
	) {
		parseFloat(
			faceAlphaNumber.property("value", parseFloat(faceAlphaNumber.attr("max")))
		);
	} else if (
		parseFloat(faceAlphaNumber.property("value")) <
		parseFloat(faceAlphaNumber.attr("min"))
	) {
		parseFloat(
			faceAlphaNumber.property("value", parseFloat(faceAlphaNumber.attr("min")))
		);
	}
	faceColorPicker.color.hsva = {
		h: faceHueNumber.property("value"),
		s: faceSaturationNumber.property("value"),
		v: faceValueNumber.property("value"),
		a: faceAlphaNumber.property("value")
	};
	btnFaceApplyUpdate();
};

var stopLayerSort = function(e, u) {
	var layerListElement = $("#layer-sortable-list");
	var draggedListItem = u.item;
	var layerListItems = layerListElement.children();
	var newListItemIds = [];
	var orderChanged = false;
	layerListItems.each(function(index) {
		var elementId = $(this).attr("id");
		newListItemIds.push(elementId);
		if (!orderChanged && index < undoHistory[undoHistoryIndex].layers.length) {
			if (undoHistory[undoHistoryIndex].layers[index].name != elementId) {
				orderChanged = true;
			}
		} else {
			orderChanged = true;
		}
	});
	if (!orderChanged) {
		currentLayer = draggedListItem.attr("id");
		$(".layer-list-item").removeClass("active-layer");
		draggedListItem.addClass("active-layer");
	} else {
		operation(function(data) {
			var newLayers = [];
			for (var i = 0; i < newListItemIds.length; i++) {
				var layerVisible = true;
				for (var j = 0; j < data.layers.length; j++) {
					if (data.layers[j].name == newListItemIds[i]) {
						layerVisible = data.layers[j].visible;
						break;
					}
				}
				newLayers.push({ name: newListItemIds[i], visible: layerVisible });
			}
			data.layers = newLayers;
			return data;
		});
	}
};

var selectLayer = function() {
	$(".layer-list-item").removeClass("active-layer");
	$(this)
		.parent()
		.addClass("active-layer");
	currentLayer = $(this)
		.parent()
		.attr("id");
};

var deleteLayer = function() {
	var layerId = $(this)
		.parent()
		.parent()
		.attr("id");
	operation(function(data) {
		if (data.layers.length > 1) {
			var newLayers = [];
			for (var i = 0; i < data.layers.length; i++) {
				if (data.layers[i].name != layerId) {
					newLayers.push(data.layers[i]);
				}
			}
			data.layers = newLayers;
			redrawLayers = true;
		}
		return data;
	});
};

var moveSelectionToLayer = function() {
	var layerId = $(this)
		.parent()
		.parent()
		.attr("id");
	operation(function(data) {
		data.points.forEach(function(point) {
			if (point.isSelected()) {
				point.layer = layerId;
			}
		});
		data.lines.forEach(function(line) {
			if (line.isSelected()) {
				line.layer = layerId;
			}
		});
		data.faces.forEach(function(face) {
			if (face.isSelected()) {
				face.layer = layerId;
			}
		});
		return data;
	});
};

var editLayerName = function() {
	var layerId = $(this)
		.parent()
		.attr("id");
	var newId = d3
		.select(this)
		.property("value")
		.replace(/\s/g, "");
	operation(function(data) {
		data.points.forEach(function(point) {
			if (point.layer == layerId) {
				point.layer = newId;
			}
		});
		data.lines.forEach(function(line) {
			if (line.layer == layerId) {
				line.layer = newId;
			}
		});
		data.faces.forEach(function(face) {
			if (face.layer == layerId) {
				face.layer = newId;
			}
		});
		data.layers.forEach(function(layer) {
			if (layer.name == layerId) {
				layer.name = newId;
			}
		});
		redrawLayers = true;
		return data;
	});
};

var toggleLayerVisibility = function() {
	var layerId = $(this)
		.parent()
		.parent()
		.attr("id");
	operation(function(data) {
		var newLayers = [];
		for (var i = 0; i < data.layers.length; i++) {
			if (data.layers[i].name == layerId) {
				newLayers.push({
					name: data.layers[i].name,
					visible: !data.layers[i].visible
				});
			} else {
				newLayers.push(data.layers[i]);
			}
		}
		data.layers = newLayers;
		redrawLayers = true;
		return data;
	});
};

var addLayer = function() {
	operation(function(data) {
		var nameNum = 1;
		while (
			data.layers.some(function(layer) {
				return layer.name == `Layer${nameNum}`;
			})
		) {
			nameNum++;
		}
		data.layers.unshift({ name: `Layer${nameNum}`, visible: true });
		redrawLayers = true;
		return data;
	});
};

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++[|   Keyboard Callbacks   |]++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

var downKey = function() {
	if (d3.event.ctrlKey || d3.event.altKey) {
		d3.event.preventDefault();
	}
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
		var backCanvas = backgroundCanvas.node();
		var backCtx = backCanvas.getContext("2d");

		var baseCanvas = imageBase.node();
		var baseCtx = baseCanvas.getContext("2d");

		var reader = new FileReader();
		reader.onload = function(e) {
			var img = new Image();
			img.onload = function() {
				if (img.width > img.height) {
					backCanvas.width = img.width;
					backCanvas.height = img.width;
					backCtx.drawImage(img, 0, (img.width - img.height) / 2);
				} else {
					backCanvas.width = img.height;
					backCanvas.height = img.height;
					backCtx.drawImage(img, (img.height - img.width) / 2, 0);
				}
				baseCanvas.width = img.width;
				baseCanvas.height = img.height;
				baseCtx.drawImage(img, 0, 0);
			};
			img.src = e.target.result;
		};
		reader.readAsDataURL(this.files[0]);
	}
};

var setupBackgroundPoints = function() {
	var baseCanvas = imageBase.node();
	var baseCtx = baseCanvas.getContext("2d");
	var imgData = baseCtx.getImageData(0, 0, baseCanvas.width, baseCanvas.height);
	var grayScale = new Uint8Array(baseCanvas.width * baseCanvas.height);
	for (var i = 0; i < imgData.data.length; i += 4) {
		grayScale[i / 4] = parseInt(
			d3.hsl(
				d3
					.rgb(imgData.data[i], imgData.data[i + 1], imgData.data[i + 2])
					.formatHsl()
			).l * 255
		);
	}
	var cornerWeights = fast9.detect(
		grayScale,
		baseCanvas.width,
		baseCanvas.height,
		thresholdNumber.property("value")
	);
	console.log(cornerWeights);
	console.log(baseCanvas.width);
	console.log(baseCanvas.height);

	operation(function(data) {
		data.layers.push({ name: "setPoints", visible: true });
		cornerWeights.forEach(function(weight) {
			var id = `p${new Date().getTime()}-${(idAccumulator++)
				.toString()
				.padStart(8, "0")}`;
			var xy = convertImageXYToSVG(weight);
			var dataIndex = (weight.x + weight.y * baseCanvas.width) * 4;
			var pointColor = `rgb(${imgData.data[dataIndex]}, ${
				imgData.data[dataIndex + 1]
			}, ${imgData.data[dataIndex + 2]})`;
			data.points.push(
				new Point(id, xy.x, xy.y, 0.0015, pointColor, "setPoints", false)
			);
		});
		return data;
	});
};

function convertImageXYToSVG(xyCoords) {
	var baseCanvas = imageBase.node();
	var squareWidth = Math.max(baseCanvas.height, baseCanvas.width);
	if (baseCanvas.width > baseCanvas.height) {
		xyCoords.y = xyCoords.y + (squareWidth - baseCanvas.height) / 2;
	} else {
		xyCoords.x = xyCoords.x + (squareWidth - baseCanvas.width) / 2;
	}
	return {
		x: xyCoords.x / squareWidth,
		y: xyCoords.y / squareWidth
	};
}

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++[|       History          |]++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

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
		faces: [],
		layers: []
	};

	data.points.forEach(function(point) {
		newData.points.push(
			new Point(
				point.id,
				point.x,
				point.y,
				point.radius,
				point.color,
				point.layer,
				point.selected
			)
		);
	});

	data.lines.forEach(function(line) {
		newData.lines.push(
			new Line(
				line.id,
				line.point1ID,
				line.point2ID,
				line.strokeWidth,
				line.color,
				line.layer
			)
		);
	});

	data.faces.forEach(function(face) {
		newData.faces.push(
			new Face(
				face.id,
				face.point1ID,
				face.point2ID,
				face.point3ID,
				face.color,
				face.layer
			)
		);
	});

	data.layers.forEach(function(layer) {
		if (!newData.layers.includes(layer)) {
			newData.layers.push(layer);
		}
	});

	return newData;
}

function setupNewData(newData) {
	newData.pointMap = new Map();
	newData.lineMap = new Map();
	newData.faceMap = new Map();

	for (var i = 0; i < newData.points.length; i++) {
		newData.pointMap.set(newData.points[i].id, i);
	}

	for (var i = 0; i < newData.lines.length; i++) {
		newData.lineMap.set(newData.lines[i].id, i);
	}

	for (var i = 0; i < newData.faces.length; i++) {
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
						data.points[i].layer,
						data.points[i].selected
					)
				);
			} else {
				newPoints.push(data.points[i]);
			}
		}
		data.points = newPoints;
		return data;
	});
}

function applyToSelectedPoints(color, radius) {
	operation(function(data) {
		var newPoints = [];
		var newColor = color;
		var newRadius = radius;
		for (var i = 0; i < data.points.length; i++) {
			if (data.points[i].isSelected()) {
				if (!pointColorEdited) {
					newColor = data.points[i].color;
				}
				if (!pointOtherEdited) {
					newRadius = data.points[i].radius;
				}
				newPoints.push(
					new Point(
						data.points[i].id,
						data.points[i].x,
						data.points[i].y,
						newRadius,
						newColor,
						data.points[i].layer,
						data.points[i].selected
					)
				);
			} else {
				newPoints.push(data.points[i]);
			}
		}
		pointColorChange({ hsva: { h: 0, s: 0, v: 0, a: 1 } });
		pointNumberChange();
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
function applyToSelectedLines(color, width) {
	operation(function(data) {
		var newLines = [];
		var newColor = color;
		var newWidth = width;
		for (var i = 0; i < data.lines.length; i++) {
			if (data.lines[i].isSelected()) {
				if (!lineColorEdited) {
					newColor = data.lines[i].color;
				}
				if (!lineOtherEdited) {
					newWidth = data.lines[i].strokeWidth;
				}
				newLines.push(
					new Line(
						data.lines[i].id,
						data.lines[i].point1ID,
						data.lines[i].point2ID,
						newWidth,
						newColor,
						data.lines[i].layer
					)
				);
			} else {
				newLines.push(data.lines[i]);
			}
		}
		lineColorChange({ hsva: { h: 0, s: 0, v: 0, a: 1 } });
		lineNumberChange();
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
						(selectedLines[i].point1ID == selectedLines[j].point1ID &&
							selectedLines[i].point2ID == selectedLines[k].point1ID &&
							selectedLines[j].point2ID == selectedLines[k].point2ID) ||
						(selectedLines[i].point2ID == selectedLines[j].point1ID &&
							selectedLines[i].point1ID == selectedLines[k].point1ID &&
							selectedLines[j].point2ID == selectedLines[k].point2ID) ||
						(selectedLines[i].point1ID == selectedLines[j].point2ID &&
							selectedLines[i].point2ID == selectedLines[k].point1ID &&
							selectedLines[j].point1ID == selectedLines[k].point2ID) ||
						(selectedLines[i].point2ID == selectedLines[j].point2ID &&
							selectedLines[i].point1ID == selectedLines[k].point1ID &&
							selectedLines[j].point1ID == selectedLines[k].point2ID) ||
						(selectedLines[i].point1ID == selectedLines[j].point1ID &&
							selectedLines[i].point2ID == selectedLines[k].point2ID &&
							selectedLines[j].point2ID == selectedLines[k].point1ID) ||
						(selectedLines[i].point2ID == selectedLines[j].point1ID &&
							selectedLines[i].point1ID == selectedLines[k].point2ID &&
							selectedLines[j].point2ID == selectedLines[k].point1ID) ||
						(selectedLines[i].point1ID == selectedLines[j].point2ID &&
							selectedLines[i].point2ID == selectedLines[k].point2ID &&
							selectedLines[j].point1ID == selectedLines[k].point1ID) ||
						(selectedLines[i].point2ID == selectedLines[j].point2ID &&
							selectedLines[i].point1ID == selectedLines[k].point2ID &&
							selectedLines[j].point1ID == selectedLines[k].point1ID)
					) {
						var p1 = selectedLines[i].point1ID;
						var p2 = selectedLines[i].point2ID;
						var p3 = selectedLines[j].point1ID;
						if (p3 == p1 || p3 == p2) {
							p3 = selectedLines[j].point2ID;
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
function applyToSelectedFaces(color) {
	operation(function(data) {
		var newFaces = [];
		var newColor = color;
		for (var i = 0; i < data.faces.length; i++) {
			if (data.faces[i].isSelected()) {
				if (!faceColorEdited) {
					newColor = data.faces[i].color;
				}
				newFaces.push(
					new Face(
						data.faces[i].id,
						data.faces[i].point1ID,
						data.faces[i].point2ID,
						data.faces[i].point3ID,
						newColor,
						data.faces[i].layer
					)
				);
			} else {
				newFaces.push(data.faces[i]);
			}
		}
		faceColorChange({ hsva: { h: 0, s: 0, v: 0, a: 1 } });
		faceNumberChange();
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

function lineExists(point1ID, point2ID) {
	var output = false;
	for (var i = 0; i < undoHistory[undoHistoryIndex].lines.length; i++) {
		if (
			(undoHistory[undoHistoryIndex].lines[i].point1ID == point1ID &&
				undoHistory[undoHistoryIndex].lines[i].point2ID == point2ID) ||
			(undoHistory[undoHistoryIndex].lines[i].point1ID == point2ID &&
				undoHistory[undoHistoryIndex].lines[i].point2ID == point1ID)
		) {
			output = true;
			break;
		}
	}
	return output;
}

function faceExists(point1ID, point2ID, point3ID) {
	var output = false;
	for (var i = 0; i < undoHistory[undoHistoryIndex].faces.length; i++) {
		if (
			(undoHistory[undoHistoryIndex].lines[i].point1ID == point1ID &&
				undoHistory[undoHistoryIndex].lines[i].point2ID == point2ID &&
				undoHistory[undoHistoryIndex].lines[i].point3ID == point3ID) ||
			(undoHistory[undoHistoryIndex].lines[i].point1ID == point1ID &&
				undoHistory[undoHistoryIndex].lines[i].point2ID == point3ID &&
				undoHistory[undoHistoryIndex].lines[i].point3ID == point2ID) ||
			(undoHistory[undoHistoryIndex].lines[i].point1ID == point2ID &&
				undoHistory[undoHistoryIndex].lines[i].point2ID == point1ID &&
				undoHistory[undoHistoryIndex].lines[i].point3ID == point3ID) ||
			(undoHistory[undoHistoryIndex].lines[i].point1ID == point2ID &&
				undoHistory[undoHistoryIndex].lines[i].point2ID == point3ID &&
				undoHistory[undoHistoryIndex].lines[i].point3ID == point1ID) ||
			(undoHistory[undoHistoryIndex].lines[i].point1ID == point3ID &&
				undoHistory[undoHistoryIndex].lines[i].point2ID == point1ID &&
				undoHistory[undoHistoryIndex].lines[i].point3ID == point2ID) ||
			(undoHistory[undoHistoryIndex].lines[i].point1ID == point3ID &&
				undoHistory[undoHistoryIndex].lines[i].point2ID == point2ID &&
				undoHistory[undoHistoryIndex].lines[i].point3ID == point1ID)
		) {
			output = true;
			break;
		}
	}
	return output;
}

function deselectAll() {
	for (var i = 0; i < undoHistory[undoHistoryIndex].points.length; i++) {
		if (undoHistory[undoHistoryIndex].points[i].hasSelected()) {
			undoHistory[undoHistoryIndex].points[i].deselect();
		}
	}
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
		var point1ID = null;
		var point2ID = null;
		for (var j = 0; j < pointArray.length; j++) {
			if (
				(points[ti * 2] == pointValueArray[2 * j] &&
					points[ti * 2 + 1] == pointValueArray[2 * j + 1]) ||
				(points[ti * 2] == pointValueArray[2 * j + 1] &&
					points[ti * 2 + 1] == pointValueArray[2 * j])
			) {
				point1ID = pointArray[j].id;
			}
			if (
				(points[tj * 2] == pointValueArray[2 * j] &&
					points[tj * 2 + 1] == pointValueArray[2 * j + 1]) ||
				(points[tj * 2] == pointValueArray[2 * j + 1] &&
					points[tj * 2 + 1] == pointValueArray[2 * j])
			) {
				point2ID = pointArray[j].id;
			}
		}
		if (point1ID && point2ID && !lineExists(point1ID, point2ID)) {
			var id = `l${new Date().getTime()}-${(idAccumulator++)
				.toString()
				.padStart(8, "0")}`;
			lineArray.push(new Line(id, point1ID, point2ID));
		}
	}
	for (let i = -1; i < hull.length; ++i) {
		var point1ID = null;
		var point2ID = null;
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
				point1ID = pointArray[j].id;
			}
			if (
				(points[point2index * 2] == pointValueArray[2 * j] &&
					points[point2index * 2 + 1] == pointValueArray[2 * j + 1]) ||
				(points[point2index * 2] == pointValueArray[2 * j + 1] &&
					points[point2index * 2 + 1] == pointValueArray[2 * j])
			) {
				point2ID = pointArray[j].id;
			}
		}
		if (point1ID && point2ID && !lineExists(point1ID, point2ID)) {
			var id = `l${new Date().getTime()}-${(idAccumulator++)
				.toString()
				.padStart(8, "0")}`;
			lineArray.push(new Line(id, point1ID, point2ID));
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

function createColorPicker(id) {
	return new iro.ColorPicker(id, {
		layout: [
			{
				component: iro.ui.Box,
				options: {
					width: 170
				}
			},
			{
				component: iro.ui.Slider,
				options: {
					width: 170,
					sliderMargin: 4,
					padding: 4,
					handleRadius: 4,
					sliderType: "hue"
				}
			},
			{
				component: iro.ui.Slider,
				options: {
					width: 170,
					sliderMargin: 4,
					padding: 4,
					handleRadius: 4,
					sliderType: "saturation"
				}
			},
			{
				component: iro.ui.Slider,
				options: {
					width: 170,
					sliderMargin: 4,
					padding: 4,
					handleRadius: 4,
					sliderType: "value"
				}
			},
			{
				component: iro.ui.Slider,
				options: {
					width: 170,
					sliderMargin: 4,
					padding: 4,
					handleRadius: 4,
					sliderType: "alpha"
				}
			}
		],
		color: "#000"
	});
}

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++[|       Rendering        |]++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

function draw() {
	if (redrawLayers) {
		renderLayers();
		redrawLayers = false;
	}

	var canvasHTML = "";
	var basicHTML = "";

	undoHistory[undoHistoryIndex].layers
		.slice()
		.reverse()
		.forEach(function(layer) {
			if (layer.visible) {
				undoHistory[undoHistoryIndex].faces.forEach(function(face) {
					if (face.layer == layer.name) {
						canvasHTML = canvasHTML.concat(face.svgCanvas());
						basicHTML = basicHTML.concat(face.svgBasic());
					}
				});

				undoHistory[undoHistoryIndex].lines.forEach(function(line) {
					if (line.layer == layer.name) {
						canvasHTML = canvasHTML.concat(line.svgCanvas());
						basicHTML = basicHTML.concat(line.svgBasic());
					}
				});

				undoHistory[undoHistoryIndex].points.forEach(function(point) {
					if (point.layer == layer.name) {
						canvasHTML = canvasHTML.concat(point.svgCanvas());
						basicHTML = basicHTML.concat(point.svgBasic());
					}
				});
			}
		});

	mainSVG.base.html(canvasHTML);
	miniDisplaySVG.base.html(basicHTML);

	d3.selectAll(".svg-points").call(
		d3
			.drag()
			.filter(function() {
				return !d3.event.ctrlKey && !d3.event.button;
			})
			.on("start", dragPointStart)
			.on("drag", dragPoint)
			.on("end", dragPointEnd)
	);

	d3.selectAll(".svg-lines").call(
		d3
			.drag()
			.filter(function() {
				return !d3.event.ctrlKey && !d3.event.button;
			})
			.on("start", dragLineStart)
			.on("drag", dragLine)
			.on("end", dragLineEnd)
	);

	d3.selectAll(".svg-faces").call(
		d3
			.drag()
			.filter(function() {
				return !d3.event.ctrlKey && !d3.event.button;
			})
			.on("start", dragFaceStart)
			.on("drag", dragFace)
			.on("end", dragFaceEnd)
	);

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

function renderLayers() {
	var newHTML = "";
	for (var i = 0; i < undoHistory[undoHistoryIndex].layers.length; i++) {
		newHTML = newHTML.concat(
			createLayerHTML(undoHistory[undoHistoryIndex].layers[i])
		);
	}
	$("#layer-sortable-list").html(newHTML);

	$("#layer-sortable-list")
		.sortable()
		.on("sortstop", stopLayerSort);

	$(".btn-layer-visibility").on("click", toggleLayerVisibility);
	$(".btn-layer-move").on("click", moveSelectionToLayer);
	$(".btn-layer-delete").on("click", deleteLayer);
	$(".layer-list-move-icon").on("click", selectLayer);
	$(".layer-list-name").on("change", editLayerName);
}

function createLayerHTML(layer) {
	var active = false;
	if (layer.name == currentLayer) {
		active = true;
	}
	return `
<li
	id="${layer.name}"
	class="layer-list-item ${active ? " active-layer" : ""}"
>
	<ion-icon
		name="swap-vertical"
		class="layer-list-move-icon"
	></ion-icon>
	<input
		class="layer-list-name"
		type="text"
		value="${layer.name}"
	>
	<div class="btn-group btn-layer-group">
		<button
			type="button"
			class="btn btn-light btn-layer-group-inside btn-layer-visibility"
			title="Toggle Layer Visibility"
		>
			<ion-icon name="eye${layer.visible ? "" : "-off"}-outline"></ion-icon>
		</button>
		<button
			type="button"
			class="btn btn-light btn-layer-group-inside btn-layer-move"
			title="Move Selection to Layer"
		>
			<ion-icon name="analytics-outline"></ion-icon>
		</button><button
			type="button"
			class="btn btn-light btn-layer-group-inside btn-layer-delete"
			title="Delete Layer"
		>
			<ion-icon name="trash-outline"></ion-icon>
		</button>
	</div>
</li>
`;
}

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++[|         Setup          |]++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

$(document).ready(function() {
	undoHistory.push({
		points: [],
		lines: [],
		faces: [],
		layers: [{ name: "Layer1", visible: true }]
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

	btnMiniDisplay.on("click", btnMiniDisplayPress);

	$("#backgroundImageLoader").on("change", uploadBackground);

	btnTabs.forEach(function(btn) {
		btn.on("click", btnTabPress);
	});

	d3.select("body")
		.on("keydown", downKey)
		.on("keyup", upKey)
		.on("mousemove", mouseMove);

	window.addEventListener("contextmenu", function(e) {
		e.preventDefault();
	});

	pointColorPicker = createColorPicker("#point-color-picker");
	lineColorPicker = createColorPicker("#line-color-picker");
	faceColorPicker = createColorPicker("#face-color-picker");

	pointColorPicker.on("input:end", pointColorChange);
	lineColorPicker.on("input:end", lineColorChange);
	faceColorPicker.on("input:end", faceColorChange);

	btnPointApply.on("click", btnPointApplyPress);
	pointRadiusNumber.on("change", pointOtherChange);

	pointHueNumber.on("change", pointNumberChange);
	pointSaturationNumber.on("change", pointNumberChange);
	pointValueNumber.on("change", pointNumberChange);
	pointAlphaNumber.on("change", pointNumberChange);

	btnLineApply.on("click", btnLineApplyPress);
	lineWidthNumber.on("change", lineOtherChange);

	lineHueNumber.on("change", lineNumberChange);
	lineSaturationNumber.on("change", lineNumberChange);
	lineValueNumber.on("change", lineNumberChange);
	lineAlphaNumber.on("change", lineNumberChange);

	btnFaceApply.on("click", btnFaceApplyPress);

	btnAddPoints.on("click", setupBackgroundPoints);

	faceHueNumber.on("change", faceNumberChange);
	faceSaturationNumber.on("change", faceNumberChange);
	faceValueNumber.on("change", faceNumberChange);
	faceAlphaNumber.on("change", faceNumberChange);

	mainSVG.mainGroup = mainSVG
		.append("g")
		.on("mousedown", boxSelectStart)
		.on("mousemove", boxSelecting)
		.on("mouseup", boxSelectEnd);
	mainSVG.mainGroup
		.append("rect")
		.attr("x", -borderWidth / 2)
		.attr("y", -borderWidth / 2)
		.attr("width", 1 + borderWidth)
		.attr("height", 1 + borderWidth)
		.attr("fill", "rgba(0,0,0,0)")
		.attr("stroke", "#000000")
		.attr("stroke-width", borderWidth);
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
	mainSVG.base = mainSVG.mainGroup.append("g");

	miniDisplaySVG.viewGroup = miniDisplaySVG.append("g");
	miniDisplaySVG.base = miniDisplaySVG.append("g");
	miniDisplaySVG.viewGroup.viewBoxRect = miniDisplaySVG.viewGroup
		.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", 1)
		.attr("height", 1)
		.attr("fill", "rgba(0,0,0,0)")
		.attr("stroke", "rgba(0,64,128,0.5)")
		.attr("stroke-width", borderWidth);

	$("#layer-sortable-list")
		.sortable()
		.on("sortstop", stopLayerSort);
	$("#btn-add-layer").on("click", addLayer);

	$(".btn-layer-visibility").on("click", toggleLayerVisibility);
	$(".btn-layer-move").on("click", moveSelectionToLayer);
	$(".btn-layer-delete").on("click", deleteLayer);
	$(".layer-list-move-icon").on("click", selectLayer);
	$(".layer-list-name").on("change", editLayerName);

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
	draw();
});
