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
	iconEditTypeFaces,
];

const btnUndo = d3.select("#btn-undo");
const btnRedo = d3.select("#btn-redo");

const btnExport = d3.select("#btn-export");

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
const useBackgroundColorCheck = d3.select("#use-background-color-check");

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
	d3.select("#background-tab"),
	d3.select("#layer-tab"),
	d3.select("#point-tab"),
	d3.select("#line-tab"),
	d3.select("#face-tab"),
];

const btnTabContents = [
	d3.select("#background-tab-content"),
	d3.select("#layer-tab-content"),
	d3.select("#point-tab-content"),
	d3.select("#line-tab-content"),
	d3.select("#face-tab-content"),
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

var svgData = {
	points: [],
	lines: [],
	faces: [],
	layers: [],
};
var stepList = ["0000000000000000"];
var currentStepIndex = 0;
var currentStepID = 0;

function getCurrentStepID() {
	return stepList[currentStepIndex];
}

var backgroundImage = false;

var zoom;

var currentLayer;
var redrawLayers = true;

var idAccumulator = 0;
var initial = null;

var threshold = 5;
var downCoord = { x: -1, y: -1 };

var rawimgData = false;

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

class Element {
	constructor(id) {
		this.id = id;
		this.createdAt = getCurrentStepID();
		this.history = [];
		this.removed = false;
		this.removedAt = null;
	}

	setProperty(property, value) {
		var oldVal = this[property];
		this[property] = value;
		var historyIndex = -1;
		var currentStep = getCurrentStepID();
		for (var i = 0; i < this.history.length; i++) {
			if (this.history[i].step == currentStep) {
				historyIndex = i;
				break;
			}
		}
		var historyStep = { step: currentStep, changes: [] };
		if (historyIndex >= 0) {
			historyStep = this.history[historyIndex];
		}
		var changeIndex = -1;
		for (var i = 0; i < historyStep.changes.length; i++) {
			if (historyStep.changes[i].property == property) {
				changeIndex = i;
				break;
			}
		}
		if (changeIndex >= 0) {
			historyStep.changes[changeIndex] = {
				property: property,
				oldVal: oldVal,
				newVal: value,
			};
		} else {
			historyStep.changes.push({
				property: property,
				oldVal: oldVal,
				newVal: value,
			});
		}
		if (historyIndex >= 0) {
			this.history[historyIndex] = historyStep;
		} else {
			this.history.push(historyStep);
		}
	}

	undoStep(step) {
		if (this.removedAt == step) {
			this.removed = false;
		}
		if (this.createdAt == step) {
			this.removed = true;
		}
		var historyIndex = -1;
		for (var i = 0; i < this.history.length; i++) {
			if (this.history[i].step == step) {
				historyIndex = i;
				break;
			}
		}
		if (historyIndex >= 0) {
			for (var i = 0; i < this.history[historyIndex].changes.length; i++) {
				this[this.history[historyIndex].changes[i].property] = this.history[
					historyIndex
				].changes[i].oldVal;
			}
		}
	}

	redoStep(step) {
		if (this.removedAt == step) {
			this.removed = true;
		}
		if (this.createdAt == step) {
			this.removed = false;
		}
		var historyIndex = -1;
		for (var i = 0; i < this.history.length; i++) {
			if (this.history[i].step == step) {
				historyIndex = i;
				break;
			}
		}
		if (historyIndex >= 0) {
			for (var i = 0; i < this.history[historyIndex].changes.length; i++) {
				this[this.history[historyIndex].changes[i].property] = this.history[
					historyIndex
				].changes[i].newVal;
			}
		}
	}

	remove() {
		this.removed = true;
		this.removedAt = getCurrentStepID();
	}
}

class Layer extends Element {
	constructor(id, name) {
		super(id);
		this.name = name;
		this.visible = true;
	}

	createLayerHTML() {
		if (this.removed || !this.visible) {
			return "";
		}
		var active = false;
		if (this.id == currentLayer) {
			active = true;
		}
		return `
<li
	id="${this.id}"
	class="layer-list-item ${active ? " active-layer" : ""}"
>
	<ion-icon
		name="swap-vertical"
		class="layer-list-move-icon"
	></ion-icon>
	<input
		class="layer-list-name"
		type="text"
		value="${this.name}"
	>
	<div class="btn-group btn-layer-group">
		<button
			type="button"
			class="btn btn-light btn-layer-group-inside btn-layer-visibility"
			title="Toggle Layer Visibility"
		>
			<ion-icon name="eye${this.visible ? "" : "-off"}-outline"></ion-icon>
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
}

class SVGCanvasElement extends Element {
	constructor(id, color = "rgba(0,0,0,1)", layer = currentLayer) {
		super(id);
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
		if (useBackgroundColorCheck.property("checked") && backgroundImage) {
			this.color = getColorAt({ x: x, y: y });
		}
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

	svgExportFormat() {
		return `${this.x * 100},${this.y * 100}`;
	}

	svgOffsetFormat(offsetX, offsetY) {
		return `${this.x + offsetX},${this.y + offsetY}`;
	}

	svgCanvas() {
		if (!visiblePoints || this.removed || !getByID(this.layer).visible) {
			return "";
		}
		var selectAttributes = "";
		if (this.isSelected()) {
			var stroke = this.radius / 5;
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
		if (!visiblePoints || this.removed || !getByID(this.layer).visible) {
			return "";
		}
		var color = "rgba(0,128,0,1)";
		if (this.isSelected()) {
			color = "#ff873d";
		}
		return `<circle cx="${this.x}" cy="${this.y}" r="0.005" fill="${color}"/>`;
	}

	svgExport() {
		if (!visiblePoints || this.removed || !getByID(this.layer).visible) {
			return "";
		}
		var c = d3.color(this.color);
		return `<circle cx="${this.x * 100}" cy="${this.y * 100}" r="${
			this.radius * 100
		}" fill="${this.color}" style="fill:${c.formatHex()};fill-opacity:${
			c.opacity
		};"/>`;
	}
}

