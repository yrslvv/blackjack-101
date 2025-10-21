let _escHandlerBound = null;  // to remove listener cleanly on exit to menu

// Declaring Arrays for Deck, Player, and Dealer's Hands
let deck = [];
let playerHand = [];
let dealerHand = [];

const unicodeCards = {
  "A-S":"🂡","2-S":"🂢","3-S":"🂣","4-S":"🂤","5-S":"🂥","6-S":"🂦","7-S":"🂧","8-S":"🂨","9-S":"🂩","10-S":"🂪","J-S":"🂫","Q-S":"🂭","K-S":"🂮",
  "A-H":"🂱","2-H":"🂲","3-H":"🂳","4-H":"🂴","5-H":"🂵","6-H":"🂶","7-H":"🂷","8-H":"🂸","9-H":"🂹","10-H":"🂺","J-H":"🂻","Q-H":"🂽","K-H":"🂾",
  "A-D":"🃁","2-D":"🃂","3-D":"🃃","4-D":"🃄","5-D":"🃅","6-D":"🃆","7-D":"🃇","8-D":"🃈","9-D":"🃉","10-D":"🃊","J-D":"🃋","Q-D":"🃍","K-D":"🃎",
  "A-C":"🃑","2-C":"🃒","3-C":"🃓","4-C":"🃔","5-C":"🃕","6-C":"🃖","7-C":"🃗","8-C":"🃘","9-C":"🃙","10-C":"🃚","J-C":"🃛","Q-C":"🃝","K-C":"🃞"
};

// Building the Deck
function buildDeck(){
  let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  let suits = ["C", "D", "H", "S"]; // Clubs, Diamonds, Hearts, Spades
  deck = [];

  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < values.length; j++) {
      deck.push(values[j] + "-" + suits[i]);
    }
  }
  console.log(deck);
}

// Shuffling the Deck
function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    let j = Math.floor(Math.random() * deck.length);
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
}

// Drawing the Card
function drawCard() {
  return deck.pop();
}

// Creating the Card Element using Unicode
function createCardElement(cardCode) {
    const div = document.createElement('div');
    div.classList.add('card');
    div.textContent = cardCode === '🂠' ? '🂠' : unicodeCards[cardCode];
    return div;
}

// Rendering the Card Visuals onto the HTML Page
function renderHands() {
  // Getting the containers for the player's and dealer's cards so they can be displayed
  const dealerContainer = document.getElementById('dealer-cards');
  const playerContainer = document.getElementById('player-cards');

  // Clear any previously rendered cards
  dealerContainer.innerHTML = '';
  playerContainer.innerHTML = '';

  // Loop through Dealer's hand and create the visual for each card
  dealerHand.forEach((card,index) => {
    const cardDiv = createCardElement(index === 0 ? '🂠' : card);
    dealerContainer.appendChild(cardDiv);
  });

  // Loop through Player's hand and do the same thing above
    dealerHand.forEach((card,index) => {
    const cardDiv = createCardElement(card);
    playerContainer.appendChild(cardDiv);
  });
}

function startGame() {
  const app = document.getElementById('app');
  app.classList.remove('fade-out', 'fade-in');
  app.innerHTML = ''; // remove menu content

  // Light blue background to indicate "game" (Dev Note: Changed it to Green because light blue is too bright - Joe)
  document.body.style.backgroundColor = '#10943cff';

  // Minimal “game screen” placeholder 
  const gameScreen = document.createElement('div');
  gameScreen.id = 'gameRoot';
  gameScreen.innerHTML = `
    <h2>Blackjack Game</h2>

    <div id="dealer-area" class = "deck">
    <h3>Dealer</h3>
    <div id="dealer-cards" class = "card-container"></div>
    </div>

    <div id="player-area" class = "deck">
    <h3>Player</h3>
    <div id="player-cards" class = "card-container"></div>
    </div>

    <button id="hit-btn"> Hit </button>
    <button id="stand-btn"> Stand </button>
  `;
  app.appendChild(gameScreen);

  // Build the pause menu (hidden by default)
  buildPauseMenu();

  // Smooth fade-in
  setTimeout(() => app.classList.add('fade-in'), 100);

  // Listen for Esc during the game
  _escHandlerBound = handleGameKeyDown.bind(null);
  window.addEventListener('keydown', _escHandlerBound);

  buildDeck();
  shuffleDeck();

  playerHand = [drawCard(), drawCard()];
  dealerHand = [drawCard(), drawCard()];

  renderHands();
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
