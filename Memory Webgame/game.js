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
    'torchick.png'
];

// Function to generate cards dynamically
function generateCards(level) {
    const numCards = levelCards[level];
    if (!numCards) {
        alert("Congratulations! You've completed all levels!");
        return;
    }

    cardGrid.innerHTML = ''; // Clear previous cards
    matchedPairs = 0; // Reset matched pairs
    timeRemaining = 120; // Reset timer

    clearInterval(timerInterval); // Stop any ongoing timer

    const cards = [];
    for (let i = 0; i < numCards / 2; i++) {
        const randomPokemon = pokemonImages[i % pokemonImages.length]; // Loop through the images if there are more cards than images
        cards.push(randomPokemon, randomPokemon); // Create pairs of the same image
    }

    // Shuffle cards
    cards.sort(() => Math.random() - 0.5);

    // Calculate grid dimensions (equal rows and columns)
    const dimension = Math.ceil(Math.sqrt(numCards));
    cardGrid.style.gridTemplateColumns = `repeat(${dimension}, 1fr)`;
    cardGrid.style.gridTemplateRows = `repeat(${dimension}, 1fr)`;

    // Create card elements
    cards.forEach(image => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.image = image;

        // Create an img element for the card image
        const img = document.createElement('img');
        img.src = `images/${image}`; // Use the image filename from the card data
        img.alt = image.split('.')[0]; // Set the alt text as the name of the Pokémon
        img.style.display = 'none'; // Hide image initially

        // Append the img to the card
        card.appendChild(img);
        cardGrid.appendChild(card);
    });

    // Show cards briefly, then hide
    setTimeout(() => {
        document.querySelectorAll('.card').forEach(card => {
            const img = card.firstChild; // Get the image inside the card
            img.style.display = 'block'; // Show the image for 1.5 seconds
            card.classList.add('flipped'); // Flip the card to reveal the image
        });

        // After 1.5 seconds, hide images and add event listeners for flipping
        setTimeout(() => {
            document.querySelectorAll('.card').forEach(card => {
                const img = card.firstChild;
                img.style.display = 'none'; // Hide image again
                card.classList.remove('flipped'); // Remove flip effect
                card.addEventListener('click', flipCard); // Add click event to flip the card
            });

            startTimer(); // Start the timer after cards are hidden
        }, 1500); // Keep images visible for 1.5 seconds
    }, 1500); // Display cards for 2 seconds
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
