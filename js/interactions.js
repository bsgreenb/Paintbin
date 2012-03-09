var idIncD = 1;
var turn = 0;
var divID = "canvas";
var specChar = '"';
var specChar2 = '#';

$("#canvas").click(function ()
	{
		$('.help p').remove();
		$('.help').append('<p>This is your canvas!<p>');
		$('.help p').css('color', '#a3ed9b');
	});

function newDrawing(){
	idIncD++;
	$('.help p').remove();
	$('.help').append('<p>Hold and drag to create a new drawing box.<p>');
	$('.help p').css('color', '#feb6b6');
	if(idIncD < 3){
	var uniqueID = specChar + specChar2 + divID + idIncD + specChar;
	var uniqueIDSC = specChar + divID + idIncD + specChar;
	var width = 0;
	var height = 0;

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
	       	width = X2 - X12;
	    	height = Y2 - Y12;	
	    	var assembleF = '<div class="canvasNode" id=';
	    	var assembleB = '></div>';
			var newCanvasdiv = assembleF + uniqueIDSC + assembleB;
			
			$("#canvas").append(newCanvasdiv);
			$("#canvas2").ink(
			{
				mode: "write",
				rightMode: "select",
			});
			//$("#canvas2").ink("option", "backgroundColor", "transparent");
			initWindow();
			drawSize(width, height);
			
			$('#writingRadio').click(function ()
				{
					$("#canvas2").ink('option', 'mode', "write");
				});
			
			$('#erasingRadio').click(function ()
				{
					$("#canvas2").ink('option', 'mode', "erase");
				});
		
			$('#selectingRadio').click(function ()
				{
					$("#canvas2").ink('option', 'mode', "select");
				});
			$('#changeColor').click(function ()
				{
					$("#canvas2").ink("option", "strokeColor", "blue");
				});
		
			// button responsible for canvas clearing
			$('#clearButton')
			.button()
			.click(function () { $("#canvas2").ink('clear'); });
		
			// initial refresh
			refresh();
			
			//position the new drawing canvas correctly
			$("#canvas2").css('left', X12).css('top', Y12);
			
			$('.help p').remove();
			$('.help').append('<p>Awesome, now you are ready to start drawing!<p>');
			$('.help p').css('color', '#a3ed9b');
			$("#canvas2").append('<div class="close" onclick="removeDrawing();"></div>');
			$("#canvas2").draggable({ containment: "parent" });
			 //$("#canvas2").resizable();
			var newwidth = width + 2;
			var newheight = height + 2;
			$('#canvas2').width(newwidth).height(newheight);
	        });
	         $(this).unbind('mousedown');      	
	});
		         
 } // end if

 
} // end newDrawing

function removeDrawing() {
	//$('#canvas2').fadeOut('slow');
	$('#canvas2').remove();
	idIncD = 1;
	defaultMessage();
}


var idIncT = 1;
//create a textbox
function createTextbox() {
	idIncT++;
	$('.help p').remove();
	$('.help').append('<p>Hold and drag to create a new text box.<p>');
	$('.help p').css('color', '#feb6b6');
	if(idIncT < 3){
	$("#canvas").mousedown(function(e){
	    var X1 = (e.pageX - this.offsetLeft) - 8;
	    var Y1 = (e.pageY - this.offsetTop) - 8;
	   	var X12 = (e.pageX) - 8;
	    var Y12 = (e.pageY) - 8;
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
	        var X2 = (e.pageX - this.offsetLeft) - 8;
	        var Y2 = (e.pageY - this.offsetTop) - 8;
	        //alert(X1 + " " + X2 + " " + Y1 + " " + Y2);
	        $(this).unbind('mouseup');
	       
	       	width = X2 - X1;
	    	height = Y2 - Y1;	
	        
	        $("#canvas").append('<textarea name="wysiwyg" id="wysiwyg" rows="5" cols="103"></textarea>');
     		$('#wysiwyg').wysiwyg();
			$(".wysiwyg").attr("id", "canvasNode");
			
			$(".wysiwyg").height(height).width(width);
			
			//position the new drawing canvas correctly
			$(".wysiwyg").css('left', X12).css('top', Y12);
		    $('.help p').remove();
			$('.help').append('<p>Alright, now you can begin writing a piece of your mind!<p>');
			$('.help p').css('color', '#a3ed9b');
			$(".wysiwyg").append('<div class="close" style="padding:4px;" onclick="removeTextbox();"></div>');
			$(".wysiwyg").draggable({ containment: "parent" });
			//$(".wysiwyg").resizable();
		});
	  $(this).unbind('mousedown');

	// } // end turn if 
	});

  }//end if

}

function removeTextbox() {
	$('.wysiwyg').remove();
	$('#wysiwyg').remove();
	idIncT = 1;
	defaultMessage();
}

