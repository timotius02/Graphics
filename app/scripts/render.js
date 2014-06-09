function theCulling(triagles, c, eye){
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
        for(var i = 0;i < triagles[0].length;i+=3){
            pointA = [triagles[0][i], triagles[1][i], triagles[2][i], triagles[3][i]];
            pointB = [triagles[0][i+1], triagles[1][i+1], triagles[2][i+1], triagles[3][i+1]];
            pointC = [triagles[0][i+2], triagles[1][i+2], triagles[2][i+2], triagles[3][i+2]];

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
        for(var i = 0; i < triagles[0].length;i+=3){

            pointA = [triagles[0][i], triagles[1][i], triagles[2][i], 1];
            pointB = [triagles[0][i+1], triagles[1][i+1], triagles[2][i+1], 1];
            pointC = [triagles[0][i+2], triagles[1][i+2], triagles[2][i+2], 1];

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