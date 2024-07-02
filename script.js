function loadGame(gameUrl) {
    var gameFrame = document.getElementById('game-frame');
    var closeButton = document.getElementById('close-button');
    gameFrame.src = gameUrl;
    gameFrame.style.display = 'block';
    closeButton.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeGame() {
    var gameFrame = document.getElementById('game-frame');
    var closeButton = document.getElementById('close-button');
    gameFrame.src = '';
    gameFrame.style.display = 'none';
    closeButton.style.display = 'none';
    document.body.style.overflow = 'auto';
}