//using this one
var n = 0;
var limitL = 0;

function createLabel() {
	n++;
	if (limitL < 1){	
		limitL++;
	$('.help p').remove();
	$('.help').append('<p>Now click on the canvas where you want your label to be.<p>');
	$('.help p').css('color', '#feb6b6');
	
	$("#canvas").click(function(e){
	var X1 = (e.pageX - this.offsetLeft) - 8;
	var Y1 = (e.pageY - this.offsetTop) - 20;
	
	var label = document.getElementById("addlabel").value;
             renderText(label); 
             $(this).unbind('click');
             
         $("#addlabel").each(function() {
        switch(this.type) {
            case 'password':
            case 'select-multiple':
            case 'select-one':
            case 'text':
            case 'textarea':
                $(this).val('');
                break;
            case 'checkbox':
            case 'radio':
                this.checked = false;
        }
    });
     
function renderText(textToRender){
	n++;
	var id = '"' + '#' + 'labelHeading' + n + '"';
	var id2 = 'labelHeading'+n;
    var label = '<span id="' + id2 + '">' + textToRender + '</span>';	
    $('#canvas').append($(label));
    attr = {font: "50px Helvetica", opacity: 0.5,};
    var classV = '"' + '.' + 'label' + '"';
	$('#' + id2).attr('width', 'auto').attr(attr).attr({fill: "#000"}).css("position", "absolute")
	.css('left', X1).css('top', Y1).addClass("label").draggable({ containment: "parent" });
	 limitL--;
  }
 });
 } // end if
	$('.help p').remove();
	$('.help').append('<p>Great! Now you can drag your label where ever you need it.<p>');
	$('.help p').css('color', '#a3ed9b');
}

$('.help').click(function(e) {
	console.log("hello");
	//$(this).css("border", "dashed 2px #F00");
});

var c = 0;
var e = 0;
var r = 0;
var rr = 0;

function drawCircle(){
	//$('#messageButton svg').removeClass('svgDrawingObject');

	$('.help p').remove();
	$('.help').append('<p>Click and drag to create this shape!<p>');
	$('.help p').css('color', '#feb6b6');
	//$('.ellipse').css({'background' '#F00'});
	$("#canvas").mousedown(function(e){
    var X1 = (e.pageX - this.offsetLeft) - 8;
    var Y1 = (e.pageY - this.offsetTop) - 8;
    var X12 = (e.pageX) - 8;
    var Y12 = (e.pageY) - 8;
    $("#canvas").append('<div id="showBox"></div>');
    $("#showBox").css('left', X1).css('top', Y1);
    $("#canvas").mousemove(function(e){
  var width = ((e.pageX - this.offsetLeft) - 8) - X1;
  var height = ((e.pageX - this.offsetLeft) - 8) - X1;
      $("#showBox").height(height).width(width);
});
    $(this).mouseup(function(e){
    	globalsomething = 12;
    	$("#showBox").remove();
    	$(this).unbind('mousemove');
        var X2 = (e.pageX - this.offsetLeft) - 8;
        var Y2 = (e.pageY - this.offsetTop) - 8;
        //alert(X1 + " " + X2 + " " + Y1 + " " + Y2);
        $(this).unbind('mouseup');
       	width = X2 - X1;
		var shapeid = 'svgShape'+c;
		var paper = Raphael(X1, Y1, width, width);
		var circle = paper.circle(width/2, width/2, width/2.2);
		 $('svg').draggable({ containment: "#canvas" });
		 //$('svg').css('position', 'absolute').css('left', X12).css('top', Y12);
		$('.help p').remove();
		$('.help').append('<p>Drag this shape anywhere on the canvas.<p>');
		$('.help p').css('color', '#a3ed9b');	 
	});
	$(this).unbind('mousedown');
		$('#buttons svg').removeClass('svgDrawingObject');
		c++;
  });
}

function drawEllipse(){
	$('.help p').remove();
	$('.help').append('<p>Click and drag to create this shape!<p>');
	$('.help p').css('color', '#feb6b6');
	$("#canvas").mousedown(function(e){
    var X1 = (e.pageX - this.offsetLeft) - 8;
    var Y1 = (e.pageY - this.offsetTop) - 8;
    var X12 = (e.pageX) - 8;
    var Y12 = (e.pageY) - 8;
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
        var X2 = (e.pageX - this.offsetLeft) - 8;
        var Y2 = (e.pageY - this.offsetTop) - 8;
        //alert(X1 + " " + X2 + " " + Y1 + " " + Y2);
        $(this).unbind('mouseup');
       	width = X2 - X1;
       	height = Y2 - Y1;	
       	
		var paper = Raphael(X1, Y1, width, height);
		var ellipse = paper.ellipse(width/2, height/2, width/2.2, height/2.2 );
		  $('svg').draggable({ containment: "#canvas" });
		//$('#canvas svg').attr('class', 'svgDrawingObject').css('position', 'absolute').css('left', X12).css('top', Y12);
		$('.help p').remove();
		$('.help').append('<p>Drag this shape anywhere on the canvas.<p>');
		$('.help p').css('color', '#a3ed9b');
	});
	$(this).unbind('mousedown');
	e++;
  });
}

