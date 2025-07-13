let balance = 1000;

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
  const icons = {
    rock: "🪨",
    paper: "📄",
    scissors: "✂️"
  };

  const computerChoice = choices[Math.floor(Math.random() * 3)];

  document.getElementById("player-icon").textContent = icons[playerChoice];
  document.getElementById("computer-icon").textContent = icons[computerChoice];

  const result = getWinner(playerChoice, computerChoice);

  if (result === "win") {
    balance += bet;
    document.getElementById("result").textContent = `You win! +$${bet}`;
  } else if (result === "lose") {
    balance -= bet;
    document.getElementById("result").textContent = `You lose! -$${bet}`;
  } else {
    document.getElementById("result").textContent = "It's a tie! $0";
  }

  document.getElementById("balance").textContent = balance;

  if (balance <= 0) {
    showGameOver();
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

function showGameOver() {
  document.getElementById("game-over-screen").classList.remove("hidden");
}

function restartGame() {
  balance = 1000;
  document.getElementById("balance").textContent = balance;
  document.getElementById("player-icon").textContent = "❔";
  document.getElementById("computer-icon").textContent = "❔";
  document.getElementById("result").textContent = "Make your move!";
  document.getElementById("game-over-screen").classList.add("hidden");
}
