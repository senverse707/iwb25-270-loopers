// Red Light Green Light JavaScript with SweetAlert2 Modals (Persistent Instruction Check)

// DOM Elements
const light = document.getElementById("light");
const player = document.getElementById("player");
const message = document.getElementById("message");
const timerDisplay = document.getElementById("timer");
const leaderboard = document.getElementById("leaderboard");
const finishLine = document.querySelector(".finish-line");

// Sounds
const soundGreen = document.getElementById("sound-green");
const soundRed = document.getElementById("sound-red");
const soundWin = document.getElementById("sound-win");
const soundLose = document.getElementById("sound-lose");

// Game State
let position = 10;
let lightState = "red";
let gameEnded = false;
let timerStarted = false;
let startTime;
let elapsedTime = 0;
let timerInterval;
let totalTime = 30;

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    elapsedTime = (Date.now() - startTime) / 1000;
    let remainingTime = totalTime - elapsedTime;

    
    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      timerDisplay.textContent = `⏱️ Time: 0.00s`;
      message.textContent = "⏰ Time’s up! You lose!";
      document.getElementById("moveBtn").disabled = true;
      gameEnded = true;
    } else {

    timerDisplay.textContent = `⏱️ Time: ${remainingTime.toFixed(2)}s`;
}
}, 100);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function switchLight() {
  if (gameEnded) return;

  light.classList.add("animate");
  lightState = lightState === "red" ? "green" : "red";
  light.textContent = lightState === "green" ? "🟢 Green Light" : "🔴 Red Light";
  light.style.backgroundColor = lightState === "green" ? "#31be71ff" : "#ff1a1a";

  if (lightState === "green") {
    soundGreen.currentTime = 0;
    soundGreen.play();
  } else {
    soundRed.currentTime = 0;
    soundRed.play();
  }

  setTimeout(() => light.classList.remove("animate"), 500);

  const nextSwitch = Math.random() * 2000 + 1000;
  setTimeout(switchLight, nextSwitch);
}

function movePlayer() {
  const instructionsShown = localStorage.getItem("instructionsShown") === "true";

  if (!instructionsShown) {
    Swal.fire({
      title: '🚦 How to Play',
      text: 'Move only when the light is GREEN. If you move on RED, you are eliminated!',
      icon: 'info',
      confirmButtonText: 'Got it!',
      background: '#1e1e1e',
      color: '#ffffff',
      confirmButtonColor: '#cf0000ff'
    });
    localStorage.setItem("instructionsShown", "true");
    return;
  }

  if (gameEnded) return;

  if (!timerStarted) {
    timerStarted = true;
    startTimer();
    switchLight();
  }

  if (lightState === "red") {
    player.classList.add("lose");
    player.style.backgroundColor = "#ff0000";
    message.textContent = `❌ Moved during RED light! Eliminated in ${elapsedTime.toFixed(2)}s.`;
    soundLose.currentTime = 0;
    soundLose.play();
    stopTimer();
    gameEnded = true;
    return;
  }

  position += 50;
  player.style.left = `${position}px`;

  const playerRight = player.getBoundingClientRect().right;
  const finishLeft = finishLine.getBoundingClientRect().left;

  if (playerRight >= finishLeft) {
    stopTimer();
    message.textContent = `🎉 You Win! Time: ${elapsedTime.toFixed(2)}s`;
    soundWin.currentTime = 0;
    soundWin.play();
    saveScore(elapsedTime);
    updateLeaderboard();
    gameEnded = true;
  }
}

function saveScore(time) {
  let scores = JSON.parse(localStorage.getItem("squidGameScores")) || [];
  scores.push({ time: time.toFixed(2), date: new Date().toLocaleString() });
  localStorage.setItem("squidGameScores", JSON.stringify(scores));
}

function updateLeaderboard() {
  let scores = JSON.parse(localStorage.getItem("squidGameScores")) || [];
  scores.sort((a, b) => parseFloat(a.time) - parseFloat(b.time));
  scores = scores.slice(0, 5);

  leaderboard.innerHTML = "";
  scores.forEach((score, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${score.time}s - ${score.date}`;
    leaderboard.appendChild(li);
  });
}

function resetGame() {
  Swal.fire({
    title: '🔄 Reset Game',
    text: 'The game has been reset. Click Move Forward to start again!',
    icon: 'warning',
    confirmButtonText: 'OK',
    background: '#1e1e1e',
    color: '#ffffff',
    confirmButtonColor: '#ff5555'
  });

  stopTimer();
  timerDisplay.textContent = `⏱️ Time: 0.00s`;
  message.textContent = "";
  position = 10;
  player.style.left = `${position}px`;
  player.style.backgroundColor = "#ffffffff";
  player.classList.remove("lose");
  lightState = "red";
  light.textContent = "🔴 Red Light";
  light.style.backgroundColor = "#ff1a1a";
  gameEnded = false;
  timerStarted = false;
}

window.onload = () => {
  updateLeaderboard();
  setTimeout(() => {
    Swal.fire({
      title: '🏁 Leaderboard Info',
      text: 'Track your top 5 fastest wins here!',
      icon: 'info',
      confirmButtonText: 'Let\'s Go!',
      background: '#1e1e1e',
      color: '#ffffff',
      confirmButtonColor: '#ac0000ff'
    });
  }, 500);
};


function clearAll() {
  Swal.fire({
    title: '🗑️ Reset All Progress',
    text: 'This will clear leaderboard and tutorial status. Continue?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ff5555',
    cancelButtonColor: '#d60000ff',
    confirmButtonText: 'Yes, Reset All',
    background: '#1e1e1e',
    color: '#ffffff'
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("squidGameScores");
      localStorage.removeItem("instructionsShown");
      updateLeaderboard();
      Swal.fire({
        title: '✅ All Data Reset',
        text: 'Leaderboard and tutorial status have been cleared.',
        icon: 'success',
        background: '#1e1e1e',
        color: '#ffffff',
        confirmButtonColor: '#d80000ff'
      });
    }
  });
}
