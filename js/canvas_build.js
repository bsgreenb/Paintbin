// essential functions

function line(cx1, cy1, cx2, cy2) {
    c = $(document.body);
    var dx = Math.abs(cx2-cx1);
    var dy = Math.abs(cy2-cy1);
    var d = Math.max(dx, dy);
    var i=0;
    for(i=0; i < d; i++) {
        var img = $(document.createElement('img')).attr('src', 'blank.gif');
        var div = $(document.createElement('div')).width(1).height(1).css({'background-color': '#f00', position: 'absolute', left: Math.min(cx1,cx2)+(i*dx/d), top: Math.min(cy1,cy2)+(i*dy/d) });
        div.append(img);
        c.append(div);
    }
}
function circle(x, y, r) {
    c = $(document.body);
    var l = 2 * Math.PI * r;
    var i=0;
    for(i=0; i < l * (1+((10-Math.log(r+1))/10)); i++) {
        var cx2 = r * Math.sin(360 * i/l);
        var cy2 = r * Math.cos(360 * i/l);
        var img = $(document.createElement('img')).attr('src', 'blank.gif');
        var div = $(document.createElement('div')).width(1).height(1).css({'background-color': '#f00', position: 'absolute', left: x+cx2, top: y+cy2 });
        div.append(img);
        c.append(div);
    }
}

//change canvas background
function changeCanvasBackground (x) {
   if (x == 1){
    $("#canvas").css('background', '#FFF url(../media/images/canvasNote.png) 40px 40px');}
   if (x == 2){
    $("#canvas").css('background', '#FFF url(../media/images/canvasGraph.png)');}
   if (x == 3){
    $("#canvas").css('background', '#FFF url(../media/images/canvasDrawing.png)');}  
   if (x == 4){
    $("#canvas").css('background-image', 'none');}    
   if (x == 5){
   	 $("#canvas").css('background', '#FFF url(../media/images/darkBack.jpg)');}  
     if (x == 6){
    $("#canvas").css('background', '#FFF url(../media/images/transparentBack.jpg)');}      

}

// create graph from data
function createGraph (id, title, type) {
	if (type == 'bar') {$(id).visualize({type: 'bar', title: title});  };
	if (type == 'pie') {$(id).visualize({type: 'pie', pieMargin: 10, title: title});   };
	if (type == 'line') {$(id).visualize({type: 'line', title: title});  };
	if (type == 'area') {$(id).visualize({type: 'area', title: title});  };
};

// NOT FINISHED alert
function notfinishedyet() {
	alert("Oops! mythoughtjot is in its pre-alpha version! This functionality will be available soon!");
}

// Draw the selected element on the canvas
function drawShape(x1, y1, x2, y2) {
	var left = Math.min(x1, x2);
	var top = Math.min(y1, y2);
	var right = Math.max(x1, x2);
	var bottom = Math.max(y1, y2);
	var settings = {fill: $('#fill').val(), stroke: $('#stroke').val(),
		strokeWidth: $('#swidth').val()};
	var shape = $('#shape').val();
	var node = null;
	if (shape == 'rect') {
		node = sketchpad.rect(left, top, right - left, bottom - top, settings);
	}
	else if (shape == 'circle') {
		var r = Math.min(right - left, bottom - top) / 2;
		node = sketchpad.circle(left + r, top + r, r, settings);
	}
	else if (shape == 'ellipse') {
		var rx = (right - left) / 2;
		var ry = (bottom - top) / 2;
		node = sketchpad.ellipse(left + rx, top + ry, rx, ry, settings);
	}
	else if (shape == 'line') {
		node = sketchpad.line(x1, y1, x2, y2, settings);
	}
	else if (shape == 'polyline') {
		node = sketchpad.polyline([[(x1 + x2) / 2, y1], [x2, y2],
			[x1, (y1 + y2) / 2], [x2, (y1 + y2) / 2], [x1, y2],
			[(x1 + x2) / 2, y1]], $.extend(settings, {fill: 'none'}));
	}
	else if (shape == 'polygon') {
		node = sketchpad.polygon([[(x1 + x2) / 2, y1], [x2, y1], [x2, y2],
			[(x1 + x2) / 2, y2], [x1, (y1 + y2) / 2]], settings);
	}
	drawNodes[drawNodes.length] = node;
	$(node).mousedown(startDrag).mousemove(dragging).mouseup(endDrag);
	$('#canvas').focus();
};

