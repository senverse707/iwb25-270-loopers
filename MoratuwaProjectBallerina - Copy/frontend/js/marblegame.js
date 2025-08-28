let player = 10, opponent = 10;

function guess(choice) {
  if (player <= 0 || opponent <= 0) return;

  let hidden = Math.floor(Math.random() * opponent) + 1;
  let result = hidden % 2 === 0 ? "even" : "odd";

  if (choice === result) {
    player += hidden;
    opponent -= hidden;
    document.getElementById("status").innerText =
      `✅ Correct! Opponent had ${hidden} (${result}). You gain ${hidden} marbles.`;
  } else {
    player -= hidden;
    opponent += hidden;
    document.getElementById("status").innerText =
      `❌ Wrong! Opponent had ${hidden} (${result}). You lose ${hidden} marbles.`;
  }

  document.getElementById("player").innerText = player;
  document.getElementById("opponent").innerText = opponent;

  if (player <= 0 || opponent <= 0) {
    setTimeout(() => showGameOver(), 1000);
  }
}

function showGameOver() {
  let text = player > 0 ? "🎉 You Win the Game!" : "💀 Game Over!";
  document.getElementById("resultText").innerText = text;
  document.getElementById("gameOver").style.display = "flex";
}

function restartGame() {
  player = 10;
  opponent = 10;
  document.getElementById("player").innerText = player;
  document.getElementById("opponent").innerText = opponent;
  document.getElementById("status").innerText = "Guess if opponent’s marbles are Odd or Even.";
  document.getElementById("gameOver").style.display = "none";
}
