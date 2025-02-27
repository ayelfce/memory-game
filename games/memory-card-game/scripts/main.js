const difficultyLevels = [
    { "diff": "easy", "column": "repeat(4, 90px)", "row": "repeat(3, calc(90px / 2 * 3))" },
    { "diff": "normal", "column": "repeat(4, 90px)", "row": "repeat(4, calc(90px / 2 * 3))" },
    { "diff": "hard", "column": "repeat(5, 90px)", "row": "repeat(4, calc(90px / 2 * 3))" }
];

function setLevelDifficulty(difficulty) {
    localStorage.setItem("selectedDifficulty", difficulty);
}

function selectDifficulty(difficulty) {
    let diff = setLevelDifficulty(difficulty);
    setTimeout(() => {
        window.location.href = "game.html";
    }, 100);
    return diff;
}

window.selectDifficulty = selectDifficulty;
