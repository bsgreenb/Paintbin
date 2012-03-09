function createDialog(dialogSelector, dialogTitle)
{
	// process all elements having specified class
	$(dialogSelector).dialog(
	{
		title: dialogTitle,
		autoOpen: false,
		closeOnEscape: false,
		modal: true
	});
}

function showAutocloseDialog(dialogSelector)
{
	var dialog = $(dialogSelector);
	dialog.dialog('open');
	window.setTimeout(function ()
	{
		dialog.dialog('close');
	},
	1500);
}

function centerStub(centralStub)
{
	// select left and right stub
	var leftStub = centralStub.prevAll('.left-stub');
	var rightStub = centralStub.prevAll('.right-stub');

	// setup the central stub
	centralStub
	.css('margin-left', leftStub.outerWidth(true))
	.css('margin-right', rightStub.outerWidth(true))
	.css('padding-top', (Math.max(leftStub.outerHeight(true), rightStub.outerHeight(true)) - centralStub.height()) / 2);
}

function refresh()
{
	$('#canvas')
	.fillVertically(window)
	.ink('resize');
}

function fitCanvas()
{
	$('#canvas')
	.fillVertically(window)
	.ink('resize', false)
	.ink('fit', 'both', true);
}

function renderMathML(mathML, autoFitCanvas)
{
	$('#mathML').html(mathML);
	var typeset = ["Typeset", MathJax.Hub, "mathML"];
	if (autoFitCanvas) MathJax.Hub.Queue(typeset, [fitCanvas]);
	else MathJax.Hub.Queue(typeset);
}

function initEditButtons(initSelectingRadio)
{
	// make radios looking like buttons
    $('#modeRadio').buttonset();

    // make checkbox look like buttons
    $('#tabletCheckbox').button();

	// don't cache which radio is checked (Firefox issue)
	$('#modeRadio > input[type=radio]').attr('autocomplete', "off");
	
	$('#writingRadio').click(function ()
	{
		$('#canvas').ink('option', 'mode', "write");
	});
	
	$('#erasingRadio').click(function ()
	{
		$('#canvas').ink('option', 'mode', "erase");
	});
	
	if (initSelectingRadio)
	{
		$('#selectingRadio').click(function ()
		{
			$('#canvas').ink('option', 'mode', "select");
		});
	}

	// button responsible for canvas clearing
	$('#clearButton')
	.button()
	.click(function () { $('#canvas').ink('clear'); });
}

function initWindow()
{
	// handle window changes properly
	window.onresize = refresh;
	window.onorientationchange = refresh;
}
