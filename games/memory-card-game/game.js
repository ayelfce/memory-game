import { updateHighScore, addUserToDatabase } from './firebase.js';

const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let levelSettings = {};

document.querySelector(".score").textContent = score;

document.addEventListener("DOMContentLoaded", function () {
    const gridContainer = document.querySelector(".grid-container"); // class yerine querySelector kullandık

    if (!gridContainer) {
        console.log("gridContainer öğesi bulunamadı!");
        return;
    }

    const selectedDifficulty = localStorage.getItem("selectedDifficulty");

    if (!selectedDifficulty) {
        console.log("Zorluk seviyesi seçilmedi!");
        return;
    }

    const difficultyLevels = [
        { "diff": "easy", "column": "repeat(4, 90px)", "row": "repeat(3, calc(90px / 2 * 3))", "cardCount": 12 },
        { "diff": "normal", "column": "repeat(4, 90px)", "row": "repeat(4, calc(90px / 2 * 3))", "cardCount": 16 },
        { "diff": "hard", "column": "repeat(5, 90px)", "row": "repeat(4, calc(90px / 2 * 3))", "cardCount": 20 }
    ];

    levelSettings = difficultyLevels.find(level => level.diff === selectedDifficulty);

    if (levelSettings) {
        gridContainer.style.display = "grid";
        gridContainer.style.gridTemplateColumns = levelSettings.column;
        gridContainer.style.gridTemplateRows = levelSettings.row;
    } else {
        console.log("Belirtilen zorluk seviyesi bulunamadı!");
    }
});


fetch("./data/cards.json")
    .then((res) => res.json())
    .then((data) => {
        const cardCount = levelSettings.cardCount;
        cards = [...data.slice(0, cardCount / 2), ...data.slice(0, cardCount / 2)];
        shuffleCards();
        generateCards();
    });

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
            alert("Tebrikler, oyunu başarıyla tamamladınız!");
            let userName = localStorage.getItem("playerName");
            updateHighScore(userName, score);
            localStorage.setItem("playerName",null);
        }
    }
    , 500);
}

function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    score++;
    document.querySelector(".score").textContent = score;
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
    score = 0;
    document.querySelector(".score").textContent = score;
    gridContainer.innerHTML = "";
    generateCards();
}
