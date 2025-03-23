window.onload = function () {
    getLeaderboard().then((leaderboardData) => {
        if (leaderboardData) {
            displayLeaderboardData(leaderboardData);
        }
    });
};

export function displayLeaderboardData(data) {
    const leaderboardDiv = document.getElementById("leaderboard");
    leaderboardDiv.innerHTML = ""; // önceki veri varsa temizle

    for (let key in data) {
        const player = data[key];
        const playerDiv = document.createElement("div");
        playerDiv.classList.add("player");
        playerDiv.innerHTML = `
        <span>${player.name}</span> 
        <span>${player.score}</span>`;
        leaderboardDiv.appendChild(playerDiv);
    }
}

window.displayLeaderboardData = displayLeaderboardData;