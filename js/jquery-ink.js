/*

The jQueryInk is a jQuery UI widget that provides a functionality of a canvas to be used for writing,
erasing and selecting strokes. The jQueryInk widget internally uses a <canvas> element introduced
by HTML5. It can be easily created over some <div> element and initialized or set calling ink() method.

List of possible options:
	mode:
		operation performed on a left mouse button click
		values: "write", "erase", "select", "none"
		default: "write"
	rightMode:
		operation performed on a right mouse button click
		values: "write", "erase", "select", "none"
		default: "select"
	backgroundColor:
		hexadecimal value determining a background color of the canvas
		default: "#fff" (white)
	strokeWidth:
		width of a stroke in pixels
		default: 2
	strokeColor:
		hexadecimal value determining a color of strokes
		default: "#000" (black)
	selectedStrokeColor:
		hexadecimal value determining a color of selected strokes
		default: "#a00" (red)

List of possible handlers:
	onStrokeAdded:
		called when writing a new stroke was finished
	onStrokesErased:
		called during erasing when some strokes were erased
	onErasingEnded:
		called when the process of erasing ends
	onSelectionChanged:
		called during selection when some stroke was selected or unselected
	onStrokesSelected:
		called when the process of selection ends and there are some selected strokes
	onEditingEnded:
		called when editing of selected strokes end
	onClear:
		called when all strokes are cleared

List of possible methods that can be called over the jQueryInk widget:
	destroy():
		destroy the widget and renew the original <div>
	redraw():
		redraw the canvas and all the strokes
	clear(redraw):
		clear all the strokes and redraw the canvas if told so
	strokes():
		obtain actual StrokesCollection
	serialize():
		serialize strokes to a string and return it
	deserialize(serializedStrokes, redraw):
		deserialize stroke from the specified string and draw them if told so
	resize(redraw):
		resize the canvas and redraw its content if told so
	fit(mode, redraw):
		resize strokes to fit canvas size and draw them if told so
	deselect():
		deselect all the selected strokes

Sample:
	
	// html tag
	<div id="myInk"></div>
	
	// create new ink
	$("#myInk").ink({
		mode: "write",
		rightMode: "erase",
		onStrokeAdded: function () { alert("Stroke added!"); }
	});
	
	// get or set some option
	var strokeColor = $("#myInk").ink("option", "strokeColor");
	$("#myInk").ink("option", "backgroundColor", "#abc");
	
	// bind a handler
	$("#myInk").bind("onStrokesErased", function () { alert("Strokes erased!") });
	
	// call a method
	var strokes = $("#myInk").ink("strokes");
	$("#myInk").ink("clear", true);

*/


var ink = {};


//////////////////////////////////////////////////
// Point class ///////////////////////////////////
//////////////////////////////////////////////////

ink.Point = function (x, y, time)
{
	this.x = x;
	this.y = y;
	this.time = time;
};

ink.Point.prototype.toString = function ()
{
	return "[" + this.x + ";" + this.y + ";" + this.time + "]";
};


//////////////////////////////////////////////////
// Rectangle class ///////////////////////////////
//////////////////////////////////////////////////

ink.Rectangle = function (left, top, right, bottom)
{
	this.left = left;
	this.top = top;
	this.right = right;
	this.bottom = bottom;
};

ink.Rectangle.prototype.getWidth = function ()
{
	return (this.right - this.left);
};

ink.Rectangle.prototype.getHeight = function ()
{
	return (this.bottom - this.top);
};

ink.Rectangle.prototype.getDiagonalSquared = function ()
{
	return ink.geometry.distanceSquared(this.getWidth(), this.getHeight());
};

/* check whether the rectangle is valid (it has nonnegative width and height) */
ink.Rectangle.prototype.isValid = function ()
{
	return (this.right >= this.left) && (this.bottom >= this.top);
};

/* resize the rectangle to contain the specified coordinates */
ink.Rectangle.prototype.include = function (x, y)
{
	if (x < this.left) this.left = x;
	if (x > this.right) this.right = x;
	if (y < this.top) this.top = y;
	if (y > this.bottom) this.bottom = y;
};

/* inflate the rectangle to all directions by the specified distance */
ink.Rectangle.prototype.inflate = function (d)
{
	this.left -= d;
	this.top -= d;
	this.right += d;
	this.bottom += d;
};

ink.Rectangle.prototype.toString = function ()
{
	return "[" + this.left + ";" + this.top + ";" + this.right + ";" + this.bottom + "]";
};


//////////////////////////////////////////////////
// Stroke class //////////////////////////////////
//////////////////////////////////////////////////

ink.Stroke = function ()
{
	this.id = ink.Stroke.NEXT_STROKE_ID++,
	this.points = [];
	this.selected = false;
};

/* because unique ids are assigned automatically to strokes we have to keep information about them */
ink.Stroke.NEXT_STROKE_ID = 0;

ink.Stroke.prototype.addPoints = function (points)
{
	for (var p = 0; p < points.length; p++)
	{
		this.points.push(points[p]);
	}
};

ink.Stroke.prototype.length = function ()
{
	return this.points.length;
};

ink.Stroke.prototype.isSelected = function ()
{
	return this.selected;
};

