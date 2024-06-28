const gameContainer = document.getElementById('game-container');
const counterDisplay = document.getElementById('counter');
const emojis = ['🍎', '🍌', '🍇', '🍒', '🍓', '🍉', '🍋', '🍑'];
const cardValues = generateCardValues(emojis);
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let attempts = 0;

function generateCardValues(emojis) {
    const values = [];
    emojis.forEach(emoji => values.push(emoji, emoji));
    return shuffleArray(values);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createCard(value) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <div class="card-front">?</div>
        <div class="card-back">${value}</div>
    `;
    card.addEventListener('click', () => revealCard(card));
    return card;
}

function revealCard(cardElement) {
    if (lockBoard) return;
    if (cardElement === firstCard) return;
    if (cardElement.classList.contains('matched')) return;

    cardElement.classList.add('flipped');

    if (!firstCard) {
        firstCard = cardElement;
    } else {
        secondCard = cardElement;
        lockBoard = true;
        attempts++;
        counterDisplay.textContent = `Attempts: ${attempts}`;
        checkForMatch();
    }
}

function checkForMatch() {
    const isMatch = firstCard.querySelector('.card-back').textContent === 
                    secondCard.querySelector('.card-back').textContent;

    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function initGame() {
    cardValues.forEach(value => {
        const card = createCard(value);
        gameContainer.appendChild(card);
    });
}

initGame();