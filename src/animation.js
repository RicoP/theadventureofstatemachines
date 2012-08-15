#ifndef ANIMATION_JS 
#define ANIMATION_JS 

function Animation(list /* [ [x1,y1 [,timeout1]], [x2,y2 [,timeout2]], [x3,y3 [,timeout3]], ... ] */, timeout) {
	var frame  = 0; 
	var length = list.length; 
	var timer  = -1; 

	this.set      = function(f) { frame = f; }; 
	this.current  = function()  { return list[frame]; }; 
	this.next     = function()  { frame = (frame+1) % length; return this.current(); }; 
	this.reset    = function()  { frame = 0; }; 
	this.stop     = function()  { clearInterval(timer); }; 
	this.autoplay = function(interval) { 
		var that = this; 
		this.stop(); 
		timer = setInterval( function() { that.next(); }, interval ); 
	}; 
}

#endif 
