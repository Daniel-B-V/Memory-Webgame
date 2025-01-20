function displayHighScores() {
    const scores = JSON.parse(localStorage.getItem('highScores')) || [];
    console.log('Scores Retrieved:', scores);

    scores.sort((a, b) => b.score - a.score);

    const tableBody = document.querySelector('.high-scores-table tbody');
    tableBody.innerHTML = '';

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
}
