#ifndef SPRITE_JS
#define SPRITE_JS 

function Sprite(options) {
	var image = options.image; 
	var animations = options.animations; 
	var currentanimation = animations[options.startanimation];
	var screenoffset = [ -options.spritesize[0] / 2, -options.spritesize[1] / 2 ]; 
	var boundingbox = options.boundingbox; // [width, height]
	var w = boundingbox[0], h = boundingbox[1]; 
	var radius = Math.sqrt( 0.25 * (w*w+h*h) ); //radius from middle point to outer corner of Bounding Box
	var position = options.position; //Always the center of the Sprite 
	var size = options.spritesize; 

	this.setAnimation = function(anim) {
		currentanimation = animations[anim]; 
	};

	this.getFrame = function() {
		return currentanimation.current(); 
	}; 

	this.getAnimation = function() {
		return currentanimation; 
	};

	this.getBoundingbox = function() {
		return coundingbox; 
	}; 

	this.getImage = function() {
		return image; 
	};

	this.getSize = function() {
		return size; 
	};

	this.getPosition = function() {
		return position; 
	}; 

	this.getOffset = function() {
		return screenoffset; 
	};

}

#endif 
