const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 600;

const tileSize = 20;
let pacman = {
    x: tileSize * 1,
    y: tileSize * 1,
    dx: tileSize,
    dy: 0,
    size: tileSize - 2
};

function drawPacman() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(pacman.x + pacman.size / 2, pacman.y + pacman.size / 2, pacman.size / 2, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.lineTo(pacman.x + pacman.size / 2, pacman.y + pacman.size / 2);
    ctx.fill();
}

function clearCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function updatePacman() {
    pacman.x += pacman.dx;
    pacman.y += pacman.dy;

    // Check for boundary collisions and wrap around if necessary
    if (pacman.x < 0) {
        pacman.x = canvas.width - tileSize;
    } else if (pacman.x >= canvas.width) {
        pacman.x = 0;
    }

    if (pacman.y < 0) {
        pacman.y = canvas.height - tileSize;
    } else if (pacman.y >= canvas.height) {
        pacman.y = 0;
    }
}

function gameLoop() {
    clearCanvas();
    drawPacman();
    updatePacman();
    requestAnimationFrame(gameLoop);
}

gameLoop();

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            pacman.dx = 0;
            pacman.dy = -tileSize;
            break;
        case 'ArrowDown':
            pacman.dx = 0;
            pacman.dy = tileSize;
            break;
        case 'ArrowLeft':
            pacman.dx = -tileSize;
            pacman.dy = 0;
            break;
        case 'ArrowRight':
            pacman.dx = tileSize;
            pacman.dy = 0;
            break;
    }
});