//createSomethingCool
function createIT() { 
	$("#canvas").append('<div id="canvas_container"></div> ');
	
    var paper = new Raphael(document.getElementById('canvas_container'), 500, 500);  
    var paper = new Raphael(document.getElementById('canvas_container'), 500, 500);  
    
    var circle = paper.circle(100, 100, 80);  
    for(var i = 0; i < 5; i+=1) {  
    var multiplier = i*5;  
    paper.circle(250 + (2*multiplier), 100 + multiplier, 50 - multiplier);  
} 
}  

function redo(i){
		//if not rendered, rerendering these will cause rrrrrs...
	if(i != "pencil"){
	$("#pencilButton svg").remove();
	renderIcon("pencil");
	}
	if(i != "pen"){
	$("#penButton svg").remove();
	renderIcon("pen");
	}
	if(i != "eraser"){
	$("#eraserButton svg").remove();
	renderIcon("eraser");
	}
	if(i != "trash"){
	$("#trashButton svg").remove();
	renderIcon("trash");
	}
	
/*
//this was going to be more efficient... but life happened.
var iconString = [];
iconString = ["pencil","bubble","flipv","barchart","users","search","mail","settings"];
	for(var s = 0; s < 7; s++){
		renderIcon(iconString[s]);
	}
*/
}

