let balance = 1000;
let streak = 0;
let allInMode = false;  // flag for all-in mode

// Emoji sets
const emojiSets = [
  { // Default set
    rock: "🪨",
    paper: "📄",
    scissors: "✂️"
  },
  { // Classic set
    rock: "🪨",
    paper: "📜",
    scissors: "✂️"
  },
  { // Fun set
    rock: "🤜",
    paper: "✋",
    scissors: "✌️"
  },
  { // Animal set
    rock: "🐢",
    paper: "🐦",
    scissors: "✂️"
  }
];

let currentEmojiSetIndex = 0;

function loadFromStorage() {
  const storedBalance = localStorage.getItem("balance");
  const storedStreak = localStorage.getItem("streak");

  if (storedBalance !== null) {
    balance = parseInt(storedBalance);
  }

  if (storedStreak !== null) {
    streak = parseInt(storedStreak);
  }

  updateUI();

  // Initialize emoji toggle button text
  const btn = document.getElementById("emoji-toggle-btn");
  btn.textContent = `Emoji Set: ${currentEmojiSetIndex + 1} / ${emojiSets.length} (Switch)`;

  // Update choice buttons emojis to match current emoji set
  updateChoiceButtons();
}

function saveToStorage() {
  localStorage.setItem("balance", balance);
  localStorage.setItem("streak", streak);
}

function play(playerChoice) {
  const betInput = document.getElementById("bet");
  const bet = parseInt(betInput.value);

  if (isNaN(bet) || bet <= 0) {
    alert("Please enter a valid bet.");
    return;
  }

  if (balance <= 0) {
    showGameOver();
    return;
  }

  if (bet > balance) {
    alert("You don't have enough money to place that bet!");
    return;
  }

  const choices = ["rock", "paper", "scissors"];
  const icons = emojiSets[currentEmojiSetIndex];

  const computerChoice = choices[Math.floor(Math.random() * 3)];

  // Display icons
  const playerIconEl = document.getElementById("player-icon");
  const computerIconEl = document.getElementById("computer-icon");

  playerIconEl.textContent = icons[playerChoice];
  computerIconEl.textContent = icons[computerChoice];

  // Add animation class
  playerIconEl.className = "icon-display " + getAnimationClass(playerChoice);
  computerIconEl.className = "icon-display " + getAnimationClass(computerChoice);

  // Determine winner
  const result = getWinner(playerChoice, computerChoice);
  let payout = 0;
  let resultMessage = "";

  if (result === "win") {
    payout = bet;
    balance += payout;
    streak++;
    resultMessage = `You win! +$${payout}`;

    if (streak === 5) {
      balance += 500;
      resultMessage += `\n🔥 5-Win Streak! Bonus +$500!`;
    }
  } else if (result === "lose") {
    payout = -bet;
    balance += payout;
    streak = 0;
    resultMessage = `You lose! -$${bet}`;
  } else {
    resultMessage = "It's a tie! $0";
    streak = 0;
  }

  document.getElementById("result").textContent = resultMessage;
  updateUI();
  updateLog(icons[playerChoice], icons[computerChoice], result, payout);
  saveToStorage();

  if (balance <= 0) {
    showGameOver();
  }

  // Reset all-in mode and re-enable bet input if active
  if (allInMode) {
    allInMode = false;
    betInput.disabled = false;
  }
}

function getWinner(player, computer) {
  if (player === computer) return "tie";
  if (
    (player === "rock" && computer === "scissors") ||
    (player === "paper" && computer === "rock") ||
    (player === "scissors" && computer === "paper")
  ) {
    return "win";
  } else {
    return "lose";
  }
}

function getAnimationClass(choice) {
  if (choice === "rock") return "animate-bounce";
  if (choice === "paper") return "animate-flip";
  if (choice === "scissors") return "animate-spin";
  return "";
}

function updateLog(playerIcon, computerIcon, result, payout) {
  const log = document.getElementById("game-log");
  const entry = document.createElement("div");

  let outcomeText = "";
  if (result === "win") {
    outcomeText = `Win (+$${Math.abs(payout)})`;
  } else if (result === "lose") {
    outcomeText = `Lose (-$${Math.abs(payout)})`;
  } else {
    outcomeText = `Tie (+$0)`;
  }

  entry.textContent = `You: ${playerIcon} | CPU: ${computerIcon} → ${outcomeText}`;
  log.prepend(entry);
}

function updateUI() {
  document.getElementById("balance").textContent = balance;
  document.getElementById("streak").textContent = streak;
}

function showGameOver() {
  document.getElementById("game-over-screen").classList.remove("hidden");
}

function restartGame() {
  balance = 1000;
  streak = 0;
  localStorage.removeItem("balance");
  localStorage.removeItem("streak");

  document.getElementById("player-icon").textContent = "❔";
  document.getElementById("computer-icon").textContent = "❔";
  document.getElementById("result").textContent = "Make your move!";
  document.getElementById("game-log").innerHTML = "";

  updateUI();
  document.getElementById("game-over-screen").classList.add("hidden");

  // Enable bet input on restart
  document.getElementById("bet").disabled = false;
}

function allIn() {
  if (balance <= 0) {
    alert("You're broke! Can't go all in.");
    return;
  }

  const betInput = document.getElementById("bet");
  betInput.value = balance; // set bet to full balance
  betInput.disabled = true; // disable input so user can't change it

  allInMode = true;
}

function toggleEmojiSet() {
  currentEmojiSetIndex = (currentEmojiSetIndex + 1) % emojiSets.length;

  // Reset displayed icons to question marks on emoji set switch
  document.getElementById("player-icon").textContent = "❔";
  document.getElementById("computer-icon").textContent = "❔";

  // Update the toggle button text
  const btn = document.getElementById("emoji-toggle-btn");
  btn.textContent = `Emoji Set: ${currentEmojiSetIndex + 1} / ${emojiSets.length} (Switch)`;

  // Update the choice buttons to the new emoji set
  updateChoiceButtons();
}

// NEW: Update the choice buttons' emojis to the current emoji set
function updateChoiceButtons() {
  const icons = emojiSets[currentEmojiSetIndex];
  const buttons = document.querySelectorAll(".choice-buttons button");

  buttons.forEach(button => {
    // Extract the choice from the onclick attribute (e.g., play('rock'))
    const match = button.getAttribute("onclick").match(/play\('(\w+)'\)/);
    if (match) {
      const choice = match[1];
      button.textContent = icons[choice];
    }
  });
}

// Load saved game on page load
window.onload = loadFromStorage;
