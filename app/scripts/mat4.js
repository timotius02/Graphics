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

}