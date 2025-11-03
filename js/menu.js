// Displays the main menu UI.
function showMainMenu() {
  const app = document.getElementById('app');
  document.body.style.backgroundColor = '#0b132b'; // reset to dark background
  app.classList.remove('fade-out', 'fade-in');
  app.innerHTML = `
    <h1>Blackjack Learner</h1>
    <button id="playBtn">Play</button>
    <button id="exitBtn">Exit</button>
  `;

  // Fade in menu
  setTimeout(() => app.classList.add('fade-in'), 50);

  // Event listeners
  document.getElementById('playBtn').addEventListener('click', () => {
    playSound('assets/sound/stand.mp3', 1.0);
    fadeOutAndStartGame();
  });

  document.getElementById('exitBtn').addEventListener('click', () => {
    playSound('assets/sound/stand.mp3', 1.0);
    closeApp();
  });
}


// Handles fade-out transition, then launches game.
function fadeOutAndStartGame() {
  const app = document.getElementById('app');
  app.classList.remove('fade-in');
  app.classList.add('fade-out');

  // Wait for animation to complete before switching
  setTimeout(() => startGame(), 500);
}
