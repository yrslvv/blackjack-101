// Each scenario defines a specific pre–rigged sequence.
const tutorialScenarios = [
  {
    title: "Tutorial 1 template",
    description: "placeholder",
    deck: [
      "10-H", // Player card 1
      "A-S",  // Player card 2
      "7-C",  // Dealer card 1
      "8-D",  // Dealer card 2
      "10-C"  // on-hit card
    ]
  },
  {
    title: "Tutorial 2 template",
    description: "lol i don't think you're gonna win",
    deck: [
      "10-H",  // Player card 1
      "3-C",  // Player card 2
      "9-S",  // Dealer card 1
      "6-D",  // Dealer card 2
      "10-H"   // on-hit card
    ]
  }
  // add more scenarios here later
];

let currentTutorialIndex = 0; // which element of the array we're on

function startTutorialGame(index = 0) {
  isTutorial = true;
  currentTutorialIndex = index;

  const scenario = tutorialScenarios[currentTutorialIndex];

  // Clone deck
  tutorialDeck = scenario.deck.slice();

  const app = document.getElementById("app");
  app.classList.remove("fade-out", "fade-in");
  app.innerHTML = "";

  document.body.style.backgroundColor = "#10943cff";

  const gameScreen = document.createElement("div");
  gameScreen.id = "gameRoot";
  gameScreen.innerHTML = `
    <h2>Blackjack Tutorial</h2>
    <h3>${scenario.title}</h3>
    <p>${scenario.description}</p>

    <div id="dealer-area" class="deck">
      <h3>Dealer</h3>
      <div id="dealer-cards" class="card-container"></div>
    </div>

    <div id="player-area" class="deck">
      <h3>Player</h3>
      <div id="player-cards" class="card-container"></div>

      <div id="betting-area">
        <h4>Betting (Tutorial)</h4>
        <p>Balance: $<span id="chipBalance">${playerChips}</span></p>
        <p>Your bet is fixed at $100 for this tutorial.</p>
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

  currentBet = 100;
  playerChips -= currentBet;
  updateChipDisplay();

  buildPauseMenu();
  setTimeout(() => app.classList.add("fade-in"), 100);

  _escHandlerBound = handleGameKeyDown.bind(null);
  window.addEventListener("keydown", _escHandlerBound);

  roundOver = false;
  dealerRevealed = false;

  // Deal cards from the rigged tutorialDeck using drawCard()
  playerHand = [drawCard(), drawCard()];
  dealerHand = [drawCard(), drawCard()];

  document.getElementById("hit-btn").addEventListener("click", () => {
    playSound("assets/sound/hit.mp3", 0.5);
    onHit();
  });

  document.getElementById("stand-btn").addEventListener("click", () => {
    playSound("assets/sound/click.mp3", 1.0);
    onStand();
  });

  enableControls();
  renderHands();

}

// Replay current scenario
function restartCurrentTutorial() {
  startTutorialGame(currentTutorialIndex);
}

// Go to the next scenario, or exit if we're done
function startNextTutorial() {
  const nextIndex = currentTutorialIndex + 1;
  if (nextIndex < tutorialScenarios.length) {
    startTutorialGame(nextIndex);
  } else {
    // finished all tutorials: go back to menu
    teardownGame();
    exitToMainMenu();
  }
}