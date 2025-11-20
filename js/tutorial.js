// REPLACE YOUR ENTIRE tutorial.js WITH THIS VERSION

const tutorialScenarios = [
  {
    title: "Tutorial 1: Understanding Blackjack",
    description: "Learn when you have a strong hand and should stand",
    deck: [
      "K-H",  // Player card 1 (10)
      "A-S",  // Player card 2 (11) = 21 Blackjack!
      "7-C",  // Dealer card 1
      "8-D"   // Dealer card 2
    ],
    steps: [
      {
        trigger: "start",
        title: "Perfect Hand - Blackjack!",
        explanation: "You have a King (worth 10) and an Ace (worth 11), which equals 21 - this is called a Blackjack! This is the best possible starting hand. When you have 21, the game will automatically stand for you since you cannot improve your hand.",
        recommendation: "Stand (automatic)"
      }
    ]
  },
  {
    title: "Tutorial 2: When to Hit",
    description: "Learn when your hand is weak and you should hit",
    deck: [
      "5-H",  // Player card 1
      "8-C",  // Player card 2 (total: 13)
      "10-S", // Dealer card 1 (showing 10 - strong)
      "6-D",  // Dealer card 2 (hidden)
      "7-H"   // Hit card (brings player to 20)
    ],
    steps: [
      {
        trigger: "start",
        title: "Weak Hand vs Strong Dealer",
        explanation: "You have 13 (5 + 8). The dealer is showing a 10, which is a strong card. Basic strategy says: when you have 12-16 and the dealer shows 7 or higher, you should HIT because the dealer likely has a strong hand. You need to improve your total.",
        recommendation: "Hit",
        highlightButtons: ["hit-btn"]
      },
      {
        trigger: "afterHit",
        title: "Strong Hand - Time to Stand",
        explanation: "Great! You drew a 7, bringing your total to 20 (5 + 8 + 7). This is an excellent hand. With 20, you should always STAND because the risk of busting is high and 20 wins most of the time.",
        recommendation: "Stand",
        highlightButtons: ["stand-btn"]
      }
    ]
  },
  {
    title: "Tutorial 3: Avoiding a Bust",
    description: "Learn when hitting is too risky",
    deck: [
      "10-H", // Player card 1
      "8-C",  // Player card 2 (total: 18)
      "5-S",  // Dealer card 1 (showing 5 - weak)
      "10-D"  // Dealer card 2 (hidden)
    ],
    steps: [
      {
        trigger: "start",
        title: "Strong Hand vs Weak Dealer",
        explanation: "You have 18 (10 + 8). The dealer is showing a 5, which is a weak card - dealers often bust when showing 4, 5, or 6. With 18, hitting risks busting (going over 21). Basic strategy: STAND on 17+ when the dealer shows a weak card. Let the dealer take the risk!",
        recommendation: "Stand",
        highlightButtons: ["stand-btn"]
      }
    ]
  },
  {
    title: "Tutorial 4: The Danger Zone",
    description: "Learn about the trickiest hands (12-16)",
    deck: [
      "9-H",  // Player card 1
      "6-C",  // Player card 2 (total: 15)
      "7-S",  // Dealer card 1 (showing 7 - strong)
      "10-D", // Dealer card 2 (hidden)
      "10-H"  // Hit card (busts player to 25)
    ],
    steps: [
      {
        trigger: "start",
        title: "The Danger Zone: 15",
        explanation: "You have 15 (9 + 6) - this is called the 'danger zone' because you're likely to bust if you hit, but 15 rarely wins. The dealer shows 7 (strong), so they probably have 17 or better. Basic strategy says HIT because standing on 15 against a strong dealer rarely wins. It's a tough situation, but hitting gives you the best chance.",
        recommendation: "Hit (risky but necessary)",
        highlightButtons: ["hit-btn"]
      },
      {
        trigger: "afterBust",
        title: "Bust - A Learning Moment",
        explanation: "You busted by drawing a 10 (9 + 6 + 10 = 25). This shows why 12-16 are the hardest hands in blackjack - you're caught between a rock and a hard place. Even though you lost, hitting was still the correct strategic play. Over many hands, this decision wins more than standing would.",
        recommendation: "Learn from this"
      }
    ]
  },
  {
    title: "Tutorial 5: The Flexible Ace",
    description: "Learn how Aces can count as 1 or 11",
    deck: [
      "A-H",  // Player card 1 (11)
      "5-C",  // Player card 2 (5) = soft 16
      "9-S",  // Dealer card 1
      "7-D",  // Dealer card 2
      "10-H", // First hit card (Ace becomes 1, total: 16)
      "4-C"   // Second hit card (total: 20)
    ],
    steps: [
      {
        trigger: "start",
        title: "Soft Hands - The Ace Advantage",
        explanation: "You have Ace-5. This is called a 'soft 16' because the Ace counts as 11 right now (11 + 5 = 16), but can change to 1 if needed. The beauty of soft hands is you CANNOT bust on the next card! If you draw a 10, the Ace automatically becomes 1 (1 + 5 + 10 = 16). Always hit soft 16 or lower.",
        recommendation: "Hit (safe with soft hand)",
        highlightButtons: ["hit-btn"]
      },
      {
        trigger: "afterHit",
        title: "Ace Flexibility in Action",
        explanation: "You drew a 10. Your Ace automatically changed from 11 to 1 to prevent a bust (1 + 5 + 10 = 16). Now you have a 'hard 16' and must decide carefully. Against the dealer's 9, basic strategy still suggests hitting one more time, though this is risky.",
        recommendation: "Hit again",
        highlightButtons: ["hit-btn"]
      },
      {
        trigger: "afterHit2",
        title: "Perfect Draw!",
        explanation: "Excellent! You drew a 4, bringing your total to 20 (A + 5 + 10 + 4 = 20). This is a great hand. Now you should STAND and see if you can beat the dealer.",
        recommendation: "Stand",
        highlightButtons: ["stand-btn"]
      }
    ]
  },
  {
    title: "Tutorial 6: When Dealer Shows Weak",
    description: "Learn to play conservatively against weak dealer cards",
    deck: [
      "10-H", // Player card 1
      "4-C",  // Player card 2 (total: 14)
      "6-S",  // Dealer card 1 (weak!)
      "10-D", // Dealer card 2 (hidden)
      "Q-H"   // Dealer bust card
    ],
    steps: [
      {
        trigger: "start",
        title: "Dealer Weakness - Your Advantage",
        explanation: "You have 14 (10 + 4), which is normally a weak hand. However, the dealer is showing a 6, which is one of the weakest cards. Dealers must hit until they reach 17, and with a 6 showing, they often bust. Basic strategy: STAND on 12-16 when dealer shows 2-6. Let them bust!",
        recommendation: "Stand",
        highlightButtons: ["stand-btn"]
      }
    ]
  },
  {
    title: "Tutorial 7: Double Aces",
    description: "Learn about soft 12 and how to play multiple low cards",
    deck: [
      "A-H",  // Player card 1
      "A-C",  // Player card 2 (soft 12: 11 + 1)
      "10-S", // Dealer card 1
      "7-D",  // Dealer card 2
      "8-H"   // Hit card (brings to soft 20)
    ],
    steps: [
      {
        trigger: "start",
        title: "Two Aces - Soft 12",
        explanation: "You have two Aces! One counts as 11 and one counts as 1, giving you 12 (11 + 1). This is a 'soft 12' - you cannot bust on the next card because if you draw anything, one Ace will adjust. Always hit soft 17 or lower. This is a safe opportunity to improve your hand.",
        recommendation: "Hit",
        highlightButtons: ["hit-btn"]
      },
      {
        trigger: "afterHit",
        title: "Excellent Result!",
        explanation: "Perfect! You drew an 8. Your hand is now: Ace (11) + Ace (1) + 8 = 20. This is a very strong hand. The dealer shows 10, but you have an excellent chance to win with 20. STAND here.",
        recommendation: "Stand",
        highlightButtons: ["stand-btn"]
      }
    ]
  },
  {
    title: "Tutorial 8: Dealer Showing Ace",
    description: "Learn how to play against the dealer's strongest card",
    deck: [
      "10-H", // Player card 1
      "7-C",  // Player card 2 (total: 17)
      "A-S",  // Dealer card 1 (very strong!)
      "9-D"   // Dealer card 2 (dealer has 20)
    ],
    steps: [
      {
        trigger: "start",
        title: "Facing the Dealer's Ace",
        explanation: "You have 17 (10 + 7). The dealer is showing an Ace - the strongest card! There's a high chance the dealer has 20 or 21 (Blackjack). With hard 17, basic strategy says STAND. Hitting 17 is very risky and rarely pays off. Sometimes you just have to stand and hope.",
        recommendation: "Stand",
        highlightButtons: ["stand-btn"]
      }
    ]
  }
];

