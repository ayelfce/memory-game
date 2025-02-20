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

document.addEventListener("DOMContentLoaded", function () {
    let savedName = localStorage.getItem("playerName");

    if ((savedName == "null") || (savedName == null)) {
        document.getElementById("nameModal").style.display = "flex";
    }
    else {
        console.log("Kayıtlı isim bulundu:", savedName);
        document.getElementById("nameModal").style.display = "none";
        document.getElementById("gameContent").classList.remove("hidden");
    }
   

    document.getElementById("startButton").addEventListener("click", function () {
        let name = document.getElementById("playerName").value.trim();

        if (name) {
            console.log("Girilen isim:", name);
            localStorage.setItem("playerName", name);
            sessionStorage.setItem("modalShown", "true"); // Modalın bir kere açıldığını işaretle
            
            document.getElementById("nameModal").style.display = "none";
            document.getElementById("gameContent").classList.remove("hidden"); 

            if (typeof addUserToDatabase === "function") {
                addUserToDatabase(name);
            } else {
                console.error("addUserToDatabase fonksiyonu bulunamadı!");
            }
        } else {
            alert("Lütfen bir isim girin!");
        }
    });
});
