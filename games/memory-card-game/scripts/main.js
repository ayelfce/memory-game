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

document.addEventListener("DOMContentLoaded", async function () {
    const easyContainer = document.querySelector(".actions.easy");
    const normalContainer = document.querySelector(".actions.normal");
    const hardContainer = document.querySelector(".actions.hard");

    try {
        const res = await fetch("../data/levels.json");
        const difficultyData = await res.json();

        // Easy, Normal ve Hard için dinamik buton ekleme
        difficultyData.forEach(difficulty => {
            let container;

            if (difficulty.diff === "easy") {
                container = easyContainer;
            } else if (difficulty.diff === "normal") {
                container = normalContainer;
            } else if (difficulty.diff === "hard") {
                container = hardContainer;
            }

            if (container) {
                container.style.display = "flex";
                container.style.flexDirection = "column";

                let rowContainer = null;

                difficulty.levels.forEach((level, index) => {
                    const button = document.createElement("button");
                    button.textContent = level.id.split("-")[1];  // easy-1 → "1"
                    button.onclick = () => selectDifficulty(level.id);

                    // Eğer 5 buton yerleştirildiyse yeni satır
                    if (index % 3 === 0) {
                        rowContainer = document.createElement("div");
                        rowContainer.style.display = "flex";
                        rowContainer.style.justifyContent = "space-between";
                        container.appendChild(rowContainer);
                    }

                    rowContainer.appendChild(button);
                });
            }
        });

    } catch (error) {
        console.error("Hata:", error);
    }
});

async function nextLevel() {
    const currentLevel = localStorage.getItem("selectedDifficulty");

    if (!currentLevel) {
        console.error("Mevcut seviye bulunamadı!");
        return;
    }

    try {
        const res = await fetch("../data/levels.json");
        const levelsData = await res.json();

        let nextLevelId = null;
        let found = false;

        for (let i = 0; i < levelsData.length; i++) {
            const difficulty = levelsData[i];

            for (let j = 0; j < difficulty.levels.length; j++) {
                if (difficulty.levels[j].id === currentLevel) {
                    found = true;

                    if (j + 1 < difficulty.levels.length) {
                        // Aynı zorluk seviyesindeki bir sonraki seviyeye geç
                        nextLevelId = difficulty.levels[j + 1].id;
                    } else if (i + 1 < levelsData.length) {
                        // Mevcut seviyenin sonuna gelindiyse bir sonraki zorluğa geç
                        nextLevelId = levelsData[i + 1].levels[0].id;
                    }
                    break;
                }
            }

            if (found) break; // Seviye bulunduğunda döngüyü durdur
        }

        if (nextLevelId) {
            localStorage.setItem("selectedDifficulty", nextLevelId);
            setTimeout(() => {
                window.location.href = "game.html";
            }, 100);
        } else {
            console.log("Tüm seviyeler tamamlandı!");
        }
    } catch (error) {
        console.error("Hata:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const nextButton = document.getElementById("nextLevelButton");

    if (nextButton) {
        nextButton.addEventListener("click", nextLevel);
    }
});