let currentTutorialIndex = 0;
let currentStepIndex = 0;
let tutorialModal = null;
let tutorialHitCount = 0;

// Create the tutorial modal overlay
function createTutorialModal() {
  if (tutorialModal) return tutorialModal;
  
  const modal = document.createElement('div');
  modal.id = 'tutorialModal';
  modal.innerHTML = `
    <div class="tutorial-overlay"></div>
    <div class="tutorial-content">
      <h3 id="tutorialTitle"></h3>
      <div id="tutorialExplanation"></div>
      <div id="tutorialRecommendation"></div>
      <button id="tutorialOkBtn">OK, I understand</button>
    </div>
  `;
  document.body.appendChild(modal);
  tutorialModal = modal;
  return modal;
}

// Highlight recommended buttons
function highlightButtons(buttonIds) {
  document.querySelectorAll('.tutorial-highlight').forEach(el => {
    el.classList.remove('tutorial-highlight');
  });
  
  if (buttonIds) {
    buttonIds.forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.classList.add('tutorial-highlight');
      }
    });
  }
}

// Remove all button highlights
function removeButtonHighlights() {
  document.querySelectorAll('.tutorial-highlight').forEach(el => {
    el.classList.remove('tutorial-highlight');
  });
}

// Add info button to show current tutorial tip
function addTutorialInfoButton() {
  const existingBtn = document.getElementById('tutorialInfoBtn');
  if (existingBtn) {
    existingBtn.remove();
  }
  
  const infoBtn = document.createElement('button');
  infoBtn.id = 'tutorialInfoBtn';
  infoBtn.innerHTML = '💡 Show Hint';
  infoBtn.className = 'tutorial-info-button';
  
  infoBtn.addEventListener('click', () => {
    playSound('assets/sound/click.mp3', 1.0);
    showCurrentTutorialStep();
  });
  
  const controls = document.getElementById('controls');
  if (controls) {
    controls.appendChild(infoBtn);
  }
}