ink.Stroke.prototype.getBoundingBox = function ()
{
	return ink.geometry.getBoundingBox(this.points);
};

/* draw the whole stroke */
ink.Stroke.prototype.draw = function (context, width, color)
{
	this.drawRange(context, 0, this.points.length - 1, width, color);
};

/* draw the last segment of the stroke */
ink.Stroke.prototype.drawLast = function (context, width, color)
{
	var pointsCount = this.points.length;
	this.drawRange(context, Math.max(0, pointsCount - 2), pointsCount - 1, width, color);
};

/* draw only one point of the segment specified by the index */
ink.Stroke.prototype.drawSinglePoint = function (context, index, width, color)
{
	context.lineWidth = 0;
	context.fillStyle = color;

	var point = this.points[index];
	context.fillRect(point.x - width / 2, point.y - width / 2, width, width);
};

/* draw part of the stroke specified by [from, to] points indices */
ink.Stroke.prototype.drawRange = function (context, from, to, width, color)
{
	// stroke having length one will be drawn as a single point
	if (1 == this.points.length)
	{
		this.drawSinglePoint(context, 0, width, color);
	}

	// range containing only one point will be as a single point
	else if (from == to)
	{
		this.drawSinglePoint(context, from, width, color);
	}

	// longer stroke will be drawn as a polyline
	else
	{
		context.lineWidth = width;
		context.strokeStyle = color;

		context.beginPath();
		context.moveTo(this.points[from].x, this.points[from].y);
		for (var p = from + 1; p <= to; p++)
		{
			context.lineTo(this.points[p].x, this.points[p].y);
		}
		context.stroke();
	}
};

/* resize the stroke by the specified factor both in x and y direction */
ink.Stroke.prototype.resizeByFactor = function (resizeFactor)
{
	for (var p = 0; p < this.points.length; p++)
	{
		this.points[p].x *= resizeFactor;
		this.points[p].y *= resizeFactor;
	}
};

ink.Stroke.prototype.serialize = function ()
{
	var str = "(";
	for (var p = 0; p < this.points.length; p++)
	{
		str += this.points[p].toString();
	}
	str += ")";

	return str;
};

ink.Stroke.prototype.deserialize = function (strokeString)
{
	var pointStrings = strokeString.split("]");
	for (var p = 0; p < pointStrings.length; p++)
	{
		if (pointStrings[p].length > 0)
		{
			var pointString = pointStrings[p].substr(1);

			var coordStrings = pointString.split(";");

			var x = parseInt(coordStrings[0]);
			var y = parseInt(coordStrings[1]);
			var time = (coordStrings.length >= 3) ? parseInt(coordStrings[2]) : 0;

			this.points.push(new ink.Point(x, y, time));
		}
	}
};

ink.Stroke.prototype.toString = function ()
{
	return this.serialize();
};


//////////////////////////////////////////////////
// StrokeCollection class ////////////////////////
//////////////////////////////////////////////////

ink.StrokesCollection = function ()
{
	this.strokes = [];
};

/* constants defining erasing of small strokes */
ink.StrokesCollection.SMALL_STROKE_POINTS_COUNT = 6;
ink.StrokesCollection.SMALL_STROKE_BOX_SIZE = 6;
ink.StrokesCollection.SMALL_STROKE_ERASE_DIST = 4;

ink.StrokesCollection.prototype.addStroke = function (stroke)
{
	this.strokes.push(stroke);
};

ink.StrokesCollection.prototype.length = function ()
{
	return this.strokes.length;
};

ink.StrokesCollection.prototype.clear = function ()
{
	this.strokes = [];
};

ink.StrokesCollection.prototype.getSelectedStrokes = function ()
{
	var selectedStrokes = new ink.StrokesCollection();
	for (var s = 0; s < this.strokes.length; s++)
	{
		// choose all strokes marked as selected
		if (this.strokes[s].selected) selectedStrokes.addStroke(this.strokes[s]);
	}

	return selectedStrokes;
};

/* create new collection of strokes containg only strokes specified by their ids */
ink.StrokesCollection.prototype.subset = function (ids)
{
	var subset = new ink.StrokesCollection();

	for (var s = 0; s < this.strokes.length; s++)
	{
		var stroke = this.strokes[i];
		for (var i = 0; i < ids.length; i++)
		{
			if (ids[i] == stroke.id)
			{
				subset.addStroke(stroke);
				break;
			}
		}
	}

	return subset;
};

ink.StrokesCollection.prototype.unselectAllStrokes = function ()
{
	for (var s = 0; s < this.strokes.length; s++)
	{
		this.strokes[s].selected = false;
	}
};

ink.StrokesCollection.prototype.getBoundingBox = function ()
{
	var boundingBox = new ink.Rectangle(Number.MAX_VALUE, Number.MAX_VALUE, Number.MIN_VALUE, Number.MIN_VALUE);
	for (var s = 0; s < this.strokes.length; s++)
	{
		var strokeBoundingBox = this.strokes[s].getBoundingBox();
		boundingBox.include(strokeBoundingBox.left, strokeBoundingBox.top);
		boundingBox.include(strokeBoundingBox.right, strokeBoundingBox.bottom);
	}

	return boundingBox;
};

