var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var scoreElement = document.getElementById('score');
var highScoreElement = document.getElementById('high-score');
var gameOverElement = document.getElementById('game-over');
var mobileControls = document.getElementById('mobile-controls');
var eatSound = document.getElementById('eat-sound');
var gameOverSound = document.getElementById('game-over-sound');

var grid = 16;
var count = 0;
var score = 0;
var highScore = localStorage.getItem('highScore') || 0;
var speed = 4;
var isPaused = false;
var isGameOver = false;

highScoreElement.textContent = 'High Score: ' + highScore;

var snake = {
    x: 160,
    y: 160,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 4
};

var apple = {
    x: 320,
    y: 320
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function resetGame() {
    score = 0;
    speed = 4;
    snake.x = 160;
    snake.y = 160;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid;
    snake.dy = 0;
    apple.x = getRandomInt(0, 25) * grid;
    apple.y = getRandomInt(0, 25) * grid;
    scoreElement.textContent = 'Score: ' + score;
    gameOverElement.style.display = 'none';
    isGameOver = false;
}

function gameOver() {
    gameOverElement.style.display = 'block';
    gameOverSound.play();
    isGameOver = true;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreElement.textContent = 'High Score: ' + highScore;
    }
}

function togglePause() {
    if (isGameOver) return;
    isPaused = !isPaused;
    if (isPaused) {
        document.getElementById('pause').textContent = 'Resume';
    } else {
        document.getElementById('pause').textContent = 'Pause';
        requestAnimationFrame(loop);
    }
}

function loop() {
    if (isPaused || isGameOver) return;

    requestAnimationFrame(loop);

    if (++count < speed) {
        return;
    }

    count = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    if (snake.x < 0) {
        snake.x = canvas.width - grid;
    } else if (snake.x >= canvas.width) {
        snake.x = 0;
    }

    if (snake.y < 0) {
        snake.y = canvas.height - grid;
    } else if (snake.y >= canvas.height) {
        snake.y = 0;
    }

    snake.cells.unshift({ x: snake.x, y: snake.y });

    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    context.fillStyle = 'green';
    snake.cells.forEach(function (cell, index) {
        context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            score++;
            speed = Math.max(2, 4 - Math.floor(score / 5));
            apple.x = getRandomInt(0, 25) * grid;
            apple.y = getRandomInt(0, 25) * grid;

            while (snake.cells.some(function (cell) {
                return cell.x === apple.x && cell.y === apple.y;
            })) {
                apple.x = getRandomInt(0, 25) * grid;
                apple.y = getRandomInt(0, 25) * grid;
            }

            scoreElement.textContent = 'Score: ' + score;
            eatSound.play();
        }

        for (var i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                gameOver();
                return;
            }
        }
    });
}

document.addEventListener('keydown', function (e) {
    if (e.which === 37 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    } else if (e.which === 38 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    } else if (e.which === 39 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    } else if (e.which === 40 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    } else if (e.which === 82) {
        resetGame();
    } else if (e.which === 80) {
        togglePause();
    }
});

document.getElementById('left').addEventListener('click', function () {
    if (snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    }
});
document.getElementById('up').addEventListener('click', function () {
    if (snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    }
});
document.getElementById('right').addEventListener('click', function () {
    if (snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    }
});
document.getElementById('down').addEventListener('click', function () {
    if (snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});
document.getElementById('pause').addEventListener('click', togglePause);

resetGame();
requestAnimationFrame(loop);

if (/Mobi|Android/i.test(navigator.userAgent)) {
    mobileControls.style.display = 'block';
}