function drawRect(){
	$('.help p').remove();
	$('.help').append('<p>Click and drag to create this shape!<p>');
	$('.help p').css('color', '#feb6b6');
	$("#canvas").mousedown(function(e){
    var X1 = (e.pageX - this.offsetLeft) - 8;
    var Y1 = (e.pageY - this.offsetTop) - 8;
    var X12 = (e.pageX) - 8;
    var Y12 = (e.pageY) - 8;
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
        var X2 = (e.pageX - this.offsetLeft) - 8;
        var Y2 = (e.pageY - this.offsetTop) - 8;
        //alert(X1 + " " + X2 + " " + Y1 + " " + Y2);
        $(this).unbind('mouseup');
       	width = X2 - X1;
       	height = Y2 - Y1;		
		var paper = Raphael(X1, Y1, width+2, width+2);
		var rect = paper.rect(1, 1, width, height);
		  $('svg').draggable({ containment: "#canvas" });
		// $('#canvas svg').attr('class', 'svgDrawingObject').css('position', 'absolute').css('left', X12).css('top', Y12);
		$('.help p').remove();
		$('.help').append('<p>Drag this shape anywhere on the canvas.<p>');
		$('.help p').css('color', '#a3ed9b');
	});
	$(this).unbind('mousedown');
	r++;
  });
}

function drawRectwithRound(){
	$('.help p').remove();
	$('.help').append('<p>Click and drag to create this shape!<p>');
	$('.help p').css('color', '#feb6b6');
	$("#canvas").mousedown(function(e){
    var X1 = (e.pageX - this.offsetLeft) - 8;
    var Y1 = (e.pageY - this.offsetTop) - 8;
    var X12 = (e.pageX) - 8;
    var Y12 = (e.pageY) - 8;
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
        var X2 = (e.pageX - this.offsetLeft) - 8;
        var Y2 = (e.pageY - this.offsetTop) - 8;
        //alert(X1 + " " + X2 + " " + Y1 + " " + Y2);
        $(this).unbind('mouseup');
       	width = X2 - X1;
       	height = Y2 - Y1;		
		var paper = Raphael(X1, Y1, width+2, width+2);
		var rect = paper.rect(1, 1, width, height, 25);
		  $('svg').draggable({ containment: "#canvas" });
		 //$('#canvas svg').attr('class', 'svgDrawingObject').css('position', 'absolute').css('left', X12).css('top', Y12);
		// $('#buttons svg').removeClass('svgDrawingObject');
		$('.help p').remove();
		$('.help').append('<p>Drag this shape anywhere on the canvas.<p>');
		$('.help p').css('color', '#a3ed9b');
	});
	$(this).unbind('mousedown');
	rr++;
  });
  
}

function drawLine(){
	$("#canvas").mousedown(function(e){
    var X1 = (e.pageX - this.offsetLeft) - 8;
    var Y1 = (e.pageY - this.offsetTop) - 8;
    var X12 = (e.pageX) - 8;
    var Y12 = (e.pageY) - 8;
    $("#canvas").mousemove(function(e){
    	$('#canvas svg').remove();
  var width = ((e.pageX - this.offsetLeft) - 8) - X1;
  var height = ((e.pageY - this.offsetTop) - 8) - Y1;
		var paper = Raphael(X12, Y12, e.pageX, e.pageY);
		var stringPath = "M" + 0 + " " + 0 + "L" + width + " " + height;
		var path = paper.path(stringPath);
});
    $(this).mouseup(function(e){
    	$("#showBox").remove();
    	$(this).unbind('mousemove');
        var X2 = (e.pageX - this.offsetLeft) - 8;
        var Y2 = (e.pageY - this.offsetTop) - 8;
        //alert(X1 + " " + X2 + " " + Y1 + " " + Y2);
        $(this).unbind('mouseup');
       	width = X2 - X1;
       	height = Y2 - Y1;		
		var paper = Raphael(X1, Y1, width, width);
		var stringPath = "M" + 0 + " " + 0 + "L" + width + " " + height;
		var path = paper.path(stringPath);
		  $('svg').draggable({ containment: "#canvas" });
		 // $('#canvas svg').attr('class', 'svgDrawingObject').css('position', 'absolute').css('left', X12).css('top', Y12);
		$('.help p').remove();
		$('.help').append('<p>Drag this shape anywhere on the canvas.<p>');
		$('.help p').css('color', '#a3ed9b');
	});
	$(this).unbind('mousedown');
  });

}

