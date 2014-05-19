'use strict';

console.log('\'Allo \'Allo!');

var canvas = document.getElementById('myCanvas');
var button = document.getElementById('myButton');

var x1, y1;
var whichPts =0;

function drawLine(x1, y1, x2, y2){
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');

    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
}


function getPosition(event){
    var x = event.x;
    var y = event.y;

    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    //alert("x:" + x + " y:" + y);
    if(whichPts ===0){
        x1 = x;
        y1 = y;
        whichPts++;
        //canvas.width = canvas.width; //clears canvas
     }
    else{
        drawLine(x1, y1, x, y);
        whichPts--;
   }

}
function grabText(){
    var value = document.getElementById('myTextArea').value;
    console.log(value);
}



canvas.addEventListener('mousedown', getPosition, false);
button.addEventListener('click', grabText, false);


