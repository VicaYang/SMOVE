var canvas = null;
var ctx = null;
var length = 0;
var marginLeft = 0;
var marginTop = 0;
var marginMin = 0;
var bgrColor =  {
    r: 128,
    g: 223,
    b: 255,
    color: "#80DFFF",
    colors:["#80DFFF","#50EFB0","#F3D0BF", "#D0AAFF","#80D0DF","#30FFBF"],
    index: 0,
    dr: 0,
    dg: 0,
    db: 0,
    textAlpha:0,
    alphaIncrease:true,
}
var game = {
    n: 0,
    unit: 0,
    baseSpeed: 0,
    score: 0,
    level: 0,
    gameLoop: 0,
    ballLoop: 0,
    pause: false,
    period:[5000,3500,3500,3500,6500]
}
var player = {
    x: 0,
    y: 0,
    step: 0,
    direction: -1,
}
var bonus = {
    x: 0,
    y: 0,
    deg: 0,
    draw: true,
}
function ball (x, y, speed, direction) {
    var b = new Object();
    b.x = x;
    b.y = y;
    b.speed = speed;
    b.direction = direction;
    return b;
}
var balls = new Array();


window.onload=function(){
    canvas = document.getElementById('background');
    ctx = canvas.getContext("2d");
    resize();
    canvas.addEventListener("touchstart", handleStart);
    canvas.addEventListener("touchend", handleEnd);
    canvas.addEventListener("touchcancel", handleCancel);
    window.addEventListener("resize", resize, false);
    window.addEventListener('keydown', whatKey, false);
}

function gameStart() {
    var ratios = document.getElementsByName("n");
    for (let i = 0, end = ratios.length; i < end; ++i) {
        if (ratios[i].checked) {
            game.n = +ratios[i].value;
            break;
        }
    }
    game.unit = length / 2 / game.n;
    baseSpeed = length / 150;
    if (game.n % 2) {
        bonus.x = bonus.y = game.n * game.unit;
        player.x = player.y = (game.n + 2) * game.unit;
    } else {
        bonus.x = bonus.y = (game.n - 1) * game.unit;
        player.x = player.y = (game.n + 1) * game.unit;
    }
    player.step = 0;
    player.direction = -1;
    document.getElementById("begin").style.display="none";
    document.getElementById("game").style.display="block";
    ctx.fillStyle = bgrColor.color; 
    ctx.textAlign='center';
    ctx.font="50px Georgia";
    drawBackground();
    drawGrid();
    drawPlayer();
    doBallLoop();
    game.gameLoop = setInterval(doGameLoop, 10);
    game.ballLoop = setInterval(doBallLoop, game.period[game.level] / Math.sqrt(game.n));

}
function gameOver() {
    ctx.clearRect(-marginLeft, -marginTop, canvas.width, canvas.height);
    document.getElementById("game").style.display="none";
    document.getElementById("over").style.display="block";
    document.getElementById("score").innerHTML="Your score is " + game.score;
    game.score = 0;
    game.level = 0;
    balls.splice(0, balls.length);
}
function gameRestart() {
    document.getElementById("over").style.display="none";
    document.getElementById("begin").style.display="block";
}
function gamePause() {
    game.pause = true;
    clearInterval(game.gameLoop);
    clearInterval(game.ballLoop);
    ctx.fillStyle="#FFFFFF";
    ctx.fillText("PAUSED", canvas.width / 2 -  marginLeft, canvas.height / 2  - marginTop);
}
function gameContinue(){
    game.pause = false;
    game.gameLoop = setInterval(doGameLoop, 10);
    drawBackground();
    if (game.level > 4)
        game.ballLoop = setInterval(doBallLoop, 1500 / Math.sqrt(game.n))
    else
        game.ballLoop = setInterval(doBallLoop, game.period[game.level] / Math.sqrt(game.n))
}

function doGameLoop() {
    bonus.deg += 0.01;
    if (bonus.draw) {
        drawBonus();
    } else {
        changeColor();
        drawBackground();
    }
    drawGrid();
    drawBall();  
    drawPlayer();
    check();
}

