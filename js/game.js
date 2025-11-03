let _escHandlerBound = null;  // to remove listener cleanly on exit to menu

// Declaring Arrays for Deck, Player, and Dealer's Hands
let deck = [];
let playerHand = [];
let dealerHand = [];
//tracks game states
let roundOver = false;
let dealerRevealed = false;

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

//helper function for calculating total hand values 
function calculateHandValue(hand) {
  let total = 0;
  let aces = 0;
  for (const code of hand) {
    const rank = code.split("-")[0];
    if (rank === "A") {
      aces += 1;
      total += 11;
    } else if (["K","Q","J","10"].includes(rank)) {
      total += 10;
    } else {
      total += parseInt(rank, 10);
    }
  }
  // downgrade Aces from 11 to 1 as needed
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return total;
}

// Creating the Card Element using Unicode
function createCardElement(cardCode) {
    const div = document.createElement('div');
    div.classList.add('card');

    const img = document.createElement('img');
    img.classList.add('card-image');

    if (cardCode === '🂠') {
        img.src = 'assets/cards/back.png'; // backside image
        img.alt = 'Card Back';
    } else {
        img.src = `assets/cards/${cardCode}.png`; // front image (e.g. "AS.png", "10H.png")
        img.alt = cardCode;
    }

    div.appendChild(img);
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
    const cardDiv = createCardElement((index === 0 && !dealerRevealed) ? '🂠' : card); //changed so that revealed upon stand or bust
    dealerContainer.appendChild(cardDiv);
  });

  // Loop through Player's hand and do the same thing above
  playerHand.forEach((card,index) => { 
    const cardDiv = createCardElement(card);
    playerContainer.appendChild(cardDiv);
  });

  // displays running totals for both sides under the buttons
  const status = document.getElementById('status');
  const pVal = calculateHandValue(playerHand);
  const dVal = dealerRevealed ? calculateHandValue(dealerHand) : '??';
  status.textContent = `Player: ${pVal}    |    Dealer: ${dVal}`;
}

// Function for playing sound effects
function playSound(soundFile, volume) {
  const audio = new Audio(soundFile);
  audio.volume = volume;
  audio.play().catch(err => console.warn('Sound not found:', err)); // Catch error if file is not found
}

// function for logging round updates
function updateStatus(msg) {
  const log = document.getElementById('statusLog');
  if (!log) return;
  const line = document.createElement('div');
  line.textContent = msg;
  log.appendChild(line);
}
// Helpers for enabling / disabling the hit and stand buttons since they lacked functionality before
function enableControls() {
  document.getElementById('hit-btn').disabled = false;
  document.getElementById('stand-btn').disabled = false;
}
function disableControls() {
  document.getElementById('hit-btn').disabled = true;
  document.getElementById('stand-btn').disabled = true;
}
// helper for ending the round
function endRound(finalMessage) {
  roundOver = true;
  dealerRevealed = true;
  renderHands();
  updateStatus(finalMessage);
  disableControls();

  // Create a container for post-round buttons
  const statusLog = document.getElementById('statusLog');
  const buttonContainer = document.createElement('div');
  buttonContainer.id = 'postRoundButtons';
  buttonContainer.style.marginTop = '16px';

  // "Try Again" button
  const tryAgainBtn = document.createElement('button');
  tryAgainBtn.textContent = 'Try Again';
  tryAgainBtn.addEventListener('click', () => {
    playSound('assets/sound/click.mp3', 1.0);
    startNewRound();
  });

  // "Quit" button
  const quitBtn = document.createElement('button');
  quitBtn.textContent = 'Quit';
  quitBtn.style.marginLeft = '10px';
  quitBtn.addEventListener('click', () => {
    playSound('assets/sound/click.mp3', 1.0);
    teardownGame();
    exitToMainMenu();
  });

  buttonContainer.appendChild(tryAgainBtn);
  buttonContainer.appendChild(quitBtn);
  statusLog.appendChild(buttonContainer);
}

// handles player pressing hit
function onHit() {
  if (roundOver) return;
  // draws & renders a card
  playerHand.push(drawCard());
  renderHands();

  // checks for bust or 21
  const pVal = calculateHandValue(playerHand);
  if (pVal > 21) {
    playSound('assets/sound/lose.mp3', 0.8);
    endRound(`Player busts with ${pVal}. Dealer wins.`);
  } else if (pVal === 21) {
    // auto-stand on 21
    updateStatus('Player has 21. Standing automatically.');
    onStand();
  }
}

function dealerPlay() {
  // reveals dealers cards
  dealerRevealed = true;
  renderHands();

  // Dealer hits until total >= 17
  let dVal = calculateHandValue(dealerHand);
  while (dVal < 17) {
    updateStatus(`Dealer hits at ${dVal}.`);
    dealerHand.push(drawCard());
    dVal = calculateHandValue(dealerHand);
    renderHands();
  }
  updateStatus(`Dealer stands at ${dVal}.`);
  return dVal;
}
// handles player pressing hit
function onStand() {
  if (roundOver) return;

  disableControls();
  const pVal = calculateHandValue(playerHand);

  const dVal = dealerPlay();

  // Resolve
  if (dVal > 21) {
    playSound('assets/sound/win.mp3', 0.8);
    endRound(`Dealer busts with ${dVal}. Player wins!`);
    return;
  }
  if (dVal > pVal) {
    playSound('assets/sound/lose.mp3', 0.8);
    endRound(`Dealer ${dVal} beats Player ${pVal}. Dealer wins.`);
  } else if (dVal < pVal) {
    playSound('assets/sound/win.mp3', 0.8);
    endRound(`Player ${pVal} beats Dealer ${dVal}. Player wins!`);
  } else {
    endRound(`Push at ${pVal}.`);
  }
}

function startGame() {
  const app = document.getElementById('app');
  app.classList.remove('fade-out', 'fade-in');
  app.innerHTML = ''; // remove menu content

  // Green background to indicate "game"
  document.body.style.backgroundColor = '#10943cff';

  // added running total text in the html
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
    <div id="controls">
    <button id="hit-btn">Hit</button>
    <button id="stand-btn">Stand</button>
    </div>

    <div id="status" style="margin-top:14px; font-weight:600;"></div>
    <div id="statusLog" style="margin-top:8px; opacity:0.9;"></div>
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

  roundOver = false;
  dealerRevealed = false;

  playerHand = [drawCard(), drawCard()];
  dealerHand = [drawCard(), drawCard()];

  // attached button events for hit and stand
  document.getElementById('hit-btn').addEventListener('click', () => {
    playSound('assets/sound/hit.mp3', 0.5);
    onHit();
  });

  document.getElementById('stand-btn').addEventListener('click', () => {
    playSound('assets/sound/click.mp3', 1.0);
    onStand();
  });;

  enableControls();
  
  renderHands();

  //Check for player blackjack from initial hand given
  const playerTotal = calculateHandValue(playerHand);
  if (playerTotal==21){
    endRound('Blackjack! Player wins automatically with 21.');
  }
  
}

function startNewRound() {
  // Clear previous status messages and buttons
  const log = document.getElementById('statusLog');
  if (log) log.innerHTML = '';

  roundOver = false;
  dealerRevealed = false;

  // Reset hands and deck
  buildDeck();
  shuffleDeck();
  playerHand = [drawCard(), drawCard()];
  dealerHand = [drawCard(), drawCard()];

  enableControls();
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
    playSound('assets/sound/click.mp3', 1.0);
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
