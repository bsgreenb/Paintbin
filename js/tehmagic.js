

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
		handle: '#slider-handle',
		min: 0,
		max: 41,
		value: 4,
		slide: function(e,ui){
		var mypos = $('#slider-bar').slider("value");
		$('#slider-bubble').val(mypos);
		}
	});

//initially render all the icons
	renderIcon("pencil");
	renderIcon("pen");
	renderIcon("eraser");
	renderIcon("trash");
	
//open tool menus upon click
	$('#pencilButton').click(function() {
		//draw();
		redo('pencil');
	});
	$('#penButton').click(function() {
		redo('pen');
	});
	$('#eraserButton').click(function() {
		redo('eraser');
	});
	$('#trashButton').click(function() {
		redo('pen'); // rerender everything since this button doesn't need to glow
	});
	
	$("#nttitle").mousedown(function(e) {
			newtitle();
		});
	$("#ntlabel").mousedown(function(e) {
			newlabel();
		});
	$("#ntparagraph").mousedown(function(e) {
			newparagraph();
	});

});