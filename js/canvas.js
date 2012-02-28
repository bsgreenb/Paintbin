//This script is based on Willam Malone's HTML Canvas Javascript Drawing App @ williammalone.com/articles/create-html5-canvas-javascript-drawing-app/#
//William's code was made available under the permissive Apache License: http://www.apache.org/licenses/LICENSE-2.0.html
//Our (modifications of his) code are NOT available under a permissive license, and are under copyright to Paintbin (C) 2012

canvasWidth = 750;
canvasHeight = 500;

$(document).ready(function() {
    //We dynamically add the canvas, so as to shield IE's virgin eyes 
    canvas = $('<canvas>').prop(
    {
        id: 'canvas',
        width: canvasWidth,
        height: canvasHeight
    });
    
    $('#canvasDiv').append(canvas);

    if(typeof G_vmlCanvasManager != 'undefined') 
    {
        canvas = G_vmlCanvasManager.initElement(canvas);
    }

    context = canvas.getContext("2d"); //grab the 2nd canvas context

    

});
