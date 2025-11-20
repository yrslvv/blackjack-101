let _escHandlerBound = null;  // to remove listener cleanly on exit to menu

// Declaring Arrays for Deck, Player, and Dealer's Hands
let deck = [];
let playerHand = [];
let dealerHand = [];
//tracks game states
let roundOver = false;
let dealerRevealed = false;
//Betting vars
let playerChips = 1000;
let currentBet = 0;
//tutorial vars
let isTutorial = false;
let tutorialDeck = null;

// --- Skeletal Tooltips -- simple plain-text tips shown on user turns ---
const Tips = {
  list: [
  "Tip: Dealer always until 16 and stands on 17 or higher.",
  "Tip: Try and get as close to 21 as possible but don't go over!",
  "Tip: An Ace can either count as an 11 or 1",
  "Tip: If you have a hand that is 17 or higher, it's usually best to stand.",
  "Tip: Face cards are all worth 10 points.",
  "Tip: Going over 21 means that you automatically lose.",
  "Tip: Dealer plays by fixed rules, you can use this to your advantage.",
  "Tip: A 'soft 17' is a hand which equals 17 but includes an ace.",
  "Tip: Pay attention to the dealers face up card before deciding if you should hit.",
  "Tip: A 10 or a face card is the most common cause of a draw.",
  "Tip: If the dealer has a weak face card, it may be smart to stand early.",
  "Tip: If you have 12–16 and the dealer shows a 7 or higher, you may consider hitting.",
  "Tip: The goal is not to hit 21, but to beat the dealers hand.",
  "Tip: You cannot bust on your first two cards, so think before you consider hitting.",
  "Tip: Blackjack (an Ace + a 10) pays more than a regular win.",
  "Tip: Click the tooltip to hide it at any time.",
  "Tip: You can replay the game at any time using the menu."
  ],
  i: -1,
  el: null,

  init() {
    if (this.el) return;
    this.el = document.createElement("div");
    this.el.id = "tooltip";
    this.el.setAttribute("role", "button");
    this.el.setAttribute("tabindex", "0");
    this.el.setAttribute("aria-label", "Game tip. Click to dismiss.");
    this.el.addEventListener("click", () => this.hide());
    this.el.addEventListener("keydown", (e) => {
      if (["Escape", "Enter", " "].includes(e.key)) this.hide();
    });
    document.body.appendChild(this.el);
    this.el.classList.add("hidden"); // hidden until first tip
  },

  show(text) {
    this.init();
    this.el.classList.remove("hidden");
    this.el.textContent = text;
  },

  hide() {
    if (!this.el) return;
    this.el.classList.add("hidden");
  },

  next() {
  if (!this.list.length) return;
  this.i = Math.floor(Math.random() * this.list.length);
  this.show(this.list[this.i]);
  }
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
  if (isTutorial && tutorialDeck && tutorialDeck.length > 0) {
    return tutorialDeck.shift();
  }
  
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

//Update chip balance
function updateChipDisplay() {
  const balanceEl = document.getElementById("chipBalance");
  if (balanceEl) balanceEl.textContent = playerChips;
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
  
  let pVal = calculateHandValue(playerHand);
  let dVal = calculateHandValue(dealerHand);
  let message = finalMessage;

  // --- Betting outcome ---
  if (pVal > 21) {
    // player busts, lose bet
    message += ` You lost $${currentBet}.`;
  } else if (dVal > 21 || pVal > dVal) {
    // player wins
    let winnings = currentBet * 2;
    playerChips += winnings;
    message += ` You won $${currentBet}!`;
  } else if (pVal === dVal) {
    // push, refund bet
    playerChips += currentBet;
    message += " Push! — your bet is returned.";
  } else {
    // dealer wins
    message += ` Dealer wins. You lost $${currentBet}.`;
  }

  updateStatus(message);
  updateChipDisplay();
  disableControls();

  // Reset bet for next round
  currentBet = 0;

  // Re-enable betting for next round (only in regular game mode)
  if (!isTutorial) {
    const betBtn = document.getElementById("placeBet-btn");
    const betInput = document.getElementById("betAmount");
    if (betBtn && betInput) {
      betBtn.disabled = false;
      betInput.disabled = false;
    }
  }

  Tips.hide();
  
  // Remove any button highlights from tutorial
  document.querySelectorAll('.tutorial-highlight').forEach(el => {
    el.classList.remove('tutorial-highlight');
  });
  
  // Remove tutorial info button when round ends
  if (isTutorial) {
    const tutorialInfoBtn = document.getElementById('tutorialInfoBtn');
    if (tutorialInfoBtn) {
      tutorialInfoBtn.remove();
    }
  }


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
    
    if(isTutorial){
      restartCurrentTutorial();
    }
    else{
      startNewRound();
    }
  });
  buttonContainer.appendChild(tryAgainBtn);

  // "Next Tutorial" button (only in tutorial mode)
  if (isTutorial) {
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next Tutorial';
    nextBtn.style.marginLeft = '10px';
    nextBtn.addEventListener('click', () => {
      playSound('assets/sound/click.mp3', 1.0);
      startNextTutorial();
    });
    buttonContainer.appendChild(nextBtn);
  }

  // "Quit" button
  const quitBtn = document.createElement('button');
  quitBtn.textContent = 'Quit';
  quitBtn.style.marginLeft = '10px';
  quitBtn.addEventListener('click', () => {
    playSound('assets/sound/click.mp3', 1.0);
    teardownGame();
    exitToMainMenu();
  });
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
  if (!roundOver) Tips.next();
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
  Tips.next();
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

    <div id="betting-area">
    <h4>Betting</h4>
    <p>Balance: $<span id="chipBalance">1000</span></p>
    <input type="number" id="betAmount" placeholder="Enter bet" min="10" max="500" value="100">
    <button id="placeBet-btn">Place Bet</button>
    </div>



    </div>
    <div id="controls">
    <button id="hit-btn">Hit</button>
    <button id="stand-btn">Stand</button>
    </div>

    <div id="status" style="margin-top:14px; font-weight:600;"></div>
    <div id="statusLog" style="margin-top:8px; opacity:0.9;"></div>
  `;
  app.appendChild(gameScreen);
  
  // Betting logic
  document.getElementById("placeBet-btn").addEventListener("click", () => {
  const betInput = document.getElementById("betAmount");
  const betValue = parseInt(betInput.value);

  if (isNaN(betValue) || betValue <= 0) {
    alert("Please enter a valid bet amount!");
    return;
  }
  if (betValue > playerChips) {
    alert("You don’t have enough chips for that bet!");
    return;
  }

  currentBet = betValue;
  playerChips -= betValue;
  updateChipDisplay();

  // Disable betting UI during round
  document.getElementById("placeBet-btn").disabled = true;
  betInput.disabled = true;

  // Start first round after placing a bet
  startNewRound();
  });


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

  Tips.next();
  //Check for player blackjack from initial hand given
  const playerTotal = calculateHandValue(playerHand);
  if (playerTotal==21){
    endRound('Blackjack! Player wins automatically with 21.');
  }

  //update chip display
  updateChipDisplay();


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
  Tips.next();
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
  
  // Clean up tutorial state
  isTutorial = false;
  tutorialDeck = null;
  
  // Remove tutorial modal if it exists
  const modal = document.getElementById('tutorialModal');
  if (modal) {
    modal.remove();
  }
  
  // Remove button highlights
  document.querySelectorAll('.tutorial-highlight').forEach(el => {
    el.classList.remove('tutorial-highlight');
  });
  
  // Remove pause UI elements to avoid duplicates on next game start
  const panel = document.getElementById('pauseMenu');
  const overlay = document.getElementById('pauseOverlay');
  panel?.remove();
  overlay?.remove();

  // Clear game root
  const app = document.getElementById('app');
  app.innerHTML = '';
} '';

