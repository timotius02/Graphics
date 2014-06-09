'use strict';


var canvas = document.getElementById('myCanvas');
var button = document.getElementById('myButton');
var context = canvas.getContext('2d');

var triangles = [[],[],[],[]];
var transformation = createIdentity();

var numFrames = 1;
var curFrame = 1;

var xLeft, yBottom, xRight, yTop;

var variables = [];

var red = 0, green = 0, blue = 0;

var saves = [];

var continuous = false;

function convertScreen(num, c){
    var result;

    var pxLeft = 0;
    var pyBottom = -canvas.height +1;
    var pxRight = canvas.width -1;
    var pyTop = 0;

    if(c==='x'){
        result = (((pxRight - pxLeft)/(xRight - xLeft)) * (num - xLeft)) + pxLeft ;
    }
    else if(c==='y'){
        result = (((pyTop - pyBottom)/(yTop - yBottom)) *(num - yBottom))+ pyBottom;
    }
    return result;
}

function interpret(string){
    var stringCopy = string;
    var split = string.split(' ');

    switch(split[0]){
        case '\n':
        break;

        case 'end':
        break;

        case '#':

        break;

        case 'frames':
            numFrames = split[2]; //assumes frame starts at 1
            break;

        case 'identity': //resets transformation
        transformation = createIdentity();
        break;

        case 'screen': //sets world coordinates
        xLeft = parseFloat(split[1]);
        yBottom = parseFloat(split[2]);
        xRight = parseFloat(split[3]);
        yTop = parseFloat(split[4]);

        break;

        case 'pixels':
        canvas.width = split[1];
        canvas.height = split[2];

        break;

        case 'vary':

        if(curFrame ===1){
            var inc = (parseFloat(split[3]) - parseFloat(split[2])) / (parseFloat(split[5]) - parseFloat(split[4]));

            var vary = {
                name: split[1],
                currVal: parseFloat(split[2]),
                increment: inc,
                startFrame: parseInt(split[4]),
                endFrame: parseInt(split[5]),
                update: function(){
                    this.currVal += this.increment;
                }
            };

            variables.push(vary);
        }
        break;

        case 'color':
        red = parseInt(split[1]);
        green = parseInt(split[2]);
        blue = parseInt(split[3]);
        break;

        case 'save':

        var save = {
            name: split[1],
            matrix: transformation
        }
        saves.push(save);
        break;

        case 'restore':
        var save;

        for(var i = 0; i < saves.length;i++){
            if(saves[i].name === split[1]){
                save = saves[i].matrix;
            }
            else if(i === saves.length-1)
                throw 'error: save '+ split[i] +' not found';
        }

        transformation = save;
        break;

        case 'import': //does not do anything yet
        break;

        case 'rotate-x':
        var angle = parseFloat(split[1]);

        if(isNaN(angle)){
            for (var i = 0; i < variables.length;i++){
                if(variables[i].name === split[1] && curFrame >= variables[i].startFrame && curFrame <= variables[i].endFrame){
                    angle = variables[i].currVal;
                    break;
                }
            }
        }

        var xRotate = createIdentity();

        xRotate[1][1] = Math.cos(angle* Math.PI/180);
        xRotate[1][2] = -Math.sin(angle* Math.PI/180);
        xRotate[2][1] = Math.sin(angle* Math.PI/180);
        xRotate[2][2] = Math.cos(angle* Math.PI/180);

        transformation = matrixMult(transformation, xRotate);

        break;

        case 'rotate-y':
        var angle = parseFloat(split[1]);

        if(isNaN(angle)){
            for (var i = 0; i < variables.length;i++){
                if(variables[i].name === split[1] && curFrame >= variables[i].startFrame && curFrame <= variables[i].endFrame){
                    angle = variables[i].currVal;
                    break;
                }
            }
        }

        var yRotate = createIdentity();

        yRotate[0][0] = Math.cos(angle* Math.PI/180);
        yRotate[0][2] = Math.sin(angle* Math.PI/180);
        yRotate[2][0] = -Math.sin(angle* Math.PI/180);
        yRotate[2][2] = Math.cos(angle* Math.PI/180);

        transformation = matrixMult(transformation, yRotate);
        break;

        case 'rotate-z':
        var angle = parseFloat(split[1]);

        if(isNaN(angle)){
            for (var i = 0; i < variables.length;i++){
                if(variables[i].name === split[1] && curFrame >= variables[i].startFrame && curFrame <= variables[i].endFrame){
                    angle = variables[i].currVal;
                    break;
                }
            }
        }

        var zRotate = createIdentity();

        zRotate[0][0] = Math.cos(angle* Math.PI/180);
        zRotate[0][1] = -Math.sin(angle* Math.PI/180);
        zRotate[1][0] = Math.sin(angle* Math.PI/180);
        zRotate[1][1] = Math.cos(angle* Math.PI/180);

        transformation = matrixMult(transformation, zRotate);
        break;

        case 'move':
        var translate = createIdentity();
        for(var c = 1; c < split.length; c++){
            var temp = parseFloat(split[c]);
            if(isNaN(angle)){
                for (var i = 0; i < variables.length;i++){
                    if(variables[i].name === split[1] && curFrame >= variables[i].startFrame && curFrame <= variables[i].endFrame){
                        angle = variables[i].currVal;
                        break;
                    }
                }
            }
        }

        translate[0][3] = parseFloat(split[1]);
        translate[1][3] = parseFloat(split[2]);
        translate[2][3] = parseFloat(split[3]);

        transformation = matrixMult(transformation, translate);
        break;

        case 'scale':
        var scale = createIdentity();

        for(var c = 1; c < split.length; c++){
            var temp = parseFloat(split[c]);
            if(isNaN(angle)){
                for (var i = 0; i < variables.length;i++){
                    if(variables[i].name === split[1] && curFrame >= variables[i].startFrame && curFrame <= variables[i].endFrame){
                        angle = variables[i].currVal;
                        break;
                    }
                }
            }
        }

        scale[0][0] = parseFloat(split[1]);
        scale[1][1] = parseFloat(split[2]);
        scale[2][2] = parseFloat(split[3]);

        transformation = matrixMult(transformation, scale);
        break;

        case 'box-t':
        var box = [[],[],[],[]];

        for(var c = 1; c < split.length; c++){
            var temp = parseFloat(split[c]);
            if(isNaN(angle)){
                for (var i = 0; i < variables.length;i++){
                    if(variables[i].name === split[1] && curFrame >= variables[i].startFrame && curFrame <= variables[i].endFrame){
                        angle = variables[i].currVal;
                        break;
                    }
                }
            }
        }


        var pointA = [-0.5, -0.5, 0.5, 1]; //front vertices
        var pointB = [0.5, -0.5, 0.5, 1];
        var pointC = [0.5, 0.5, 0.5, 1];
        var pointD = [-0.5, 0.5, 0.5, 1];

        var pointE = [0.5, -0.5, -0.5, 1]; //back vertices
        var pointF = [-0.5, -0.5, -0.5, 1];
        var pointG = [-0.5, 0.5, -0.5, 1];
        var pointH = [0.5, 0.5, -0.5, 1];

        //adding triangles
        box = combine(box, pointA);
        box = combine(box, pointB);
        box = combine(box, pointC);

        box = combine(box, pointC);
        box = combine(box, pointD);
        box = combine(box, pointA);

        box = combine(box, pointB);
        box = combine(box, pointE);
        box = combine(box, pointH);

        box = combine(box, pointH);
        box = combine(box, pointC);
        box = combine(box, pointB);

        box = combine(box, pointE);
        box = combine(box, pointF);
        box = combine(box, pointG);

        box = combine(box, pointG);
        box = combine(box, pointH);
        box = combine(box, pointE);

        box = combine(box, pointF);
        box = combine(box, pointA);
        box = combine(box, pointD);

        box = combine(box, pointD);
        box = combine(box, pointG);
        box = combine(box, pointF);

        box = combine(box, pointC);
        box = combine(box, pointH);
        box = combine(box, pointG);

        box = combine(box, pointG);
        box = combine(box, pointD);
        box = combine(box, pointC);

        box = combine(box, pointF);
        box = combine(box, pointE);
        box = combine(box, pointB);

        box = combine(box, pointB);
        box = combine(box, pointA);
        box = combine(box, pointF);

        //local transformations
        var scale = createIdentity();
        scale[0][0] = parseFloat(split[1]);
        scale[1][1] = parseFloat(split[2]);
        scale[2][2] = parseFloat(split[3]);
        box = matrixMult(scale, box);

        var rotateX = createIdentity();
        var angle = parseFloat(split[4]);
        rotateX[1][1] = Math.cos(angle* Math.PI/180);
        rotateX[1][2] = -Math.sin(angle* Math.PI/180);
        rotateX[2][1] = Math.sin(angle* Math.PI/180);
        rotateX[2][2] = Math.cos(angle* Math.PI/180);
        box = matrixMult(rotateX, box);

        var rotateY = createIdentity();
        angle = parseFloat(split[5]);
        rotateY[0][0] = Math.cos(angle* Math.PI/180);
        rotateY[0][2] = Math.sin(angle* Math.PI/180);
        rotateY[2][0] = -Math.sin(angle* Math.PI/180);
        rotateY[2][2] = Math.cos(angle* Math.PI/180);
        box = matrixMult(rotateY, box);


        var rotateZ = createIdentity();
        angle = parseFloat(split[6]);
        rotateZ[0][0] = Math.cos(angle* Math.PI/180);
        rotateZ[0][1] = -Math.sin(angle* Math.PI/180);
        rotateZ[1][0] = Math.sin(angle* Math.PI/180);
        rotateZ[1][1] = Math.cos(angle* Math.PI/180);
        box = matrixMult(rotateZ, box);

        var move = createIdentity();
        move[0][3] = parseFloat(split[7]);
        move[1][3] = parseFloat(split[8]);
        move[2][3] = parseFloat(split[9]);
        box = matrixMult(move, box);


        //applying world transformation

        box = matrixMult(transformation, box);

        triangles = combine(triangles, box);
        
        break;

        case 'sphere-t':
        var sphere = [[],[],[],[]];

        var longitudesA = [[],[],[],[]];
        var longitudesB = [[],[],[],[]];

        var point = [0, 0, 0, 1];

        for(var c = 1; c < split.length; c++){//find variable
            var temp = parseFloat(split[c]);
            if(isNaN(angle)){
                for (var i = 0; i < variables.length;i++){
                    if(variables[i].name === split[1] && curFrame >= variables[i].startFrame && curFrame <= variables[i].endFrame){
                        angle = variables[i].currVal;
                        break;
                    }
                }
            }
        }


        for(var theta = 0; theta < 360;){
            for(var phi = 0; phi <= 180;phi+=15){
                point[0] = Math.sin(phi * Math.PI/180) * Math.cos(theta* Math.PI/180);
                point[1] = Math.cos(phi * Math.PI/180);
                point[2] = Math.sin(phi * Math.PI/180) * Math.sin(theta * Math.PI/180);

                longitudesB = combine(longitudesB, point);
            }

            theta+=15;

            for(phi = 0; phi <=180; phi+=15 ){
                point[0] = Math.sin(phi * Math.PI/180) * Math.cos(theta* Math.PI/180);
                point[1] = Math.cos(phi * Math.PI/180);
                point[2] = Math.sin(phi * Math.PI/180) * Math.sin(theta * Math.PI/180);

                longitudesA = combine(longitudesA, point);
            }

            //topmost triangle
            point = [longitudesA[0][0], longitudesA[1][0], longitudesA[2][0], 1];
            sphere = combine(sphere, point);

            point = [longitudesA[0][1], longitudesA[1][1], longitudesA[2][1], 1];
            sphere = combine(sphere, point);

            point = [longitudesB[0][1], longitudesB[1][1], longitudesB[2][1], 1];
            sphere = combine(sphere, point);

            //middle triangles
            for(var c = 2; c < longitudesA[0].length-1; c++){
                point = [longitudesB[0][c], longitudesB[1][c], longitudesB[2][c], 1];
                sphere = combine(sphere, point);

                point = [longitudesB[0][c-1], longitudesB[1][c-1], longitudesB[2][c-1], 1];
                sphere = combine(sphere, point);

                point = [longitudesA[0][c-1], longitudesA[1][c-1], longitudesA[2][c-1], 1];
                sphere = combine(sphere, point);

                //other triangles
                point = [longitudesA[0][c-1], longitudesA[1][c-1], longitudesA[2][c-1], 1];
                sphere = combine(sphere, point);

                point = [longitudesA[0][c], longitudesA[1][c], longitudesA[2][c], 1];
                sphere = combine(sphere, point);

                point = [longitudesB[0][c], longitudesB[1][c], longitudesB[2][c], 1];
                sphere = combine(sphere, point);
            }

            //bottom triangle

            point = [longitudesB[0][longitudesB[0].length-1], longitudesB[1][longitudesB[0].length-1], longitudesB[2][longitudesB[0].length-1], 1];
            sphere = combine(sphere, point);

            point = [longitudesB[0][longitudesB[0].length-2], longitudesB[1][longitudesB[0].length-2], longitudesB[2][longitudesB[0].length-2], 1];
            sphere = combine(sphere, point);

            point = [longitudesA[0][longitudesB[0].length-2], longitudesA[1][longitudesB[0].length-2], longitudesA[2][longitudesB[0].length-2], 1];
            sphere = combine(sphere, point);

            longitudesA = [[],[],[],[]];
            longitudesB = [[],[],[],[]];
        }
        //local transform
        var scale = createIdentity();
        scale[0][0] = parseFloat(split[1]);
        scale[1][1] = parseFloat(split[2]);
        scale[2][2] = parseFloat(split[3]);
        sphere = matrixMult(scale, sphere);

        var rotateX = createIdentity();
        var angle = parseFloat(split[4]);
        rotateX[1][1] = Math.cos(angle* Math.PI/180);
        rotateX[1][2] = -Math.sin(angle* Math.PI/180);
        rotateX[2][1] = Math.sin(angle* Math.PI/180);
        rotateX[2][2] = Math.cos(angle* Math.PI/180);
        sphere = matrixMult(rotateX, sphere);

        var rotateY = createIdentity();
        angle = parseFloat(split[5]);
        rotateY[0][0] = Math.cos(angle* Math.PI/180);
        rotateY[0][2] = Math.sin(angle* Math.PI/180);
        rotateY[2][0] = -Math.sin(angle* Math.PI/180);
        rotateY[2][2] = Math.cos(angle* Math.PI/180);
        sphere = matrixMult(rotateY, sphere);


        var rotateZ = createIdentity();
        angle = parseFloat(split[6]);
        rotateZ[0][0] = Math.cos(angle* Math.PI/180);
        rotateZ[0][1] = -Math.sin(angle* Math.PI/180);
        rotateZ[1][0] = Math.sin(angle* Math.PI/180);
        rotateZ[1][1] = Math.cos(angle* Math.PI/180);
        sphere = matrixMult(rotateZ, sphere);

        var move = createIdentity();
        move[0][3] = parseFloat(split[7]);
        move[1][3] = parseFloat(split[8]);
        move[2][3] = parseFloat(split[9]);
        sphere = matrixMult(move, sphere);

        sphere = matrixMult(transformation, sphere);
        triangles = combine(triangles, sphere);

        break;

        case 'render-parallel':
        var eye = [0, 0, 0];

        var copy = theCulling(triangles, 'p', eye);

        drawTriangles(copy, context);

        break;

        case 'render-perspective-cyclops':
        eye = [parseFloat(split[1]), parseFloat(split[2]), parseFloat(split[3])];

        var copy = theCulling(triangles, 'c', eye);
        
        renderCyclops(copy, eye);

        drawTriangles(copy, context);

        break;

        case 'render-perspective-stereo':
        var eye1 = [parseFloat(split[1]), parseFloat(split[2]), parseFloat(split[3])];
        var eye2 = [parseFloat(split[4]), parseFloat(split[5]), parseFloat(split[6])];

        var stereo1 = theCulling(triangles, 's', eye1);
        var stereo2 = theCulling(triangles, 's', eye2);

        renderCyclops(stereo1, eye1);
        renderCyclops(stereo2, eye2);

        drawTriangles(stereo1, context);

        drawTriangles(stereo2, context);

        break;

        default:
        // console.log('Keyword '+split[0]+' not found.');
    }
}

