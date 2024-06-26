const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 300;
const TILE_SIZE = 20;

const NONE = 4,
    UP = 3,
    LEFT = 2,
    DOWN = 1,
    RIGHT = 11;

const gameMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let pacman = {
    x: TILE_SIZE,
    y: TILE_SIZE,
    dx: 0,
    dy: 0,
    size: TILE_SIZE - 2,
    direction: NONE,
    alive: true
};

let ghosts = [
    { x: 7 * TILE_SIZE, y: 7 * TILE_SIZE, size: TILE_SIZE - 2, direction: NONE, speed: 1, moveCounter: 0 },
    { x: 7 * TILE_SIZE, y: 1 * TILE_SIZE, size: TILE_SIZE - 2, direction: NONE, speed: 1, moveCounter: 0 },
];

let points = [];
let score = 0;

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const scoreElement = document.getElementById('score');

function initializePoints() {
    points = [];
    for (let row = 0; row < gameMap.length; row++) {
        for (let col = 0; col < gameMap[row].length; col++) {
            if (gameMap[row][col] === 0) {
                points.push({ x: col * TILE_SIZE + TILE_SIZE / 2, y: row * TILE_SIZE + TILE_SIZE / 2 });
            }
        }
    }
}

function clearCanvas() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#0000FF';
    ctx.lineWidth = 2;
    for (let row = 0; row < gameMap.length; row++) {
        for (let col = 0; col < gameMap[row].length; col++) {
            if (gameMap[row][col] === 1) {
                ctx.strokeRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}

function drawPoints() {
    ctx.fillStyle = 'white';
    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.fill();
    });
}

function drawPacman() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(pacman.x + pacman.size / 2, pacman.y + pacman.size / 2, pacman.size / 2, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.lineTo(pacman.x + pacman.size / 2, pacman.y + pacman.size / 2);
    ctx.fill();
}

function drawGhosts() {
    ghosts.forEach(ghost => {
        ctx.fillStyle = 'red';
        const ghostX = ghost.x + ghost.size / 2;
        const ghostY = ghost.y + ghost.size / 2;
        const radius = ghost.size / 2;

        ctx.beginPath();
        ctx.arc(ghostX, ghostY - radius / 2, radius, Math.PI, 0);
        ctx.lineTo(ghostX + radius, ghostY + radius / 2);

        for (let i = 0; i <= 4; i++) {
            const x = ghostX + radius - (radius / 2) * i;
            const y = ghostY + radius / 2 + (i % 2 === 0 ? 0 : radius / 2);
            ctx.lineTo(x, y);
        }
        ctx.lineTo(ghostX - radius, ghostY + radius / 2);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'white';
        const eyeOffsetX = radius / 3;
        const eyeOffsetY = radius / 3;
        const eyeRadius = radius / 5;

        ctx.beginPath();
        ctx.arc(ghostX - eyeOffsetX, ghostY - eyeOffsetY, eyeRadius, 0, 2 * Math.PI);
        ctx.arc(ghostX + eyeOffsetX, ghostY - eyeOffsetY, eyeRadius, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(ghostX - eyeOffsetX, ghostY - eyeOffsetY, eyeRadius / 2, 0, 2 * Math.PI);
        ctx.arc(ghostX + eyeOffsetX, ghostY - eyeOffsetY, eyeRadius / 2, 0, 2 * Math.PI);
        ctx.fill();
    });
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

function canMoveTo(x, y) {
    const gridX = Math.floor(x / TILE_SIZE);
    const gridY = Math.floor(y / TILE_SIZE);

    return gameMap[gridY][gridX] === 0;
}

function updatePacman() {
    const newX = pacman.x + pacman.dx;
    const newY = pacman.y + pacman.dy;

    if (canMoveTo(newX, newY)) {
        pacman.x = newX;
        pacman.y = newY;
    }

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

function moveGhosts() {
    ghosts.forEach(ghost => {
        ghost.moveCounter++;
        if (ghost.moveCounter >= ghost.speed * 10) {
            ghost.moveCounter = 0;
            let directions = [UP, DOWN, LEFT, RIGHT];
            directions.sort(() => Math.random() - 0.5);

            for (let direction of directions) {
                let newX = ghost.x, newY = ghost.y;
                switch (direction) {
                    case UP:
                        newY -= TILE_SIZE;
                        break;
                    case DOWN:
                        newY += TILE_SIZE;
                        break;
                    case LEFT:
                        newX -= TILE_SIZE;
                        break;
                    case RIGHT:
                        newX += TILE_SIZE;
                        break;
                }
                if (canMoveTo(newX, newY)) {
                    ghost.x = newX;
                    ghost.y = newY;
                    break;
                }
            }
        }
    });
}

function checkCollisions() {
    ghosts.forEach(ghost => {
        if (pacman.x < ghost.x + ghost.size &&
            pacman.x + pacman.size > ghost.x &&
            pacman.y < ghost.y + ghost.size &&
            pacman.y + pacman.size > ghost.y) {
            pacman.alive = false;
        }
    });
}

function updateScore() {
    scoreElement.textContent = score;
}

function checkPointCollision() {
    points = points.filter(point => {
        const distX = Math.abs(point.x - (pacman.x + pacman.size / 2));
        const distY = Math.abs(point.y - (pacman.y + pacman.size / 2));

        if (distX < pacman.size / 2 && distY < pacman.size / 2) {
            score++;
            updateScore();
            return false;
        }
        return true;
    });
}

function resetGame() {
    pacman = {
        x: TILE_SIZE,
        y: TILE_SIZE,
        dx: 0,
        dy: 0,
        size: TILE_SIZE - 2,
        direction: NONE,
        alive: true
    };

    ghosts = [
        { x: 7 * TILE_SIZE, y: 7 * TILE_SIZE, size: TILE_SIZE - 2, direction: NONE, speed: 1, moveCounter: 0 },
        { x: 7 * TILE_SIZE, y: 1 * TILE_SIZE, size: TILE_SIZE - 2, direction: NONE, speed: 1, moveCounter: 0 },
    ];

    score = 0;
    updateScore();
    initializePoints();

    document.removeEventListener('keydown', handleRestart);
    gameLoop();
}

function gameLoop() {
    if (pacman.alive) {
        clearCanvas();
        drawPoints();
        movePacman();
        drawPacman();
        updatePacman();
        moveGhosts();
        drawGhosts();
        checkCollisions();
        checkPointCollision();
        requestAnimationFrame(gameLoop);
    } else {
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText('Game Over', CANVAS_WIDTH / 2 - 50, CANVAS_HEIGHT / 2);
        ctx.fillText('Press R to Restart', CANVAS_WIDTH / 2 - 80, CANVAS_HEIGHT / 2 + 30);
        document.addEventListener('keydown', handleRestart, { once: true });
    }
}

function handleRestart(event) {
    if (event.key === 'r' || event.key === 'R') {
        resetGame();
    }
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

initializePoints();
gameLoop();