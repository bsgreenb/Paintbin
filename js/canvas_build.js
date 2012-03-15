// essential functions

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
	if(i != "eraser"){
	$("#eraserButton svg").remove();
	renderIcon("eraser");
	}
	if(i != "trash"){
	$("#trashButton svg").remove();
	renderIcon("trash");
	}
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
    	
    	case "box":
        iconT = "M3.083,7.333v16.334h24.833V7.333H3.083z M19.333,20.668H6.083V10.332h13.25V20.668z";
    	path = document.getElementById("boxButton")
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

//render size icon
function renderCircle(i) {
	var paper = Raphael("sizeButton", 40, 40);
	var circle = paper.circle(20, 20, 4);
	circle.attr("fill", "#FFF");
	//$("#sizeButton svg").css('height', 40);
	$( "#slider-bar" ).slider({
   slide: function(event, ui) {
		var value = $( "#slider-bar" ).slider( "option", "value" );
		circle.attr('r', value);
		curSize = value;
	}
});
	
}




