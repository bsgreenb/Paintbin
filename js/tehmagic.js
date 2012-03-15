

$(document).ready(function() {

//load roundabout
      $('.roundabout').roundabout({
      	duration: 200
      });
	
// load colorpicker
$('#colorSelector').ColorPicker({
	color: '#0000ff',
	onShow: function (colpkr) {
		$(colpkr).fadeIn(500);
		return false;
	},
	onHide: function (colpkr) {
		$(colpkr).fadeOut(500);
		return false;
	},
	onChange: function (hsb, hex, rgb) {
		$('#colorSelector div').css('backgroundColor', '#' + hex);
	}
});

//load jquery slider
$('#slider-bar').slider({
	orientation: "vertical",
	handle: '#slider-handle',
	min: 1,
	max: 16,
	value: 4,
	slide: function(e,ui){
	var mypos = $('#slider-bar').slider("value");
	$('#slider-bubble').val(mypos);
	}
});

//load jquery slider
$('#sizeButton').click(function() {
	var p = $("#pencilButton");
var position = p.position();
$("#slider-bar").fadeIn("slow");
$("#slider-bar").css('left', position.left-20).css('top', position.top+40);
$('body').mouseup(function() {
	$("#slider-bar").fadeOut("slow");
	});
});


//initially render all the icons
renderIcon("pencil");
renderIcon("eraser");
renderIcon("trash");
renderCircle();
	
//open tool menus upon click
	$('#pencilButton').click(function() {
		//draw();
		redo('pencil');
	});
	$('#eraserButton').click(function() {
		redo('eraser');
	});
	$('#trashButton').click(function() {
		redo('pencil'); // rerender everything since this button doesn't need to glow
	});
	
});