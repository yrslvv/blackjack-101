let _escHandlerBound = null;  // to remove listener cleanly on exit to menu

function startGame() {
  const app = document.getElementById('app');
  app.classList.remove('fade-out', 'fade-in');
  app.innerHTML = ''; // remove menu content

  // Light blue background to indicate "game"
  document.body.style.backgroundColor = '#add8e6';

  // Minimal “game screen” placeholder 
  const gameScreen = document.createElement('div');
  gameScreen.id = 'gameRoot';
  gameScreen.innerHTML = `
    <h2>Blackjack Game Placeholder</h2>
    <p>Press <kbd>Esc</kbd> to open the side menu.</p>
  `;
  app.appendChild(gameScreen);

  // Build the pause menu (hidden by default)
  buildPauseMenu();

  // Smooth fade-in
  setTimeout(() => app.classList.add('fade-in'), 100);

  // Listen for Esc during the game
  _escHandlerBound = handleGameKeyDown.bind(null);
  window.addEventListener('keydown', _escHandlerBound);
}


// Creates the pause (side) menu + overlay once per game start.
function buildPauseMenu() {
  let overlay = document.getElementById('pauseOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'pauseOverlay';
    document.body.appendChild(overlay);
  }

  // Panel
  let panel = document.getElementById('pauseMenu');
  if (!panel) {
    panel = document.createElement('aside');
    panel.id = 'pauseMenu';
    panel.setAttribute('aria-hidden', 'true');
    panel.setAttribute('aria-label', 'Pause Menu'); 

    panel.innerHTML = `
      <h3>Paused</h3>
      <p>Use the buttons below to continue or exit to main menu.</p>
      <div class="menu-actions">
        <button id="btnContinue">Continue</button>
        <button id="btnExitToMenu">Exit to Main Menu</button>
      </div>
    `;

    document.body.appendChild(panel);
  }

  // Wire buttons
  document.getElementById('btnContinue').addEventListener('click', () => {
    closePauseMenu();
  });

  document.getElementById('btnExitToMenu').addEventListener('click', () => {
    // Cleanup game listeners/UI before returning to main menu
    teardownGame();
    exitToMainMenu();
  });
}


// Handles keydown events during the game.
// Currently toggles the pause menu with Esc.
function handleGameKeyDown(e) {
  if (e.key === 'Escape') {
    const isOpen = document.getElementById('pauseMenu')?.classList.contains('open');
    if (isOpen) {
      closePauseMenu();
    } else {
      openPauseMenu();
    }
  }
}

// Opens the pause menu and overlay; consider pausing timers/loops here. 
function openPauseMenu() {
  const panel = document.getElementById('pauseMenu');
  const overlay = document.getElementById('pauseOverlay');
  if (!panel || !overlay) return;

  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
  overlay.classList.add('visible');

  // Optional: move focus for accessibility
  const firstButton = document.getElementById('btnContinue');
  if (firstButton) firstButton.focus();
}

// Closes the pause menu and overlay; consider resuming timers/loops here. 
function closePauseMenu() {
  const panel = document.getElementById('pauseMenu');
  const overlay = document.getElementById('pauseOverlay');
  if (!panel || !overlay) return;

  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
  overlay.classList.remove('visible');

  // Optional: return focus to game root
  const root = document.getElementById('gameRoot');
  if (root) root.focus?.();
}


// Cleans up game-specific listeners/UI before leaving the game.
// Fot future devs: stop intervals, animations, sounds, and save state here.
function teardownGame() {
  if (_escHandlerBound) {
    window.removeEventListener('keydown', _escHandlerBound);
    _escHandlerBound = null;
  }

  // Remove pause UI elements to avoid duplicates on next game start
  const panel = document.getElementById('pauseMenu');
  const overlay = document.getElementById('pauseOverlay');
  panel?.remove();
  overlay?.remove();

  // Clear game root
  const app = document.getElementById('app');
  app.innerHTML = '';
}
