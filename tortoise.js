var tortoise;
var canvas;
var ctx;
var ctxDrawing;

var cmdHistory = [];
var cmdIndex = 0;
var cmdFragment = '';
var cmdMatches = [];
var cmdArray = ['go()', 'turn()', 'tailDown()', 'tailUp()', 'dream()', 'look()', 'trip()'];

class Tortoise {
    constructor(x1, y1) {
        var x = x1;
        var y = y1;

        var degree = 0;
        var rad = 0;
        var distance = 0;

        var img = new Image();
        var width = 0;
        var height = 0;
        var isImageLoaded = false;
        img.src = "tortoise.png";
        img.addEventListener("load", () => {
            isImageLoaded = true;
            width = img.width;
            height = img.height;
        });

        var isDrawing = false;
        var isTripping = false;
        var color = "#000000";
        var hue = 0;

        this.go = function (dist) {
            if (!isNaN(dist)) {
                distance = dist;
            }
        };

        this.turn = function (deg) {
            if (!isNaN(deg)) {
                degree = deg;
            }
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

        this.dream = function (rgb) {
            if (isTripping) {
                isTripping = false;
            }
            color = `#${rgb}`;
        };

        this.look = function () {
            var data = ctxDrawing.getImageData(x, y, 1, 1).data;
            $("#look").css("background-color", `rgb(${data[0]}, ${data[1]}, ${data[2]})`);
        };

        this.trip = function () {
            isTripping = true;
        };

        this.draw = function () {
            move();
            rotate();
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(-rad);
            if (isImageLoaded) {
                ctx.drawImage(img, -(width / 2), -(height / 2));
            }
            ctx.restore();
            if (isTripping) {
                if (distance != 0) {
                    hue++;
                }
                ctxDrawing.fillStyle = `hsl(${hue}, 100%, 50%)`;
            }
            else {
                ctxDrawing.fillStyle = color;
            }
            if (isDrawing) {
                ctxDrawing.fillRect(x, y, 1, 1);
            }
        };

        function move() {
            if (distance != 0) {
                x -= Math.sin(rad);
                y -= Math.cos(rad);
                distance--;
            }
        }

        function rotate() {
            let degreeStep = degree > 0 ? 1 : -1;
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
    eval(`tortoise.${cmd}`);
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
    if (!cmd.startsWith(cmdFragment)){
        cmdMatches = [];
    }
        
    switch (cmdMatches.length) {
        case 0:
            cmdFragment = cmd;
            $.each(cmdArray, function (index, value) {
                if (value.startsWith(cmd)) {
                    cmdMatches.push(value);
                }
            });

        default:
            var fullCmd = cmdMatches.shift();
            $txt.val(fullCmd);
            $txt.setCursorPosition(fullCmd.length - 1);
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
            if(cmd != '') {
                cmdAutoComplete(cmd, $txt);
            }
            break;
    }
}


$.fn.setCursorPosition = function(pos) {
    this.each(function(index, elem) {
        if (elem.setSelectionRange) {
            elem.setSelectionRange(pos, pos);
        } else if (elem.createTextRange) {
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

function helpWindow() {
    $('#help').click(function(){
        $('#helpwin').show();
    });
    $(".close").click(function() {
        $('#helpwin').hide();
    });
}

window.onload = function() {
    $("#txtinput").keydown(function(e) {
        evalInput(e);
    });

    canvas = document.getElementById("tortoise");
    ctx = canvas.getContext("2d");
    ctxDrawing = document.getElementById("drawing").getContext("2d");
    init(canvas.width / 2, canvas.height / 2);
    helpWindow();
};