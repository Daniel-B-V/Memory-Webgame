function displayHighScores() {
    const scores = JSON.parse(localStorage.getItem('highScores')) || [];
    
    // Sort the scores in descending order
    scores.sort((a, b) => b.score - a.score);
    
    const tableBody = document.querySelector('.high-scores-table tbody');
    tableBody.innerHTML = '';  // Clear existing table rows

    // Populate the table with high scores
    scores.forEach((gameData, index) => {
        const row = document.createElement('tr');
        row.innerHTML = ` 
            <td>${index + 1}</td>
            <td>${gameData.username}</td>
            <td>${gameData.score}</td>
            <td>${gameData.date}</td>
            <td>${gameData.time}</td>
        `;
        tableBody.appendChild(row);
    });

    // Ensure all table cells have black text
    const highScoreRows = document.querySelectorAll('.high-scores-table td');
    highScoreRows.forEach(cell => {
        cell.style.color = 'black';  // Set the text color to black
    });
}
