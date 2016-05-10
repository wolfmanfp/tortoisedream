var tortoise;
var ctx;
var ctx2;

function Tortoise(X, Y) {
    var x = X;
    var y = Y;
	var degree =0;
	var degreeStep =0;
    var angle = 0;
	var distance = 0;
	var step = 1;

    var img = new Image();
    img.src = "tortoise.png";
    var width = 26;
    var height = 34;

    this.go = function (dist) {
		distance = dist;
    }

    this.turn = function (deg) {
		degree = deg;
		degreeStep = degree/5;
    }

    this.draw = function () {
		
		move();
		rotate();
		
		ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-angle);
        ctx.drawImage(img, 0 - (width / 2), 0 - (height / 2));
        ctx.restore();
		
		ctx2.fillRect(x, y , 1, 1 );
    }

	function rotate(){
		if(degree !=0){
			angle -= degreeStep * (Math.PI / 180);
			degree -=degreeStep;
		}
	}
	
	function move(){
		if(distance != 0){
			x -= Math.sin(angle) * step;
			y -= Math.cos(angle) * step;
			distance -=step;
		}
	}
}

function init(x, y) {
    tortoise = new Tortoise(x, y);
    setInterval(repaint, 33);
}

function repaint() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tortoise.draw();
}

window.onload = function () {
    ctx = document.getElementById("canvas").getContext("2d");
    ctx2 = document.getElementById("canvas2").getContext("2d");
    init(canvas.width / 2, canvas.height / 2);
}