// Show the current tutorial step
function showCurrentTutorialStep() {
  const scenario = tutorialScenarios[currentTutorialIndex];
  
  let stepToShow = null;
  const playerTotal = calculateHandValue(playerHand);
  
  if (tutorialHitCount === 2) {
    stepToShow = scenario.steps.find(s => s.trigger === 'afterHit2');
  }
  if (!stepToShow && tutorialHitCount === 1) {
    stepToShow = scenario.steps.find(s => s.trigger === 'afterHit');
  }
  if (!stepToShow && playerTotal > 21) {
    stepToShow = scenario.steps.find(s => s.trigger === 'afterBust');
  }
  if (!stepToShow) {
    stepToShow = scenario.steps[currentStepIndex] || scenario.steps[0];
  }
  
  if (stepToShow) {
    showTutorialStep(stepToShow);
  }
}

// Show tutorial step explanation
function showTutorialStep(step) {
  const modal = createTutorialModal();
  const title = modal.querySelector('#tutorialTitle');
  const explanation = modal.querySelector('#tutorialExplanation');
  const recommendation = modal.querySelector('#tutorialRecommendation');
  const okBtn = modal.querySelector('#tutorialOkBtn');
  
  title.textContent = step.title;
  explanation.textContent = step.explanation;
  recommendation.innerHTML = `<strong>Recommended Action:</strong> ${step.recommendation}`;
  
  modal.classList.add('visible');
  
  const newBtn = okBtn.cloneNode(true);
  okBtn.parentNode.replaceChild(newBtn, okBtn);
  
  newBtn.addEventListener('click', () => {
    playSound('assets/sound/click.mp3', 1.0);
    modal.classList.remove('visible');
    
    if (step.highlightButtons) {
      setTimeout(() => {
        highlightButtons(step.highlightButtons);
      }, 300);
    }
  });
}

