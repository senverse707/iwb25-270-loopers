// GAME CONFIG 
const TOTAL_STEPS = 8;
let currentStep = 0;
let bridge = [];
let gameOver = false;
let difficulty = "easy";
let startTime = 60;
let timerInterval;
let gamesPlayed = 0;
let bestScore = 0;
let soundEnabled = true;

let hintLimit = 3;
let hintsUsed = 0;
let cheatModeEnabled = false;


document.getElementById("restart").addEventListener("click", initGame);


//DOM ELEMENTS 
const stepCounter = document.getElementById("step-counter");
const progressBar = document.getElementById("progress-bar");
const timeDisplay = document.getElementById("time");
const leaderboard = document.getElementById("leaderboard");
const gamesPlayedDisplay = document.getElementById("games-played");
const bestScoreDisplay = document.getElementById("best-score");
const soundToggle = document.getElementById("sound-toggle");
const hintBtn = document.getElementById("hint-btn");
const cheatBtn = document.getElementById("cheat-btn");

// AUDIO ELEMENTS
const sounds = {
    break: document.getElementById("break-sound"),
    step: document.getElementById("step-sound"),
    win: document.getElementById("win-sound"),
    lose: document.getElementById("lose-sound")
};

//PARTICLE CONFIG
const particleConfig = {
    particles: {
        number: { value: 20 },
        color: { value: ["#ffffff", "#00ffff"] },
        shape: { type: "circle" },
        opacity: { value: 0.8 },
        size: { value: 5 },
        move: {
            enable: true,
            speed: 6,
            direction: "none",
            out_mode: "out"
        }
    },
    interactivity: { detect_on: "canvas" },
    retina_detect: true
};

//  PLAY SOUND FUNCTION 
function playSound(sound) {
    if (!soundEnabled) return;
    sounds[sound].currentTime = 0;
    sounds[sound].play().catch(e => console.log("Audio play failed:", e));
}

//  INITIALIZE GAME 
function initGame() {
    currentStep = 0;
    gameOver = false;
    hintsUsed = 0;

    hintLimit = 3;
    hintBtn.disabled = false;
    hintBtn.textContent = `💡 Hint (${hintLimit - hintsUsed})`;
    cheatBtn.textContent = cheatModeEnabled ? "❌ Disable Cheat" : "👁️ Cheat Mode";

    stepCounter.textContent = "0";
    timeDisplay.textContent = "00:00";
    bridge = generateBridge(difficulty);
    startTimer();
    renderBridge();

    console.log("Correct path:", bridge.join(" → "));
}

//GENERATE BRIDGE 
function generateBridge(difficulty) {
    const newBridge = [];
    for (let i = 0; i < TOTAL_STEPS; i++) {
        let safeSide;
        switch (difficulty) {
            case "easy":
                safeSide = Math.random() < 0.5 ? "left" : "right";
                break;
            case "medium":
                safeSide = Math.random() < 0.3 ? "left" : "right";
                break;
            case "hard":
                safeSide = i % 2 === 0 ? "left" : "right";
                break;
        }
        newBridge.push(safeSide);
    }
    return newBridge;
}

//RENDER BRIDGE 
function renderBridge() {
    const bridgeElement = document.getElementById("bridge");
    bridgeElement.innerHTML = "";

    for (let i = 0; i < TOTAL_STEPS; i++) {
        const stepDiv = document.createElement("div");
        stepDiv.className = "step";

        const leftGlass = document.createElement("div");
        leftGlass.className = `glass`;
        leftGlass.textContent = "LEFT";
        leftGlass.onclick = () => selectStep(i, "left");

        const rightGlass = document.createElement("div");
        rightGlass.className = `glass`;
        rightGlass.textContent = "RIGHT";
        rightGlass.onclick = () => selectStep(i, "right");

        stepDiv.appendChild(leftGlass);
        stepDiv.appendChild(rightGlass);
        bridgeElement.appendChild(stepDiv);
    }

    // ✅ Reapply cheat highlights if cheat mode is enabled
    if (cheatModeEnabled) {
        bridge.forEach((side, index) => {
            const stepRow = document.querySelectorAll(`.step:nth-child(${index + 1}) .glass`);
            const safeGlass = side === "left" ? stepRow[0] : stepRow[1];
            safeGlass.classList.add("cheat");
        });
    }
}