function check(){
    for (let elem of balls) {
        if ((player.x - elem.x)*(player.x - elem.x)+(player.y - elem.y)*(player.y - elem.y) < 1.21 * game.unit * game.unit) {
            clearInterval(game.gameLoop);
            clearInterval(game.ballLoop);
            gameOver();
            break;
        }
    }
    if (Math.abs(player.x-bonus.x)+Math.abs(player.y-bonus.y)<10) {
        generateBonus();
        game.score++;
        ctx.fillStyle = bgrColor.color;
        ctx.fillRect(-marginMin, -marginMin, marginMin, marginMin);
        ctx.fillStyle="#FFFFFF";   
        ctx.font="50px Georgia";
        ctx.fillText(game.score,-marginMin * 0.5,-marginMin * 0.5);    
        if (game.score % 10 === 0) {
            bonus.draw = false;
            game.level++;
            bgrColor.index = (bgrColor.index + 1) % bgrColor.colors.length;
            bgrColor.dr = (parseInt(bgrColor.colors[bgrColor.index].substr(1,2), 16) - bgrColor.r) / 250;
            bgrColor.dg = (parseInt(bgrColor.colors[bgrColor.index].substr(3,2), 16) - bgrColor.g) / 250;
            bgrColor.db = (parseInt(bgrColor.colors[bgrColor.index].substr(5,2), 16) - bgrColor.b) / 250;
            clearInterval(game.ballLoop);
            setTimeout(nextLevel, 2500);
        }
        ctx.fillStyle = "#FFFFFF";

    }
}

function generateBall(loc, direction, speed, offset){
    switch(direction) {
        case 0: balls.push(ball((2 * loc +  1) * game.unit, length + marginTop + offset, speed, direction));break;
        case 1: balls.push(ball(-marginMin - offset, (2 * loc +  1) * game.unit, speed, direction));break;
        case 2: balls.push(ball((2 * loc +  1) * game.unit, -marginTop - offset, speed, direction));break;
        case 3: balls.push(ball(length + marginMin + offset, (2 * loc +  1) * game.unit, speed, direction));break;
    }
}
function doBallLoop() {
    let loc = Math.floor(Math.random() * game.n);
    let direction = Math.floor(Math.random() * 4);
    switch(game.level) {
        case 0: 
            generateBall(loc, direction, baseSpeed, 0);
            break;
        case 1:
            generateBall(loc, direction, baseSpeed, 0);
            generateBall((game.n - 1 - loc), (direction + 2) % 4, baseSpeed, 0);
            break;
        case 2:
            generateBall(loc, direction, baseSpeed, 0);
            generateBall((loc + 1) % game.n, direction, baseSpeed * 1.3, 4 * game.unit);
            break;
        case 3:
            generateBall(loc, direction, baseSpeed * 1.3, 0);
            generateBall((loc + 1) % game.n, direction, baseSpeed * 1.3, 0);
            break;
        case 4:
            if (loc > game.n - 3) loc = game.n - 3;
            generateBall(loc, direction, baseSpeed, 0);
            generateBall(loc + 1, direction, baseSpeed, 2 * game.unit);
            generateBall(loc, direction, baseSpeed, 4 * game.unit);
            generateBall(loc + 2, direction, baseSpeed, 6 * game.unit);
            generateBall(loc + 1, direction, baseSpeed, 8 * game.unit);
            generateBall(loc + 2 % game.n, direction, baseSpeed, 10 * game.unit);
            break;
        default:
            generateBall(loc, direction, 1.6 * baseSpeed, 0);
            break;
    }
}
function generateBonus() {
    let x = (Math.floor(Math.random() * game.n) * 2 + 1) * game.unit;
    let y = (Math.floor(Math.random() * game.n) * 2 + 1) * game.unit;
    if (Math.abs(x - bonus.x) < 10) {
        bonus.x = Math.abs(x + game.unit -  length) < 10 ? game.unit : x + 2 * game.unit;
    } else {
        bonus.x = x;
    }
    if (Math.abs(y - bonus.y) < 10) {
        bonus.y = Math.abs(y + game.unit -  length) < 10 ? game.unit : y + 2 * game.unit;
    } else {
        bonus.y = y;
    }
}
function nextLevel(){
    bonus.draw = true;
    bgrColor.alphaIncrease = true;
    doBallLoop();
    if (game.level > 4)
        game.ballLoop = setInterval(doBallLoop, 1500 / Math.sqrt(game.n))
    else
        game.ballLoop = setInterval(doBallLoop, game.period[game.level] / Math.sqrt(game.n))
}
