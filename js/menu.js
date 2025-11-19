// Displays the main menu UI.
function showMainMenu() {
  const app = document.getElementById('app');
  document.body.style.backgroundColor = '#0b132b'; // reset to dark background
  app.classList.remove('fade-out', 'fade-in');
  app.innerHTML = `
    <h1>Blackjack Learner</h1>
    <div id = "menuButtons">
    <button id="playBtn">Play</button>
    <button id="tutorialBtn">Tutorial</button>
    <button id="exitBtn">Exit</button>
    </div>
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

  document.getElementById('tutorialBtn').addEventListener('click', () => {
    playSound('assets/sound/stand.mp3', 1.0);
    fadeOutAndStartTutorial();
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

function fadeOutAndStartTutorial() {
  const app = document.getElementById('app');
  app.classList.remove('fade-in');
  app.classList.add('fade-out');

  setTimeout(() => startTutorialGame(0), 500); // start at scenario 0, you can change this to save state when quiting
}