//render icons
function renderIcon(i) {
	var element;
var iconT;
   switch (i) {
        case "pencil": 
        iconT = "M25.31,2.872l-3.384-2.127c-0.854-0.536-1.979-0.278-2.517,0.576l-1.334,2.123l6.474,4.066l1.335-2.122C26.42,4.533,26.164,3.407,25.31,2.872zM6.555,21.786l6.474,4.066L23.581,9.054l-6.477-4.067L6.555,21.786zM5.566,26.952l-0.143,3.819l3.379-1.787l3.14-1.658l-6.246-3.925L5.566,26.952z";
        path = document.getElementById("pencilButton")
        break;
        
        case "users": 
        iconT = "M21.053,20.8c-1.132-0.453-1.584-1.698-1.584-1.698s-0.51,0.282-0.51-0.51s0.51,0.51,1.02-2.548c0,0,1.414-0.397,1.132-3.68h-0.34c0,0,0.849-3.51,0-4.699c-0.85-1.189-1.189-1.981-3.058-2.548s-1.188-0.454-2.547-0.396c-1.359,0.057-2.492,0.792-2.492,1.188c0,0-0.849,0.057-1.188,0.397c-0.34,0.34-0.906,1.924-0.906,2.321s0.283,3.058,0.566,3.624l-0.337,0.113c-0.283,3.283,1.132,3.68,1.132,3.68c0.509,3.058,1.019,1.756,1.019,2.548s-0.51,0.51-0.51,0.51s-0.452,1.245-1.584,1.698c-1.132,0.452-7.416,2.886-7.927,3.396c-0.511,0.511-0.453,2.888-0.453,2.888h26.947c0,0,0.059-2.377-0.452-2.888C28.469,23.686,22.185,21.252,21.053,20.8zM8.583,20.628c-0.099-0.18-0.148-0.31-0.148-0.31s-0.432,0.239-0.432-0.432s0.432,0.432,0.864-2.159c0,0,1.199-0.336,0.959-3.119H9.538c0,0,0.143-0.591,0.237-1.334c-0.004-0.308,0.006-0.636,0.037-0.996l0.038-0.426c-0.021-0.492-0.107-0.939-0.312-1.226C8.818,9.619,8.53,8.947,6.947,8.467c-1.583-0.48-1.008-0.385-2.159-0.336C3.636,8.179,2.676,8.802,2.676,9.139c0,0-0.72,0.048-1.008,0.336c-0.271,0.271-0.705,1.462-0.757,1.885v0.281c0.047,0.653,0.258,2.449,0.469,2.872l-0.286,0.096c-0.239,2.783,0.959,3.119,0.959,3.119c0.432,2.591,0.864,1.488,0.864,2.159s-0.432,0.432-0.432,0.432s-0.383,1.057-1.343,1.439c-0.061,0.024-0.139,0.056-0.232,0.092v5.234h0.575c-0.029-1.278,0.077-2.927,0.746-3.594C2.587,23.135,3.754,22.551,8.583,20.628zM30.913,11.572c-0.04-0.378-0.127-0.715-0.292-0.946c-0.719-1.008-1.008-1.679-2.59-2.159c-1.584-0.48-1.008-0.385-2.16-0.336C24.72,8.179,23.76,8.802,23.76,9.139c0,0-0.719,0.048-1.008,0.336c-0.271,0.272-0.709,1.472-0.758,1.891h0.033l0.08,0.913c0.02,0.231,0.022,0.436,0.027,0.645c0.09,0.666,0.21,1.35,0.33,1.589l-0.286,0.096c-0.239,2.783,0.96,3.119,0.96,3.119c0.432,2.591,0.863,1.488,0.863,2.159s-0.432,0.432-0.432,0.432s-0.053,0.142-0.163,0.338c4.77,1.9,5.927,2.48,6.279,2.834c0.67,0.667,0.775,2.315,0.746,3.594h0.48v-5.306c-0.016-0.006-0.038-0.015-0.052-0.021c-0.959-0.383-1.343-1.439-1.343-1.439s-0.433,0.239-0.433-0.432s0.433,0.432,0.864-2.159c0,0,0.804-0.229,0.963-1.841v-1.227c-0.001-0.018-0.001-0.033-0.003-0.051h-0.289c0,0,0.215-0.89,0.292-1.861V11.572z";
        path = document.getElementById("shareButton")
        break;
        
        case "user": 
        iconT = "M20.771,12.364c0,0,0.849-3.51,0-4.699c-0.85-1.189-1.189-1.981-3.058-2.548s-1.188-0.454-2.547-0.396c-1.359,0.057-2.492,0.792-2.492,1.188c0,0-0.849,0.057-1.188,0.397c-0.34,0.34-0.906,1.924-0.906,2.321s0.283,3.058,0.566,3.624l-0.337,0.113c-0.283,3.283,1.132,3.68,1.132,3.68c0.509,3.058,1.019,1.756,1.019,2.548s-0.51,0.51-0.51,0.51s-0.452,1.245-1.584,1.698c-1.132,0.452-7.416,2.886-7.927,3.396c-0.511,0.511-0.453,2.888-0.453,2.888h26.947c0,0,0.059-2.377-0.452-2.888c-0.512-0.511-6.796-2.944-7.928-3.396c-1.132-0.453-1.584-1.698-1.584-1.698s-0.51,0.282-0.51-0.51s0.51,0.51,1.02-2.548c0,0,1.414-0.397,1.132-3.68H20.771z";
        break;

        case "mail": 
        iconT = "M28.516,7.167H3.482l12.517,7.108L28.516,7.167zM16.74,17.303C16.51,17.434,16.255,17.5,16,17.5s-0.51-0.066-0.741-0.197L2.5,10.06v14.773h27V10.06L16.74,17.303z";
        path = document.getElementById("messageButton")
        break;

        case "bubble": 
        iconT = "M16,5.333c-7.732,0-14,4.701-14,10.5c0,1.982,0.741,3.833,2.016,5.414L2,25.667l5.613-1.441c2.339,1.317,5.237,2.107,8.387,2.107c7.732,0,14-4.701,14-10.5C30,10.034,23.732,5.333,16,5.333z";
        path = document.getElementById("textButton")
		break;

        case "smiles": 
        iconT = "M16,1.466C7.973,1.466,1.466,7.973,1.466,16c0,8.027,6.507,14.534,14.534,14.534c8.027,0,14.534-6.507,14.534-14.534C30.534,7.973,24.027,1.466,16,1.466zM16,29.534C8.539,29.534,2.466,23.462,2.466,16C2.466,8.539,8.539,2.466,16,2.466c7.462,0,13.535,6.072,13.535,13.533C29.534,23.462,23.462,29.534,16,29.534zM11.104,14c0.932,0,1.688-1.483,1.688-3.312s-0.755-3.312-1.688-3.312s-1.688,1.483-1.688,3.312S10.172,14,11.104,14zM20.729,14c0.934,0,1.688-1.483,1.688-3.312s-0.756-3.312-1.688-3.312c-0.932,0-1.688,1.483-1.688,3.312S19.798,14,20.729,14zM8.143,21.189C10.458,24.243,13.148,26,16.021,26c2.969,0,5.745-1.868,8.11-5.109c-2.515,1.754-5.292,2.734-8.215,2.734C13.164,23.625,10.54,22.756,8.143,21.189z";
        path = document.getElementById("smilesButton")
        break;
        
        case "flipv": 
        iconT = "M21.45,16.078v-1.001h-2.001v1.001H21.45zM25.45,16.078v-1.001h-2v1.001H25.45zM29.45,16.078v-1.001h-2v1.001H29.45zM32.495,16.078v-1.001H31.45v1.001H32.495zM17.451,16.078v-1.001h-2v1.001H17.451zM1.451,16.078v-1.001h-2v1.001H1.451zM5.451,16.078v-1.001h-2v1.001H5.451zM9.452,16.078v-1.001h-2v1.001H9.452zM13.452,16.078v-1.001h-2v1.001H13.452zM1.571,12.745h25.962V-1.348L1.571,12.745zM5.504,11.745l21.03-11.41v11.41H5.504zM27.533,18.464H1.571l25.962,14.093V18.464z";
        path = document.getElementById("shapeButton")
        break;
        
        case "barchart": 
        iconT = "M21.25,8.375V28h6.5V8.375H21.25zM12.25,28h6.5V4.125h-6.5V28zM3.25,28h6.5V12.625h-6.5V28z";
        path = document.getElementById("graphButton")
        break;
        
        case "piechart": 
        iconT = "M15.583,15.917l1.648-10.779C16.692,5.056,16.145,5,15.583,5C9.554,5,4.666,9.888,4.666,15.917c0,6.029,4.888,10.917,10.917,10.917S26.5,21.946,26.5,15.917c0-0.256-0.021-0.507-0.038-0.759L15.583,15.917zM19.437,3.127l-1.648,10.779l10.879-0.759C28.313,8.026,24.436,3.886,19.437,3.127z";
        break;
        
        case "linechart": 
        iconT = "M3.625,25.062c-0.539-0.115-0.885-0.646-0.77-1.187l0,0L6.51,6.584l2.267,9.259l1.923-5.188l3.581,3.741l3.883-13.103l2.934,11.734l1.96-1.509l5.271,11.74c0.226,0.504,0,1.095-0.505,1.321l0,0c-0.505,0.227-1.096,0-1.322-0.504l0,0l-4.23-9.428l-2.374,1.826l-1.896-7.596l-2.783,9.393l-3.754-3.924L8.386,22.66l-1.731-7.083l-1.843,8.711c-0.101,0.472-0.515,0.794-0.979,0.794l0,0C3.765,25.083,3.695,25.076,3.625,25.062L3.625,25.062z";
		break;
 
        case "settings":
        iconT = "M26.834,14.693c1.816-2.088,2.181-4.938,1.193-7.334l-3.646,4.252l-3.594-0.699L19.596,7.45l3.637-4.242c-2.502-0.63-5.258,0.13-7.066,2.21c-1.907,2.193-2.219,5.229-1.039,7.693L5.624,24.04c-1.011,1.162-0.888,2.924,0.274,3.935c1.162,1.01,2.924,0.888,3.935-0.274l9.493-10.918C21.939,17.625,24.918,16.896,26.834,14.693z";
    	path = document.getElementById("canvasButton")
    	break;
    	
    	case "box":
        iconT = "M3.083,7.333v16.334h24.833V7.333H3.083z M19.333,20.668H6.083V10.332h13.25V20.668z";
    	path = document.getElementById("boxButton")
    	break;
    	
    	case "rageface":
        iconT = "M730 1665 c-58 -12 -121 -30 -140 -38 -19 -9 -57 -21 -85 -28 -38 -10 -64 -26 -107 -67 -32 -30 -58 -60 -58 -67 0 -6 -19 -29 -42 -49 -32 -29 -47 -36 -67 -32 -25 6 -25 6 -7 -9 18 -14 14 -15 -50 -17 l-69 -2 57 -3 c32 -2 58 -7 58 -10 0 -10 -105 -153 -112 -153 -4 0 -9 17 -11 38 -3 28 -4 23 -5 -20 -1 -35 -9 -70 -21 -90 -23 -41 -31 -114 -36 -338 -2 -114 0 -181 7 -195 7 -11 17 -45 23 -75 7 -30 24 -95 39 -144 15 -50 25 -94 23 -100 -6 -18 -72 108 -85 164 -9 35 -17 164 -21 350 l-8 295 2 -300 c3 -329 7 -359 65 -470 17 -33 35 -64 41 -70 5 -5 9 -23 9 -40 0 -42 27 -145 46 -173 25 -38 25 -20 0 43 -46 116 -39 173 11 94 34 -53 56 -71 148 -119 67 -34 88 -41 94 -31 7 11 9 11 13 0 3 -9 11 0 20 21 l15 35 30 -32 c17 -18 36 -33 43 -33 7 0 44 20 84 44 181 113 434 177 508 128 37 -24 115 -88 166 -136 42 -40 51 -42 32 -6 -12 22 -3 50 15 50 15 0 25 -22 25 -56 0 -21 4 -25 26 -22 27 3 37 24 145 291 19 46 28 166 10 138 -17 -26 -20 8 -20 197 0 239 -7 305 -37 361 -13 24 -24 50 -24 57 0 7 -18 39 -40 70 -22 31 -49 89 -61 128 -34 112 -42 129 -75 166 -17 19 -49 60 -72 91 -22 31 -68 76 -101 100 -33 24 -61 47 -61 52 0 4 10 8 23 8 41 3 -87 20 -173 24 -62 2 -113 -3 -190 -20z m399 -81 c62 -46 87 -77 76 -94 -3 -5 1 -12 8 -17 13 -8 37 -45 37 -57 0 -4 -25 11 -56 31 -46 30 -53 38 -37 44 17 6 17 6 -2 12 -11 4 -47 7 -80 8 -48 1 -72 -4 -113 -25 -47 -24 -52 -25 -52 -8 0 18 26 62 44 74 6 4 31 5 56 2 41 -4 43 -3 20 8 -14 6 -27 13 -29 14 -4 4 52 53 61 54 3 0 34 -21 67 -46z m-318 -11 c43 -7 46 -10 38 -30 -6 -16 -17 -23 -34 -23 -22 0 -25 -4 -25 -33 0 -18 -13 -71 -30 -117 -16 -47 -30 -96 -31 -110 0 -21 -4 -18 -20 19 -11 25 -24 62 -29 84 -4 22 -13 44 -19 50 -14 14 -14 2 -1 -42 18 -63 2 -44 -21 26 -14 41 -25 61 -27 49 -2 -10 8 -52 23 -93 22 -59 25 -77 15 -86 -8 -8 -14 -8 -16 -2 -10 26 -46 77 -51 72 -3 -3 7 -30 22 -60 17 -35 25 -67 23 -88 l-3 -33 -36 32 c-21 18 -44 50 -53 72 -18 46 -31 54 -111 70 -72 15 -125 35 -125 49 0 13 116 143 154 172 16 13 48 26 70 30 47 9 218 3 287 -8z m204 -110 c-3 -16 -8 -37 -11 -49 -3 -13 4 -29 22 -47 49 -49 144 -28 144 32 0 15 -5 32 -12 39 -25 25 6 11 54 -24 37 -28 56 -51 77 -99 16 -34 33 -65 39 -69 20 -12 54 -100 53 -139 0 -38 -20 -80 -50 -105 -9 -7 -45 -27 -80 -44 -56 -27 -75 -31 -150 -32 -79 0 -93 3 -155 33 -70 35 -104 70 -131 135 -16 38 -13 85 4 58 4 -7 7 13 6 45 -3 69 4 90 50 150 19 25 35 56 35 68 0 15 13 29 48 48 59 33 66 33 57 0z m-690 -143 c11 -4 34 -13 51 -20 18 -6 44 -25 60 -41 l28 -29 -32 0 c-32 0 -52 15 -30 23 7 2 10 7 7 10 -14 17 -163 -43 -230 -93 -39 -28 -73 -49 -76 -47 -8 9 24 61 57 92 17 17 47 51 66 77 35 47 45 50 99 28z m118 -111 c24 -5 60 -26 82 -44 33 -28 37 -36 25 -44 -12 -8 -7 -13 22 -26 21 -8 42 -15 47 -15 6 0 17 -10 25 -22 28 -44 11 -188 -22 -188 -7 0 -11 -4 -8 -8 3 -5 -8 -21 -24 -37 -23 -22 -35 -26 -61 -23 -28 4 -30 3 -15 -8 16 -11 14 -15 -24 -34 -40 -20 -43 -20 -68 -4 -15 9 -21 11 -14 3 20 -21 14 -29 -20 -29 -40 0 -78 24 -130 82 -21 24 -34 33 -29 21 6 -12 34 -42 63 -67 l53 -46 -37 0 c-29 0 -41 6 -54 25 -9 14 -21 25 -26 25 -5 0 -2 -7 6 -16 33 -33 14 -43 -43 -23 -24 9 -29 14 -19 20 10 7 8 9 -6 9 -24 0 -56 28 -56 49 0 13 -2 13 -9 2 -10 -16 -31 -6 -31 15 0 8 5 12 10 9 5 -3 10 -1 10 4 0 6 -7 11 -15 11 -8 0 -15 5 -15 11 0 5 5 7 11 3 7 -4 10 -1 7 7 -3 8 -11 13 -17 12 -16 -4 -14 15 9 77 11 30 20 56 20 57 0 2 13 3 30 3 37 0 103 56 131 111 21 42 23 49 11 49 -5 0 -15 -15 -24 -33 -24 -50 -65 -94 -99 -106 -31 -10 -31 -10 -24 17 18 75 144 162 236 162 28 0 69 -5 92 -11z m291 -124 c-16 -25 -8 -35 13 -14 7 7 17 2 32 -19 11 -16 31 -32 44 -36 12 -3 36 -20 52 -37 l30 -32 -60 7 c-34 3 -67 2 -75 -4 -11 -7 -2 -10 33 -10 35 0 49 -4 54 -16 6 -15 7 -15 19 0 11 16 13 16 18 -1 14 -48 18 -164 6 -193 l-12 -29 -44 30 c-47 32 -118 115 -130 151 -5 15 0 26 17 41 l24 19 -29 -17 c-15 -9 -32 -13 -36 -8 -4 4 -10 38 -13 76 -4 52 -2 67 9 67 7 0 21 11 30 25 9 14 20 25 25 25 5 0 2 -11 -7 -25z m691 -25 c9 -27 -61 -120 -121 -163 -24 -17 -42 -33 -39 -35 9 -10 102 67 128 106 16 23 32 42 36 42 11 0 68 -185 85 -275 8 -44 17 -156 20 -250 4 -158 3 -172 -15 -194 -10 -13 -19 -31 -19 -42 0 -10 -4 -20 -8 -23 -5 -3 -19 -39 -31 -79 -12 -41 -28 -83 -36 -93 -12 -17 -14 -16 -20 19 -4 21 -4 55 0 75 8 46 8 35 -1 175 -4 65 -11 120 -16 123 -15 10 -17 1 -8 -43 4 -24 3 -43 -1 -43 -10 0 -14 44 -10 98 1 19 -2 31 -7 28 -4 -2 -20 32 -35 78 -45 137 -115 238 -206 297 l-45 29 86 0 c52 0 90 4 94 11 4 8 -14 9 -62 5 l-69 -5 65 14 c35 9 83 27 105 42 l40 26 -24 -27 c-18 -19 -20 -26 -10 -26 17 0 71 53 88 87 6 12 11 31 11 42 0 27 17 27 25 1z m-703 -290 c14 -54 23 -102 20 -105 -3 -3 -22 -5 -42 -5 -28 0 -43 7 -67 33 -48 50 -54 67 -36 98 9 15 27 32 40 38 13 6 26 18 29 26 15 37 33 10 56 -85z m-552 -64 c25 -18 44 -38 43 -45 -4 -13 119 -16 145 -2 9 5 38 12 64 15 l47 7 -10 -33 c-5 -18 -9 -40 -8 -48 0 -8 7 7 14 34 13 47 27 66 51 66 7 0 -2 -42 -21 -107 -18 -60 -40 -155 -49 -213 -9 -58 -21 -130 -27 -161 -5 -31 -7 -82 -3 -113 4 -36 3 -56 -4 -56 -15 0 -26 174 -20 325 5 105 4 118 -4 65 -5 -36 -7 -140 -4 -232 3 -93 3 -168 0 -168 -4 0 -38 17 -77 37 -46 24 -76 48 -86 67 -9 16 -31 46 -48 66 -18 21 -33 48 -33 62 0 13 -12 62 -26 109 -14 46 -30 109 -35 139 -6 30 -15 60 -21 67 -6 8 -8 16 -6 19 3 3 15 -10 26 -28 11 -18 37 -48 56 -67 29 -28 42 -56 73 -153 21 -66 43 -118 50 -118 7 0 17 -15 22 -32 16 -57 12 -14 -9 86 -11 53 -27 111 -36 129 -9 17 -54 71 -100 119 l-84 87 0 72 0 72 25 -23 c13 -13 27 -31 30 -40 9 -27 122 -101 163 -106 39 -4 35 0 -10 10 -28 6 -85 53 -165 135 -53 54 -58 78 -5 27 20 -20 57 -52 82 -70z m943 -285 c30 -61 36 -131 13 -151 -12 -9 -21 -7 -45 11 -27 20 -33 21 -56 9 -22 -12 -28 -11 -48 8 -32 30 -55 28 -75 -8 -9 -16 -25 -30 -36 -30 -24 0 -82 -36 -102 -63 -9 -12 -18 -17 -20 -12 -20 47 -46 43 -71 -9 l-16 -35 -19 24 c-17 22 -19 23 -50 8 -29 -15 -32 -15 -45 2 -31 44 2 145 72 217 50 51 85 60 215 55 64 -3 110 -1 110 4 0 17 43 28 95 26 50 -2 50 -2 78 -56z";
    	path = document.getElementById("ragefaceButton")
    	break;
    	
    	case "pen":
        iconT = "M13.587,12.074c-0.049-0.074-0.11-0.147-0.188-0.202c-0.333-0.243-0.803-0.169-1.047,0.166c-0.244,0.336-0.167,0.805,0.167,1.048c0.303,0.22,0.708,0.167,0.966-0.091l-7.086,9.768l-2.203,7.997l6.917-4.577L26.865,4.468l-4.716-3.42l-1.52,2.096c-0.087-0.349-0.281-0.676-0.596-0.907c-0.73-0.529-1.751-0.369-2.28,0.363C14.721,6.782,16.402,7.896,13.587,12.074zM10.118,25.148L6.56,27.503l1.133-4.117L10.118,25.148zM14.309,11.861c2.183-3.225,1.975-4.099,3.843-6.962c0.309,0.212,0.664,0.287,1.012,0.269L14.309,11.861z";
    	path = document.getElementById("penButton")
    	break;

    	case "eraser":
        iconT = "M23.043,4.649l-0.404-2.312l-1.59,1.727l-2.323-0.33l1.151,2.045l-1.032,2.108l2.302-0.463l1.686,1.633l0.271-2.332l2.074-1.099L23.043,4.649zM26.217,18.198l-0.182-1.25l-0.882,0.905l-1.245-0.214l0.588,1.118l-0.588,1.118l1.245-0.214l0.882,0.905l0.182-1.25l1.133-0.56L26.217,18.198zM4.92,7.672L5.868,7.3l0.844,0.569L6.65,6.853l0.802-0.627L6.467,5.97L6.118,5.013L5.571,5.872L4.553,5.908l0.647,0.786L4.92,7.672zM10.439,10.505l1.021-1.096l1.481,0.219l-0.727-1.31l0.667-1.341l-1.47,0.287l-1.069-1.048L10.16,7.703L8.832,8.396l1.358,0.632L10.439,10.505zM17.234,12.721c-0.588-0.368-1.172-0.618-1.692-0.729c-0.492-0.089-1.039-0.149-1.425,0.374L2.562,30.788h6.68l9.669-15.416c0.303-0.576,0.012-1.041-0.283-1.447C18.303,13.508,17.822,13.09,17.234,12.721zM13.613,21.936c-0.254-0.396-0.74-0.857-1.373-1.254c-0.632-0.396-1.258-0.634-1.726-0.69l4.421-7.052c0.064-0.013,0.262-0.021,0.543,0.066c0.346,0.092,0.785,0.285,1.225,0.562c0.504,0.313,0.908,0.677,1.133,0.97c0.113,0.145,0.178,0.271,0.195,0.335c0.002,0.006,0.004,0.011,0.004,0.015L13.613,21.936z";
    	path = document.getElementById("eraserButton")
    	break;

    	case "trash":
        iconT = "M20.826,5.75l0.396,1.188c1.54,0.575,2.589,1.44,2.589,2.626c0,2.405-4.308,3.498-8.312,3.498c-4.003,0-8.311-1.093-8.311-3.498c0-1.272,1.21-2.174,2.938-2.746l0.388-1.165c-2.443,0.648-4.327,1.876-4.327,3.91v2.264c0,1.224,0.685,2.155,1.759,2.845l0.396,9.265c0,1.381,3.274,2.5,7.312,2.5c4.038,0,7.313-1.119,7.313-2.5l0.405-9.493c0.885-0.664,1.438-1.521,1.438-2.617V9.562C24.812,7.625,23.101,6.42,20.826,5.75zM11.093,24.127c-0.476-0.286-1.022-0.846-1.166-1.237c-1.007-2.76-0.73-4.921-0.529-7.509c0.747,0.28,1.58,0.491,2.45,0.642c-0.216,2.658-0.43,4.923,0.003,7.828C11.916,24.278,11.567,24.411,11.093,24.127zM17.219,24.329c-0.019,0.445-0.691,0.856-1.517,0.856c-0.828,0-1.498-0.413-1.517-0.858c-0.126-2.996-0.032-5.322,0.068-8.039c0.418,0.022,0.835,0.037,1.246,0.037c0.543,0,1.097-0.02,1.651-0.059C17.251,18.994,17.346,21.325,17.219,24.329zM21.476,22.892c-0.143,0.392-0.69,0.95-1.165,1.235c-0.474,0.284-0.817,0.151-0.754-0.276c0.437-2.93,0.214-5.209-0.005-7.897c0.881-0.174,1.708-0.417,2.44-0.731C22.194,17.883,22.503,20.076,21.476,22.892zM11.338,9.512c0.525,0.173,1.092-0.109,1.268-0.633h-0.002l0.771-2.316h4.56l0.771,2.316c0.14,0.419,0.53,0.685,0.949,0.685c0.104,0,0.211-0.017,0.316-0.052c0.524-0.175,0.808-0.742,0.633-1.265l-1.002-3.001c-0.136-0.407-0.518-0.683-0.945-0.683h-6.002c-0.428,0-0.812,0.275-0.948,0.683l-1,2.999C10.532,8.77,10.815,9.337,11.338,9.512z";
    	path = document.getElementById("trashButton")
    	break;
    	
	
    }
var icon = {
	token: iconT
    },
        x = 0,
        y = 0,
        fill = {fill: "#fff", stroke: "none"},
        stroke = {stroke: "#ffbc6c", "stroke-width": 3, "stroke-linejoin": "round", opacity: 0},
        selected,
        none = {fill: "#000", opacity: 0};
    for (var name in icon) {
        var r = Raphael(path, 40, 40),
            s = r.path(icon[name]).attr(stroke).translate(4, 4),
            Icon = r.path(icon[name]).attr(fill).translate(4, 4);
        (function (icon, path, s) {
            r.rect(0, 0, 32, 32).attr(none).click(function () {
               selected && selected.attr(fill);
               selected = icon.attr({fill: "90-#ff8e08-#002c62"});
            }).hover(function () {
                s.stop().animate({opacity: 1}, 200);
            }, function () {
                s.stop().attr({opacity: 0});
            });             
        })(Icon, icon[name], s);
        x += 37;
        if (x > 450) {
            x = 0;
            y += 37;
        }
    }
}

