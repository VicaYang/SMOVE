var canvas = null;
var ctx = null;
var length = 0;
var marginLeft = 0;
var marginTop = 0;
var marginMin = 0;
var n = 0;
var unit = 0;
var score = 0;
var gameLoop = 0;
var ballLoop = 0;
var level = 0;
var baseSpeed = 0;
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
var bonus = {
    x: 0,
    y: 0,
    deg: 0,
    draw: true,
}
var player = {
    x: 0,
    y: 0,
    step: 0,
    direction: -1,
}
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
            n = +ratios[i].value;
            break;
        }
    }
    unit = length / 2 / n;
    baseSpeed = length / 150;
    if (n % 2) {
        bonus.x = bonus.y = n * unit;
        player.x = player.y = (n + 2) * unit;
    } else {
        bonus.x = bonus.y = (n - 1) * unit;
        player.x = player.y = (n + 1) * unit;
    }
    player.step = 0;
    player.direction = -1;
    document.getElementById("begin").style.display="none";
    document.getElementById("game").style.display="block";
    ctx.fillStyle = bgrColor.color; 
    ctx.fillRect(-marginLeft, -marginTop, canvas.width, canvas.height);
    drawGrid();
    drawPlayer();
    doBallLoop();
    gameLoop = setInterval(doGameLoop, 10);
    ballLoop = setInterval(doBallLoop, 5000/n);

}
function gameOver() {
    ctx.clearRect(-marginLeft, -marginTop, canvas.width, canvas.height);
    document.getElementById("game").style.display="none";
    document.getElementById("over").style.display="block";
    document.getElementById("score").innerHTML="Your score is " + score;
    score = 0;
    level = 0;
    balls.splice(0, balls.length);
}
function gameRestart() {
    document.getElementById("over").style.display="none";
    document.getElementById("begin").style.display="block";
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

function doGameLoop() {
    bonus.deg += 0.01;
    if (bonus.draw) {
        drawBonus();
    } else {
        changeColor();
        drawLevelUp();
    }
    drawGrid();
    drawBall();  
    drawPlayer();
    check();
}

function check(){
    for (let elem of balls) {
        if ((player.x - elem.x)*(player.x - elem.x)+(player.y - elem.y)*(player.y - elem.y) < 1.21 * unit * unit) {
            clearInterval(gameLoop);
            clearInterval(ballLoop);
            gameOver();
            break;
        }
    }
    if (Math.abs(player.x-bonus.x)+Math.abs(player.y-bonus.y)<10) {
        generateBonus();
        score++;
        ctx.fillStyle = bgrColor.color;
        ctx.fillRect(-marginMin, -marginMin, marginMin, marginMin);
        ctx.fillStyle="#FFFFFF";   
        ctx.font="50px Georgia";
        ctx.fillText(score,-marginMin * 0.8,-marginMin * 0.5);    
        if (score % 10 === 0) {
            bonus.draw = false;
            level++;
            bgrColor.index = (bgrColor.index + 1) % bgrColor.colors.length;
            bgrColor.dr = (parseInt(bgrColor.colors[bgrColor.index].substr(1,2), 16) - bgrColor.r) / 250;
            bgrColor.dg = (parseInt(bgrColor.colors[bgrColor.index].substr(3,2), 16) - bgrColor.g) / 250;
            bgrColor.db = (parseInt(bgrColor.colors[bgrColor.index].substr(5,2), 16) - bgrColor.b) / 250;
            clearInterval(ballLoop);
            setTimeout(nextLevel, 2500);
        }
        ctx.fillStyle = "#FFFFFF";

    }
}

function generateBall(loc, direction, speed, offset){
    switch(direction) {
        case 0: balls.push(ball((2 * loc +  1) * unit, length + marginTop + offset, speed, direction));break;
        case 1: balls.push(ball(-marginMin - offset, (2 * loc +  1) * unit, speed, direction));break;
        case 2: balls.push(ball((2 * loc +  1) * unit, -marginTop - offset, speed, direction));break;
        case 3: balls.push(ball(length + marginMin + offset, (2 * loc +  1) * unit, speed, direction));break;
    }
}
function doBallLoop() {
    let loc = Math.floor(Math.random() * n);
    let direction = Math.floor(Math.random() * 4);
    switch(level) {
        case 0: 
            generateBall(loc, direction, baseSpeed, 0);
            break;
        case 1:
            generateBall(loc, direction, baseSpeed, 0);
            generateBall((n - 1 - loc), (direction + 2) % 4, baseSpeed, 0);
            break;
        case 2:
            generateBall(loc, direction, baseSpeed, 0);
            generateBall((loc + 1) % n, direction, baseSpeed * 1.3, 4 * unit);
            break;
        case 3:
            generateBall(loc, direction, baseSpeed * 1.3, 0);
            generateBall((loc + 1) % n, direction, baseSpeed * 1.3, 0);
            break;
        case 4:
            if (loc > n - 3) loc = n - 3;
            generateBall(loc, direction, baseSpeed, 0);
            generateBall(loc + 1, direction, baseSpeed, 2 * unit);
            generateBall(loc, direction, baseSpeed, 4 * unit);
            generateBall(loc + 2, direction, baseSpeed, 6 * unit);
            generateBall(loc + 1, direction, baseSpeed, 8 * unit);
            generateBall(loc + 2 % n, direction, baseSpeed, 10 * unit);
            break;
        default:
            generateBall(loc, direction, 1.6 * baseSpeed, 0);
            break;
    }
}
function generateBonus() {
    let x = (Math.floor(Math.random() * n) * 2 + 1) * unit;
    let y = (Math.floor(Math.random() * n) * 2 + 1) * unit;
    if (Math.abs(x - bonus.x) < 10) {
        bonus.x = Math.abs(x + unit -  length) < 10 ? unit : x + 2 * unit;
    } else {
        bonus.x = x;
    }
    if (Math.abs(y - bonus.y) < 10) {
        bonus.y = Math.abs(y + unit -  length) < 10 ? unit : y + 2 * unit;
    } else {
        bonus.y = y;
    }
}
function nextLevel(){
    bonus.draw = true;
    switch(level){
        case 1: doBallLoop();ballLoop = setInterval(doBallLoop, 3500 / Math.sqrt(n));break;
        case 2: doBallLoop();ballLoop = setInterval(doBallLoop, 3500 / Math.sqrt(n));break;
        case 3:doBallLoop();ballLoop = setInterval(doBallLoop, 3500 / Math.sqrt(n));break;
        case 4:doBallLoop();ballLoop = setInterval(doBallLoop, 6000 / Math.sqrt(n));break;
        default:doBallLoop();ballLoop = setInterval(doBallLoop, 1500 / Math.sqrt(n));break;
    }
}
