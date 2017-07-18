var touchThreshold = length / 4;
function whatKey(event) {
    if (player.step === 0) {
        player.step = 20;
        switch(event.keyCode) {
            case 37: player.direction = 3; if (player.x <= game.unit + 5) player.step = 0; break;//LEFT
            case 38: player.direction = 0; if (player.y <= game.unit + 5) player.step = 0; break;//UP
            case 39: player.direction = 1; if (player.x >= length - game.unit - 5) player.step = 0;  break;//RIGHT
            case 40: player.direction = 2; if (player.y >= length - game.unit - 5) player.step = 0; break;//DOWN
            default: player.step = 0; break;
        }
    }
}
var touchBegin={x:0,y:0};
function handleStart(evt) {
    evt.preventDefault();
    touchBegin.x=evt.changedTouches[0].pageX;
    touchBegin.y=evt.changedTouches[0].pageY;
    if (canvas.width - 100 < touchBegin.x && touchBegin.x < canvas.width  && 0 < touchBegin.y && touchBegin.y <  100 ) {
        game.pause ? gameContinue() : gamePause();
    }
}
function handleEnd(evt) {
    evt.preventDefault();
    if (player.step === 0) {
        player.step = 20;
        let diffX = evt.changedTouches[0].pageX - touchBegin.x;
        let diffY = evt.changedTouches[0].pageY - touchBegin.y;
        let direction = -1;
        if (diffX > touchThreshold && diffX > 1.25 * Math.abs(diffY))
            direction = 1;
        if (diffX < -touchThreshold && -diffX > 1.25 * Math.abs(diffY))
            direction = 3;
        if (diffY > touchThreshold && diffY > 1.25 * Math.abs(diffX))
            direction = 2;
        if (diffY < -touchThreshold && -diffY > 1.25 * Math.abs(diffX))
            direction = 0;
        switch(direction) {
            case 3: player.direction = 3; if (player.x <= game.unit + 5) player.step = 0; break;//LEFT
            case 0: player.direction = 0; if (player.y <= game.unit + 5) player.step = 0; break;//UP
            case 1: player.direction = 1; if (player.x >= length - game.unit - 5) player.step = 0;  break;//RIGHT
            case 2: player.direction = 2; if (player.y >= length - game.unit - 5) player.step = 0; break;//DOWN
            default: player.direction = -1; player.step = 0; break;
        }
    }
}
function handleCancel(evt) {
    evt.preventDefault();
    touchBegin.x = 0;
    touchBegin.y = 0;
}
function resize(){
    ctx.font="50px Georgia";
    ctx.translate(-marginLeft, -marginTop);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    length = canvas.width < canvas.height ? 0.5 * canvas.width : 0.5 * canvas.height;
    baseSpeed = length / 150;
    let ratio = length / 2 / game.n / game.unit;
    game.unit = length / 2 / game.n;
    marginLeft = (canvas.width - length) / 2;
    marginTop = (canvas.height - length) / 2;
    marginMin = marginLeft < marginTop ? marginLeft : marginTop;
    ctx.translate(marginLeft, marginTop);
    if (document.getElementById("game").style.display === "block") {
        player.x *= ratio;
        player.y *= ratio;
        bonus.x *= ratio;
        bonus.y *= ratio;
        for (let elem of balls) {
            elem.x *= ratio;
            elem.y *= ratio;
            elem.speed *= ratio;
        }
    }
    drawAll();
}