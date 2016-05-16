var tortoise;
var canvas;
var ctx;
var ctx2;
var cmdHistory = [];
var cmdIndex = 0;
var cmdFragment = '';
var cmdArray = ['go', 'turn', 'trip', 'tailDown', 'tailUp', 'dream'];

function Tortoise(x1, y1) {
    var x = x1;
    var y = y1;

    var degree = 0;
    var degreeStep = 5;
    var rad = 0;
    var distance = 0;

    var img = new Image();
    img.src = "tortoise.png";
    var width = img.width;
    var height = img.height;

    var isDrawing = false;

    this.go = function (dist) {
        distance = dist;
    };

    this.turn = function (deg) {
        degree = deg;
    };

    this.tailUp = function () {
        if (isDrawing) {
            isDrawing = false;
        }
    };

    this.tailDown = function () {
        if (!isDrawing) {
            isDrawing = true;
        }
    };

    this.dream = function () {
        //TODO
    };

    this.look = function () {
        //TODO
    };

    this.trip = function () {
        //TODO
    };

    this.draw = function () {
        move();
        rotate();

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-rad);
        ctx.drawImage(img, -(width / 2), -(height / 2));
        ctx.restore();
        if (isDrawing) ctx2.fillRect(x, y, 1, 1);
    };

    function move() {
        if (distance != 0) {
            x -= Math.sin(rad);
            y -= Math.cos(rad);
            distance--;
        }
    }

    function rotate() {
        if (degree != 0) {
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

function cmdArchive(cmd) {
    cmdHistory.push(cmd);
    cmdIndex = cmdHistory.length;
}

function cmdEntered(cmd, $txt) {
    eval(cmd);
    cmdArchive(cmd);
    $txt.val('');
}

function cmdPrevious(cmd, $txt) {
    if (cmdIndex > 0) {
        cmdIndex--;
    }

    $txt.val(cmdHistory[cmdIndex]);
}

function cmdNext(cmd, $txt) {
    if (cmdIndex < cmdHistory.length - 1) {
        cmdIndex++;
    }
    $txt.val(cmdHistory[cmdIndex]);
}

function cmdAutoComplete(cmd, $txt) {
    var txt = $txt.val();
    var tort = 'tortoise';
    if (tort.startsWith(txt)) {
            $txt.val(tort);
        } 
    else {
            var func = txt.split('.')[1];
            $.each(cmdArray, function(index, value) {
                if (value.startsWith(func)) {
                    $txt.val('tortoise.' + value);
                }
            }); 
        }
    }

    function evalInput(e) {
        $txt = $('#txtinput');
        cmd = $txt.val().split('\n')[0]; //parancs elso sora

        switch (e.which) {
        case 13:
            e.preventDefault();
            cmdEntered(cmd, $txt);
            break;
        case 38:
            cmdPrevious(cmd, $txt);
            break;
        case 40:
            cmdNext(cmd, $txt);
            break;

        case 9:
            e.preventDefault();
            cmdAutoComplete(cmd, $txt);
            break;
        default:
            break;
        }
    };

    window.onload = function () {
        $("#txtinput").keydown(function (e) {
            evalInput(e);
        });

        canvas = document.getElementById("tortoise");
        ctx = canvas.getContext("2d");
        ctx2 = document.getElementById("drawing").getContext("2d");
        init(canvas.width / 2, canvas.height / 2);
    };