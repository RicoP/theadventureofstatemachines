#include <statemachine.js> 
#include <glt.js> 

(function() { 
"use strict"; 

var canvas = document.getElementsByTagName("canvas")[0]; 
var ctx    = canvas.getContext("2d"); 

function loadMap(mapname) { 
	GLT.loadmanager.loadFiles({
		files : [mapname],
		finished : function(files) {
			var mapdata = files[mapname]; 
			console.log(mapdata.tilewidth); 
			console.log(mapdata.tileset) ;

			GLT.loadmanager.loadFiles({
				files : mapdata.tilesets.map(function(tile) { return tile.image; }), 
				finished : function(images) {
					console.log(images); 

					start(mapdata, images); 
				}
			}); 

		}
	}); 
}

function checkLayerDimension(layers) {
	var first = layers[0]; 
	var dim = { width : first.width, height : first.height }; 

	for(var i = 1; i < layers.length; i++) {
		var layer = layers[i]; 
		if(layer.width !== dim.width || layer.height !== layer.height) {
			throw new Error("Size of layer '" + layer.name + "' is different of layer '" + first.name + "."); 
		}
	}

	return dim; 
}


function mapIndexToTile(id, tilesets, images) {
	if(id === 0) {
		return null; 
	}

	var tiles = tilesets.slice(0); 
	tiles.sort(function(a,b) { return a.firstgid - b.firstgid; }); 

	var lastSet = null; 
	var nextSet = null; 

	var i = 0; 
	do {
		lastSet = tiles[i]; 
		i++; 
		nextSet = tiles[i]; 
	} while( nextSet && id >= nextSet.firstgid ); 

	var tileset = lastSet; 
	var offset = id - tileset.firstgid; 

	var width  = (tileset.imagewidth  / tileset.tilewidth)  | 0; 
	//var height = (tileset.imageheight / tileset.tileheight) | 0; 

	return {
		image  : images[tileset.image], 
		offx   : offset % width,
		offy   : (offset / width) | 0
	};
}

function addGrid(dimension, grids, layer, tilesets, images) {
	var grid = new Array(dimension.width); 
	for(var x = 0; x < dimension.width; x++) {
		grid[x] = new Array(dimension.height); 
	}

	var data = layer.data; 
	var x = 0, y = 0; 
	for(var i = 0; i !== data.length; i++) {
		x = i % dimension.width; 
		y = (i / dimension.width) | 0; 

		grid[x][y] = mapIndexToTile(data[i], tilesets, images); 
	}

	grids[layer.name] = grid; 
}

function start(map, images) {
	var dimension = checkLayerDimension(map.layers); 
	var grids = {}; 

	for(var l = 0; l !== map.layers.length; l++) {
		addGrid(dimension, grids, map.layers[l], map.tilesets, images); 
	}

	console.log(grids); 
	map.grids = grids; 

	startGameLoop(map); 
}

function startGameLoop(map) {
	function error(m) { throw new Error(m); }

	var width      = map.width; 
	var height     = map.height; 
	var tilewidth  = map.tilewidth; 
	var tileheight = map.tileheight; 

	var bg         = map.grids.background || error("No Layer 'background'"); 
	var obstacles  = map.grids.obstacles  || error("No Layer 'obstacles'"); 
	var objects    = map.grids.objects    || error("No Layer 'objects'");  
	var ceiling    = map.grids.ceiling    || error("No Layer 'ceiling'"); 

	var layers = [bg, obstacles, objects, ceiling]; 

	function gameloop(info) {
		for(var x = 0; x !== map.width; x++) {
			for(var y = 0; y !== map.height; y++) {
				for(var j = 0; j !== layers.length; j++) { 
					var layer = layers[j]; 
					var tile = layer[x][y]; 
					if(tile) { 
						ctx.drawImage(
							tile.image, 
							tilewidth * tile.offx, tileheight * tile.offy, 
							tilewidth, tileheight, 
							tilewidth * x, tileheight * y, 
							tilewidth, tileheight
						); 		
					}
				}
			}
		}

		GLT.requestGameFrame(gameloop); 
	}

	GLT.requestGameFrame(gameloop); 
}



loadMap("map1.json"); 

}()); 

