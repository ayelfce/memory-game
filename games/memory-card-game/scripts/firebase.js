import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, get, child, update, remove } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { firebaseConfig } from "../config.js";

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Realtime Database referansını al
const database = getDatabase(app);
const usersRef = ref(database, 'users');
const leadsRef = ref(database, 'leaderboard');

export function getLeaderboard() {
  return get(leadsRef)  // Bu satır bir Promise döndürür
    .then((snapshot) => {
      if (snapshot.exists()) {
        const leaderboard = snapshot.val();
        console.log("Leaderboard Data:", leaderboard);
        return leaderboard;
      } else {
        console.log("No data available");
        return {};
      }
    })
    .catch((error) => {
      console.error("Error getting leaderboard:", error);
      return {};
    });
}

window.getLeaderboard = getLeaderboard;

export function updateHighScore(userName, newScore) {
  const userRef = child(usersRef, userName);

  get(userRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        // User exists, check high score
        const userData = snapshot.val();
        const currentHighScore = userData.highScore || 0; // Handle case where highScore might not exist

        if (newScore > currentHighScore) {
          // Update high score
          update(userRef, { highScore: newScore })
            .then(() => {
              console.log(`High score for ${userName} updated to ${newScore}`)

              get(leadsRef).then((snapshot) => {
                if (snapshot.exists()) {
                  const leaderboard = snapshot.val();
                  console.log(leaderboard.length);
                  for (let i = 1; i < leaderboard.length; i++) {
                    if (newScore > leaderboard[i].score) {
                      for (let j = leaderboard.length - 1; j > i; j--) {
                        leaderboard[j] = leaderboard[j - 1];
                      }
                      leaderboard[i] = { name: userName, score: newScore };
                      const updates = {};
                      updates[`/leaderboard`] = leaderboard;
                      update(ref(database), updates)
                        .then(() => console.log(`Leaderboard updated`))
                        .catch((error) => console.error("Error updating leaderboard:", error));
                      break;
                    }
                  }

                }
              })
            })
            .catch((error) => console.error("Error updating high score:", error));
        } else {
          console.log(`New score for ${userName} is not a high score.`);
        }
      } else {
        // User doesn't exist, create a new user
        const newUser = {
          highScore: newScore
        };
        set(userRef, newUser)
          .then(() => console.log(`New user ${userName} created with high score ${newScore}`))
          .catch((error) => console.error("Error creating new user:", error));
      }
    })
    .catch((error) => console.error("Error reading user data:", error));
}

window.updateHighScore = updateHighScore;

export function addUserToDatabase(userName) {
  const userRef = ref(database, "users/" + userName);

  get(userRef).then((snapshot) => {
    if (!snapshot.exists()) {
      // Eğer kullanıcı yoksa, yeni kullanıcı oluştur
      set(userRef, {
        highScore: 0
      })
        .then(() => console.log(`Yeni kullanıcı ${userName} eklendi.`))
        .catch(error => console.error("Hata:", error));
    } else {
      console.log(`Kullanıcı ${userName} zaten kayıtlı.`);
    }
  }).catch(error => console.error("Hata:", error));
}

window.addUserToDatabase = addUserToDatabase;


// Ornek Kullanim
// const userId = "deneme_user";
// const newScore = 150;
// updateHighScore(userId, newScore);
// HTML içinde kullanımında <script src="firebase.js" type="module"></script> seklinde import edilmelidir.