// Check for next tutorial step based on game state (NO AUTO-SHOW)
function checkTutorialProgress() {
  if (!isTutorial || roundOver) return;
  
  const scenario = tutorialScenarios[currentTutorialIndex];
  const playerTotal = calculateHandValue(playerHand);
  
  // Just update currentStepIndex, don't auto-show
  if (tutorialHitCount === 1) {
    const nextStep = scenario.steps.find(s => s.trigger === 'afterHit');
    if (nextStep) {
      currentStepIndex = scenario.steps.indexOf(nextStep);
    }
  }
  
  if (tutorialHitCount === 2) {
    const nextStep = scenario.steps.find(s => s.trigger === 'afterHit2');
    if (nextStep) {
      currentStepIndex = scenario.steps.indexOf(nextStep);
    }
  }
  
  if (playerTotal > 21) {
    const nextStep = scenario.steps.find(s => s.trigger === 'afterBust');
    if (nextStep) {
      currentStepIndex = scenario.steps.indexOf(nextStep);
    }
  }
}

// Override the hit function for tutorial tracking
const originalOnHit = onHit;
function tutorialOnHit() {
  if (!isTutorial || roundOver) return;

  const scenario = tutorialScenarios[currentTutorialIndex];
  const step = scenario.steps[currentStepIndex];

  // Wrong move
  if (!step.recommendation.toLowerCase().includes("hit")) {
    updateStatus("That is not the recommended move!");
    showCurrentTutorialStep();
    return;
  }

  // ✔ CORRECT MOVE — finish scenario immediately
  dealerRevealed = true;
  renderHands();
  endRound("Great! You followed the correct move.");
}

// Override the stand function for tutorial tracking
const originalOnStand = onStand;
function tutorialOnStand() {
  if (!isTutorial || roundOver) return;

  const scenario = tutorialScenarios[currentTutorialIndex];
  const step = scenario.steps[currentStepIndex];

  // Wrong move
  if (!step.recommendation.toLowerCase().includes("stand")) {
    updateStatus("hat is not the recommended move!");
    showCurrentTutorialStep();
    return;
  }

  // ✔ CORRECT MOVE — finish scenario immediately
  dealerRevealed = true;
  renderHands();
  endRound("Great! You followed the correct move.");
}

function startTutorialGame(index = 0) {
  isTutorial = true;
  currentTutorialIndex = index;
  currentStepIndex = 0;
  tutorialHitCount = 0;

  const scenario = tutorialScenarios[currentTutorialIndex];
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
    <p style="font-style: italic; opacity: 0.9;">${scenario.description}</p>

    <div id="dealer-area" class="deck">
      <h3>Dealer</h3>
      <div id="dealer-cards" class="card-container"></div>
    </div>

    <div id="player-area" class="deck">
      <h3>Player (You)</h3>
      <div id="player-cards" class="card-container"></div>

      <div id="betting-area">
        <h4>Practice Mode</h4>
        <p>Balance: $<span id="chipBalance">${playerChips}</span></p>
        <p style="font-size: 14px; opacity: 0.8;">Fixed bet: $100 (tutorial)</p>
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

  playerHand = [drawCard(), drawCard()];
  dealerHand = [drawCard(), drawCard()];

  document.getElementById("hit-btn").addEventListener("click", () => {
    playSound("assets/sound/hit.mp3", 0.5);
    tutorialOnHit();
  });

  document.getElementById("stand-btn").addEventListener("click", () => {
    playSound("assets/sound/click.mp3", 1.0);
    tutorialOnStand();
  });

  enableControls();
  renderHands();
  addTutorialInfoButton();
}

function restartCurrentTutorial() {
  if (tutorialModal) {
    tutorialModal.remove();
    tutorialModal = null;
  }
  removeButtonHighlights();
  startTutorialGame(currentTutorialIndex);
}

function startNextTutorial() {
  if (tutorialModal) {
    tutorialModal.remove();
    tutorialModal = null;
  }
  removeButtonHighlights();
  
  const nextIndex = currentTutorialIndex + 1;
  if (nextIndex < tutorialScenarios.length) {
    startTutorialGame(nextIndex);
  } else {
    teardownGame();
    exitToMainMenu();
  }
}