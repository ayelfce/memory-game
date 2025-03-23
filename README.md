# 🃏 Memory Cards Game

A browser-based memory card matching game with multiple difficulty levels, score tracking, and leaderboard functionality.

This project is hosted using GitHub Pages. You can access the project [here](https://ayelfce.github.io/memory-game/).

## ⭐ Features
- 🎮 **Multiple Difficulty Levels**: Easy, Normal, and Hard modes with progressively challenging card layouts and time limits  
- 🏆 **Score System**: Points awarded based on matching accuracy and level difficulty  
- 🌍 **Leaderboard**: Global leaderboard using Firebase Realtime Database  
- 📱 **Responsive Design**: Works on various device sizes (desktop, tablet, mobile)  
- 🔐 **User Authentication**: Simple username system for score tracking  

## 🎯 Game Mechanics
- Flip pairs of cards to find matches  
- Score higher by making fewer mistakes  
- Beat the timer to complete each level  
- Progress through increasingly difficult levels  

## 📁 Project Structure
- /data - JSON configuration files for cards and level settings
- /images - Card face images and logo assets
- /pages - HTML files for different game screens
- /scripts - JavaScript logic for game functionality
- /style - CSS styling for the application

## ⚙️ Technical Implementation
- **JavaScript**: Core game logic without frameworks  
- **Firebase**: Backend for user data and leaderboard  
- **Responsive CSS**: Adapts to different screen sizes and orientations  

## 🛠️ Setup Instructions
1. Clone the repository  
2. Create a Firebase project and set up Realtime Database  
3. Copy `config.example.js` to `config.js` and add your Firebase credentials  
4. Open `menu.html` in a browser to start the game  

## 🔥 Firebase Configuration
The game requires a Firebase Realtime Database for storing user scores and leaderboard data. Configure your Firebase project settings in `config.js` based on the example provided.

## 🌍 Browser Compatibility
The game works on modern browsers that support ES6 features and modules.
