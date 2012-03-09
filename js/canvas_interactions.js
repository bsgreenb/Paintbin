/* canvas interaction functions */

function draw() {
	var callback = function(event){
 if(event.preventDefault)
 {
  event.preventDefault();
 }
 // Other code...
}

    var width = $("#canvas").width();
    var height = $("#canvas").height();
	var sketchpad = Raphael.sketchpad("canvas", {
		width: width,
		height: height,
		editing: true
	});
 	
	
	$('.tipBox p').remove();
	$('.tipBox').append('<p>Let the rage begin.</p>');
	$('.tipBox p').css('color', '#a3ed9b');
	
	// When the sketchpad changes, update the input field.
	sketchpad.change(function() {
		$("#data").val(sketchpad.json());
	});
		
		$("#editor_undo").click(function() {
			sketchpad.undo();
		});
		$("#editor_redo").click(function() {
			sketchpad.redo();
		});
		$("#editor_clear").click(function() {
			sketchpad.clear();
		});
		
		$('#colorpickersubmit').click(function() {
			var color = '#' + $('.colorpicker_hex input').val();
			sketchpad.pen().color(color);
		} );
		$('#sizepickersubmit').click(function() {
			var width = $('#slider-bubble').val();
			sketchpad.pen().width(width);
			console.log(width);
		} );
}

function text() {

}

function newtitle() {
	$('.tipBox p').remove();
	$('.tipBox').append('<p>To create a new text object, simply drag an element onto the page!</p>');
	$('.tipBox p').css('color', '#b6e0fe');
	$(".tipBox").fadeIn(500).delay(4000).fadeOut(500);
	
	var X1 = (e.pageX - this.offsetLeft) - 8;
    var Y1 = (e.pageY - this.offsetTop) - 8;
    var X12 = (e.pageX) - 6;
    var Y12 = (e.pageY) - 6;
    $("#canvas").append('<div id="titlePreview"></div>');
    $("#titlePreview").css('left', X1).css('top', Y1);

    $("#canvas").mousemove(function(e){
	   $("#titlePreview").css('left', (e.pageX - this.offsetLeft)).css('top', (e.pageY - this.offsetTop));
		});
		
    $(this).mouseup(function(e){
	$("#titlePreview").remove();
	$(this).unbind('mousemove');
    var X2 = (e.pageX) - 8;
    var Y2 = (e.pageY) - 8;
    
	$("#canvas").append('<div id="textbox"></div>');
	textpad = Raphael('textbox', "100%", "80%");

	$('#textbox').css('left', X2).css('top', Y2);
	$("#textbox").draggable();

	var txt =  textpad.text(175, 50, "Some Header of Mine");
	txt.attr({
		"width" : 150,
		"fill": "#000",
		"font-size": "12pt",
		"font-weight": "bold"
	});
    
    $(this).unbind('mouseup');
    });
			
	/*
$("#canvas").mousedown(function(e){
	    var X1 = (e.pageX - this.offsetLeft) - 8;
	    var Y1 = (e.pageY - this.offsetTop) - 8;
	    var X12 = (e.pageX) - 6;
	    var Y12 = (e.pageY) - 6;
	    $("#canvas").append('<div id="showBox"></div>');
	    $("#showBox").css('left', X1).css('top', Y1);
	    
	    $("#canvas").mousemove(function(e){
	    	
		  	var width = ((e.pageX - this.offsetLeft) - 8) - X1;
		  	var height = ((e.pageY - this.offsetTop) - 8) - Y1;
		  	   
		    $("#showBox").height(height).width(width);
			});
	
	    $(this).mouseup(function(e){
	    	$("#showBox").remove();
	    	$(this).unbind('mousemove');
	        var X2 = (e.pageX) - 8;
	        var Y2 = (e.pageY) - 8;
	        //alert(X1 + " " + X2 + " " + Y1 + " " + Y2);
	        $(this).unbind('mouseup');
	        //turn--;
	       	w = X2 - X12;
	    	h = Y2 - Y12;
	    	
			$("#canvas").append('<div id="textbox"></div>');
			textpad = Raphael('textbox', "100%", "80%");
		
			$('#textbox').width(w).height(h);
			$('#textbox').css('left', X12).css('top', Y12);
			$("#textbox").draggable();
		
			var txt =  textpad.text(175, 50, "some text");
			txt.attr({
				"width" : 150,
				"fill": "#000",
				"font-size": "12pt",
				"font-weight": "bold"
			});
		});
	  $(this).unbind('mousedown');   
	});
	*/
}