const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const grid = 15;
const paddleHeight = grid * 5;
const maxPaddleY = canvas.height - grid - paddleHeight;
const maxScore = 10;
let isPaused = false;
var paddleSpeed = 6;
var ballSpeed = 5;

const leftPaddle = {
    x: grid * 2,
    y: canvas.height / 2 - paddleHeight / 2,
    width: grid,
    height: paddleHeight,
    dy: 0
};

const rightPaddle = {
    x: canvas.width - grid * 3,
    y: canvas.height / 2 - paddleHeight / 2,
    width: grid,
    height: paddleHeight,
    dy: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: grid,
    height: grid,
    resetting: false,
    dx: ballSpeed,
    dy: -ballSpeed
};

function moveAIPaddle() {
    const paddleCenter = rightPaddle.y + paddleHeight / 2;
    if (paddleCenter < ball.y - grid) {
        rightPaddle.dy = paddleSpeed;
    } else if (paddleCenter > ball.y + grid) {
        rightPaddle.dy = -paddleSpeed;
    } else {
        rightPaddle.dy = 0;
    }
}

function checkGameOver() {
    if (leftScore >= maxScore || rightScore >= maxScore) {
        alert(`${leftScore >= maxScore ? 'Player 1' : 'Player 2'} wins!`);
        leftScore = 0;
        rightScore = 0;
        updateScore();
    }
}

let leftScore = 0;
let rightScore = 0;

function updateScore() {
    document.getElementById('leftScore').textContent = leftScore;
    document.getElementById('rightScore').textContent = rightScore;
}

function collides(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y;
}

let lastFrameTime = Date.now();
let fpsDisplay = document.createElement('div');
fpsDisplay.style.position = 'absolute';
fpsDisplay.style.color = 'white';
fpsDisplay.style.top = '60px';
fpsDisplay.style.left = '20px';
document.body.appendChild(fpsDisplay);

function updateFPS() {
    let now = Date.now();
    let delta = (now - lastFrameTime) / 1000;
    lastFrameTime = now;
    let fps = Math.round(1 / delta);
    fpsDisplay.textContent = `FPS: ${fps}`;
}

const powerUp = {
    x: Math.random() * (canvas.width - grid),
    y: Math.random() * (canvas.height - grid),
    width: grid,
    height: grid,
    active: true
};

function drawPowerUp() {
    if (powerUp.active) {
        context.fillStyle = 'red';
        context.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
    }
}

function checkPowerUpCollision() {
    if (collides(ball, powerUp)) {
        powerUp.active = false;
        ball.dx *= 1.5;
        ball.dy *= 1.5;
        setTimeout(() => {
            powerUp.x = Math.random() * (canvas.width - grid);
            powerUp.y = Math.random() * (canvas.height - grid);
            powerUp.active = true;
        }, 5000);
    }
}

let difficulty = 'easy';

function setDifficulty(level) {
    difficulty = level;
    if (level === 'easy') {
        ballSpeed = 3;
        paddleSpeed = 4;
    } else if (level === 'medium') {
        ballSpeed = 5;
        paddleSpeed = 6;
    } else if (level === 'hard') {
        ballSpeed = 7;
        paddleSpeed = 8;
    }
    ball.dx = ballSpeed;
    ball.dy = -ballSpeed;
}

function movePaddle(paddle) {
    paddle.y += paddle.dy;
    if (paddle.y < grid) {
        paddle.y = grid;
    } else if (paddle.y > maxPaddleY) {
        paddle.y = maxPaddleY;
    }
}

const trailColor = 'rgba(255, 255, 255, 0.5)';
const maxTrailLength = 30;
const trailSegmentSize = 5;
let trail = [];

function updateTrail() {
    trail.unshift({
        x: ball.x,
        y: ball.y
    });

    if (trail.length > maxTrailLength) {
        trail.pop();
    }
}

function drawTrail() {
    for (let i = 0; i < trail.length; i++) {
        let alpha = 1.0 - (i / maxTrailLength);
        context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        let segment = trail[i];
        context.fillRect(segment.x, segment.y, trailSegmentSize, trailSegmentSize);
    }
}

function loop() {
    if (isPaused) {
        requestAnimationFrame(loop);
        return;
    }

    requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);

    updateFPS();
    drawPowerUp();
    updateTrail();

    movePaddle(leftPaddle);
    moveAIPaddle();

    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;

    if (leftPaddle.y < grid) {
        leftPaddle.y = grid;
    } else if (leftPaddle.y > maxPaddleY) {
        leftPaddle.y = maxPaddleY;
    }

    if (rightPaddle.y < grid) {
        rightPaddle.y = grid;
    } else if (rightPaddle.y > maxPaddleY) {
        rightPaddle.y = maxPaddleY;
    }

    drawTrail();

    context.fillStyle = 'white';
    context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y < grid) {
        ball.y = grid;
        ball.dy *= -1;
    } else if (ball.y + grid > canvas.height - grid) {
        ball.y = canvas.height - grid * 2;
        ball.dy *= -1;
    }

    if (ball.x < 0 && !ball.resetting) {
        rightScore++;
        updateScore();
        checkGameOver();
        resetBall();
    } else if (ball.x > canvas.width && !ball.resetting) {
        leftScore++;
        updateScore();
        checkGameOver();
        resetBall();
    }

    if (collides(ball, leftPaddle)) {
        ball.dx *= -1;
        ball.x = leftPaddle.x + leftPaddle.width;
    } else if (collides(ball, rightPaddle)) {
        ball.dx *= -1;
        ball.x = rightPaddle.x - ball.width;
    }

    if (collides(ball, leftPaddle) || collides(ball, rightPaddle)) {
        ball.dx *= -1;
        ball.dx *= 1.05;
        ball.dy *= 1.05;
    }

    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    context.fillStyle = 'lightgrey';
    context.fillRect(0, 0, canvas.width, grid);
    context.fillRect(0, canvas.height - grid, canvas.width, canvas.height);

    for (let i = grid; i < canvas.height - grid; i += grid * 2) {
        context.fillRect(canvas.width / 2 - grid / 2, i, grid, grid);
    }

    checkPowerUpCollision();
}

function resetBall() {
    ball.resetting = true;

    setTimeout(() => {
        ball.resetting = false;
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
        ball.dy = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
    }, 400);
}

document.addEventListener('keydown', function (e) {
    if (e.key === '1') {
        setDifficulty('easy');
    } else if (e.key === '2') {
        setDifficulty('medium');
    } else if (e.key === '3') {
        setDifficulty('hard');
    }

    if (e.key === 'p') {
        isPaused = !isPaused;
    }

    if (e.which === 38) {
        leftPaddle.dy = -paddleSpeed;
    } else if (e.which === 40) {
        leftPaddle.dy = paddleSpeed;
    }

    if (e.which === 87) {
        rightPaddle.dy = -paddleSpeed;
    } else if (e.which === 83) {
        rightPaddle.dy = paddleSpeed;
    }
});

document.addEventListener('keyup', function (e) {
    if (e.which === 38 || e.which === 40) {
        leftPaddle.dy = 0;
    }

    if (e.which === 83 || e.which === 87) {
        rightPaddle.dy = 0;
    }
});

requestAnimationFrame(loop);