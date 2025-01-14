// Navigate back to the home page
document.getElementById('back-home').addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Variables and DOM elements
const cardGrid = document.getElementById('card-grid');
const scoreDisplay = document.getElementById('current-score');
const timerDisplay = document.getElementById('timer');
let score = 0;
let level = 1; // Start at level 1
let flippedCards = [];
let matchedPairs = 0;
let timerInterval; // Interval to update the timer
let timeRemaining = 120; // 2 minutes (120 seconds) per level

// Number of cards for each level
const levelCards = {
    1: 4,  // Level 1: 4 cards (2 pairs)
    2: 6,  // Level 2: 6 cards (3 pairs)
    3: 10, // Level 3: 10 cards (5 pairs)
    4: 14, // Level 4: 14 cards (7 pairs)
    5: 20, // Level 5: 20 cards (10 pairs)
};

// Function to generate cards dynamically
function generateCards(level) {
    if (level > 5) {
        alert("Congratulations! You've completed all levels.");
        return;
    }

    const numCards = levelCards[level];
    cardGrid.innerHTML = ''; // Clear the grid for new cards
    matchedPairs = 0; // Reset matched pairs for the new level
    timeRemaining = 120; // Reset timer to 2 minutes

    // Start the timer
    startTimer();

    // Dynamically set grid columns based on the number of cards
    const columns = Math.ceil(Math.sqrt(numCards));
    cardGrid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    const cards = [];
    for (let i = 1; i <= numCards / 2; i++) {
        cards.push(i, i); // Create pairs
    }

    // Shuffle the cards
    cards.sort(() => Math.random() - 0.5);

    // Create card elements and add them to the grid
    cards.forEach(value => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value;
        card.innerText = '?'; // Hidden state
        card.addEventListener('click', flipCard);
        cardGrid.appendChild(card);
    });
}

// Function to handle card flipping
function flipCard() {
    if (this.classList.contains('flipped') || flippedCards.length === 2) return;

    this.classList.add('flipped');
    this.innerText = this.dataset.value;
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 1000);
    }
}

// Function to check for a match
function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.value === card2.dataset.value) {
        score += 10; // Update score for a match
        scoreDisplay.innerText = score;
        matchedPairs++; // Increment matched pairs

        if (matchedPairs === levelCards[level] / 2) {
            // All pairs matched, proceed to next level
            setTimeout(() => {
                if (level < 5) {
                    alert(`Level ${level} completed! Moving to Level ${level + 1}.`);
                    level++;
                    generateCards(level);
                } else {
                    alert("Congratulations! You've completed all levels.");
                }
            }, 500);
        }

        flippedCards = []; // Reset flipped cards array
    } else {
        // If no match, reset cards to hidden state
        card1.classList.remove('flipped');
        card1.innerText = '?';
        card2.classList.remove('flipped');
        card2.innerText = '?';
        flippedCards = [];
    }
}

// Function to start the timer
function startTimer() {
    // Update the timer display every second
    timerInterval = setInterval(() => {
        if (timeRemaining > 0) {
            timeRemaining--;
            timerDisplay.innerText = `Time: ${formatTime(timeRemaining)}`;
        } else {
            clearInterval(timerInterval); // Stop the timer when it reaches 0
            alert("Time's up! Moving to the next level.");
            if (level < 5) {
                level++;
                generateCards(level);
            } else {
                alert("Game over. You've completed all levels!");
            }
        }
    }, 1000);
}

// Function to format the time (minutes:seconds)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secondsRemaining = seconds % 60;
    return `${minutes}:${secondsRemaining < 10 ? '0' : ''}${secondsRemaining}`;
}

// Initialize the game
generateCards(level);
