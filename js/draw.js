function drawGrid() {
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = "#FFFFFF";
    let width = 2 * game.unit;
    let space = game.unit / 5;
    ctx.beginPath();
    for (let loc = width; loc < length  ; loc += width) {
        ctx.moveTo(loc, space);ctx.lineTo(loc,length-space);
        ctx.moveTo(space, loc);ctx.lineTo(length-space,loc);
    }
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = 3.0;
    ctx.moveTo(game.unit, 0);
    ctx.lineTo(length-game.unit, 0);ctx.arc(length-game.unit,game.unit,game.unit,1.5*Math.PI,2*Math.PI);
    ctx.lineTo(length, length-game.unit);ctx.arc(length-game.unit,length-game.unit,game.unit,0,0.5*Math.PI);
    ctx.lineTo(game.unit, length);ctx.arc(game.unit,length-game.unit,game.unit,0.5*Math.PI,1*Math.PI);
    ctx.lineTo(0,game.unit);ctx.arc(game.unit,game.unit,game.unit,1*Math.PI,1.5*Math.PI);
    ctx.stroke();
}
function drawCircle(ctx, x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.fillStyle = color;
    ctx.fill();
}
function drawPlayer() {
    if (player.step !== 0) {
        player.step--;
        drawCircle(ctx, player.x, player.y, game.unit * 0.5 + 2, bgrColor.color);
        switch(player.direction) {
            case 0: player.y -= game.unit / 10; break;
            case 1: player.x += game.unit / 10; break;
            case 2: player.y += game.unit / 10; break;
            case 3: player.x -= game.unit / 10; break;
            default: break;
        }
    }
    drawCircle(ctx, player.x, player.y, game.unit * 0.5, "#FFFFFF");
}
function drawBonus() {
    let dx = game.unit / 3 * Math.cos(bonus.deg);
    let dy = game.unit / 3 * Math.sin(bonus.deg);
    drawCircle(ctx, bonus.x, bonus.y, game.unit / 3 + 2, bgrColor.color);
    ctx.fillStyle = (game.score % 10 === 9) ? '#E9F335' : '#3163F5';
    ctx.beginPath();
    ctx.moveTo(bonus.x + dx, bonus.y + dy);
    ctx.lineTo(bonus.x - dy, bonus.y + dx);
    ctx.lineTo(bonus.x - dx, bonus.y - dy);
    ctx.lineTo(bonus.x + dy, bonus.y - dx);
    ctx.closePath();
    ctx.fill();
}
function drawBall(draw) {
    let remove = new Array();
    for (let i = 0, len = balls.length; i < len; ++i) {
        drawCircle(ctx, balls[i].x, balls[i].y, game.unit * 0.6 + 2, bgrColor.color);
        drawSmallBall(balls[i], false);
        switch(balls[i].direction) {
            case 0: balls[i].y -= balls[i].speed; if (balls[i].y < -marginTop - 5 * game.unit) remove.push(i); break;
            case 1: balls[i].x += balls[i].speed; if (balls[i].x > canvas.width - marginLeft + 5 * game.unit) remove.push(i); break;
            case 2: balls[i].y += balls[i].speed; if (balls[i].y > canvas.height - marginTop + 5 * game.unit) remove.push(i); break;
            case 3: balls[i].x -= balls[i].speed; if (balls[i].x < -marginTop - 5 * game.unit) remove.push(i); break;
        }
        drawSmallBall(balls[i], true);
        drawCircle(ctx, balls[i].x, balls[i].y, game.unit * 0.6, "#000000");
    }
    for (let i = remove.length - 1; i >= 0; --i) {
        drawCircle(ctx, balls[i].x, balls[i].y, game.unit * 0.6 + 2, bgrColor.color);
        drawSmallBall(balls[i], false);
        balls.splice(i, 1);
    }
}
function drawSmallBall(ball, draw) {
    let stepX = 0;
    let stepY = 0;
    switch(ball.direction) {
        case 0: stepY = game.unit / 2.5; break;
        case 1: stepX = -game.unit / 2.5; break;
        case 2: stepY = -game.unit / 2.5; break;
        case 3: stepX = game.unit / 2.5; break;
    }
    let r = draw ? game.unit / 7 : game.unit / 7 + 2;
    if (draw) {
        for (let i = 3; i < 8; ++i) {
            drawCircle(ctx, ball.x + i * stepX, ball.y + i * stepY, r , "rgba(255,255,255," + (9-i)/9 + ")");
        }
    } else {
        for (let i = 3; i < 8; ++i) {
            drawCircle(ctx, ball.x + i * stepX, ball.y + i * stepY, r , bgrColor.color);
        }
    }
}
function drawBackground(){
    ctx.fillStyle = bgrColor.color; 
    ctx.fillRect(-marginLeft, -marginTop, canvas.width, canvas.height);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(canvas.width-marginLeft - 20, -marginTop + 30, 5, 20);
    ctx.fillRect(canvas.width-marginLeft - 30, -marginTop + 30, 5, 20);
    ctx.font="50px Georgia";
    ctx.fillText(game.score,-marginMin * 0.5, -marginMin * 0.5);
    ctx.fillStyle = "rgba(255,255,255," + bgrColor.textAlpha + ")";
    ctx.fillText("Level " + game.level, canvas.width / 2 - marginLeft, -marginMin * 0.5);
    
}
function changeColor(){
    bgrColor.r += bgrColor.dr;
    bgrColor.g += bgrColor.dg;
    bgrColor.b += bgrColor.db;
    let r = Math.floor(bgrColor.r);
    let g = Math.floor(bgrColor.g);
    let b = Math.floor(bgrColor.b);
    bgrColor.color = '#' + (0x1000000 + 0x10000 * r + 0x100 * g + b).toString(16).substr(1);
    if (bgrColor.alphaIncrease) {
        bgrColor.textAlpha += 0.01;
        if (Math.abs(bgrColor.textAlpha - 1) < 0.01) {
            bgrColor.alphaIncrease=false;
        }
    } else {
        if (Math.abs(bgrColor.textAlpha) > 0.01)
            bgrColor.textAlpha -= 0.01;
        else
            bgrColor.textAlpha = 0;
    }
}
function drawAll(){
    drawBackground();
    if (game.pause) {
        ctx.fillStyle="#FFFFFF";
        ctx.textAlign='center';
        ctx.fillText("PAUSED", canvas.width / 2 -  marginLeft, canvas.height / 2  - marginTop);
    }
    if (bonus.draw) 
        drawBonus();   
    drawGrid();
    drawBall();
    drawPlayer();
}