/* erase strokes that are close to or intersect with a line specified by a segment between from and to points */
ink.StrokesCollection.prototype.erase = function (from, to)
{
	var keptStrokes = [];
	var erasedStrokes = [];

	// direction of erase segment
	var eraseX = to.x - from.x;
	var eraseY = to.y - from.y;

	// check the strokes
	for (var s = 0; s < this.strokes.length; s++)
	{
		var stroke = this.strokes[s];
		var strokePoints = stroke.points;
		var eraseStroke = false;

		// small stroke (only a few points and a small bounding box) => check proximity
		if (strokePoints.length <= ink.StrokesCollection.SMALL_STROKE_POINTS_COUNT &&
			stroke.getBoundingBox().getDiagonalSquared() <= ink.StrokesCollection.SMALL_STROKE_BOX_SIZE * ink.StrokesCollection.SMALL_STROKE_BOX_SIZE)
		{
			var smallStrokeEraseDistSquared = ink.StrokesCollection.SMALL_STROKE_ERASE_DIST * ink.StrokesCollection.SMALL_STROKE_ERASE_DIST;

			if (eraseX > 0 || eraseY > 0)
			{
				// check distance of the of the stroke points and the erasing segment
				for (p = 0; p < strokePoints.length && !eraseStroke; p++)
				{
					eraseStroke = ink.geometry.pointSegmentDistanceSquared(strokePoints[p], from, to) <= smallStrokeEraseDistSquared;
				}
			}
			else
			{
				// check distance of the stroke points and the new erasing point
				for (p = 0; p < strokePoints.length && !eraseStroke; p++)
				{
					eraseStroke = ink.geometry.pointsDistanceSquared(strokePoints[p], to) <= smallStrokeEraseDistSquared;
				}
			}
		}

		// normal stroke => check intersection
		else
		{
			// check all segments of the stroke formed by pairs of following points for intersection
			for (var p = 1; p < strokePoints.length && !eraseStroke; p++)
			{
				eraseStroke = ink.geometry.doSegmentsIntersect(strokePoints[p - 1], strokePoints[p], from, eraseX, eraseY);
			}
		}

		// add the stroke to the right list
		if (eraseStroke) erasedStrokes.push(stroke)
		else keptStrokes.push(stroke);
	}

	// update the list of strokes
	this.strokes = keptStrokes;

	return erasedStrokes;
};

ink.StrokesCollection.prototype.draw = function (context, strokeWidth, strokeColor, selectedStrokeColor)
{
	for (var s = 0; s < this.strokes.length; s++)
	{
		var stroke = this.strokes[s];
		var color = stroke.isSelected() ? selectedStrokeColor : strokeColor;
		stroke.draw(context, strokeWidth, color);
	}
};

/* resize all the strokes by the specified factor both in x and y direction */
ink.StrokesCollection.prototype.resizeByFactor = function (resizeFactor)
{
	for (var s = 0; s < this.strokes.length; s++)
	{
		this.strokes[s].resizeByFactor(resizeFactor);
	}
};

ink.StrokesCollection.prototype.serialize = function ()
{
	var str = "";
	for (var s = 0; s < this.strokes.length; s++)
	{
		str += this.strokes[s].serialize();
	}

	return str;
};

ink.StrokesCollection.prototype.deserialize = function (strokesString)
{
	// remove all strokes
	this.clear();

	// add deserialized strokes
	var strokeStrings = strokesString.split(")");
	for (var s = 0; s < strokeStrings.length; s++)
	{
		if (strokeStrings[s].length > 0)
		{
			var strokeString = strokeStrings[s].substr(1);

			var stroke = new ink.Stroke();
			stroke.deserialize(strokeString);

			this.strokes.push(stroke);
		}
	}
};

ink.StrokesCollection.prototype.toString = function ()
{
	return this.serialize();
};


//////////////////////////////////////////////////
// StrokesSelector class /////////////////////////
////////////////////////////////////////////////// 

ink.StrokesSelector = function (strokes)
{
    this.selectionPoints = [];
    this.selectionBounds = new ink.Rectangle(1e10, 1e10, -1e10, -1e10);
    
	this.strokeSelectionInfos = [];
	for (var s = 0; s < strokes.length; s++)
	{
		var strokePoints = this._approximateStroke(strokes[s]);
		this.strokeSelectionInfos[s] = new ink.StrokesSelector.StrokeSelectionInfo(strokes[s], strokePoints);
	}
};

ink.StrokesSelector.StrokeSelectionInfo = function (stroke, points)
{
	// stroke itself
	this.stroke = stroke;
	
	// approximation points
	this.points = points;
	
	// bounding box of approximation points
	this.boundingBox = ink.geometry.getBoundingBox(points);
	
	this.testedEdgesCount = 0;
	
	this.intersectionsCount = [];
	for (var i = 0; i < points.length; i++)
	{
		this.intersectionsCount[i] = 0;
	}
};

/* constants determining how the selection polygon should look like */
ink.StrokesSelector.LINE_WIDTH = 1;
ink.StrokesSelector.LINE_DASH_LENGTH = 5;
ink.StrokesSelector.LINE_SPACE_LENGTH = 3;
ink.StrokesSelector.LINE_COLOR = '#333';
ink.StrokesSelector.DOT_RADIUS = 3;
ink.StrokesSelector.DOT_COLOR = '#f90';

