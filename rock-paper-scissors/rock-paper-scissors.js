const toggleButton = document.querySelector('.theme-toggle');
const body = document.querySelector('body');

toggleButton.addEventListener('click', function () {
    body.classList.toggle('dark');


});

let p1Score = 0
let p2Score = 0

function startOneRound() {
    const playerSelectionButtons = document.querySelectorAll('.button');
    playerSelectionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const p1 = button.dataset.selection;
            const p2 = getComputerChoice();
            roundCheck(p1, p2);
            applyRules(p1Score, p2Score);
            updateScoreboard(p1Score, p2Score, button.textContent, p2);
        });
    })
}


function getComputerChoice() {
    const choices = ['✊', '✋', '✌'];
    return choices[Math.floor(Math.random() * choices.length)];
}

const p1ScoreElem = document.querySelector('#p1-score');
const p2ScoreElem = document.querySelector('#p2-score');

const roundCheck = (p1, p2) => {
    const rules = {
        rock: "✌",
        paper: "✊",
        scissors: "✋"
    };
    const ruleConvert = {
        rock: "✊",
        paper: "✋",
        scissors: "✌"
    };

    if (p2 === rules[p1]) {
        p1Score++;
        p1ScoreElem.textContent = p1Score;
        if (p1Score === 3) {
            endGameP1win();
        }
    } else if (ruleConvert[p1] === p2) {

    } else {
        p2Score++;
        p2ScoreElem.textContent = p2Score;
        if (p2Score === 3) {
            endGameP2win();
        }
    }
};

function updateScoreboard(p1Score, p2Score, p1, p2) {
    p1ScoreElem.textContent = `${p1Score}`;
    p2ScoreElem.textContent = `${p2Score}`;
    const h2 = document.querySelector('h2')
    h2.textContent = `You: ${p1} | PC: ${p2}`

}


function applyRules(roundWinner) {
    console.log('round winner:', roundWinner);
    console.log(`Player: ${p1Score}, PC: ${p2Score}`);
}

function restartRounds() {
    p1Score = 0;
    p2Score = 0;
    p1ScoreElem.textContent = p1Score;
    p2ScoreElem.textContent = p2Score;
    const card = document.querySelector('.card');
    card.remove();
}

function endGameP1win() {
    const card = document.createElement('div');
    card.classList.add('card');
    card.classList.add('dark');

    const left = document.createElement('div');
    left.classList.add('newDiv')

    const message = document.createElement('p');
    message.textContent = 'You beat the PC!';
    message.classList.add('dark');

    const replay = document.createElement('button');
    replay.classList.add('replay');
    replay.textContent = 'Start Over';
    replay.classList.add('dark');
    replay.addEventListener('click', restartRounds);


    /*const image = document.createElement('img');
    image.src = 'images/HaroldHappy.jpg';*/

    left.appendChild(message);
    left.appendChild(replay);
    card.appendChild(left);
    //card.appendChild(image);


    body.appendChild(card);
}

function endGameP2win() {
    const card = document.createElement('div');
    card.classList.add('card');
    card.classList.add('dark');

    const left = document.createElement('div');
    left.classList.add('newDiv')

    const message = document.createElement('p');
    message.textContent = 'The PC beat your ass';
    message.classList.add('dark');

    const replay = document.createElement('button');
    replay.classList.add('replay');
    replay.textContent = 'Start Over';
    replay.classList.add('dark');
    replay.addEventListener('click', restartRounds);

    /*const image = document.createElement('img');
    image.src = 'images/HaroldSad.jpg';*/

    left.appendChild(message);
    left.appendChild(replay);
    card.appendChild(left);
    //card.appendChild(image);

    body.appendChild(card);
}



startOneRound();