class Line extends SVGCanvasElement {
	constructor(
		id,
		point1ID,
		point2ID,
		strokeWidth = 0.005,
		color = "rgba(0,0,0,0.7)",
		layer = currentLayer
	) {
		super(id, color, layer);
		this.point1ID = point1ID;
		this.point2ID = point2ID;
		this.strokeWidth = strokeWidth;
		if (useBackgroundColorCheck.property("checked") && backgroundImage) {
			var p1 = getByID(this.point1ID);
			var p2 = getByID(this.point2ID);
			this.color = getColorAt({ x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 });
		}
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
		if (!visibleLines || this.removed || !getByID(this.layer).visible) {
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
		if (!visibleLines || this.removed || !getByID(this.layer).visible) {
			return "";
		}
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
		if (!visibleLines || this.removed || !getByID(this.layer).visible) {
			return "";
		}
		var c = d3.color(this.color);
		return `<line x1="${getByID(this.point1ID).x * 100}" y1="${
			getByID(this.point1ID).y * 100
		}" x2="${getByID(this.point2ID).x * 100}" y2="${
			getByID(this.point2ID).y * 100
		}"  stroke-width="${this.strokeWidth * 100}" stroke="${
			this.color
		}" stroke-linecap="round" style="stroke-width:${
			this.strokeWidth * 100
		};stroke-linecap:round;stroke-miterlimit:4;stroke-dasharray:none;stroke:${c.formatHex()};stroke-opacity:${
			c.opacity
		};"/>`;
	}
}

class Face extends SVGCanvasElement {
	constructor(
		id,
		point1ID,
		point2ID,
		point3ID,
		color = "rgba(0,0,0,0.3)",
		layer = currentLayer
	) {
		super(id, color, layer);
		this.point1ID = point1ID;
		this.point2ID = point2ID;
		this.point3ID = point3ID;
		if (useBackgroundColorCheck.property("checked") && backgroundImage) {
			var p1 = getByID(this.point1ID);
			var p2 = getByID(this.point2ID);
			var p3 = getByID(this.point3ID);
			this.color = getColorAt({
				x: (p1.x + p2.x + p3.x) / 3,
				y: (p1.y + p2.y + p3.y) / 3,
			});
		}
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
		if (!visibleFaces || this.removed || !getByID(this.layer).visible) {
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
		if (!visibleFaces || this.removed || !getByID(this.layer).visible) {
			return "";
		}
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
		if (!visibleFaces || this.removed || !getByID(this.layer).visible) {
			return "";
		}
		var c = d3.color(this.color);
		return `<polygon points="${getByID(
			this.point1ID
		).svgExportFormat()} ${getByID(this.point2ID).svgExportFormat()} ${getByID(
			this.point3ID
		).svgExportFormat()}" fill="${
			this.color
		}" style="fill:${c.formatHex()};fill-opacity:${c.opacity};"/>`;
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

var btnUndoPress = function () {
	keydown = "~";
	var undoId = getCurrentStepID();
	for (var i = 0; i < svgData.points.length; i++) {
		svgData.points[i].undoStep(undoId);
	}
	for (var i = 0; i < svgData.lines.length; i++) {
		svgData.lines[i].undoStep(undoId);
	}
	for (var i = 0; i < svgData.faces.length; i++) {
		svgData.faces[i].undoStep(undoId);
	}
	for (var i = 0; i < svgData.layers.length; i++) {
		svgData.layers[i].undoStep(undoId);
	}
	currentStepIndex--;
	redrawLayers = true;
	draw();
};
var btnRedoPress = function () {
	keydown = "~";
	currentStepIndex++;
	var redoId = getCurrentStepID();
	for (var i = 0; i < svgData.points.length; i++) {
		svgData.points[i].redoStep(redoId);
	}
	for (var i = 0; i < svgData.lines.length; i++) {
		svgData.lines[i].redoStep(redoId);
	}
	for (var i = 0; i < svgData.faces.length; i++) {
		svgData.faces[i].redoStep(redoId);
	}
	for (var i = 0; i < svgData.layers.length; i++) {
		svgData.layers[i].redoStep(redoId);
	}
	redrawLayers = true;
	draw();
};

var btnBackgroundVisPress = function () {
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
var btnPointsVisPress = function () {
	keydown = "~";
	visiblePoints = !visiblePoints;
	if (visiblePoints) {
		btnPointsVis.classed("btn-extra", false);
	} else {
		btnPointsVis.classed("btn-extra", true);
	}
	draw();
};
var btnLinesVisPress = function () {
	keydown = "~";
	visibleLines = !visibleLines;
	if (visibleLines) {
		btnLinesVis.classed("btn-extra", false);
	} else {
		btnLinesVis.classed("btn-extra", true);
	}
	draw();
};
var btnFacesVisPress = function () {
	keydown = "~";
	visibleFaces = !visibleFaces;
	if (visibleFaces) {
		btnFacesVis.classed("btn-extra", false);
	} else {
		btnFacesVis.classed("btn-extra", true);
	}
	draw();
};

var btnZoomInPress = function () {
	keydown = "~";
	zoom.scaleBy(mainSVG, zoomFactor);
	mainSVG.call(zoom);
};
var btnZoomOutPress = function () {
	keydown = "~";
	zoom.scaleBy(mainSVG, 1 / zoomFactor);
	mainSVG.call(zoom);
};
var btnZoomResetPress = function () {
	mainSVG.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
};

var btnMiniDisplayPress = function () {
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

var btnTabPress = function () {
	var btn = d3.select(this);
	btnTabs.forEach(function (btnOff) {
		btnOff.attr("aria-selected", "false");
		btnOff.classed("active", false);
	});
	btn.attr("aria-selected", "true");
	btn.classed("active", true);

	btnTabContents.forEach(function (btnContent) {
		btnContent.classed("active", false);
	});
	d3.select(`#${btn.attr("aria-controls")}`).classed("active", true);
};

var btnExportPress = function () {
	var exportHTML = "<svg>";

	svgData.layers
		.slice()
		.reverse()
		.forEach(function (layer) {
			if (layer.visible) {
				svgData.faces.forEach(function (face) {
					if (face.layer == layer.id) {
						exportHTML = exportHTML.concat(face.svgExport());
					}
				});

				svgData.lines.forEach(function (line) {
					if (line.layer == layer.id) {
						exportHTML = exportHTML.concat(line.svgExport());
					}
				});

				svgData.points.forEach(function (point) {
					if (point.layer == layer.id) {
						exportHTML = exportHTML.concat(point.svgExport());
					}
				});
			}
		});

	exportHTML = exportHTML.concat("</svg>");

	download("progrimage.svg", exportHTML);
};

function download(filename, text) {
	var element = document.createElement("a");
	element.setAttribute(
		"href",
		"data:text/plain;charset=utf-8," + encodeURIComponent(text)
	);
	element.setAttribute("download", filename);

	element.style.display = "none";
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++[| Interaction  Callbacks |]++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

/*     --==++==--     --==++==--     --==++==--     --==++==--     --==++==--     */

var zoomStart = function () {
	mainSVG.attr("cursor", "grabbing");
};
var zooming = function () {
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
var zoomEnd = function () {
	mainSVG.attr("cursor", null);
};

var dragPointStart = function () {
	keydown = "~";
	initial = {
		x: d3.event.x,
		y: d3.event.y,
	};

	d3.selectAll(".svg-points").attr("cursor", "grabbing");
};
var dragPoint = function () {
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
var dragPointEnd = function () {
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

var dragLineStart = function () {
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
var dragLine = function () {
	var line = getByID(d3.select(this).attr("id"));
	dragPoint.call(d3.select(`#${line.point1ID}`).node());
};
var dragLineEnd = function () {
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

var dragFaceStart = function () {
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
var dragFace = function () {
	var face = getByID(d3.select(this).attr("id"));
	dragPoint.call(d3.select(`#${face.point1ID}`).node());
};
var dragFaceEnd = function () {
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

var boxSelectStart = function () {
	keydown = "~";
	if (d3.event.button == 0) {
		initial = screenCoordsToSVG(d3.event.offsetX, d3.event.offsetY);
		boxSelectStarted = true;
	}
};

var boxSelecting = function () {
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

var boxSelectEnd = function () {
	if (boxSelectOngoing) {
		var current = screenCoordsToSVG(d3.event.offsetX, d3.event.offsetY);
		if (
			(initial.x - current.x) * (initial.x - current.x) +
				(initial.y - current.y) * (initial.y - current.y) <
			0.0001
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
			for (var i = 0; i < svgData.points.length; i++) {
				if (
					svgData.points[i].x < maxX &&
					svgData.points[i].x > minX &&
					svgData.points[i].y < maxY &&
					svgData.points[i].y > minY
				) {
					svgData.points[i].select();
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

var btnPointApplyPress = function () {
	applyToSelectedPoints(
		pointColorPicker.color.rgbaString,
		parseFloat(pointRadiusNumber.property("value"))
	);
	pointColorEdited = false;
	pointOtherEdited = false;
	btnPointApplyUpdate();
};

var pointOtherChange = function () {
	pointOtherEdited = true;
	btnPointApplyUpdate();
};

var pointColorChange = function (color) {
	pointColorEdited = true;
	pointHueNumber.property("value", color.hsva.h);
	pointSaturationNumber.property("value", color.hsva.s);
	pointValueNumber.property("value", color.hsva.v);
	pointAlphaNumber.property("value", color.hsva.a);
	btnPointApplyUpdate();
};

var pointNumberChange = function () {
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
		a: pointAlphaNumber.property("value"),
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

var btnLineApplyPress = function () {
	applyToSelectedLines(
		lineColorPicker.color.rgbaString,
		parseFloat(lineWidthNumber.property("value"))
	);
	lineColorEdited = false;
	lineOtherEdited = false;
	btnLineApplyUpdate();
};

var lineOtherChange = function () {
	lineOtherEdited = true;
	btnLineApplyUpdate();
};

var lineColorChange = function (color) {
	lineColorEdited = true;
	lineHueNumber.property("value", color.hsva.h);
	lineSaturationNumber.property("value", color.hsva.s);
	lineValueNumber.property("value", color.hsva.v);
	lineAlphaNumber.property("value", color.hsva.a);
	btnLineApplyUpdate();
};

var lineNumberChange = function () {
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
		a: lineAlphaNumber.property("value"),
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

var btnFaceApplyPress = function () {
	applyToSelectedFaces(faceColorPicker.color.rgbaString);
	faceColorEdited = false;
	btnFaceApplyUpdate();
};

var faceColorChange = function (color) {
	faceColorEdited = true;
	faceHueNumber.property("value", color.hsva.h);
	faceSaturationNumber.property("value", color.hsva.s);
	faceValueNumber.property("value", color.hsva.v);
	faceAlphaNumber.property("value", color.hsva.a);
	btnFaceApplyUpdate();
};

var faceNumberChange = function () {
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
		a: faceAlphaNumber.property("value"),
	};
	btnFaceApplyUpdate();
};

var stopLayerSort = function (e, u) {
	var layerListElement = $("#layer-sortable-list");
	var draggedListItem = u.item;
	var layerListItems = layerListElement.children();
	var newListItemIds = [];
	var orderChanged = false;
	layerListItems.each(function (index) {
		var elementId = $(this).attr("id");
		newListItemIds.push(elementId);
		if (!orderChanged && index < svgData.layers.length) {
			if (svgData.layers[index].id != elementId) {
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
		stepOperation(function () {
			for (var i = 0; i < newListItemIds.length; i++) {
				var layerVisible = true;
				for (var j = 0; j < svgData.layers.length; j++) {
					if (svgData.layers[j].id == newListItemIds[i]) {
						newLayers.push(svgData.layers[j]);
						break;
					}
				}
			}
			for (var i = 0; i < svgData.layers.length; i++) {
				if (svgData.layers[i].removed) {
					newLayers.push(svgData.layers[i]);
				}
			}
			svgData.layers = newLayers;
		});
	}
};

var selectLayer = function () {
	$(".layer-list-item").removeClass("active-layer");
	$(this).parent().addClass("active-layer");
	currentLayer = $(this).parent().attr("id");
};

var deleteLayer = function () {
	var layerId = $(this).parent().parent().attr("id");
	stepOperation(function () {
		if (svgData.layers.length > 1) {
			for (var i = 0; i < svgData.layers.length; i++) {
				if (svgData.layers[i].id != layerId) {
					svgData.layers[i].remove();
				}
			}
			redrawLayers = true;
		}
	});
};

var moveSelectionToLayer = function () {
	var layerId = $(this).parent().parent().attr("id");
	stepOperation(function () {
		svgData.points.forEach(function (point) {
			if (point.isSelected()) {
				point.layer = layerId;
			}
		});
		svgData.lines.forEach(function (line) {
			if (line.isSelected()) {
				line.layer = layerId;
			}
		});
		svgData.faces.forEach(function (face) {
			if (face.isSelected()) {
				face.layer = layerId;
			}
		});
	});
};

var editLayerName = function () {
	var layerId = $(this).parent().attr("id");
	var newName = d3.select(this).property("value").replace(/\s/g, "");
	stepOperation(function () {
		svgData.layers.forEach(function (layer) {
			if (layer.id == layerId) {
				layer.name = newName;
			}
		});
		redrawLayers = true;
	});
};

var toggleLayerVisibility = function () {
	var layerId = $(this).parent().parent().attr("id");
	stepOperation(function () {
		for (var i = 0; i < svgData.layers.length; i++) {
			if (svgData.layers[i].id == layerId) {
				svgData.layers[i].visible = !svgData.layers[i].visible;
			}
		}
		redrawLayers = true;
	});
};

var addLayer = function () {
	stepOperation(function () {
		var nameNum = 1;
		while (
			svgData.layers.some(function (layer) {
				return layer.name == `Layer${nameNum}`;
			})
		) {
			nameNum++;
		}
		svgData.layers.unshift(
			new Layer(
				`r${new Date().getTime()}-${(idAccumulator++)
					.toString()
					.padStart(8, "0")}`,
				`Layer${nameNum}`
			)
		);
		redrawLayers = true;
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

var downKey = function () {
	if (d3.event.ctrlKey || d3.event.altKey) {
		d3.event.preventDefault();
	}
	keydown = d3.event.key;
};

var upKey = function () {
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
		if (keydown == "a" || keydown == "A") {
			if (d3.event.ctrlKey) {
				svgData.points.forEach(function (point) {
					point.select();
					draw();
				});
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

var mouseMove = function () {
	mouseClientCoords = { x: d3.event.clientX, y: d3.event.clientY };
	mouseOffsetCoords = { x: d3.event.offsetX, y: d3.event.offsetY };
};

var uploadBackground = function () {
	if (this.files && this.files[0]) {
		var backCanvas = backgroundCanvas.node();
		var backCtx = backCanvas.getContext("2d");

		var baseCanvas = imageBase.node();
		var baseCtx = baseCanvas.getContext("2d");

		rawimgData = true;
		var reader = new FileReader();
		reader.onload = function (e) {
			var img = new Image();
			img.onload = function () {
				if (img.width > img.height) {
					backCanvas.width = img.width;
					backCanvas.height = img.width;
					backCtx.drawImage(img, 0, (img.width - img.height) / 2);
				} else {
					backCanvas.width = img.height;
					backCanvas.height = img.height;
					backCtx.drawImage(img, (img.height - img.width) / 2, 0);
				}
				backgroundImage = true;
				baseCanvas.width = img.width;
				baseCanvas.height = img.height;
				baseCtx.drawImage(img, 0, 0);
			};
			img.src = e.target.result;
		};
		reader.readAsDataURL(this.files[0]);
	}
};

var setupBackgroundPoints = function () {
	if (backgroundImage) {
		var baseCanvas = imageBase.node();
		var baseCtx = baseCanvas.getContext("2d");
		var imgData = baseCtx.getImageData(
			0,
			0,
			baseCanvas.width,
			baseCanvas.height
		);
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
			30
		);
		var finalPoints = sortThroughCorners(cornerWeights);
		stepOperation(function () {
			var outputLayer = new Layer(
				`r${new Date().getTime()}-${(idAccumulator++)
					.toString()
					.padStart(8, "0")}`,
				`setPoints`
			);
			redrawLayers = true;
			svgData.layers.push(outputLayer);
			finalPoints.forEach(function (weight) {
				var id = `p${new Date().getTime()}-${(idAccumulator++)
					.toString()
					.padStart(8, "0")}`;
				var xy = convertImageXYToSVG(weight);
				var dataIndex = (weight.x + weight.y * baseCanvas.width) * 4;
				var pointColor = `rgb(${imgData.data[dataIndex]}, ${
					imgData.data[dataIndex + 1]
				}, ${imgData.data[dataIndex + 2]})`;
				svgData.points.push(
					new Point(id, xy.x, xy.y, 0.0015, pointColor, outputLayer.id, false)
				);
			});
		});
	}
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
		y: xyCoords.y / squareWidth,
	};
}

function convertSVGXYToImage(xyCoords) {
	var baseCanvas = imageBase.node();
	var squareWidth = Math.max(baseCanvas.height, baseCanvas.width);
	xyCoords = {
		x: parseInt(xyCoords.x * squareWidth),
		y: parseInt(xyCoords.y * squareWidth),
	};
	if (baseCanvas.width > baseCanvas.height) {
		xyCoords.y = xyCoords.y - (squareWidth - baseCanvas.height) / 2;
	} else {
		xyCoords.x = xyCoords.x - (squareWidth - baseCanvas.width) / 2;
	}
	return xyCoords;
}

function getColorAt(xyCoords) {
	var baseCanvas = imageBase.node();
	var baseCtx = baseCanvas.getContext("2d");
	var imgData = baseCtx.getImageData(0, 0, baseCanvas.width, baseCanvas.height);
	var coords = convertSVGXYToImage(xyCoords);
	var dataIndex = (coords.x + coords.y * baseCanvas.width) * 4;
	return `rgba(${imgData.data[dataIndex]}, ${imgData.data[dataIndex + 1]}, ${
		imgData.data[dataIndex + 2]
	},1)`;
}

function sortThroughCorners(weights) {
	var baseCanvas = imageBase.node();
	var splits = 50;
	var widthSplit = baseCanvas.width / splits;
	var heightSplit = baseCanvas.height / splits;

	weights.sort(function (a, b) {
		return b.x - a.x;
	});

	var weightsThinned = [];

	for (var x = 0; x < splits; x++) {
		for (var y = 0; y < splits; y++) {
			var group = [];
			for (var i = 0; i < weights.length; i++) {
				if (
					x * widthSplit < weights[i].x &&
					(x + 1) * widthSplit > weights[i].x &&
					y * heightSplit < weights[i].y &&
					(y + 1) * heightSplit > weights[i].y
				) {
					group.push(weights[i]);
				}
			}
			if (group.length > 0) {
				var xAccumulator = 0;
				var yAccumulator = 0;
				var sAccumulator = 0;
				for (var i = 0; i < group.length; i++) {
					xAccumulator += group[i].x;
					yAccumulator += group[i].y;
					sAccumulator += group[i].score;
				}
				weightsThinned.push({
					x: xAccumulator / group.length,
					y: yAccumulator / group.length,
					score: sAccumulator / group.length,
				});
			}
		}
	}

	weightsThinned.sort(function (a, b) {
		return b.score - a.score;
	});

	var pointsToTake = d3.select("#points-taken-number").property("value");
	var output = [];

	if (pointsToTake > weightsThinned.length) {
		output = weightsThinned;
	} else {
		output = weightsThinned.slice(0, pointsToTake);
	}

	output.push({ x: baseCanvas.width, y: baseCanvas.height });
	output.push({ x: baseCanvas.width, y: 0 });
	output.push({ x: 0, y: baseCanvas.height });
	output.push({ x: 0, y: 0 });
	return output;
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

function stepOperation(fn) {
	stepList = stepList.slice(0, currentStepIndex + 1);
	currentStepIndex++;
	currentStepID++;
	stepList.push(currentStepID.toString().padStart(16, "0"));
	fn();
	draw();
}

function addPoint() {
	stepOperation(function () {
		if (
			!(
				d3.event.shiftKey ||
				(d3.event.sourceEvent && d3.event.sourceEvent.shiftKey)
			)
		) {
			for (var i = 0; i < svgData.points.length; i++) {
				svgData.points[i].deselect();
			}
		}

		var id = `p${new Date().getTime()}-${(idAccumulator++)
			.toString()
			.padStart(8, "0")}`;
		var coords = screenCoordsToSVG(mouseOffsetCoords.x, mouseOffsetCoords.y);
		var newPoint = new Point(id, coords.x, coords.y);
		newPoint.select();
		svgData.points.push(newPoint);
	});
}

function removeSelectedPoints() {
	stepOperation(function () {
		for (var i = 0; i < svgData.lines.length; i++) {
			if (svgData.lines[i].hasSelected()) {
				svgData.lines[i].remove();
			}
		}
		for (var i = 0; i < svgData.faces.length; i++) {
			if (svgData.faces[i].hasSelected()) {
				svgData.faces[i].remove();
			}
		}
		for (var i = 0; i < svgData.points.length; i++) {
			if (svgData.points[i].isSelected()) {
				svgData.points[i].deselect();
				svgData.points[i].remove();
			}
		}
	});
}

function moveSelected(offsetX, offsetY) {
	stepOperation(function () {
		for (var i = 0; i < svgData.points.length; i++) {
			if (svgData.points[i].isSelected()) {
				svgData.points[i].setProperty("x", svgData.points[i].x + offsetX);
				svgData.points[i].setProperty("y", svgData.points[i].y + offsetY);
			}
		}
	});
}

function applyToSelectedPoints(color, radius) {
	stepOperation(function () {
		var newColor = color;
		var newRadius = radius;
		for (var i = 0; i < svgData.points.length; i++) {
			if (svgData.points[i].isSelected()) {
				if (!pointColorEdited) {
					newColor = svgData.points[i].color;
				}
				if (!pointOtherEdited) {
					newRadius = svgData.points[i].radius;
				}
				svgData.points[i].setProperty("radius", newRadius);
				svgData.points[i].setProperty("color", newColor);
			}
		}
		pointColorChange({ hsva: { h: 0, s: 0, v: 0, a: 1 } });
		pointNumberChange();
	});
}

function addDelaunayLines() {
	stepOperation(function () {
		var lines = delaunayLines(getSelectedPoints());
		for (var i = 0; i < lines.length; i++) {
			svgData.lines.push(lines[i]);
		}
	});
}
function removeSelectedLines() {
	stepOperation(function () {
		for (var i = 0; i < svgData.lines.length; i++) {
			if (svgData.lines[i].isSelected()) {
				svgData.lines[i].remove();
			}
		}
	});
}
function applyToSelectedLines(color, width) {
	stepOperation(function () {
		var newColor = color;
		var newWidth = width;
		for (var i = 0; i < svgData.lines.length; i++) {
			if (svgData.lines[i].isSelected()) {
				if (!lineColorEdited) {
					newColor = svgData.lines[i].color;
				}
				if (!lineOtherEdited) {
					newWidth = svgData.lines[i].strokeWidth;
				}
				svgData.lines[i].setProperty("strokeWidth", newRadius);
				svgData.lines[i].setProperty("color", newColor);
			}
		}
		lineColorChange({ hsva: { h: 0, s: 0, v: 0, a: 1 } });
		lineNumberChange();
	});
}

function addSelectedFaces() {
	stepOperation(function () {
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

						svgData.faces.push(new Face(id, p1, p2, p3));
					}
				}
			}
		}
	});
}
function removeSelectedFaces() {
	stepOperation(function () {
		for (var i = 0; i < svgData.faces.length; i++) {
			if (svgData.faces[i].isSelected()) {
				svgData.faces[i].remove();
			}
		}
	});
}
function applyToSelectedFaces(color) {
	stepOperation(function () {
		var newColor = color;
		for (var i = 0; i < svgData.faces.length; i++) {
			if (svgData.faces[i].isSelected()) {
				if (!faceColorEdited) {
					newColor = svgData.faces[i].color;
				}
				svgData.faces[i].setProperty("color", newColor);
			}
		}
		faceColorChange({ hsva: { h: 0, s: 0, v: 0, a: 1 } });
		faceNumberChange();
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
	for (var i = 0; i < svgData.points.length; i++) {
		if (svgData.points[i].isSelected()) {
			selectedPoints.push(svgData.points[i]);
		}
	}
	return selectedPoints;
}

function getSelectedLines() {
	var selectedLines = [];
	for (var i = 0; i < svgData.lines.length; i++) {
		if (svgData.lines[i].isSelected()) {
			selectedLines.push(svgData.lines[i]);
		}
	}
	return selectedLines;
}

function getSelectedFaces() {
	var selectedFaces = [];
	for (var i = 0; i < svgData.faces.length; i++) {
		if (svgData.faces[i].isSelected()) {
			selectedFaces.push(svgData.faces[i]);
		}
	}
	return selectedFaces;
}

function lineExists(point1ID, point2ID) {
	var output = false;
	for (var i = 0; i < svgData.lines.length; i++) {
		if (
			(svgData.lines[i].point1ID == point1ID &&
				svgData.lines[i].point2ID == point2ID) ||
			(svgData.lines[i].point1ID == point2ID &&
				svgData.lines[i].point2ID == point1ID)
		) {
			output = true;
			break;
		}
	}
	return output;
}

function faceExists(point1ID, point2ID, point3ID) {
	var output = false;
	for (var i = 0; i < svgData.faces.length; i++) {
		if (
			(svgData.lines[i].point1ID == point1ID &&
				svgData.lines[i].point2ID == point2ID &&
				svgData.lines[i].point3ID == point3ID) ||
			(svgData.lines[i].point1ID == point1ID &&
				svgData.lines[i].point2ID == point3ID &&
				svgData.lines[i].point3ID == point2ID) ||
			(svgData.lines[i].point1ID == point2ID &&
				svgData.lines[i].point2ID == point1ID &&
				svgData.lines[i].point3ID == point3ID) ||
			(svgData.lines[i].point1ID == point2ID &&
				svgData.lines[i].point2ID == point3ID &&
				svgData.lines[i].point3ID == point1ID) ||
			(svgData.lines[i].point1ID == point3ID &&
				svgData.lines[i].point2ID == point1ID &&
				svgData.lines[i].point3ID == point2ID) ||
			(svgData.lines[i].point1ID == point3ID &&
				svgData.lines[i].point2ID == point2ID &&
				svgData.lines[i].point3ID == point1ID)
		) {
			output = true;
			break;
		}
	}
	return output;
}

function deselectAll() {
	for (var i = 0; i < svgData.points.length; i++) {
		if (svgData.points[i].hasSelected()) {
			svgData.points[i].deselect();
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
		return getInternalByID(svgData.faces, id);
	} else if (id.startsWith("l")) {
		return getInternalByID(svgData.lines, id);
	} else if (id.startsWith("p")) {
		return getInternalByID(svgData.points, id);
	} else if (id.startsWith("r")) {
		return getInternalByID(svgData.layers, id);
	} else {
		return null;
	}
}

function getInternalByID(dataArray, id) {
	var output = null;
	for (var i = 0; i < dataArray.length; i++) {
		if (dataArray[i].id == id) {
			output = dataArray[i];
			break;
		}
	}
	return output;
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
		y: (offsetY / h - trans.y) / trans.k,
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
					width: 170,
				},
			},
			{
				component: iro.ui.Slider,
				options: {
					width: 170,
					sliderMargin: 4,
					padding: 4,
					handleRadius: 4,
					sliderType: "hue",
				},
			},
			{
				component: iro.ui.Slider,
				options: {
					width: 170,
					sliderMargin: 4,
					padding: 4,
					handleRadius: 4,
					sliderType: "saturation",
				},
			},
			{
				component: iro.ui.Slider,
				options: {
					width: 170,
					sliderMargin: 4,
					padding: 4,
					handleRadius: 4,
					sliderType: "value",
				},
			},
			{
				component: iro.ui.Slider,
				options: {
					width: 170,
					sliderMargin: 4,
					padding: 4,
					handleRadius: 4,
					sliderType: "alpha",
				},
			},
		],
		color: "#000",
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

	svgData.layers
		.slice()
		.reverse()
		.forEach(function (layer) {
			if (layer.visible) {
				svgData.faces.forEach(function (face) {
					if (face.layer == layer.id) {
						canvasHTML = canvasHTML.concat(face.svgCanvas());
						basicHTML = basicHTML.concat(face.svgBasic());
					}
				});

				svgData.lines.forEach(function (line) {
					if (line.layer == layer.id) {
						canvasHTML = canvasHTML.concat(line.svgCanvas());
						basicHTML = basicHTML.concat(line.svgBasic());
					}
				});

				svgData.points.forEach(function (point) {
					if (point.layer == layer.id) {
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
			.filter(function () {
				return !d3.event.ctrlKey && !d3.event.button;
			})
			.on("start", dragPointStart)
			.on("drag", dragPoint)
			.on("end", dragPointEnd)
	);

	d3.selectAll(".svg-lines").call(
		d3
			.drag()
			.filter(function () {
				return !d3.event.ctrlKey && !d3.event.button;
			})
			.on("start", dragLineStart)
			.on("drag", dragLine)
			.on("end", dragLineEnd)
	);

	d3.selectAll(".svg-faces").call(
		d3
			.drag()
			.filter(function () {
				return !d3.event.ctrlKey && !d3.event.button;
			})
			.on("start", dragFaceStart)
			.on("drag", dragFace)
			.on("end", dragFaceEnd)
	);

	btnUndo.classed("btn-extra", currentStepIndex > 1 ? false : true);
	btnRedo.classed(
		"btn-extra",
		currentStepIndex !== stepList.length - 1 ? false : true
	);
}

function renderSVGOffset(offsetX, offsetY) {
	for (var i = 0; i < svgData.points.length; i++) {
		if (svgData.points[i].hasSelected()) {
			svgData.points[i].svgOffset(offsetX, offsetY);
		}
	}
	for (var i = 0; i < svgData.lines.length; i++) {
		if (svgData.lines[i].hasSelected()) {
			svgData.lines[i].svgOffset(offsetX, offsetY);
		}
	}
	for (var i = 0; i < svgData.faces.length; i++) {
		if (svgData.faces[i].hasSelected()) {
			svgData.faces[i].svgOffset(offsetX, offsetY);
		}
	}
}

function renderLayers() {
	var newHTML = "";
	for (var i = 0; i < svgData.layers.length; i++) {
		newHTML = newHTML.concat(svgData.layers[i].createLayerHTML());
	}
	$("#layer-sortable-list").html(newHTML);

	$("#layer-sortable-list").sortable().on("sortstop", stopLayerSort);

	$(".btn-layer-visibility").on("click", toggleLayerVisibility);
	$(".btn-layer-move").on("click", moveSelectionToLayer);
	$(".btn-layer-delete").on("click", deleteLayer);
	$(".layer-list-move-icon").on("click", selectLayer);
	$(".layer-list-name").on("change", editLayerName);
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

$(document).ready(function () {
	svgData.layers.push(
		new Layer(
			`r${new Date().getTime()}-${(idAccumulator++)
				.toString()
				.padStart(8, "0")}`,
			"Layer1"
		)
	);
	currentLayer = svgData.layers[0].id;
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

	btnTabs.forEach(function (btn) {
		btn.on("click", btnTabPress);
	});

	d3.select("body")
		.on("keydown", downKey)
		.on("keyup", upKey)
		.on("mousemove", mouseMove);

	window.addEventListener("contextmenu", function (e) {
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

	btnExport.on("click", btnExportPress);

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

	$("#layer-sortable-list").sortable().on("sortstop", stopLayerSort);
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
				[1, 1],
			])
			.translateExtent([
				[-2, -2],
				[3, 3],
			])
			.scaleExtent([Math.pow(1 / zoomFactor, 8), Math.pow(zoomFactor, 8)])
			.filter(function () {
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
