#include <statemachine.js> 
#include <glt.js> 

(function() { 
"use strict"; 

var canvas = document.getElementsByTagName("canvas")[0]; 
var ctx    = canvas.getContext("2d"); 

GLT.loadmanager.loadFiles({
	files : ["../map/map1.json"],
	finished : function(files) {
		var map = files["../map/map1.json"]; 

		console.log(map.tilewidth); 
	}
}); 


}()); 

