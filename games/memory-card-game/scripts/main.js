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


