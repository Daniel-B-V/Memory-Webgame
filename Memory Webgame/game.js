const cardGrid = document.getElementById('card-grid');
const scoreDisplay = document.getElementById('current-score');
const timerDisplay = document.getElementById('timer');
const levelCompletedPopup = document.getElementById('level-completed-popup');
const totalScoreDisplay = document.getElementById('total-score');
const nextLevelButton = document.getElementById('next-level');
const retryLevelButton = document.getElementById('retry-level');
const timesUpPopup = document.getElementById('times-up-popup');
const totalTimeUpScoreDisplay = document.getElementById('total-time-up-score');
const retryTimeUpButton = document.getElementById('retry-time-up');
const finalLevelPopup = document.getElementById('final-level-popup');

let score = 0;
let flippedCards = [];
let matchedPairs = 0;
let timerInterval;
let timeRemaining = 90; // 1:30 minutes

// Number of cards per level
const levelCards = {
    1: 4,
    2: 6,
    3: 12,
    4: 16,
    5: 20,
};

let level = 1; // Start at level 1

const pokemonImages = [
    'bulbasaur.png',
    'charmander.png',
    'squirtle.png',
    'pikachu.png',
    'cyndaquil.png',
    'totodile.png',
    'chikorita.png',
    'treecko.png',
    'mudkip.png',
    'torchic.png'
];

// Function to generate cards dynamically
function generateCards(level) {
    const numCards = levelCards[level];
    if (!numCards) {
        clearInterval(timerInterval);
        finalLevelPopup.style.display = 'block';
        return;
    }

    cardGrid.innerHTML = '';
    cardGrid.className = 'card-grid';
    cardGrid.classList.add(`level-${level}`);

    matchedPairs = 0;
    timeRemaining = 90;
    clearInterval(timerInterval);

    const cards = [];
    for (let i = 0; i < numCards / 2; i++) {
        const randomPokemon = pokemonImages[i % pokemonImages.length];
        cards.push(randomPokemon, randomPokemon);
    }

    cards.sort(() => Math.random() - 0.5);

    const dimension = Math.ceil(Math.sqrt(numCards));
    cardGrid.style.gridTemplateColumns = `repeat(${dimension}, 1fr)`;
    cardGrid.style.gridTemplateRows = `repeat(${dimension}, 1fr)`;

    cards.forEach(image => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.image = image;

        const img = document.createElement('img');
        img.src = `images/${image}`;
        img.alt = image.split('.')[0];
        img.style.display = 'none';

        card.appendChild(img);
        cardGrid.appendChild(card);
    });

    setTimeout(() => {
        document.querySelectorAll('.card').forEach(card => {
            const img = card.firstChild;
            img.style.display = 'block';
            card.classList.add('flipped');
        });

        setTimeout(() => {
            document.querySelectorAll('.card').forEach(card => {
                const img = card.firstChild;
                img.style.display = 'none';
                card.classList.remove('flipped');
                card.addEventListener('click', flipCard);
            });

            startTimer();
        }, 1000);
    }, 1000);
}

function flipCard() {
    if (this.classList.contains('flipped') || flippedCards.length === 2) return;

    this.classList.add('flipped');
    const img = this.firstChild;
    img.style.display = 'block';

    flippedCards.push(this);

    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 1000);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.image === card2.dataset.image) {
        score += 10;
        scoreDisplay.innerText = score;
        matchedPairs++;

        if (matchedPairs === levelCards[level] / 2) {
            clearInterval(timerInterval);
            totalScoreDisplay.innerText = score;
            levelCompletedPopup.style.display = 'block';
            endGame(); // This will now save the score only once when the level is completed
        }

        flippedCards = [];
    } else {
        card1.classList.remove('flipped');
        card1.firstChild.style.display = 'none';
        card2.classList.remove('flipped');
        card2.firstChild.style.display = 'none';
        flippedCards = [];
    }
}

nextLevelButton.addEventListener('click', () => {
    level++;
    levelCompletedPopup.style.display = 'none';
    generateCards(level);
});

retryLevelButton.addEventListener('click', () => {
    levelCompletedPopup.style.display = 'none';
    generateCards(level);
});

retryTimeUpButton.addEventListener('click', () => {
    timesUpPopup.style.display = 'none';
    generateCards(level);
});

function startTimer() {
    timerInterval = setInterval(() => {
        if (timeRemaining > 0) {
            timeRemaining--;
            timerDisplay.innerText = `Time: ${formatTime(timeRemaining)}`;
        } else {
            clearInterval(timerInterval);
            timesUpPopup.style.display = 'block';
        }
    }, 1000);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

generateCards(level);

function saveScore(score) {
    const username = localStorage.getItem('currentUsername'); // Retrieve the current username
    console.log("Saving score for username:", username); // Log the username
    if (username) {
        const datePlayed = new Date();
        const gameData = {
            username: username,
            score: score,
            date: datePlayed.toLocaleDateString(),
            time: datePlayed.toLocaleTimeString()
        };

        let scores = JSON.parse(localStorage.getItem('highScores')) || [];

        // Remove any existing scores for the current user
        scores = scores.filter(scoreEntry => scoreEntry.username !== username);

        // Add the new score for the user
        scores.push(gameData);

        // Sort scores by highest score first
        scores.sort((a, b) => b.score - a.score);

        // Save the updated scores to localStorage
        localStorage.setItem('highScores', JSON.stringify(scores));

        console.log('Scores saved:', scores);
    } else {
        console.log("No username found in localStorage.");
    }
}

document.getElementById('back-home').addEventListener('click', () => {
    window.location.href = 'index.html';
});

document.getElementById('back-home-popup').addEventListener('click', () => {
    window.location.href = 'index.html';
});

document.getElementById('back-home-time-up').addEventListener('click', () => {
    window.location.href = 'index.html';
});

document.getElementById('final-back-home').addEventListener('click', () => {
    window.location.href = 'index.html';
});

function endGame() {
    clearInterval(timerInterval);
    saveScore(score); // Save the current score
}
