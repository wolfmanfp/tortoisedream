var tortoise;
var canvas;
var ctx;
var ctx2;
var cmdHistory = [];
var cmdIndex = 0;
var cmdFragment = '';
var cmdMatches = [];
var cmdArray = ['go()', 'turn()', 'trip()', 'tailDown()', 'tailUp()', 'dream()'];

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

    this.go = function(dist) {
        if (!isNaN(dist)) {
            distance = dist;
        }
    };

    this.turn = function(deg) {
        if (!isNaN(deg)) {
            degree = deg;
        }
    };

    this.tailUp = function() {
        if (isDrawing) {
            isDrawing = false;
        }
    };

    this.tailDown = function() {
        if (!isDrawing) {
            isDrawing = true;
        }
    };

    this.dream = function(rgb) {
        ctx2.fillStyle= "#"+rgb;
    };

    this.look = function() {
        var data = ctx2.getImageData(x, y, 1, 1).data;
        $("#look").css("background-color",
            "rgb("+data[0]+","+data[1]+","+data[2]+")");
    };

    this.trip = function() {
        //TODO
    };

    this.draw = function() {
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

function cmdArchive(cmd) {
    cmdHistory.push(cmd);
    cmdIndex = cmdHistory.length;
}

function cmdEntered(cmd, $txt) {
    eval('tortoise.' + cmd);
    cmdArchive(cmd);
    $txt.val('');
}

function cmdPrevious($txt) {
    if (cmdIndex > 0) {
        cmdIndex--;
    }
    $txt.val(cmdHistory[cmdIndex]);
}

function cmdNext($txt) {
    if (cmdIndex < cmdHistory.length - 1) {
        cmdIndex++;
    }
    $txt.val(cmdHistory[cmdIndex]);
}

function cmdAutoComplete(cmd, $txt) {
    console.log(cmd + " = "+ cmdFragment);
    if (!cmd.startsWith(cmdFragment)){
        cmdFragment = cmd;
        cmdMatches = [];
    }
        
    switch (cmdMatches.length) {
    case 0:
        $.each(cmdArray, function (index, value) {
            if (value.startsWith(cmd)) {
                cmdMatches.push(value);
            }
        });

    default:
        var fullCmd = cmdMatches.shift();
        $txt.val(fullCmd);
        $txt.setCursorPosition(fullCmd.length-1);
        break;
    }
}

function evalInput(e) {
    $txt = $('#txtinput');
    cmd = $txt.val();

    switch (e.which) {
        //enter
        case 13:
            e.preventDefault();
            cmdEntered(cmd, $txt);
            break;

        //arrow up
        case 38:
            cmdPrevious($txt);
            break;

        //arrow down
        case 40:
            cmdNext($txt);
            break;

        //tab
        case 9:
            e.preventDefault();
            if(cmd != '' ) {
                cmdAutoComplete(cmd, $txt);
            }
            break;
    }
}

$.fn.setCursorPosition = function(pos) {
    this.each(function(index, elem) {
        if (elem.setSelectionRange) {
            elem.setSelectionRange(pos, pos);
        }
        else if (elem.createTextRange) {
            var range = elem.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    });
    return this;
};

function init(x, y) {
    tortoise = new Tortoise(x, y);
    setInterval(repaint, 16);
}

function repaint() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tortoise.draw();
}

window.onload = function() {
    $("#txtinput").keyup(function (e) {
        evalInput(e);
    });

    canvas = document.getElementById("tortoise");
    ctx = canvas.getContext("2d");
    ctx2 = document.getElementById("drawing").getContext("2d");
    init(canvas.width / 2, canvas.height / 2);
};