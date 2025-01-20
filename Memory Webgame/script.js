window.onload = function () {
    // Handle Play Now button click
    document.getElementById('play-now').addEventListener('click', function () {
        document.getElementById('username-modal').style.display = 'flex';
    });

    // Handle Save Username button in the modal
    document.getElementById('save-username').addEventListener('click', function () {
        const usernameInput = document.getElementById('modal-username').value.trim();
        const existingUsernames = JSON.parse(localStorage.getItem('usernames')) || [];

        if (!usernameInput) {
            alert('Please enter a valid username.');
        } else if (existingUsernames.includes(usernameInput)) {
            alert('Username is already taken. Please choose another one.');
        } else {
            existingUsernames.push(usernameInput);
            localStorage.setItem('usernames', JSON.stringify(existingUsernames));
            localStorage.setItem('currentUsername', usernameInput);
            document.getElementById('username-modal').style.display = 'none';
            window.location.href = 'game.html'; // Redirect to the game
        }
    });

    // Close modal if the user clicks the close button
    document.querySelector('.close').addEventListener('click', function () {
        document.getElementById('username-modal').style.display = 'none';
    });

    // Handle Back button to close the modal
    document.getElementById('back-button').addEventListener('click', function () {
        document.getElementById('username-modal').style.display = 'none';
    });

    // Redirect to High Scores
    document.getElementById('high-scores').addEventListener('click', function () {
        window.location.href = 'high-scores.html';
    });

    // Redirect to Instructions
    document.getElementById('instructions').addEventListener('click', function () {
        window.location.href = 'instructions.html';
    });
};
