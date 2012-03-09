

function loadSampleMathML()
{
	$('#loadingProgressDialog').dialog('open');

	// load sample MathML by synchronous Ajax call
	$.ajax(
	{
		async: false,
		url: "Service.svc/DataCollectorWebHttpEndpoint/LoadSampleMathML",
		type: "POST",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		complete: function (result)
		{
			$('#loadingProgressDialog').dialog('close');

			if ((4 == result.readyState && 200 == result.status))
			{
				var mathML = jQuery.parseJSON(result.responseText).d;
				renderMathML(mathML, true);
			}
			else
			{
				// some error has occured while loadig sample formula
				showAutocloseDialog('#loadingErrorDialog');
			}
		}
	});
}

function initDialogs()
{
	// create dialogs
	createDialog('#loadingProgressDialog, #loadingErrorDialog', "Sample Formula Loading Progress");
	createDialog('#savingProgressDialog, #savingSuccessDialog, #savingErrorDialog', "Formula Saving Progress");

	// close saving error dialog when clicking on its button
	$('#loadingErrorButton')
	.button()
	.click(function ()
	{
		$('#loadingErrorDialog').dialog('close');
	});

	// close saving success dialog when clicking on its button
	$('#savingSuccessButton')
	.button()
	.click(function ()
	{
		$('#savingSuccessDialog').dialog('close');
	});

	// close saving error dialog when clicking on its button
	$('#savingErrorButton')
	.button()
	.click(function ()
	{
		$('#savingErrorDialog').dialog('close');
	});
}

function updateUsername()
{
	var usernameTextVal = $('#usernameText').val();

	if (usernameTextVal.length > 0)
	{
		// username is filled properly => remember it
		$('#usernameHidden').val(usernameTextVal);
	}
	else
	{
		// username not filled => show helping message
		$('#usernameText').val("Please insert your name...").css('color', "Gray");
		$('#usernameHidden').val("");
	}
}

function initUsername()
{
	$('#usernameText')
	.focus(function ()
	{
		if (0 == $('#usernameHidden').val().length)
		{
			$(this).val("").css('color', "Black");
		}
	})
	.blur(updateUsername);

	// initial update of username
	$('#usernameText').val("");
	updateUsername();
}

function initSaveButton()
{
    $('#saveButton')
	.button()
	.click(function () {
	    // show saving progress dialog
	    $('#savingProgressDialog').dialog('open');

	    // prepare data to be send to the service
	    var strokesString = $('#canvas').ink('serialize');
	    var usernameString = $('#usernameHidden').val();
	    var tabletUsed = "0";
	    if ($('#tabletCheckbox').attr('checked')) {
	        tabletUsed = "1";
	    }

	    // send data and load sample MathML using synchronous Ajax call
	    $.ajax(
		{
		    async: false,
		    url: "Service.svc/DataCollectorWebHttpEndpoint/SaveUserStrokesStringAndLoadSampleMathML",
		    type: "POST",
		    contentType: "application/json; charset=utf-8",
		    data: '{"strokesString":"' + strokesString + '", "username":"' + usernameString + '", "tabletUsed":"' + tabletUsed + '"}',
		    dataType: "json",
		    complete: function (result) {
		        // hide saving progress dialog
		        $('#savingProgressDialog').dialog('close');

		        if ((4 == result.readyState && 200 == result.status)) {
		            var response = jQuery.parseJSON(result.responseText).d;

		            if (response.SavingResult) {
		                // formulas has been saved successfully => clean strokes and render new sample MathML
		                showAutocloseDialog('#savingSuccessDialog');
		                $('#canvas').ink('clear', true);
		                renderMathML(response.SampleMathML, true);
		                return;
		            }
		        }

		        // some error has occured while saving the formula => keep strokes and sample formula
		        showAutocloseDialog('#savingErrorDialog');
		    }
		});
	});
}

function initCanvas()
{
	$('#canvas111').ink(
	{
		mode: "write",
		rightMode: "select",
		backgroundColor: '#ccc'
	});
}

$(document).ready(function ()
{
	// init all page elements
	initDialogs();
	initEditButtons(false);
	initUsername();
	initSaveButton();
	initCanvas();
	initWindow();

	// initial refresh
	refresh();

	// initial sample formula load
	loadSampleMathML();
});
