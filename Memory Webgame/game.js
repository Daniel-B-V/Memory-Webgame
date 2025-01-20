// Navigate back to the home page
document.getElementById('back-home').addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Variables and DOM elements
const cardGrid = document.getElementById('card-grid');
const scoreDisplay = document.getElementById('current-score');
const timerDisplay = document.getElementById('timer');
const levelCompletedPopup = document.getElementById('level-completed-popup');
const totalScoreDisplay = document.getElementById('total-score');
const nextLevelButton = document.getElementById('next-level');
const retryLevelButton = document.getElementById('retry-level'); // Retry button
const backHomePopupButton = document.getElementById('back-home-popup');
const timesUpPopup = document.getElementById('times-up-popup');
const totalTimeUpScoreDisplay = document.getElementById('total-time-up-score');
const retryTimeUpButton = document.getElementById('retry-time-up');
const backHomeTimeUpButton = document.getElementById('back-home-time-up');
const finalLevelPopup = document.getElementById('final-level-popup');
const finalBackHomeButton = document.getElementById('final-back-home');

let score = 0;
let flippedCards = [];
let matchedPairs = 0;
let timerInterval;
let timeRemaining = 90; // 1:30 minute

// Number of cards per level
const levelCards = {
    1: 4,
    2: 6,
    3: 12,
    4: 16,
    5: 20,
};

let level = 1; // Start at level 1

// List of Pokémon image filenames
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
        // All levels completed
        clearInterval(timerInterval); // Stop the timer
        finalLevelPopup.style.display = 'block'; // Show final level popup

        // Apply the blur effect to the background content
        document.querySelector('.game-info').classList.add('blur-background');
        document.querySelector('.card-grid').classList.add('blur-background');
        return;
    }

    // Reset card grid and styles
    cardGrid.innerHTML = '';
    cardGrid.className = 'card-grid'; // Clear previous level classes

    // Add level-specific class
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

    // Set grid dimensions dynamically
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

// Function to flip cards
function flipCard() {
    if (this.classList.contains('flipped') || flippedCards.length === 2) return;

    this.classList.add('flipped');
    
    const img = this.firstChild; // Get the image element inside the card
    img.style.display = 'block'; // Show the image when the card is flipped

    flippedCards.push(this);

    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 1000);
    }
}

// Function to check for a match
function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.image === card2.dataset.image) {
        score += 10;
        scoreDisplay.innerText = score;
        matchedPairs++;

        if (matchedPairs === levelCards[level] / 2) {
            // Show the popup for level completion
            clearInterval(timerInterval); // Stop the timer
            totalScoreDisplay.innerText = score; // Update the total score
            levelCompletedPopup.style.display = 'block';

            // Apply the blur effect to the background content
            document.querySelector('.game-info').classList.add('blur-background');
            document.querySelector('.card-grid').classList.add('blur-background');
        }

        flippedCards = [];
    } else {
        // Reset unmatched cards
        card1.classList.remove('flipped');
        card1.firstChild.style.display = 'none'; // Hide the image again
        card2.classList.remove('flipped');
        card2.firstChild.style.display = 'none'; // Hide the image again
        flippedCards = [];
    }
}

// Event listener for the Next Level button
nextLevelButton.addEventListener('click', () => {
    level++; // Move to the next level
    levelCompletedPopup.style.display = 'none'; // Hide the popup

    // Remove the blur effect when going to next level
    document.querySelector('.game-info').classList.remove('blur-background');
    document.querySelector('.card-grid').classList.remove('blur-background');

    generateCards(level); // Generate new cards
});

// Event listener for the Retry Level button
retryLevelButton.addEventListener('click', () => {
    levelCompletedPopup.style.display = 'none'; // Hide the popup
    document.querySelector('.game-info').classList.remove('blur-background'); // Remove blur effect
    document.querySelector('.card-grid').classList.remove('blur-background'); // Remove blur effect
    generateCards(level); // Retry the current level
});

// Timer functionality
function startTimer() {
    timerInterval = setInterval(() => {
        if (timeRemaining > 0) {
            timeRemaining--;
            timerDisplay.innerText = `Time: ${formatTime(timeRemaining)}`;
        } else {
            clearInterval(timerInterval);
            showTimeUpPopup(); // Show the "Time's Up" popup when time runs out
        }
    }, 1000);
}

// Format time as mm:ss
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function showTimeUpPopup() {
    totalTimeUpScoreDisplay.innerText = score; // Display current score
    timesUpPopup.style.display = 'block';

    // Apply the blur effect to the background content
    document.querySelector('.game-info').classList.add('blur-background');
    document.querySelector('.card-grid').classList.add('blur-background');
}

// Event listener for Retry button
retryTimeUpButton.addEventListener('click', () => {
    timesUpPopup.style.display = 'none'; // Hide the popup
    document.querySelector('.game-info').classList.remove('blur-background'); // Remove blur effect
    document.querySelector('.card-grid').classList.remove('blur-background'); // Remove blur effect
    generateCards(level); // Retry the current level
});

// Event listener for Back to Home button
backHomeTimeUpButton.addEventListener('click', () => {
    window.location.href = 'index.html';
});

backHomePopupButton.addEventListener('click', () => {
    window.location.href = 'index.html';
});

finalBackHomeButton.addEventListener('click', () => {
    window.location.href = 'index.html';
});
// Start game
generateCards(level);

// Save score, date, and time when the game ends
function saveScore(score) {
    const username = localStorage.getItem('username');
    if (username) {
        const datePlayed = new Date();
        const gameData = {
            username: username,
            score: score,
            date: datePlayed.toLocaleDateString(),
            time: datePlayed.toLocaleTimeString()
        };
        
        // Get existing scores from localStorage
        let scores = JSON.parse(localStorage.getItem('highScores')) || [];
        
        // Add the new score
        scores.push(gameData);
        
        // Save updated scores back to localStorage
        localStorage.setItem('highScores', JSON.stringify(scores));
    }
}

// Example usage: Save score when game ends (this is just a mock)
saveScore(score);  