/* distance of two following selection polygon vertices */
ink.StrokesSelector.SELECTION_DIST = 12;

/* distance of two following vertices approximating a stroke */
ink.StrokesSelector.APPROXIMATION_DIST = 8;

/* ratio of how many of stroke approximating vertices have to be selected for the stroke to be selected */
ink.StrokesSelector.SELECTION_RATIO = 0.66;

/* add new selection points; also updateSelection method has to be called after */
ink.StrokesSelector.prototype.addSelectionPoints = function (points)
{
	var added = false;

	// the first selection point is added always
	if (0 == this.selectionPoints.length && points.length > 0)
	{
		this._addSelectionPoint(points[0]);
		added = true;
	}

	// other selection points are added only if they are sufficiently
	// far away from the lastly added point
	for (var p = 0; p < points.length; p++)
	{
		if (this._updateSelectionWithPoint(points[p]))
		{
			added = true;
		}
	}

	return added;
};

/* recompute the selection and check whether a set of selected strokes has changed */
ink.StrokesSelector.prototype.updateSelection = function ()
{
	var selectionChanged = false;

	for (var i = 0; i < this.strokeSelectionInfos.length; i++)
	{
		var s = this.strokeSelectionInfos[i];
		var strokePreviouslySelected = s.stroke.selected;

		// intersection of bounding boxes
		var intersection = ink.geometry.rectanglesIntersection(this.selectionBounds, s.boundingBox);

		// if there is some intersection of bounding boxes
		if (intersection.isValid())
		{
			var insidePointsCount = 0;

			for (var p = 0; p < s.points.length; p++)
			{
				// intersections with all but the very last selection edge
				for (var e = s.testedEdgesCount; e < this.selectionPoints.length - 1; e++)
				{
					var from = this.selectionPoints[e];
					var to = this.selectionPoints[e + 1];
					if (this._pointEdgeIntersection(from, to, s.points[p])) s.intersectionsCount[p]++;
				}
				var intersectionsCount = s.intersectionsCount[p];

				// intersection with the last edge
				var last = this.selectionPoints[this.selectionPoints.length - 1];
				var first = this.selectionPoints[0];
				if (this._pointEdgeIntersection(last, first, s.points[p])) intersectionsCount++;

				if (1 == intersectionsCount % 2) insidePointsCount++;
			}

			// if there are sufficiently enough points lying inside the selection area then select the stroke
			s.stroke.selected = (insidePointsCount / s.points.length >= ink.StrokesSelector.SELECTION_RATIO);

			// selection has changed (no matter if the stroke was selected or unselected)
			if (strokePreviouslySelected != s.stroke.selected) selectionChanged = true;

			s.testedEdgesCount = this.selectionPoints.length - 1;
		}
	}

	return selectionChanged;
};

ink.StrokesSelector.prototype.draw = function (context)
{
	if (this.selectionPoints.length >= 1)
	{
		context.fillStyle = ink.StrokesSelector.DOT_COLOR;
		context.lineWidth = ink.StrokesSelector.LINE_WIDTH;
		context.strokeStyle = ink.StrokesSelector.LINE_COLOR;

		if (this.selectionPoints.length > 1)
		{
			var firstPoint = this.selectionPoints[0];
			var lastPoint = this.selectionPoints[this.selectionPoints.length - 1];

			// draw dashed line connecting the last and the first selection point
			ink.drawing.drawDashedLine(lastPoint.x, lastPoint.y, firstPoint.x, firstPoint.y,
				ink.StrokesSelector.LINE_DASH_LENGTH, ink.StrokesSelector.LINE_SPACE_LENGTH, context);
		}

		// draw all the selection points as a dots
		for (var p = 0; p < this.selectionPoints.length; p++)
		{
			context.beginPath();
			context.arc(this.selectionPoints[p].x, this.selectionPoints[p].y,
				ink.StrokesSelector.DOT_RADIUS, 0, 2 * Math.PI, true);
			context.stroke();
			context.fill();
		}
	}
};

ink.StrokesSelector.prototype._approximateStroke = function (stroke)
{
	var approximatingPoints = [];

	if (stroke.points.length > 0)
	{
		// first approximating point
		var lastApproximatingPoint = stroke.points[0];
		approximatingPoints.push(lastApproximatingPoint);

		// to avoid computation of squared roots
		var approximationDistSquared = ink.StrokesSelector.APPROXIMATION_DIST * ink.StrokesSelector.APPROXIMATION_DIST;

		for (var p = 1; p < stroke.points.length; p++)
		{
			var point = stroke.points[p];
			if (ink.geometry.pointsDistanceSquared(lastApproximatingPoint, point) >= approximationDistSquared)
			{
				approximatingPoints.push(point);
				lastApproximatingPoint = point;
			}
		}
	}

	return approximatingPoints;
};

ink.StrokesSelector.prototype._addSelectionPoint = function (point)
{
	this.selectionPoints.push(point);
	this.selectionBounds.include(point.x, point.y);
};