//render Text for headers
function renderHeader(div, header) {
		 var paper = Raphael(div, 100, 100);
	var t = paper.text(50, 10, header);
	
	var letters = paper.print(50, 50, header, paper.getFont("Vegur"), 40);
	
	letters[4].attr({fill:"orange"});
	for (var i = 5; i < letters.length; i++) {
	  letters[i].attr({fill: "#3D5C9D", "stroke-width": "2", stroke: "#3D5C9D"});
	}

}

//change toolbar
function changeToolbar(div) {
	$(div).topZIndex( { increment: 10 } );
}

//newDrawing

function initButtons(){
			// make radios looking like buttons
    $('#modeRadio').buttonset();

    // make checkbox look like buttons
    $('#tabletCheckbox').button();

	// don't cache which radio is checked (Firefox issue)
	$('#modeRadio > input[type=radio]').attr('autocomplete', "off");
}



var drawinit = 0;
var shapeinit = 0;

function setGlobal(set) {
	switch (set) {
		case "draw":
		drawinit = 1;
		case "shape":
		shapeinit = 1;
  }
}
function initDraw() {drawinit = 1;}
function initShape() {shapeinit = 1;}

function pointless() {
		$("#canvas").bind('mousemove',function(e){ 
            $("#canvas").text("e.pageX: " + e.pageX + ", e.pageY: " + e.pageY); 
	});
}

