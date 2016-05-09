var tortoise;
var ctx;

function Tortoise(X, Y) {
    var x = X;
    var y = Y;
    var angle = 0;

    var img = new Image();
    img.src = "tortoise.png";
    var width = 26;
    var height = 34;

    this.go = function (dist) {
        x -= Math.sin(angle) * dist;
        y -= Math.cos(angle) * dist;
    }

    this.turn = function (deg) {
        angle -= deg * (Math.PI / 180);
    }

    this.draw = function () {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-angle);
        ctx.drawImage(img, 0 - (width / 2), 0 - (height / 2));
        ctx.restore();
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
    init(canvas.width / 2, canvas.height / 2);
}