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

window.goToLeaderboard = function () {
    getLeaderboard().then((leaderboardData) => {
        window.location.href = 'board.html';
    }).catch((error) => {
        console.error("Veri çekme hatası:", error);
    });
}
