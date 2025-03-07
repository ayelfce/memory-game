import { updateHighScore, addUserToDatabase } from './firebase.js';

const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let matches = 0;
let moves = 0;
let score = 0;
let max_score;
let time;
let timeLeft;
let timerInterval;

document.querySelector(".accuracy").textContent = "%0";

document.addEventListener("DOMContentLoaded", async function () {
    const gridContainer = document.querySelector(".grid-container");

    if (!gridContainer) {
        console.log("gridContainer öğesi bulunamadı!");
        return;
    }

    const selectedDifficulty = localStorage.getItem("selectedDifficulty");

    if (!selectedDifficulty) {
        console.log("Zorluk seviyesi seçilmedi!");
        return;
    }

    try {
        const res = await fetch("../data/levels.json");
        const difficultyData = await res.json();

        // Önce zorluk seviyesini bul
        const difficulty = difficultyData.find(d => selectedDifficulty.startsWith(d.diff));

        if (!difficulty) {
            console.log("Belirtilen zorluk kategorisi bulunamadı!");
            return;
        }

        // Seçilen seviyeyi bul
        const levelSettings = difficulty.levels.find(level => level.id === selectedDifficulty);

        if (levelSettings) {
            console.log("Seçilen zorluk ayarları:", levelSettings);

            gridContainer.style.display = "grid";
            gridContainer.style.gridTemplateColumns = levelSettings.column;
            gridContainer.style.gridTemplateRows = levelSettings.row;

            fetch("../data/cards.json")
                .then((res) => res.json())
                .then((data) => {
                    const cardCount = levelSettings.cardCount;
                    time = levelSettings.time;
                    max_score = levelSettings.max_score;
                    timeLeft = time;
                    cards = [...data.slice(0, cardCount / 2), ...data.slice(0, cardCount / 2)];
                    shuffleCards();
                    generateCards();
                });
        } else {
            console.log("Belirtilen seviye bulunamadı!");
        }
    } catch (error) {
        console.error("Hata:", error);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    startTimer();
});


function startTimer() {
    const timeElement = document.querySelector('.time');
    timerInterval = setInterval(() => {
        timeLeft--;
        timeElement.textContent = formatTime(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            gameOverLose();
        }
    }, 1000);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function gameOver() {
    document.getElementById("gameOverModal").style.display = "flex";
    score = Math.floor((matches/moves)*max_score);
    document.getElementById("finalScore").textContent = score;
    let userName = localStorage.getItem("playerName");
    updateHighScore(userName, score);
    localStorage.setItem("playerName", null);
    clearInterval(timerInterval);
}

function gameOverLose() {
    document.getElementById("gameOverModalLose").style.display = "flex";
    clearInterval(timerInterval);
}


function shuffleCards() {
    let currentIndex = cards.length,
        randomIndex,
        temporaryValue;
    // Fisher-Yates Shuffle
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temporaryValue;
    }
}

function generateCards() {
    for (let card of cards) {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-name", card.name);
        cardElement.innerHTML = `
        <div class="front">
          <img class="front-image" src=${card.image} />
        </div>
        <div class="back"></div>
        `;
        gridContainer.appendChild(cardElement);
        cardElement.addEventListener("click", flipCard);
    }
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add("flipped");

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;
    moves++;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    isMatch ? disableCards() : unflipCards();
}

function checkForWin() {
    let flippedCards = document.querySelectorAll(".flipped");
    setTimeout(() => {
        if (flippedCards.length === cards.length) {
            gameOver();
        }
    }
        , 500);
}

function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    matches++;
    document.querySelector(".accuracy").textContent = "%" + Math.floor(matches/moves*100);
    checkForWin();
    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetBoard();
    }, 1000);
}

function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function restart() {
    resetBoard();
    shuffleCards();
    timeLeft = time;
    moves = 0;
    matches = 0;
    document.querySelector(".accuracy").textContent = "%0";
    gridContainer.innerHTML = "";
    generateCards();
    document.getElementById("gameOverModal").style.display = "none";
    document.getElementById("gameOverModalLose").style.display = "none";
    clearInterval(timerInterval);
    startTimer();
}

window.restart = restart;