function updateVariables(){
    for(var i = 0; i < variables.length;i++){
        if(curFrame >= variables[i].startFrame && curFrame <= variables[i].endFrame)
            variables[i].update();
    }
}

function printVariables(){
    for (var i =0; i < variables.length;i++){
        console.log(variables[i].name +' : '+ variables[i].currVal);
    }
}
function parseLine(value){
    var split = value.split('\n');

    for(var i=0; i < split.length; i++){
        interpret(split[i]);
    }
}

var id;
function grabText(){
    var value = document.getElementById('myTextArea').value;
    if(id){
        clearInterval(id);
    }

    continuous = document.getElementById('continuous').checked;

    variables = [];
    curFrame = 1;
    numFrames = 1;

    id = setInterval(function(){
        canvas.width = canvas.width;
        triangles = [[],[],[],[]];
        transformation = createIdentity();

        saves = [];

        red = 0;
        green = 0;
        blue = 0;
        parseLine(value);

        curFrame++;

        updateVariables();

        if(curFrame > numFrames){

            if(continuous){
                variables = [];
                curFrame = 1;
                numFrames = 1; 
            }          
            else
                clearInterval(id);
        }
        
    }, 20);
}

button.addEventListener('click', grabText, false);

//socketio
// create the socket object

function drawCopy(copy){//assume render parallel
    canvas.width = canvas.width;
    var eye = [0, 0, 0];
    var copy2 = theCulling(copy, 'p', eye);

    drawTriangles(copy2, context);
}

