const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const TILE_SIZE = 20;

const NONE = 4,
    UP = 3,
    LEFT = 2,
    DOWN = 1,
    RIGHT = 11;

let pacman = {
    x: TILE_SIZE,
    y: TILE_SIZE,
    dx: 0,
    dy: 0,
    size: TILE_SIZE - 2,
    direction: NONE,
};

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

function clearCanvas() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 1;

    for (let x = TILE_SIZE; x < CANVAS_WIDTH; x += TILE_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
    }

    for (let y = TILE_SIZE; y < CANVAS_HEIGHT; y += TILE_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
    }
}

function drawPacman() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(pacman.x + pacman.size / 2, pacman.y + pacman.size / 2, pacman.size / 2, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.lineTo(pacman.x + pacman.size / 2, pacman.y + pacman.size / 2);
    ctx.fill();
}

function movePacman() {
    switch (pacman.direction) {
        case UP:
            pacman.dy = -TILE_SIZE;
            pacman.dx = 0;
            break;
        case DOWN:
            pacman.dy = TILE_SIZE;
            pacman.dx = 0;
            break;
        case LEFT:
            pacman.dx = -TILE_SIZE;
            pacman.dy = 0;
            break;
        case RIGHT:
            pacman.dx = TILE_SIZE;
            pacman.dy = 0;
            break;
    }
}

function updatePacman() {
    pacman.x += pacman.dx;
    pacman.y += pacman.dy;

    if (pacman.x < 0) {
        pacman.x = CANVAS_WIDTH - TILE_SIZE;
    } else if (pacman.x >= CANVAS_WIDTH) {
        pacman.x = 0;
    }

    if (pacman.y < 0) {
        pacman.y = CANVAS_HEIGHT - TILE_SIZE;
    } else if (pacman.y >= CANVAS_HEIGHT) {
        pacman.y = 0;
    }
}

function gameLoop() {
    clearCanvas();
    movePacman();
    drawPacman();
    updatePacman();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            pacman.direction = UP;
            break;
        case 'ArrowDown':
            pacman.direction = DOWN;
            break;
        case 'ArrowLeft':
            pacman.direction = LEFT;
            break;
        case 'ArrowRight':
            pacman.direction = RIGHT;
            break;
    }
});

pacman.x = TILE_SIZE;
pacman.y = TILE_SIZE;
pacman.direction = LEFT;

gameLoop();