// GLASS BREAK PARTICLE EFFECT 
let breakIndex = 0;
function triggerGlassBreakEffect(x, y) {
    const container = document.getElementById("glass-break-particles");
    container.innerHTML = "";
    container.style.left = `${x - 50}px`;
    container.style.top = `${y - 50}px`;
    container.style.display = "block";

    const uniqueId = `particles-js-${breakIndex++}`;
    const canvas = document.createElement("div");
    canvas.id = uniqueId;
    canvas.style.width = "100px";
    canvas.style.height = "100px";
    container.appendChild(canvas);

    particlesJS(uniqueId, JSON.parse(JSON.stringify(particleConfig)));

    setTimeout(() => {
        container.style.display = "none";
        container.innerHTML = "";
    }, 1000);
}

// SELECT STEP
function selectStep(step, choice) {
    if (gameOver || step !== currentStep) return;

    const correctSide = bridge[step];
    const glassElements = document.querySelectorAll(`.step:nth-child(${step + 1}) .glass`);
    const clickedGlass = choice === "left" ? glassElements[0] : glassElements[1];

    if (choice === correctSide) {
        playSound("step");
        clickedGlass.classList.add("safe");
        currentStep++;
        stepCounter.textContent = currentStep;
        progressBar.style.width = `${(currentStep / TOTAL_STEPS) * 100}%`;

        if (currentStep === TOTAL_STEPS) {
            playSound("win");
            endGame(true);
        }
    } else {
        const rect = clickedGlass.getBoundingClientRect();
        triggerGlassBreakEffect(rect.left + rect.width / 2, rect.top + rect.height / 2);

        playSound("break");
        clickedGlass.classList.add("broken");
        setTimeout(() => playSound("lose"), 500);
        endGame(false);
    }
}

//TIMER FUNCTIONS 
function startTimer() {
    timeLeft = 480;
    updateTimer(); 
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const seconds = String(timeLeft % 60).padStart(2, "0");
    timeDisplay.textContent = `${minutes}:${seconds}`;

        if (timeLeft <= 0) {
        clearInterval(timerInterval);
        endGame(false); // auto game over when time runs out
    } else {
        timeLeft--; // ⬅️ decrease by 1 each second
    }
}


function stopTimer() {
    clearInterval(timerInterval);
}

//  END GAME 
function endGame(isWin) {
    gameOver = true;
    stopTimer();
    gamesPlayed++;
    gamesPlayedDisplay.textContent = gamesPlayed;

    if (isWin) {
        bestScore = Math.max(bestScore, currentStep);
        bestScoreDisplay.textContent = bestScore;
        showWinMessage();
    } else {
        revealCorrectPath();
        showGameOverMessage();
    }
}

// SHOW CORRECT PATH 
function revealCorrectPath() {
    for (let i = 0; i < TOTAL_STEPS; i++) {
        const stepRow = document.querySelectorAll(`.step:nth-child(${i + 1}) .glass`);
        const safeGlass = bridge[i] === "left" ? stepRow[0] : stepRow[1];
        safeGlass.classList.add("cheat");
    }
}

//  MODAL MESSAGES 
function showWinMessage() {
    Swal.fire({
        title: '🎉 YOU WIN! 🎉',
        html: `
            <p>You crossed the bridge in <strong>${timeDisplay.textContent}</strong>!</p>
            <p>Correct choices: <strong>${currentStep}/${TOTAL_STEPS}</strong></p>
        `,
        icon: 'success',
        background: '#1a1a1a',
        color: 'white',
        confirmButtonColor: '#00ffcc',
        confirmButtonText: 'Play Again'
    }).then(() => initGame());
}

