let selectedShape = "circle"; // default

// Shape to emoji map
const shapeEmojis = {
  circle: "🔵",
  triangle: "🔺",
  square: "🟥"
};

// Setup shape selection
document.querySelectorAll(".player-choice button").forEach(button => {
  button.addEventListener("click", () => {
    selectedShape = button.dataset.shape;

    // Update the card display
    document.querySelectorAll(".ddakji-card").forEach(card => {
      card.textContent = shapeEmojis[selectedShape];
    });

    // Optional: visual feedback on selected button
    document.querySelectorAll(".player-choice button").forEach(btn =>
      btn.classList.remove("active")
    );
    button.classList.add("active");
  });
});

// Setup the Ddakji game
function startDdakjiGame() {
  const cards = document.querySelectorAll(".ddakji-card");
  const resultText = document.getElementById("ddakji-result");
  const soundWin = new Audio("sounds/Voicy_Realistic Gunshot Sound Effect.mp3");
  const soundLose = new Audio("sounds/Voicy_Wow.mp3");

  // Set initial shape on cards
  cards.forEach(card => {
    card.textContent = shapeEmojis[selectedShape];
  });

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const win = Math.random() < 0.5;

      card.classList.add("flip");

      resultText.textContent = win ? "You're Palyer!" : "You're Player!";
      resultText.className = win ? "result win" : "result lose";

      (win ? soundWin : soundLose).play();

      setTimeout(() => {
        card.classList.remove("flip");
        resultText.textContent = "Pick a card!";
        resultText.className = "result";
      }, 2000);
    });
  });
}

// On window load
window.onload = () => {
  startDdakjiGame();
};
