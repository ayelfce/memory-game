import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, get, child, update, remove } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBTGhmoT8vjwKYMEP23-1ob9RsGg7zp3gc",
  authDomain: "memory-cards-5d05b.firebaseapp.com",
  databaseURL: "https://memory-cards-5d05b-default-rtdb.firebaseio.com",
  projectId: "memory-cards-5d05b",
  storageBucket: "memory-cards-5d05b.firebasestorage.app",
  messagingSenderId: "445447572363",
  appId: "1:445447572363:web:fe94b66a3789193d37bd8e"
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Realtime Database referansını al
const database = getDatabase(app);
const usersRef = ref(database, 'users');

function updateHighScore(userId, newScore) {
  const userRef = child(usersRef, userId);

  get(userRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        // User exists, check high score
        const userData = snapshot.val();
        const currentHighScore = userData.highScore || 0; // Handle case where highScore might not exist

        if (newScore > currentHighScore) {
          // Update high score
          update(userRef, { highScore: newScore })
            .then(() => console.log(`High score for ${userId} updated to ${newScore}`))
            .catch((error) => console.error("Error updating high score:", error));
        } else {
          console.log(`New score for ${userId} is not a high score.`);
        }
      } else {
        // User doesn't exist, create a new user
        const newUser = {
          highScore: newScore
        };
        set(userRef, newUser)
          .then(() => console.log(`New user ${userId} created with high score ${newScore}`))
          .catch((error) => console.error("Error creating new user:", error));
      }
    })
    .catch((error) => console.error("Error reading user data:", error));
}

window.updateHighScore = updateHighScore;

function addUserToDatabase(userName) {
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