ink.StrokesSelector.prototype._updateSelectionWithPoint = function (point)
{
	var lastPoint = this.selectionPoints[this.selectionPoints.length - 1];

	var distanceSquared = ink.geometry.pointsDistanceSquared(point, lastPoint);
	if (distanceSquared >= ink.StrokesSelector.SELECTION_DIST * ink.StrokesSelector.SELECTION_DIST)
	{
		// compute number of points that will be added
		var distance = Math.sqrt(distanceSquared);
		var addedPointsCount = Math.floor(distance / ink.StrokesSelector.SELECTION_DIST);

		// vector for adding points
		var xInc = (point.x - lastPoint.x) / distance;
		var yInc = (point.y - lastPoint.y) / distance;

		// add the points
		for (var i = 0; i < addedPointsCount; i++)
		{
			// add new point
			var x = lastPoint.x + (i + 1) * xInc * ink.StrokesSelector.SELECTION_DIST;
			var y = lastPoint.y + (i + 1) * yInc * ink.StrokesSelector.SELECTION_DIST;

			this._addSelectionPoint(new ink.Point(x, y));
		}

		return true;
	}

	// no point was added to selection
	return false;
};

ink.StrokesSelector.prototype._pointEdgeIntersection = function (from, to, point)
{
	// minimal and maximal Y coordinate of the current edge's vertices
	var maxX = Math.max(from.x, to.x);
	var minY = Math.min(from.y, to.y);
	var maxY = Math.max(from.y, to.y);

	// if the point is properly located
	if ((point.x <= maxX) && (minY < point.y) && (point.y <= maxY) && (from.y != to.y))
	{
		var inters = from.x + (to.x - from.x) * (point.y - from.y) / (to.y - from.y);
		if ((from.x == to.x) || (point.x <= inters))
		{
			return true;
		}
	}

	return false;
};


//////////////////////////////////////////////////
// StrokesEditor class ///////////////////////////
//////////////////////////////////////////////////

ink.StrokesEditor = function (strokesCollection)
{
	this.strokesCollection = strokesCollection;

	this.selectionRectangle = strokesCollection.getBoundingBox();
	this.selectionRectangle.inflate(ink.StrokesEditor.RECTANGLE_INFLATION);
};

/* constants determining a look of the editing rectangle */
ink.StrokesEditor.LINE_WIDTH = 1;
ink.StrokesEditor.LINE_DASH_LENGTH = 5;
ink.StrokesEditor.LINE_SPACE_LENGTH = 3;
ink.StrokesEditor.LINE_COLOR = '#333';
ink.StrokesEditor.RECTANGLE_INFLATION = 10;

ink.StrokesEditor.prototype.draw = function (context)
{
	var r = this.selectionRectangle;
	var d = ink.StrokesEditor.LINE_DASH_LENGTH;
	var s = ink.StrokesEditor.LINE_SPACE_LENGTH;

	// setup selection box visual style
	context.lineWidth = ink.StrokesEditor.LINE_WIDTH;
	context.strokeStyle = ink.StrokesEditor.LINE_COLOR;

	// draw selection box using 4 dashed lines
	ink.drawing.drawDashedLine(r.left, r.top, r.left, r.bottom, d, s, context);
	ink.drawing.drawDashedLine(r.left, r.bottom, r.right, r.bottom, d, s, context);
	ink.drawing.drawDashedLine(r.right, r.bottom, r.right, r.top, d, s, context);
	ink.drawing.drawDashedLine(r.right, r.top, r.left, r.top, d, s, context);
}


//////////////////////////////////////////////////
// geometry functions ////////////////////////////
//////////////////////////////////////////////////

ink.geometry = {};

ink.geometry.distanceSquared = function (xDiff, yDiff)
{
	return xDiff * xDiff + yDiff * yDiff;
};

/* compute squared value of Euclidean distance of points p and q */
ink.geometry.pointsDistanceSquared = function (p, q)
{
	return ink.geometry.distanceSquared(p.x - q.x, p.y - q.y);
};

/* compute squared value of Euclidean distance of point p and segment [from, to] */
ink.geometry.pointSegmentDistanceSquared = function (p, from, to)
{
	// direction of the segment
	var dirX = to.x - from.x;
	var dirY = to.y - from.y;

	// coefficient determining point mapped onto the segment
	var t = (dirX * (p.x - from.x) + dirY * (p.y - from.y)) / ink.geometry.distanceSquared(dirX, dirY);
	if (t < 0) t = 0;
	if (t > 1) t = 0;

	// point mapped onto the segment
	var mappedX = from.x + t * dirX;
	var mappedY = from.y + t * dirY;

	// distance between the original and mapped point
	return ink.geometry.distanceSquared(p.x - mappedX, p.y - mappedY);
};

/* compute bounding rectangle of the specifed set of points */
ink.geometry.getBoundingBox = function (points)
{
	var boundingBox = new ink.Rectangle(1e10, 1e10, -1e10, -1e10);
	for (var p = 0; p < points.length; p++)
	{
		boundingBox.include(points[p].x, points[p].y);
	}

	return boundingBox;
};

/* compute an intersection of rectangles r and s */
ink.geometry.rectanglesIntersection = function (r, s)
{
	var left = Math.max(r.left, s.left);
	var top = Math.max(r.top, s.top);
	var right = Math.min(r.right, s.right);
	var bottom = Math.min(r.bottom, s.bottom);

	return new ink.Rectangle(left, top, right, bottom);
};

