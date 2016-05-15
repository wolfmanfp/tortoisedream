var tortoise;
var canvas;
var ctx;
var ctx2;

function Tortoise(x, y) {
    this.x = x;
    this.y = y;

	var degree = 0;
	var degreeStep = 5;
    var rad = 0;
	var distance = 0;

    var img = new Image();
    img.src = "tortoise.png";
    var width = img.width;
    var height = img.height;

    var isDrawing = false;

    this.go = function(dist) {
		distance = dist;
    };

    this.turn = function(deg) {
		degree = deg;
    };

    this.tailUp = function() {
        if (isDrawing) isDrawing = false;
    };

    this.tailDown = function() {
        if (!isDrawing) isDrawing = true;
    };

    this.dream = function() {
        //TODO
    };

    this.look = function() {
        //TODO
    };

    this.trip = function() {
        //TODO
    };

    this.draw = function(){
		move();
		rotate();

		ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-rad);
        ctx.drawImage(img, -(width / 2), -(height / 2));
        ctx.restore();
        if (isDrawing) ctx2.fillRect(x, y , 1, 1);
    };

	function move(){
		if(distance != 0){
			x -= Math.sin(rad);
			y -= Math.cos(rad);
			distance--;
		}
	}

    function rotate(){
        if(degree !=0){
            rad -= degreeStep * (Math.PI / 180);
            degree -= degreeStep;
        }
    }
}

function init(x, y) {
    tortoise = new Tortoise(x, y);
    setInterval(repaint, 16);
}

function repaint() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tortoise.draw();
}

window.onload = function() {
    canvas = document.getElementById("tortoise");
    ctx = canvas.getContext("2d");
    ctx2 = document.getElementById("drawing").getContext("2d");
    init(canvas.width / 2, canvas.height / 2);
};