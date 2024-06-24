const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 600;
canvas.height = 600;

// Game variables
const tileSize = 20;
let pacman = {
    x: tileSize * 1,
    y: tileSize * 1,
    dx: tileSize,
    dy: 0,
    size: tileSize - 2
};

// Draw Pac-Man
function drawPacman() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(pacman.x + pacman.size / 2, pacman.y + pacman.size / 2, pacman.size / 2, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.lineTo(pacman.x + pacman.size / 2, pacman.y + pacman.size / 2);
    ctx.fill();
}

// Clear the canvas
function clearCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Update Pac-Man's position
function updatePacman() {
    pacman.x += pacman.dx;
    pacman.y += pacman.dy;
}

// Main game loop
function gameLoop() {
    clearCanvas();
    drawPacman();
    updatePacman();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();

// Handle keyboard input
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