function showGameOverMessage() {
    Swal.fire({
        title: '💀 YOU FELL! 💀',
        html: `
            <p>You made it to step <strong>${currentStep}</strong>.</p>
            // <p>The correct path has been revealed.</p>
        `,
        icon: 'error',
        background: '#1a1a1a',
        color: 'white',
        confirmButtonColor: '#ff1a1a',
        confirmButtonText: 'Try Again'
    }).then(() => initGame());
}

function showRules() {
    Swal.fire({
        title: '❖ GLASS BRIDGE RULES ❖',
        html: `
            <div style="text-align: left; line-height: 1.6;">
                <p>➤ Choose LEFT or RIGHT to step on the glass.</p>
                <p>➤ Only ONE side is safe each time!</p>
                <p>➤ You get <strong>3 hints</strong> per game.</p>
                <p>➤ Click CHEAT to reveal the path (for testing).</p>
            </div>
        `,
        background: '#1a1a1a',
        color: 'white',
        confirmButtonColor: '#ff007f',
        confirmButtonText: 'Got It!'
    });
}

//HINT SYSTEM 
function giveHint() {
    if (gameOver || currentStep >= TOTAL_STEPS || hintsUsed >= hintLimit) return;

    const correct = bridge[currentStep];
    const stepRow = document.querySelectorAll(`.step:nth-child(${currentStep + 1}) .glass`);
    const glassToHint = correct === "left" ? stepRow[0] : stepRow[1];

    glassToHint.classList.add("hint");
    setTimeout(() => glassToHint.classList.remove("hint"), 1000);

    hintsUsed++;
    const hintsLeft = hintLimit - hintsUsed;
    hintBtn.textContent = `💡 Hint (${hintsLeft})`;
    if (hintsLeft <= 0) {
        hintBtn.disabled = true;
    }
}

//  CHEAT MODE
function toggleCheatMode() {
    cheatModeEnabled = !cheatModeEnabled;

    if (cheatModeEnabled) {
        console.log("✅ Cheat Mode ON");
        bridge.forEach((side, index) => {
            const stepRow = document.querySelectorAll(`.step:nth-child(${index + 1}) .glass`);
            const safeGlass = side === "left" ? stepRow[0] : stepRow[1];
            safeGlass.classList.add("cheat");
        });
        cheatBtn.textContent = "❌ Disable Cheat";
    } else {
        disableCheatMode();
    }
}

function disableCheatMode() {
    cheatModeEnabled = false;
    document.querySelectorAll(".glass").forEach(glass => {
        glass.classList.remove("cheat");
    });
    cheatBtn.textContent = "👁️ Cheat Mode";
    console.log("❌ Cheat Mode OFF");
}

// EVENT LISTENERS 
document.getElementById("restart").addEventListener("click", initGame);
document.getElementById("rules").addEventListener("click", showRules);
document.querySelectorAll(".difficulty-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".difficulty-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        difficulty = btn.dataset.difficulty;
        initGame();
    });
});
soundToggle.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    soundToggle.textContent = soundEnabled ? "🔊 SOUND ON" : "🔇 SOUND OFF";
});
hintBtn.addEventListener("click", giveHint);
cheatBtn.addEventListener("click", toggleCheatMode);

// ON LOAD 
window.onload = () => {
    // initGame();
    if (!localStorage.getItem("glass_tutorial_shown")) {
        showRules();
        localStorage.setItem("glass_tutorial_shown", "true");
    }
};
window.addEventListener("DOMContentLoaded", () => {
  const hash = window.location.hash;

  if (hash === "#main" || hash === "#home") {
    // Instantly skip intro and login/signup
    document.getElementById("intro").style.display = "none";
    document.getElementById("container").style.display = "none";
    document.getElementById("main").style.display = "block";

    const footer = document.getElementById("footer");
    if (footer) footer.style.display = "block";
  }
});
















