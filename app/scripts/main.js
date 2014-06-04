'use strict';


var canvas = document.getElementById('myCanvas');
var button = document.getElementById('myButton');

// var x1, y1;
// var whichPts =0;

// function drawLine(x1, y1, x2, y2){
//     var canvas = document.getElementById('myCanvas');
//     var context = canvas.getContext('2d');

//     context.beginPath();
//     context.moveTo(x1, y1);
//     context.lineTo(x2, y2);

//     context.strokeStyle = '#ff0000';
//     context.stroke();
// }


// function getPosition(event){
//     var x = event.x;
//     var y = event.y;

//     x -= canvas.offsetLeft;
//     y -= canvas.offsetTop;

//     //alert("x:" + x + " y:" + y);
//     if(whichPts ===0){
//         x1 = x;
//         y1 = y;
//         whichPts++;
//         //canvas.width = canvas.width; //clears canvas
//      }
//     else{
//         drawLine(x1, y1, x, y);
//         whichPts--;
//    }

// }

var triangles = [];
var edge = [];
var transformation = createIdentity();

var numFrames = 1;
var curFrame = 1;

var xLeft, yBottom, xRight, yTop;

var variables = {};

var red = 255, green = 255, blue = 255;

var saves = {};

function interpret(string){
    var stringCopy = string;
    var split = string.split(' ');


    switch(split[0]){
        case '\n':
            break;

        case 'end':
            break;

        case '#':
            console.log(stringCopy.substring(1));
            break;

        case 'frames':
            numFrames = split[2]; //assumes frame starts at 1
            break;

        case 'identity': //resets transformation
            transformation = createIdentity();
            break;

        case 'screen': //sets world coordinates
            xLeft = split[1];
            yBottom = split[2];
            xRight = split[3];
            yTop = split[4];
            break;

        case 'pixels':
            canvas.width = split[1];
            canvas.height = split[2];
            break;

        case 'vary':  //working here
            var increment = parseFloat(split[3]) - parseFloat(split[2]) / split[5] - split[4];
            variables[split[1]]= {name: split[2], currVal: split[3], split[4], split[5]};//
            console.log(variables);
            break;

        case 'color':
            red = split[1];
            green = split[2];
            blue = split[3];
            break;

        case 'save':
            save[split[1]] = transformation;
            break;

        case 'restore':
            transformation = save[split[1]];
            break;

        case 'import': //does not do anything yet
            break;

        case 'rotate-x':
                var angle = parseFloat(split[i]);

                if(!check){
                    angle = variables[split[i]]
                }

            var xRotate = createIdentity();

            xRotate[1][1] = Math.cos();

            break;

        case 'rotate-y':
            break;

        case 'rotate-z':
            break;

        case 'move':
            break;

        case 'scale':
            break;

        case 'box-t':
            break;

        case 'sphere-t':
            break;

        case 'render-parallel':
            break;

        case 'render-perspective-cyclops':
            break;

        case 'render-perspective-stereo':
            break;

        case 'files':
            break;

        default:
            console.log('Keyword '+split[0]+' not found.');
    }
}
function parseLine(value){
    var split = value.split('\n');

    for(var i=0; i < split.length; i++){
        interpret(split[i]);
    }
}

function grabText(){
    var value = document.getElementById('myTextArea').value;
    parseLine(value);
}


//canvas.addEventListener('mousedown', getPosition, false);
button.addEventListener('click', grabText, false);