/* check whether the specified point lies inside the specified rectangle */
ink.geometry.isPointInRectangle = function (rect, point)
{
	return (rect.left <= point.x) && (point.x <= rect.right) &&
		(rect.top <= point.y) && (point.y <= rect.bottom);
};

ink.geometry.crossProduct = function (x1, y1, x2, y2)
{
	return x1 * y2 - y1 * x2;
};

/* check whether the segmnet [from1, to1] and the segment [from2, [from2 + dir2x, from2 + dir2y]] intersect */
ink.geometry.doSegmentsIntersect = function (from1, to1, from2, dir2x, dir2y)
{
	// try to find coefficients e, f so that: from1 + e * (to1 - from1) = from2 + f * dir2
	// if we find e, f from [0, 1] then the segments intersect

	// direction of the first segment
	var dir1x = to1.x - from1.x;
	var dir1y = to1.y - from1.y;

	// coss product of direction vectors
	var cross = ink.geometry.crossProduct(dir1x, dir1y, dir2x, dir2y);

	// if the segments aren't parallel
	if (cross != 0)
	{
		// direction of the origins' join vector
		var dx = from2.x - from1.x;
		var dy = from2.y - from1.y;

		// coefficients of intersection
		var e = ink.geometry.crossProduct(dx, dy, dir2x, dir2y) / cross;
		var f = ink.geometry.crossProduct(dx, dy, dir1x, dir1y) / cross;

		// if the segments intersect inside them
		if (e >= 0 && e <= 1 && f >= 0 && f <= 1)
		{
			return true;
		}
	}

	return false;
};


//////////////////////////////////////////////////
// drawing functions /////////////////////////////
//////////////////////////////////////////////////

ink.drawing = {};

ink.drawing.drawLine = function (x1, y1, x2, y2, context)
{
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
};

ink.drawing.drawDashedLine = function (x1, y1, x2, y2, dashLength, spaceLength, context)
{
	if (x1 != x2 || y1 != y2)
	{
		var xDiff = x2 - x1;
		var yDiff = y2 - y1;

		// length of the line to be drawn
		var length = Math.sqrt(xDiff * xDiff + yDiff * yDiff);

		// sinus and cosinus of the line direction angle
		var cos = xDiff / length;
		var sin = yDiff / length;

		// count of spaces
		var count = Math.ceil((length - dashLength) / (dashLength + spaceLength));

		// length of dash on the end of the line
		var capDashLength = 0.5 * (length - (count * spaceLength + (count - 1) * dashLength));

		context.beginPath();

		// draw the first dash
		x2 = x1 + cos * capDashLength;
		y2 = y1 + sin * capDashLength;
		ink.drawing.drawLine(x1, y1, x2, y2, context);

		// draw following dashes
		for (var i = 1; i <= count; i++)
		{
			x1 = x2 + cos * spaceLength;
			y1 = y2 + sin * spaceLength;
			x2 = x1 + cos * (i < count ? dashLength : capDashLength);
			y2 = y1 + sin * (i < count ? dashLength : capDashLength);
			ink.drawing.drawLine(x1, y1, x2, y2, context);
		}

		context.stroke();
	}
};


//////////////////////////////////////////////////
// jQuery plugin /////////////////////////////////
//////////////////////////////////////////////////

