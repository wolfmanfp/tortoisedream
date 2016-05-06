var tortoise;

function Tortoise(X, Y, w, h, c){
	var x = X;
	var y = Y;
	var angle=0;
	var distance = 0;
	var width = w;
	var height = h;
	var ctx = c;
	
	this.go = function(dist){
		distance = dist;
		x+= Math.sin(angle)*distance;
		y+= Math.cos(angle)*distance;
		this.draw();
	}
	
	this.turn = function(deg){
		angle+= deg* (Math.PI / 180);
		this.draw();
	}
	
	this.draw = function(){
		ctx.save();
		ctx.translate(x,y);
		ctx.rotate(-angle);
		ctx.fillRect(-10,- 10, w, h);
		ctx.restore();
	}
	
	
}

function init(ctx, x, y){
	tortoise = new Tortoise(x, y, 20, 20, ctx);
}

window.onload = function () {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	init(ctx, canvas.width/2, canvas.height/2);
}