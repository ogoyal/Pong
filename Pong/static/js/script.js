const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");
let gamePaused = false;
let hitCounter = 0;
const MAX_SPEED = 7;

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 3,
    dx: 3,
    dy: 3,
    color: "white"
};

const userPaddle = {
    x: 0,
    y: canvas.height / 2 - 40,
    width: 10,
    height: 80,
    dy: 8,
    color: "blue"
};

const compPaddle = {
    x: canvas.width - 10,
    y: canvas.height / 2 - 40,
    width: 10,
    height: 80,
    dy: 8,
    color: "red"
};

let userScore = 0;
let compScore = 0;
const userScoreSpan = document.getElementById("userScore");
const compScoreSpan = document.getElementById("compScore");

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function togglePause() {
    gamePaused = !gamePaused;
    if (!gamePaused) {
        gameLoop();
    }
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function movePaddle(paddle, upKey, downKey) {
    document.addEventListener("keydown", function(event) {
        switch(event.keyCode) {
            case upKey:
                paddle.y = Math.max(0, paddle.y - paddle.dy); // Prevent paddle from moving above canvas
                break;
            case downKey:
                paddle.y = Math.min(canvas.height - paddle.height, paddle.y + paddle.dy); // Prevent paddle from moving below canvas
                break;
        }
    });
}

movePaddle(userPaddle, 38, 40); // ArrowUp and ArrowDown for user paddle

function update() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }

    // Ball collision with paddles
    if ((ball.x - ball.radius < userPaddle.x + userPaddle.width && ball.y + ball.radius > userPaddle.y && ball.y - ball.radius < userPaddle.y + userPaddle.height) ||
        (ball.x + ball.radius > compPaddle.x && ball.y + ball.radius > compPaddle.y && ball.y - ball.radius < compPaddle.y + compPaddle.height)) {
        ball.dx = -ball.dx;
        hitCounter++;
    }

    if (hitCounter >= 3) {  // Change 3 to any number of hits you prefer
        if (Math.abs(ball.dx) < MAX_SPEED) {
            ball.dx = (ball.dx > 0) ? ball.dx + 1 : ball.dx - 1;  // Increase speed in the x-direction
        }
        if (Math.abs(ball.dy) < MAX_SPEED) {
            ball.dy = (ball.dy > 0) ? ball.dy + 1 : ball.dy - 1;  // Increase speed in the y-direction
        }
        hitCounter = 0;  // Reset the hit counter
    }    

    // Computer paddle movement (Simple AI)
    compPaddle.y += (ball.y - (compPaddle.y + compPaddle.height / 2)) * 0.1;

    // Ensure computer paddle doesn't move out of canvas
    compPaddle.y = Math.max(0, Math.min(canvas.height - compPaddle.height, compPaddle.y));

    // Ball out of bounds
    if (ball.x + ball.radius > canvas.width) {
        // User scores a point
        userScore++;
        userScoreSpan.textContent = userScore;
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = -ball.dx;
    } else if (ball.x - ball.radius < 0) {
        // Computer scores a point
        compScore++;
        compScoreSpan.textContent = compScore;
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = -ball.dx;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRect(userPaddle.x, userPaddle.y, userPaddle.width, userPaddle.height, userPaddle.color);
    drawRect(compPaddle.x, compPaddle.y, compPaddle.width, compPaddle.height, compPaddle.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

function gameLoop() {
    if (!gamePaused) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

document.addEventListener("keydown", function(event) {
    if (event.keyCode === 32) { // Spacebar key
        togglePause();
    }
});

gameLoop();
