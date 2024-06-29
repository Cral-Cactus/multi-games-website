document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.querySelector('.grid-container');
    const scoreDisplay = document.getElementById('score');
    const bestDisplay = document.getElementById('best');
    const newGameButton = document.getElementById('new-game');

    let tiles = [];
    let score = 0;
    let best = localStorage.getItem('best') ? localStorage.getItem('best') : 0;

    bestDisplay.innerText = best;

    function createBoard() {
        for (let i = 0; i < 4; i++) {
            tiles[i] = [];
            for (let j = 0; j < 4; j++) {
                tiles[i][j] = 0;
            }
        }
        addTile();
        addTile();
        updateBoard();
    }

    function updateBoard() {
        document.querySelectorAll('.tile').forEach(tile => tile.remove());
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (tiles[i][j] !== 0) {
                    const tile = document.createElement('div');
                    tile.classList.add('tile', `tile-${tiles[i][j]}`);
                    tile.innerText = tiles[i][j];
                    tile.style.transform = `translate(${j * 75}px, ${i * 75}px)`;
                    gridContainer.appendChild(tile);
                }
            }
        }
        scoreDisplay.innerText = score;
    }

    function addTile() {
        let emptyTiles = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (tiles[i][j] === 0) {
                    emptyTiles.push({ x: i, y: j });
                }
            }
        }
        if (emptyTiles.length > 0) {
            const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            tiles[randomTile.x][randomTile.y] = Math.random() > 0.1 ? 2 : 4;
        }
    }

    function slide(row) {
        let arr = row.filter(val => val);
        let missing = 4 - arr.length;
        let zeros = Array(missing).fill(0);
        arr = zeros.concat(arr);
        return arr;
    }

    function combine(row) {
        for (let i = 3; i >= 1; i--) {
            if (row[i] === row[i - 1] && row[i] !== 0) {
                row[i] = row[i] * 2;
                row[i - 1] = 0;
                score += row[i];
                if (score > best) {
                    best = score;
                    localStorage.setItem('best', best);
                    bestDisplay.innerText = best;
                }
            }
        }
        return row;
    }

    function control(e) {
        if (e.keyCode === 39) {
            keyRight();
        } else if (e.keyCode === 37) {
            keyLeft();
        } else if (e.keyCode === 38) {
            keyUp();
        } else if (e.keyCode === 40) {
            keyDown();
        }
    }

    document.addEventListener('keyup', control);

    function keyRight() {
        for (let i = 0; i < 4; i++) {
            let row = tiles[i];
            row = slide(row);
            row = combine(row);
            row = slide(row);
            tiles[i] = row;
        }
        addTile();
        updateBoard();
    }

    function keyLeft() {
        for (let i = 0; i < 4; i++) {
            let row = tiles[i];
            row.reverse();
            row = slide(row);
            row = combine(row);
            row = slide(row);
            row.reverse();
            tiles[i] = row;
        }
        addTile();
        updateBoard();
    }

    function keyUp() {
        for (let i = 0; i < 4; i++) {
            let column = [tiles[0][i], tiles[1][i], tiles[2][i], tiles[3][i]];
            column.reverse();
            column = slide(column);
            column = combine(column);
            column = slide(column);
            column.reverse();
            for (let j = 0; j < 4; j++) {
                tiles[j][i] = column[j];
            }
        }
        addTile();
        updateBoard();
    }

    function keyDown() {
        for (let i = 0; i < 4; i++) {
            let column = [tiles[0][i], tiles[1][i], tiles[2][i], tiles[3][i]];
            column = slide(column);
            column = combine(column);
            column = slide(column);
            for (let j = 0; j < 4; j++) {
                tiles[j][i] = column[j];
            }
        }
        addTile();
        updateBoard();
    }

    newGameButton.addEventListener('click', () => {
        score = 0;
        createBoard();
    });

    createBoard();
});