function drawSize(w, h)
{
	$("#canvas2")
	.width(w)
	.height(h)
	.ink('resize', false)
	.ink('fit', 'both', true);
}
function refresh(div)
{
	$("#canvas2")
	.fillVertically(window)
	.ink('resize');
}

function initWindow()
{
	// handle window changes properly
	window.onresize = refresh;
	window.onorientationchange = refresh;
}

//select what to do based on what was clicked

function whattodo() {
	if (drawinit)
	newDrawing();
	if (shapeinit)
	createShape();
}

//display some help dialog at the top based on what the user is doing
var c;
window.onload = function() {
	$('.help').append('<p>Select a tool to get started!<p>');
}
function defaultMessage() {
	$('.help p').remove();
	$('.help').append('<p>Select a tool to get started!<p>');
}
function startupMessage() {
	$('.help p').remove();
	$('.help').append("<p>This looks like a brand new canvas! Let's get started!<p>");
}

// draw shapes
function createShape() {
	  $("#canvas").off(anode.newDrawing())

		if (shapeinit) {
	//$('#canvas').append('<div id="svgsketch" class="svgdiv" style="width: 100%; height: 300px;"></div>');
	
		// Drawing Shapes
		var drawNodes = [];
		var sketchpad = null;
		var start = null;
		var outline = null;
		var offset = null;
		
		$('#canvas').svg({onLoad: function(svg) {
				sketchpad = svg;
				var surface = svg.rect(0, 0, '100%', '100%', {id: 'surface', fill: 'transparent'});
				$(surface).mousedown(startDrag).mousemove(dragging).mouseup(endDrag);
				resetSize(svg, '100%', '100%');
			}
		});
		
		// Remove the last drawn element
		$('#undo').click(function() {
			if (!drawNodes.length) {
				return;
			}
			sketchpad.remove(drawNodes[drawNodes.length - 1]);
			drawNodes.splice(drawNodes.length - 1, 1);
		});
		
		// Clear the canvas
		$('#clear2').click(function() {
			while (drawNodes.length) {
				$('#undo').trigger('click');
			}
		});
		
		// Convert to text
		$('#toSVG').click(function() {
			alert(sketchpad.toSVG());
		});
	shapeinit = 0;
  }
}

function dragBox() {

}

//removing table td
$(document).ready(function(){
        $('#table1 td').click(function(){
                $(this).parent().remove();
        });
});
$(document).ready(function(){
        $('#table2 td img.delete').click(function(){
                $(this).parent().parent().remove();
        });
})