var socket = io();

function move(data) {
    var angle = data.xRotate;
    var xRotate = createIdentity();

    var copy = triangles;

    xRotate[1][1] = Math.cos(angle* Math.PI/180);
    xRotate[1][2] = -Math.sin(angle* Math.PI/180);
    xRotate[2][1] = Math.sin(angle* Math.PI/180);
    xRotate[2][2] = Math.cos(angle* Math.PI/180);

    copy = matrixMult(xRotate, copy);

    angle = data.yRotate;
    var yRotate = createIdentity();

    yRotate[0][0] = Math.cos(angle* Math.PI/180);
    yRotate[0][2] = Math.sin(angle* Math.PI/180);
    yRotate[2][0] = -Math.sin(angle* Math.PI/180);
    yRotate[2][2] = Math.cos(angle* Math.PI/180);

    copy = matrixMult(yRotate, copy);

    angle = -data.zRotate;
    var zRotate = createIdentity();

    zRotate[0][0] = Math.cos(angle* Math.PI/180);
    zRotate[0][1] = -Math.sin(angle* Math.PI/180);
    zRotate[1][0] = Math.sin(angle* Math.PI/180);
    zRotate[1][1] = Math.cos(angle* Math.PI/180);

    copy = matrixMult(zRotate, copy);

    drawCopy(copy);
}

socket.on('connect', function () {

  socket.on('move', function(data) {
    move(data);
});

  socket.on('disconnect',function() {
  });
});

var is_client = document.getElementById('is_client');


function handleOrientationEvent(alpha,beta,gamma) {
    var data = {
        zRotate: gamma,
        xRotate: beta,
        yRotate: alpha,
    };
    if(is_client.checked) {
        socket.emit('devicemove', data);
        move(data);
    }
}


if(window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", function(event) {
        var alpha = event.alpha;
        var beta = event.beta;
        var gamma = event.gamma;
        
        handleOrientationEvent(alpha, beta, gamma);
    }, false);
}