(function ($)
{
	var State =
	{
		Normal: 0,
		Writing: 1,
		Erasing: 2,
		Selecting: 3,
		Editing: 4
	}

	var MouseButton =
	{
		Unknown: 0,
		Left: 1,
		Right: 2
	}

	function getPoints(canvas, data, event)
	{
		// offset of the canvas relative to the document
		var offset = canvas.offset();

		// time of the input
		var time = (new Date()).getTime() - data.initTime;

		var points = [];

		if (event.touches)
		{
			for (var i = 0; i < event.touches.length; i++)
			{
				var x = event.touches[i].pageX - offset.left;
				var y = event.touches[i].pageY - offset.top;
				points.push(new ink.Point(x, y, time));
			}
		}
		else
		{
			var x = event.clientX - offset.left;
			var y = event.clientY - offset.top;
			points.push(new ink.Point(x, y, time));
		}

		return points;
	}

	function getMouseButton(event)
	{
		var button = event.button || event.which;

		if (1 == button) return MouseButton.Left;
		if (2 == button) return MouseButton.Right;
		else return MouseButton.Unknown;
	}

	function define(value, defaultValue)
	{
		return (undefined === value) ? defaultValue : value;
	}

	function beginWriting(self, data, points)
	{
		data.state = State.Writing;

		// begin new stroke
		data.stroke = new ink.Stroke();
		data.strokesCollection.addStroke(data.stroke);
		data.stroke.addPoints(points);

		self.redraw();
	}

	function performWriting(self, data, points)
	{
		if (State.Writing == data.state && null != data.stroke)
		{
			data.stroke.addPoints(points);

			self.redraw();
		}
	}

	function endWriting(self, data)
	{
		self._trigger('onStrokeAdded', null, data.stroke);

		data.state = State.Normal;
		data.stroke = null;

		self.redraw();
	}

	function beginErasing(self, data, points)
	{
		data.state = State.Erasing;
		data.erasePoint = points[0];
	}

	function performErasing(self, data, points)
	{
		if (State.Erasing == data.state && null != data.erasePoint)
		{
			// try to erase using the line connecting previous erase point and the last added erase point
			var lastPoint = points[points.length - 1];
			var erasedStrokes = data.strokesCollection.erase(data.erasePoint, lastPoint);
			data.erasePoint = lastPoint;

			if (erasedStrokes.length > 0)
			{
				self._trigger('onStrokesErased', null, erasedStrokes);

				// redraw only when some stroke was erased, otherwise the view didn't changed
				self.redraw();
			}
		}
	}

	function endErasing(self, data)
	{
		self._trigger('onErasingEnded', null, data.strokesCollection);

		data.state = State.Normal;
		data.erasePoint = null;
	}

	function beginSelecting(self, data, points)
	{
		data.state = State.Selecting;

		// create new selector
		data.strokesSelector = new ink.StrokesSelector(data.strokesCollection.strokes);
		data.strokesSelector.addSelectionPoints(points);

		self.redraw();
	}

	function performSelecting(self, data, points)
	{
		if (State.Selecting == data.state && null != data.strokesSelector)
		{
			if (data.strokesSelector.addSelectionPoints(points))
			{
				if (data.strokesSelector.updateSelection())
				{
					self._trigger('onSelectionChanged', null, data.strokesCollection.getSelectedStrokes());
				}

				// redraw only when at least on selection point was added otherwise the view hasn't change
				self.redraw();
			}
		}
	}

	function endSelecting(self, data)
	{
		if (State.Selecting == data.state && null != data.strokesSelector)
		{
			data.state = State.Normal;
			data.strokesSelector = null;

			var selectedStrokes = data.strokesCollection.getSelectedStrokes();

			if (selectedStrokes.length() > 0)
			{
				self._trigger('onStrokesSelected', null, selectedStrokes);
				beginEditing(self, data, selectedStrokes);
			}
			else
			{
				self.redraw();
			}
		}
	}

	function beginEditing(self, data, strokes)
	{
		data.state = State.Editing;
		data.strokesEditor = new ink.StrokesEditor(strokes);

		self.redraw();
	}

	function endEditing(self, data)
	{
		if (State.Editing == data.state)
		{
			var editedStrokes = data.strokesEditor.strokesCollection;
			self._trigger('onEditingEnded', null, editedStrokes);

			data.state = State.Normal;
			data.strokesEditor = null;

			data.strokesCollection.unselectAllStrokes();

			self.redraw();
		}
	}

	function endInteraction(self, data)
	{
		switch (data.state)
		{
			case State.Writing:
				endWriting(self, data);
				break;
			case State.Erasing:
				endErasing(self, data);
				break;
			case State.Selecting:
				endSelecting(self, data);
				break;
		}
	}

$.widget("ui.ink",
{
	/* default values of the widget's options */
	options:
	{
		mode: "write",
		rightMode: "select",
		backgroundColor: '#fff',
		strokeWidth: 2,
		strokeColor: '#000',
		selectedStrokeColor: '#a00'
	},

	_create: function ()
	{
		var self = this;
		var options = this.options;

		// add canvas element keeping content of the wrapper div
		var content = this.element.html();
		var canvas = $('<canvas>' + content + '</canvas>');
		this.element.html(canvas);

		// set right size of the canvas without redrawing it
		this.resize(false);

		// initialize data bound with the wrapper
		canvas.data('ink',
		{
			initTime: (new Date()).getTime(),
			state: State.Normal,
			strokesCollection: new ink.StrokesCollection(),
			stroke: null,
			erasePoint: null,
			strokesSelector: null,
			strokesEditor: null
		});

		var canvasElement = canvas.get(0);
		var data = this._getData();

		// create event handlers for the canvas element
		var canvasHandlers =
		{
			beginInteraction: function (event)
			{
				if (State.Editing == data.state)
				{
					endEditing(self, data);
				}
				else
				{
					var points = getPoints(canvas, data, event);
					var mouseButton = getMouseButton(event);

					var mode = (MouseButton.Left == mouseButton || MouseButton.Unknown == mouseButton) ?
						options.mode : options.rightMode;

					// on left mouse button action depends on the current mode
					switch (mode)
					{
						case "write":
							beginWriting(self, data, points);
							break;
						case "erase":
							beginErasing(self, data, points);
							break;
						case "select":
							beginSelecting(self, data, points);
							break;
					}
				}

				return false;
			},

			performInteraction: function (event)
			{
				var state = data.state;

				if (State.Writing == state || State.Erasing == state || State.Selecting == state)
				{
					var points = getPoints(canvas, data, event);

					switch (data.state)
					{
						case State.Writing:
							performWriting(self, data, points);
							break;
						case State.Erasing:
							performErasing(self, data, points);
							break;
						case State.Selecting:
							performSelecting(self, data, points);
					}
				}

				return false;
			},

			endInteraction: function (event)
			{
				endInteraction(self, data);
				return false;
			},

			avoidInteraction: function ()
			{
				return false;
			}
		};
		
		// bind handlers to events generated by a mouse
		canvas
		.mousedown(canvasHandlers.beginInteraction)
		.mousemove(canvasHandlers.performInteraction)
		.mouseup(canvasHandlers.endInteraction)
		.mouseout(canvasHandlers.endInteraction);

		// bind handlers to events generated by a touch device
		canvasElement.ontouchstart = canvasHandlers.beginInteraction;
		canvasElement.ontouchmove = canvasHandlers.performInteraction;
		canvasElement.ontouchend = canvasHandlers.endInteraction;

		// disable text selection cursor on canvas click
		canvasElement.onselectstart = canvasHandlers.avoidInteraction;

		// disable context menu
		canvasElement.oncontextmenu = canvasHandlers.avoidInteraction;

		// the first redraw
		this.redraw();
	},

	_setOption: function (option, value)
	{
		$.Widget.prototype._setOption.apply(this, arguments);

		if ("mode" == option || 'rightMode' == option)
		{
			this._endInteractionAndEditing();
		}
		else if ('backgroundColor' == option || 'strokeColor' == option ||
		'selectedStrokeColor' == option || 'strokeWidth' == option)
		{
			this.redraw();
		}
	},

	_getCanvas: function ()
	{
		return this.element.children('canvas');
	},

	_getData: function ()
	{
		return this._getCanvas().data('ink');
	},

	_endInteractionAndEditing: function ()
	{
		var data = this._getData();
		endInteraction(this, data);
		endEditing(this, data);
	},

	/* destroy the widget and renew the original <div> */
	destroy: function ()
	{
		// remove data bound with the wrapper
		this._getCanvas().removeData('ink');

		// remove canvas element keeping its inner content
		var content = this.element.children('canvas').html();
		this.element.html(content);

		return this;
	},

	/*	redraw the canvas and all the strokes */
	redraw: function ()
	{
		this._trigger("onRedraw", null, context);

		var options = this.options;
		var canvas = this._getCanvas();
		var canvasElement = canvas.get(0);
		var context = canvasElement.getContext('2d');
		var data = this._getData();

		if (State.Writing == data.state && null != data.stroke)
		{
			// last segment of the currently written stroke only
			data.stroke.drawLast(context, options.strokeWidth, options.strokeColor, options.selectedStrokeColor);
		}
		else
		{
			// background
			context.fillStyle = options.backgroundColor;
			context.fillRect(0, 0, canvasElement.width, canvasElement.height);

			// all strokes
			data.strokesCollection.draw(context, options.strokeWidth, options.strokeColor, options.selectedStrokeColor);
		}

		// strokes selector
		if (State.Selecting == data.state && null != data.strokesSelector)
		{
			data.strokesSelector.draw(context);
		}
		
		// strokes editor
		if (State.Editing == data.state && null != data.strokesEditor)
		{
			data.strokesEditor.draw(context);
		}
		
		return this;
	},

	/* clear all the strokes and redraw the canvas if told so */
	clear: function (redraw)
	{
		var data = this._getData();
		
		this._trigger('onClear', null, data.strokesCollection);

		this._endInteractionAndEditing();

		data.strokesCollection.clear();

		// don't redraw if told explicitly
		if (define(redraw, true)) this.redraw();

		return this;
	},

	/* obtain actual StrokesCollection */
	strokes: function ()
	{
		return this._getData().strokesCollection;
	},

	/* serialize strokes to a string and return it */
	serialize: function ()
	{
		return this.strokes().serialize();
	},

	/* deserialize stroke from the specified string and draw them if told so */
	deserialize: function (serializedStrokes, redraw)
	{
		var strokes = this.strokes();
		strokes.deserialize(serializedStrokes);

		// don't redraw if told explicitly
		if (define(redraw, true)) this.redraw();

		return this;
	},

	/* resize the canvas and redraw its content if told so */
	resize: function (redraw)
	{
		this._getCanvas()
		.attr('width', this.element.width())
		.attr('height', this.element.height());

		// don't redraw if told explicitly
		if (define(redraw, true)) this.redraw();

		return this;
	},

	/* resize strokes to fit canvas size and draw them if told so */
	fit: function (mode, redraw)
	{
		var strokes = this.strokes();

		// compute strokes bounds considering empty space
		var strokesBounds = strokes.getBoundingBox();
		var strokesWidth = strokesBounds.getWidth() + 2 * strokesBounds.left;
		var strokesHeight = strokesBounds.getHeight() + 2 * strokesBounds.top;

		// load canvas width and height
		var canvas = this._getCanvas();
		var canvasWidth = canvas.attr('width');
		var canvasHeight = canvas.attr('height');

		// compute multiplication factor for resizing all the strokes while keeping aspect ratio
		var resizeFactor = Math.min(canvasWidth / strokesWidth, canvasHeight / strokesHeight);

		if ((resizeFactor < 1.0 && ('both' == mode || 'down' == mode)) || (resizeFactor > 1.0 && ('both' == mode || 'up' == mode)))
		{
			strokes.resizeByFactor(resizeFactor);

			// don't redraw if told explicitly
			if (define(redraw, true)) this.redraw();
		}
		
		return this;
	},

	/* deselect all the selected strokes */
	deselect: function ()
	{
		this._endInteractionAndEditing();
		return this;
	}
});

})(jQuery);
