const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const grid = 15;
const paddleHeight = grid * 5;
const maxPaddleY = canvas.height - grid - paddleHeight;

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
    if (ball.dy > 0) {
        rightPaddle.dy = paddleSpeed;
    } else {
        rightPaddle.dy = -paddleSpeed;
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

function loop() {
    requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);

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
        resetBall();
    } else if (ball.x > canvas.width && !ball.resetting) {
        leftScore++;
        updateScore();
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