function removeTable() {
	$('table').remove();
	idIncT = 1;
	defaultMessage();
}

var rowLimit = 0;
var columnLimit = 0;
function addtablerow() {
	if(rowLimit < 16){
	$('table tbody>tr:last').clone(true).insertAfter('table tbody>tr:last').fadeIn("slow");
     $("table tbody>tr:last td").empty();
     rowLimit++;
    }
    else
    alert("This version only allows for a limited number of rows.");
}
function addtablecolumn() {
	if(columnLimit < 8){
	var rowCount = $('table tr').length;
	rowCount++;
	console.log(rowCount);
	for (var n=1;n<rowCount;n++){
		console.log($('#table tr:nth-child(' + n + ') td:last'));
		$('table tr:nth-child(' + n + ') td:last').clone(true).insertAfter('table tr:nth-child(' + n + ') td:last');
		$('table tr:nth-child(' + n + ') td:last').empty();
	  }
	  columnLimit++;
	 }
	 else
	 alert("This version only allows for a limited number of columns.");
}

function newTableTitle() {
	$('table caption h3').remove();
	var newTitle = document.getElementById("addtabletitle").value;
	$('table caption').append("<h3>" + newTitle + "</h3>");
}

function clearCanvas() {
	var r=confirm("Are you sure you want to clear your canvas?");
if (r==true)
  {
	$('#canvas > *').remove();
	$('.svgDrawingObject').remove();
	defaultMessage();
} 

}
	

function isEmpty(str) {
    return (!str || 0 === str.length);
}

var some = $("#title").text();

function barGraph(){
	 $("table td").click(function () {		
		var $td= $(this).closest('tr').children('td');
		var n = 0;
		var value=new Array();
		while(1){
		value[n]= $td.eq(n).text();
			$td.eq(n).addClass("glow");
			var isempty = isEmpty(value[n]);
			n++;
			if(isempty){break;}
			
		}
		n--;
		value[n] = $('table input:first').val();
		n++;
		for (var s = 0; s < n; s++){
			console.log(value[s]);	
		}
	});
	createGraph ('table', document.getElementById("tableTitle").value, 'bar')
}
var limitT = 0;
function createDynamicTable(tbody, rows, cols) {
	if(limitT < 1){
		if (rows > 10) { alert("Version alpha only allows for up to 10 rows per table."); return};
		if (cols > 10) { alert("Version alpha only allows for up to 10 columns per table."); return};
	$('.help p').remove();
	$('.help').append('<p>Click anywhere to create your new table.<p>');
	$('.help p').css('color', '#feb6b6');
	
 //   $('#canvas').click(function(e){
  //  	var X = (e.pageX);
   //     var Y = (e.pageY);
   if (tbody == null || tbody.length < 1) return;
	     $('#ui-tabs-1').append('<table class="zebra-striped"><caption><h3 id="tableTitle">New Table</h3></caption><tbody>');
	 for (var r = 1; r <= rows; r++) {
	     var trow = $("<tr>");
	 for (var c = 1; c <= cols; c++) {
	     var cellText = "Cell " + r + "." + c
	 $("<td>")
	    .addClass("tableCell")
	    .appendTo(trow);
     }
     trow.appendTo(tbody);
}
	$('#ui-tabs-1').append('</tbody></table>');
	//position the new drawing canvas correctly
//	$("table").css('left', X).css('top', Y);
	
	$('table td').click(function(){
			if( !$(this).is('.input') ){
				$(this).addClass('input')
					.html('<input type="text" value="'+ $(this).text() +'" />')
					// .html('<textarea type="text" >' + $(this).text() + '</textarea>')
					.find('input').focus()
					.blur(function(){
						//remove td class, remove input
						$(this).parent().removeClass('input').html($(this).val() || 0);
						//update charts	
						$('.visualize').trigger('visualizeRefresh');
					});					
			}
			$('.help p').remove();
			$('.help').append('<p>Name, numbers, or descriptions will do!<p>');
			$('.help p').css('color', '#fff');
	})
		.hover(function(){ $(this).addClass('hover'); },function(){ $(this).removeClass('hover'); });
		$('#ui-tabs-1 table').draggable({ containment: "#ui-tabs-1" });	

	  // $('#ui-tabs-1').unbind('click');
	$('.help p').remove();
	$('.help').append('<p>Click the cells of your table to edit them!<p>');
	$('.help p').css('color', '#a3ed9b');
//  });
  limitT++;
  
 } // end if
 else
  alert("We're sorry, version alpha only allows for one table to be created per canvas.");
  
}

function removeButton() {
	$('#canvas svg').insertAfter('<div id="deleteNode">X</div>');
	
	$('#deleteNode').click(function(e){
		console.log("yeay");
	});
}
