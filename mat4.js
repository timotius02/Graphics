'use strict'

var Mat4 = function(){
	var value = [];

	var combine = function(matrix){ //returns the length of the 
		return value.concat(matrix); //newly concatenated array
	};

	var get = function(row, col){//organized by column first 
		return value[col][row]; //to allow better combine and addColumn function
	}

	var matrixMult = function(matrix){
		if(this.length !== matrix[0].length){//if numcols != numrows
			throw 'error: matrices incompatible for multiplicaton' ;
		
		else {
			var result = [];

			for(var 1 = 0; i < this.length; i++){
				result[i] = [];
				for(var j = 0; j < matrix[0].length; j++){
					var sum = 0; 

				}
			}
		}
	
	}
}