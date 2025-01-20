// Function to show a prompt asking the user to enter a username if not already set in localStorage
function checkUsername() {
    const username = localStorage.getItem('username');
    if (!username) {
        // Show the modal for username input
        document.getElementById('popup-overlay').style.display = 'block';
        document.getElementById('username-popup').style.display = 'block';
        return false;  // Prevent further action until username is set
    }
    return true;
}

// Submit the username and save it in localStorage
document.getElementById('submit-username').addEventListener('click', () => {
    const enteredUsername = document.getElementById('username-input').value;
    if (enteredUsername) {
        localStorage.setItem('username', enteredUsername);
        document.getElementById('username-popup').style.display = 'none'; // Hide the modal
        window.location.href = 'game.html'; // Proceed to the game page
    } else {
        alert("You must enter a username to play!");
    }
});

// Back button event listener
document.getElementById('back-home').addEventListener('click', () => {
    window.location.href = 'index.html'; // Redirect to the homepage
});

// Play Now button event listener
document.getElementById('play-now').addEventListener('click', () => {
    if (checkUsername()) {
        // Redirect to the game page if a username is set
        window.location.href = 'game.html';
    }
});

// Other button listeners
document.getElementById('high-scores').addEventListener('click', () => {
    window.location.href = 'high-scores.html';
});

document.getElementById('instructions').addEventListener('click', () => {
    window.location.href = 'instructions.html';
});
