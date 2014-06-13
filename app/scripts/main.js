'use strict';

var canvas = document.getElementById('myCanvas');
var button = document.getElementById('myButton');
var sample = document.getElementById('sample');
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

'use strict';

function createIdentity(){
    return [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
}


function combine(matrix1, matrix2){
    if(matrix1.length !== matrix2.length){
        throw 'error: matrices does not have same height';
    }
    var num = 0;
    return matrix1.map(function(row){ //for every row
        return row.concat(matrix2[num++]);
    });
}

function matrixMult(matrix1, matrix2) {
    if(matrix1[0].length!== matrix2.length){//if width != height
        throw 'error: matrices cannot be multiplied';
    }
    var result = [];
    for (var i = 0; i < matrix1.length; i++) {
        result[i] = [];
        for (var j = 0; j < matrix2[0].length; j++) {
            var sum = 0;
            for (var k = 0; k < matrix1[0].length; k++) {
                sum += matrix1[i][k] * matrix2[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

function matrixPrint(matrix){
    for(var i = 0; i < matrix.length;i++){
        var join = matrix[i].join(' ');
        console.log(join);
    }

}function uploadCoordinates(form) {
       var file=form.uploadfile.value;
       var reader=new FileReader();
       reader.readAsText(file);
       form.coordinates.value=reader.result; }

function theCulling(triangles, c, eye){
    var pointA = [];
    var pointB = [];
    var pointC = [];

    var vectorA = [];
    var vectorB = [];
    var vectorS = [];

    var perpVector = [];

    var d;

    var ret = [[],[],[],[]];

    if(c==='p'){//p for parallel
        for(var i = 0;i < triangles[0].length;i+=3){
            pointA = [triangles[0][i], triangles[1][i], triangles[2][i], triangles[3][i]];
            pointB = [triangles[0][i+1], triangles[1][i+1], triangles[2][i+1], triangles[3][i+1]];
            pointC = [triangles[0][i+2], triangles[1][i+2], triangles[2][i+2], triangles[3][i+2]];

            vectorA = [pointA[0]- pointB[0], pointA[1]- pointB[1], pointA[2]- pointB[2]];
            vectorB = [pointC[0]- pointB[0], pointC[1]- pointB[1], pointC[2]- pointB[2]];

            //finding perp vector
            perpVector = [(vectorA[1] * vectorB[2]) - (vectorA[2] * vectorB[1]),
                          (vectorA[2] * vectorB[0]) - (vectorA[0] * vectorB[2]),
                          (vectorA[0] * vectorB[1]) - (vectorA[1] * vectorB[0])];

            if(perpVector[2]< 0){
                ret = combine(ret, pointA);
                ret = combine(ret, pointB);
                ret = combine(ret, pointC);
            }
        }
    }
    else{
        for(var i = 0; i < triangles[0].length;i+=3){

            pointA = [triangles[0][i], triangles[1][i], triangles[2][i], 1];
            pointB = [triangles[0][i+1], triangles[1][i+1], triangles[2][i+1], 1];
            pointC = [triangles[0][i+2], triangles[1][i+2], triangles[2][i+2], 1];

            vectorA = [pointB[0]- pointA[0], pointB[1]- pointA[1], pointB[2]- pointA[2]];
            vectorB = [pointC[0]- pointB[0], pointC[1]- pointB[1], pointC[2]- pointB[2]];

            vectorS = [pointA[0]- eye[0], pointA[1] - eye[1], pointA[2] - eye[2]];

            //perpVector = [(vectorA[1] * vectorB[2]) - (vectorA[2] * vectorB[1]), (vectorA[2] * vectorB[0]) - (vectorA[0] * vectorB[2]), (vectorA[0] * vectorB[1]) - (vectorA[1] * vectorB[0])];

            var temp1 = (vectorA[1]*vectorB[2]) - (vectorA[2]* vectorB[1]);
            var temp2 = (vectorA[2]*vectorB[0]) - (vectorA[0]* vectorB[2]);
            var temp3 = (vectorA[0]*vectorB[1]) - (vectorA[1]* vectorB[0]);
            perpVector = [temp1, temp2, temp3];

            d = (vectorS[0]* perpVector[0]) + (vectorS[1]* perpVector[1]) +(vectorS[2]* perpVector[2]);

            if(d < 0){
                ret = combine(ret, pointA);
                ret = combine(ret, pointB);
                ret = combine(ret, pointC);
            }
        }

    }

    return ret;
}

function renderCyclops(matrix, eye){
    var x1 = eye[0];
    var y1 = eye[1];
    var z1 = eye[2];

    var x, y, z;

    for(var i = 0; i < matrix[0].length;i++){
        x = matrix[0][i];
        y = matrix[1][i];
        z = matrix[2][i];

        matrix[0][i] = x1 - ((z1 * (x1-x)) / (z1-z));
        matrix[1][i] = y1 - ((z1 * (y1-y)) / (z1-z));
        matrix[2][i] = 0;
    }
}

function renderStereo(matrix, eye1, eye2){
    var matrix2 = matrix;

    renderCyclops(matrix, eye1);
    renderCyclops(matrix2, eye2);

    matrix = combine(matrix, matrix2);

}

function drawTriangles(copy, context){
    for(var i = 0; i < copy[0].length;i+=3){
        var x1 = convertScreen(copy[0][i], 'x');
        var y1 = -convertScreen(copy[1][i], 'y');

        var x2 = convertScreen(copy[0][i+1], 'x');
        var y2 = -convertScreen(copy[1][i+1], 'y');

        var x3 = convertScreen(copy[0][i+2], 'x');
        var y3 = -convertScreen(copy[1][i+2], 'y');


        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineTo(x3, y3);
        context.lineTo(x1, y1);

        context.strokeStyle = '#000000';
        context.stroke();               
    }

}

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

function interpretImport(line){
    var split = line.split('  ');
    var length = 0;
    var ret = [[],[],[],[]];

    switch(split[0]){
        case "":
        if(curFrame===1){
            console.log(split.length);
            console.log(line);
        }
        break;
        case "#":
        break;

        default:
        if(split.length ===1){
            length = parseInt(split[0]);
        }
        else{
            // if(split[0]==='' && split.length ===1)
            //     break;
            // else if(split[0]==='')
            //     split.splice(0,1);

            var point1 = [parseFloat(split[0]), parseFloat(split[1]), parseFloat(split[2]), 1];
            var point2 = [parseFloat(split[3]), parseFloat(split[4]), parseFloat(split[5]), 1];
            var point3 = [parseFloat(split[6]), parseFloat(split[7]), parseFloat(split[8]), 1];

            ret = combine(ret, point1);
            ret = combine(ret, point2);
            ret = combine(ret, point3);
        }
    }
    return ret;
}

function importFiles(lines, i, k){
    var importsTriangles = [[],[],[],[]];

    for(var c =i; c < k; c++){
        var ret = interpretImport(lines[c]);//returns one triangle face
        importsTriangles = combine(importsTriangles, ret);
    }

    return importsTriangles;
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
            var imports = document.getElementById('imports').value;
            var lines = imports.split('\n');
            var importTriangles;

            for(var c = 2; c < split.length; c++){
                var temp = parseFloat(split[c]);

                if(isNaN(temp)){

                    for (var i = 0; i < variables.length;i++){
                        if(variables[i].name === split[c] && curFrame >= variables[i].startFrame && curFrame <= variables[i].endFrame){
                            split[c] = variables[i].currVal.toString();
                            break;
                        }
                    }
                }
            }

            for(var i = 0; i < lines.length;i++){
                if(lines[i].charAt(0)==='n'){
                    var concat = lines[i].split(' ');
                    if(concat[1] === split[1]){//find right import
                        for(var k =i ; k < lines.length;k++){
                            if(lines[k].charAt(0)==='e'){
                                importTriangles = importFiles(lines, i+1, k);
                            }
                        }
                        break;
                    }
                }
            }
            // if(curFrame===1)
            // console.log(importTriangles);
        //local transformations
        var scale = createIdentity();
        scale[0][0] = parseFloat(split[2]);
        scale[1][1] = parseFloat(split[3]);
        scale[2][2] = parseFloat(split[4]);
        importTriangles = matrixMult(scale, importTriangles);

        var rotateX = createIdentity();
        var angle = parseFloat(split[5]);
        rotateX[1][1] = Math.cos(angle* Math.PI/180);
        rotateX[1][2] = -Math.sin(angle* Math.PI/180);
        rotateX[2][1] = Math.sin(angle* Math.PI/180);
        rotateX[2][2] = Math.cos(angle* Math.PI/180);
        importTriangles = matrixMult(rotateX, importTriangles);

        var rotateY = createIdentity();
        angle = parseFloat(split[6]);
        rotateY[0][0] = Math.cos(angle* Math.PI/180);
        rotateY[0][2] = Math.sin(angle* Math.PI/180);
        rotateY[2][0] = -Math.sin(angle* Math.PI/180);
        rotateY[2][2] = Math.cos(angle* Math.PI/180);
        importTriangles = matrixMult(rotateY, importTriangles);


        var rotateZ = createIdentity();
        angle = parseFloat(split[7]);
        rotateZ[0][0] = Math.cos(angle* Math.PI/180);
        rotateZ[0][1] = -Math.sin(angle* Math.PI/180);
        rotateZ[1][0] = Math.sin(angle* Math.PI/180);
        rotateZ[1][1] = Math.cos(angle* Math.PI/180);
        importTriangles = matrixMult(rotateZ, importTriangles);

        var move = createIdentity();
        move[0][3] = parseFloat(split[8]);
        move[1][3] = parseFloat(split[9]);
        move[2][3] = parseFloat(split[10]);
        importTriangles = matrixMult(move, importTriangles);

        //applying world transformation

        importTriangles = matrixMult(transformation, importTriangles);

        triangles = combine(triangles, importTriangles);

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
            if(isNaN(temp)){
                for (var i = 0; i < variables.length;i++){
                    if(variables[i].name === split[1] && curFrame >= variables[i].startFrame && curFrame <= variables[i].endFrame){
                        split[c] = variables[i].currVal.toString();
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
            if(isNaN(temp)){
                for (var i = 0; i < variables.length;i++){
                    if(variables[i].name === split[1] && curFrame >= variables[i].startFrame && curFrame <= variables[i].endFrame){
                        split[c] = variables[i].currVal.toString();
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

                if(isNaN(temp)){

                    for (var i = 0; i < variables.length;i++){
                        if(variables[i].name === split[c] && curFrame >= variables[i].startFrame && curFrame <= variables[i].endFrame){
                            split[c] = variables[i].currVal.toString();
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

            for(var c = 1; c < split.length; c++){
                var temp = parseFloat(split[c]);

                if(isNaN(temp)){

                    for (var i = 0; i < variables.length;i++){
                        if(variables[i].name === split[c] && curFrame >= variables[i].startFrame && curFrame <= variables[i].endFrame){
                            split[c] = variables[i].currVal.toString();
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
        
    }, 33);
}
function grabSample(){
    var text = '# object3d commands test (corrected)\nscreen -3 -2 3 2\npixels 600 400\nrotate-y 40\nrotate-x 20\nsphere-t 1 1 1 0 0 0 1 0 0\nbox-t 1 1 1 0 0 0 -1 -0.5 -1\nrender-parallel';
    document.getElementById('myTextArea').value = text;
}

button.addEventListener('click', grabText, false);
sample.addEventListener('click', grabSample, false);

//socketio
// create the socket object

function drawCopy(copy){//assume render parallel
    canvas.width = canvas.width;
    var eye = [0, 0, 0];
    var copy2 = theCulling(copy, 'p', eye);

    drawTriangles(copy2, context);
}

var socket = io();

// function move(data){
//     var copy = triangles;

//     var move = createIdentity();
//     move[0][3] = data.x;
//     move[1][3] = data.y;
//     move[2][3] = data.z;
//     copy = matrixMult(move, copy);

//     drawCopy(copy);
// }

function rotate(data) {
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

    angle = data.zRotate;
    var zRotate = createIdentity();

    zRotate[0][0] = Math.cos(angle* Math.PI/180);
    zRotate[0][1] = -Math.sin(angle* Math.PI/180);
    zRotate[1][0] = Math.sin(angle* Math.PI/180);
    zRotate[1][1] = Math.cos(angle* Math.PI/180);

    copy = matrixMult(zRotate, copy);

    drawCopy(copy);
}

socket.on('connect', function () {

  socket.on('rotate', function(data) {
    rotate(data);
});

  // socket.on('move', function(data){
  //   move(data);
  // });

  socket.on('disconnect',function() {
  });
});

var is_client = document.getElementById('is_client');


function orientationHandler(data) {
    var dataSet = {
        zRotate: data.gamma,
        xRotate: -data.beta,
        yRotate: data.alpha,
    };
    if(is_client.checked) {
        socket.emit('devicerotate', dataSet);
        rotate(dataSet);
    }
}

// function motionHandler(data){
//     var acceleration = data.acceleration;


//     if(is_client.checked){
//         socket.emit('devicemove', acceleration);
//         move(acceleration);

//     }
// }


if(window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', orientationHandler, false);
}
// if(window.DeviceMotionEvent){
//     window.addEventListener('devicemotion', motionHandler, false);
// }


window.onload = function() {

    //Check File API support
    if (window.File && window.FileList && window.FileReader) {
        var filesInput = document.getElementById('files');

        filesInput.addEventListener('change', function(event) {

            var files = event.target.files; //FileList object
            var output = document.getElementById('result');

            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                var picReader = new FileReader();

                picReader.addEventListener("load", function(event) {
                    //var textFile = event.target;
                    document.getElementById('myTextArea').value = event.target.result;
                });

                //Read the text file
                picReader.readAsText(file);
            }
        });

        var importFiles= document.getElementById('importFiles');

        importFiles.addEventListener('change', function(event) {

            var files = event.target.files; //FileList object
            var output = document.getElementById('result');

            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                var picReader = new FileReader();

                picReader.addEventListener("load", function(event) {
                    //var textFile = event.target;
                    document.getElementById('imports').value += "\nname " + file.name+"\n";
                    document.getElementById('imports').value += event.target.result;
                    document.getElementById('imports').value += "end\n";


                });

                //Read the text file
                picReader.readAsText(file);
            }
        });

    }
    else {
        console.log("Your browser does not support File API");
    }
}