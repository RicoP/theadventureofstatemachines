#include <statemachine.js> 
#include <glt.js> 
#include "animation.js"
#include "sprite.js" 

(function() { 
"use strict"; 

var canvas = document.getElementsByTagName("canvas")[0]; 
var ctx    = canvas.getContext("2d"); 

var game = {
	hero : {
		health    : 1, 
		maxhealth : 3,
		gold      : 10, 
		maxgold   : 99
	}
}; 

function loadMap(mapname) { 
	GLT.loadmanager.loadFiles({
		files : [mapname],
		finished : function(files) {
			var mapdata = files[mapname]; 

			//Make shure the tilesets are ordered by firstgid
			mapdata.tilesets.sort(function(a,b) { return a.firstgid - b.firstgid; }); 

			GLT.loadmanager.loadFiles({
				files : mapdata.tilesets.map(function(tile) { return tile.image; }).concat("mage.png"), 
				finished : function(images) {					
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
		//Air
		return null; 
	}

	var lastSet = null; 
	var nextSet = null; 

	var i = 0; 
	do {
		lastSet = tilesets[i]; 
		i++; 
		nextSet = tilesets[i]; 
	} while( nextSet && id >= nextSet.firstgid ); 

	var tileset = lastSet; 
	var offset = id - tileset.firstgid; 

	var width  = (tileset.imagewidth  / tileset.tilewidth)  | 0; 

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

	startGameLoop(map, images); 
}

function startGameLoop(map, images) {
	function error(m) { throw new Error(m); }

	var width      = map.width; 
	var height     = map.height; 
	var tilewidth  = map.tilewidth; 
	var tileheight = map.tileheight; 

	var background = map.grids.background || error("No Layer 'background'"); 
	var obstacles  = map.grids.obstacles  || error("No Layer 'obstacles'"); 
	var objects    = map.grids.objects    || error("No Layer 'objects'");  
	var ceiling    = map.grids.ceiling    || error("No Layer 'ceiling'"); 

	var layers = [background, obstacles, objects, ceiling]; 

	var hero = new Sprite({
		image : images["mage.png"], 
		animations : {
			"northstand" : new Animation([ [0,0] ]),
			"weststand"  : new Animation([ [0,64] ]),
			"southstand" : new Animation([ [0,128] ]),
			"eaststand"  : new Animation([ [0,192] ]),
			"northwalk"  : new Animation([ 
				[1*64,0],   [2*64,0],   [3*64,0],   [4*64,0],   [5*64,0],   [6*64,0],   [7*64,0],   [8*64,0] 
			]),
			"westwalk"   : new Animation([ 
				[1*64,64],  [2*64,64],  [3*64,64],  [4*64,64],  [5*64,64],  [6*64,64],  [7*64,64],  [8*64,64] 
			]),
			"southwalk"  : new Animation([ 
				[1*64,128], [2*64,128], [3*64,128], [4*64,128], [5*64,128], [6*64,128], [7*64,128], [8*64,128] 
			]),
			"eastwalk"   : new Animation([ 
				[1*64,192], [2*64,192], [3*64,192], [4*64,192], [5*64,192], [6*64,192], [7*64,192], [8*64,192] 
			])
		},
		startanimation : "southstand", 
		spritesize : [64,64], 
		boundingbox : [32,48], 
		position : [256,256]
	});

	var heroAnimTime = 0.2; 
	var heroNextAnimTick = heroAnimTime; 

	function gameloop(info) {
		for(var j = 0; j !== layers.length; j++) { 
			var layer = layers[j]; 
			for(var x = 0; x !== map.width; x++) {
				for(var y = 0; y !== map.height; y++) {
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

			if(layer === obstacles) {
				//Draw hero
				var frame = hero.getFrame();  
				var size = hero.getSize(); 
				var pos = hero.getPosition(); 
				var offset = hero.getOffset(); 
				var moved = false; 

				if(GLT.keys.isDown(GLT.keys.codes.w)) {
					pos[1] -= size[0] * info.time.delta; 
					hero.setAnimationByName("northwalk"); 
					moved = true;
				}

				if(GLT.keys.isDown(GLT.keys.codes.s)) {
					pos[1] += size[0] * info.time.delta; 
					hero.setAnimationByName("southwalk"); 
					moved = true;
				}

				if(GLT.keys.isDown(GLT.keys.codes.a)) {
					pos[0] -= size[1] * info.time.delta; 
					hero.setAnimationByName("westwalk"); 
					moved = true;
				}

				if(GLT.keys.isDown(GLT.keys.codes.d)) {
					pos[0] += size[1] * info.time.delta; 
					hero.setAnimationByName("eastwalk"); 
					moved = true;
				}

				if(moved) {
					heroNextAnimTick -= info.time.delta; 
					if(heroNextAnimTick <= 0) {
						heroNextAnimTick += heroAnimTime; 
						hero.getAnimation().next();
					}
				} 
				else {
					var name = hero.getAnimationName(); 
					if(name === "northwalk") {
						hero.setAnimationByName("northstand");
					} else if(name === "southwalk") {
						hero.setAnimationByName("southstand"); 
					} else if(name === "westwalk") {
						hero.setAnimationByName("weststand"); 
					} else if(name === "eastwalk") {
						hero.setAnimationByName("eaststand"); 
					}



				}


				ctx.drawImage(
					hero.getImage(), 
					frame[0], frame[1], 
					size[0], size[1], 
					offset[0] + pos[0], offset[1] + pos[1], 
					size[0], size[1]
				);
			}
		}

		GLT.requestGameFrame(gameloop); 
	}

	GLT.requestGameFrame(gameloop); 
}



loadMap("map1.json"); 

}()); 

