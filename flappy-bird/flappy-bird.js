const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverScreen = document.getElementById('game-over');
const finalScore = document.getElementById('final-score');

canvas.width = 320;
canvas.height = 480;

let bird, pipes, score, frameCount, gameInterval;

function init() {
    bird = {
        x: 50,
        y: 150,
        width: 20,
        height: 20,
        gravity: 0.6,
        lift: -15,
        velocity: 0
    };

    pipes = [];
    score = 0;
    frameCount = 0;
    gameOverScreen.style.display = 'none';
}

function drawBird() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    ctx.fillStyle = 'green';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
    });
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        endGame();
    }
}

function updatePipes() {
    if (frameCount % 90 === 0) {
        const pipeTopHeight = Math.random() * (canvas.height - pipeGap - 50) + 20;
        const pipeBottomHeight = pipeTopHeight + pipeGap;
        pipes.push({ x: canvas.width, width: pipeWidth, top: pipeTopHeight, bottom: pipeBottomHeight });
    }

    pipes.forEach(pipe => {
        pipe.x -= 2;

        if (pipe.x + pipe.width < 0) {
            pipes.shift();
            score++;
        }

        if (bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)) {
            endGame();
        }
    });
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
    drawScore();
    updateBird();
    updatePipes();
    frameCount++;
}

function endGame() {
    clearInterval(gameInterval);
    gameOverScreen.style.display = 'block';
    finalScore.textContent = score;
}

function startGame() {
    init();
    gameInterval = setInterval(gameLoop, 1000 / 60);
}

document.addEventListener('keydown', () => {
    bird.velocity = bird.lift;
});

document.addEventListener('click', () => {
    bird.velocity = bird.lift;
});

startGame();