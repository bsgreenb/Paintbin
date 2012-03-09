/*

The jQuery FillVertically plugin changes height of the element so that it vertically
fills its parent element specified by the selector. It changes height of all elements
on the path to the selected parent element while keeping heights of siblings unchanged.
It also respects borders, paddings and margins of all elements.

Sample:

	<div id="a">
		<div id="b1"></div>
		<div id="b2">
			<div id="c1"></div>
			<div id="c2"></div>
		</div>
		<div id="b3"></div>
	</div>

	Calling $("#c1").fillVertically("#a") changes height of "b2" div to fill "a" vertically
	while keeping heights of "b1" and "b3" unchanged and then it changes height of "c1" div
	to fill "b2" vertically while keeping height of "c2" unchanged.

*/

(function (jQuery)
{
	/* return top margin of the object as an unitless number */
	function topMargin(obj)
	{
		return parseFloat(obj.css('margin-top'));
	}

	/* return bottom margin of the object as an unitless number */
	function bottomMargin(obj)
	{
		return parseFloat(obj.css('margin-bottom'));
	}

	/* check whether the object is visible */
	function isVisible(obj)
	{
		return (obj.css('display') != 'none') && (obj.css('visibility') != 'hidden');
	}

	/* compute height of the element given height of its parent */
	function computeFillHeight(element, parentHeight)
	{
		var t = $(element);

		// sum of all siblings' heights (including padding and border)
		var siblingsHeightsSum = 0;

		// sum of all margins while counting only the maximum of two following elements' margins
		// (that's how browsers should draw it according to HTML standard)
		var marginsSum = 0;

		// process previous elements
		var successorTopMargin = topMargin(t);
		t.prevAll().each(function ()
		{
			var p = $(this);
			if (isVisible(p))
			{
				siblingsHeightsSum += p.outerHeight();
				marginsSum += Math.max(successorTopMargin, bottomMargin(p));
				successorTopMargin = topMargin(p);
			}
		});
		marginsSum += successorTopMargin;

		// process next elements
		var predecessorBottomMagin = bottomMargin(t);
		t.nextAll().each(function ()
		{
			var n = $(this);
			if (isVisible(n))
			{
				siblingsHeightsSum += n.outerHeight();
				marginsSum += Math.max(predecessorBottomMagin, topMargin(n));
				predecessorBottomMagin = bottomMargin(n);
			}
		});
		marginsSum += predecessorBottomMagin;

		// height of the element's padding and border
		var paddingAndBorderHeight = t.outerHeight() - t.height();

		// fill the remaining height
		return parentHeight - (siblingsHeightsSum + marginsSum + paddingAndBorderHeight);
	}

	/* the own jQuery plugin function */
	$.fn.fillVertically = function (parentSelector)
	{
		// prepare array of parent elements that will be filled
		var elements = null, height = 0;
		if (window === parentSelector)
		{
			elements = this.parents().toArray().reverse();
			height = $(window).height();
		}
		else
		{
			elements = this.parentsUntil(parentSelector).toArray().reverse();
			height = $(elements[0]).parent().height();
		}
		elements.push(this.get(0));

		// initially compute heights passing most distant predecessor
		for (var i = 0; i < elements.length; i++)
		{
			height = computeFillHeight(elements[i], height);
		}

		// set computed height
		this.height(height);

		return this;
	};

})(jQuery);
