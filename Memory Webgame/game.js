// Navigate back to the home page
document.getElementById('back-home').addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Variables and DOM elements
const cardGrid = document.getElementById('card-grid');
const scoreDisplay = document.getElementById('current-score');
const timerDisplay = document.getElementById('timer');
let score = 0;
let flippedCards = [];
let matchedPairs = 0;
let timerInterval;
let timeRemaining = 120; // 2 minutes

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
        alert("Congratulations! You've completed all levels!");
        return;
    }

    // Reset card grid and styles
    cardGrid.innerHTML = '';
    cardGrid.className = 'card-grid'; // Clear previous level classes

    // Add level-specific class
    cardGrid.classList.add(`level-${level}`);

    matchedPairs = 0;
    timeRemaining = 120;

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
        }, 1500);
    }, 1500);
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
            // Proceed to the next level if all pairs are matched
            setTimeout(() => {
                alert(`Level ${level} completed!`);
                level++; // Move to next level
                generateCards(level); // Generate new cards
            }, 500);
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

// Timer functionality
function startTimer() {
    timerInterval = setInterval(() => {
        if (timeRemaining > 0) {
            timeRemaining--;
            timerDisplay.innerText = `Time: ${formatTime(timeRemaining)}`;
        } else {
            clearInterval(timerInterval);
            alert('Time’s up! Game over.');
        }
    }, 1000);
}

// Format time as mm:ss
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Start game
generateCards(level);
