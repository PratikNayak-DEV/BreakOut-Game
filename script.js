const ruleBtn = document.getElementById('rules-btn');
const rules = document.getElementById('rules');
const closeBtn = document.getElementById('close-btn');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let score = 0;

const brickRowCount = 9;
const brickColumnCount =5;
const delay =500;

//create ball props
const ball= {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 4,
    dx: 4,
    dy: -4,
    visible: true
};

//create paddle props
const paddle = {
    x:canvas.width/2 - 40,
    y:canvas.height -20,
    w:80,
    h:10,
    speed:10,
    dx:0,
    visible:true
};

//create bricks props
const brickInfo = {
    w:70,
    h:20,
    padding:10,
    offsetX:45,
    offsetY:60,
    visible:true
};

//Create Bricks
const bricks =[];
for(let i =0;i<brickRowCount;i++){
    bricks[i] = [];
    for(let j=0;j< brickColumnCount;j++){
        const x = i* (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
        const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY; 
        bricks[i][j] = {x,y,...brickInfo}
    }
}

//draw ball on canvas
function drawBall(){
    ctx.beginPath();
    ctx.arc(ball.x,ball.y,ball.size,0,Math.PI *2);
    ctx.fillStyle = ball.visible ? '#0095dd' : 'transparent';
    ctx.fill();
    ctx.closePath();
}

//draw paddle on canvas
function drawPaddle(){
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = paddle.visible ? '#0095dd' : 'transparent';
  ctx.fill();
  ctx.closePath();
}

//Draw score on canvas
function drawScore(){
    ctx.font = '20px Arial';
    ctx.fillText(`Score : ${score}`,canvas.width - 100,30);
}

//Draw bricks on canvas
function drawBricks(){
    bricks.forEach(column => {
        column.forEach(brick =>{
            ctx.beginPath();
            ctx.rect(brick.x,brick.y,brick.w,brick.h);
            ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
            ctx.fill();
            ctx.closePath();
        });
    });
}

//Move paddle on canvas
function movePaddle(){
    paddle.x += paddle.dx;

    //wall detection
    if(paddle.x + paddle.w > canvas.width){
        paddle.x = canvas.width - paddle.w;
    }
    if(paddle.x < 0){
        paddle.x = 0;
    }
}

//move ball on canvas
function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;

    //Wall colision (r/l)
    if(ball.x + ball.size > canvas.width || ball.x - ball.size < 0){
        ball.dx *= -1;
    }

    //Wall colision (t/b)
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
        ball.dy *= -1;
      }
    

      //paddle colision
      if(
        ball.x - ball.size > paddle.x &&
        ball.x + ball.size < paddle.x + paddle.w &&
        ball.y + ball.size > paddle.y
      ){
        ball.dy = -ball.speed;
      }

    //Brick collision
    bricks.forEach(column =>{
        column.forEach(brick => {
            if(brick.visible){
                if(
                    ball.x - ball.size > brick.x && // left brick side check
                    ball.x + ball.size < brick.x + brick.w && // right brick side check
                    ball.y + ball.size > brick.y && // top brick side check
                    ball.y - ball.size < brick.y + brick.h // bottom brick side check  
                ){
                    ball.dy *= -1;
                    brick.visible = false;

                    increaseScore();
                }
            }
        });
    });

    //Hit bottom wall - Lose
    if(ball.y + ball.size > canvas.height){
        showAllBricks();
        score = 0;
    }

}

//Increase score

function increaseScore(){
    score ++;

    if(score % (brickRowCount * brickColumnCount) === 0){
        ball.visible = false;
        paddle.visible = false;
        
        //After 0.5 sec restart the game
        setTimeout(function (){
            showAllBricks();
            score = 0;
            paddle.x = canvas.width / 2 - 40;
            paddle.y = canvas.height - 20;
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
            ball.visible = true;
            paddle.visible = true;
        },delay)
    }
}

//Make all brick appear
function showAllBricks(){
    bricks.forEach(column => {
        column.forEach(brick => (brick.visible = true));
    });
}

//Draw everything
function draw(){
    //clear canvas
    ctx.clearRect(0,0,canvas.width,canvas.height);

    drawBall();
    drawPaddle();
    drawScore();
    drawBricks();
}

//update canvs
function update(){
    movePaddle();
    moveBall();

    //Draw everything 
    draw();
    requestAnimationFrame(update);
}

update();

//keydown event

function keyUp(e){
    if(
        e.key === 'Right' ||
        e.key === 'ArrowRight' ||
        e.key === 'Left' ||
        e.key === 'ArrowLeft'
    ){
        paddle.dx = 0;
    }
}

function keyDown(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      paddle.dx = paddle.speed;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      paddle.dx = -paddle.speed;
    }
  }
  

//Keyboard event handlers
document.addEventListener('keydown',keyDown);
document.addEventListener('keyup',keyUp);

//Rules and close even handlers
ruleBtn.addEventListener('click',() => rules.classList.add('show'));
closeBtn.addEventListener('click',() => rules.classList.remove('show'));