// Game elements
const light = document.getElementById('light');
const timeDisplay = document.getElementById('time');
const playerScoreDisplay = document.getElementById('player-score');
const cpuScoreDisplay = document.getElementById('cpu-score');
const ropeMarker = document.getElementById('rope-marker');
const messageDisplay = document.getElementById('message');
const difficultyDisplay = document.getElementById('difficulty-display');
const startBtn = document.getElementById('start-btn');
const easyBtn = document.getElementById('easy-btn');
const mediumBtn = document.getElementById('medium-btn');
const hardBtn = document.getElementById('hard-btn');
const humanCard = document.querySelector('.player-card.human');
const cpuCard = document.querySelector('.player-card.cpu');

// Audio elements
const pullSound = document.getElementById('pull-sound');
const winSound = document.getElementById('win-sound');
const loseSound = document.getElementById('lose-sound');
const bgMusic = document.getElementById('bg-music');

// Game variables
let gameActive = false;
let time = 0;
let playerScore = 0;
let cpuScore = 0;
let ropePosition = 50;
let gameInterval;
let timerInterval;
let difficulty = 'medium';
let cpuPullStrength = 0.5;

// Difficulty settings
const difficultySettings = {
    easy: { 
        cpuStrength: 0.3, 
        timeFactor: 1.2, 
        name: "EASY",
        color: "#ac0000ff"
    },
    medium: { 
        cpuStrength: 0.5, 
        timeFactor: 1, 
        name: "MEDIUM",
        color: "#ac0000ff"
    },
    hard: { 
        cpuStrength: 0.8, 
        timeFactor: 0.8, 
        name: "HARD",
        color: "#ac0000ff"
    }
};

// Initialize the game
function initGame() {
    // Set up difficulty buttons
    setDifficulty('medium');
    
    // Set up event listeners
    startBtn.addEventListener('click', startGame);
    easyBtn.addEventListener('click', () => setDifficulty('easy'));
    mediumBtn.addEventListener('click', () => setDifficulty('medium'));
    hardBtn.addEventListener('click', () => setDifficulty('hard'));
    
    // Keyboard controls
    document.addEventListener('keydown', handleKeyDown);
    
    // Touch controls
    document.addEventListener('touchstart', handleTouch);
    document.addEventListener('mousedown', handleTouch);
    
    // Try to play background music
    try {
        bgMusic.volume = 0.3;
        bgMusic.play().catch(e => console.log("Autoplay prevented:", e));
    } catch (e) {
        console.log("Audio error:", e);
    }
}

// Set difficulty level
function setDifficulty(level) {
    difficulty = level;
    const settings = difficultySettings[difficulty];
    difficultyDisplay.textContent = settings.name;
    
    // Update button states
    easyBtn.classList.toggle('active', difficulty === 'easy');
    mediumBtn.classList.toggle('active', difficulty === 'medium');
    hardBtn.classList.toggle('active', difficulty === 'hard');
    
    // Update button colors
    easyBtn.style.backgroundColor = difficultySettings.easy.color;
    mediumBtn.style.backgroundColor = difficultySettings.medium.color;
    hardBtn.style.backgroundColor = difficultySettings.hard.color;
}

// Start the game
function startGame() {
    if (gameActive) return;
    
    gameActive = true;
    time = 0;
    playerScore = 0;
    cpuScore = 0;
    ropePosition = 50;
    
    const settings = difficultySettings[difficulty];
    cpuPullStrength = settings.cpuStrength;
    
    updateDisplays();
    messageDisplay.textContent = 'MASH SPACEBAR TO PULL!';
    messageDisplay.classList.remove('win-animation');
    ropeMarker.classList.remove('lose');
    light.classList.remove('victory', 'eliminated');
    
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    
    gameInterval = setInterval(updateGame, 50);
    timerInterval = setInterval(() => {
        time++;
        timeDisplay.textContent = time;
    }, 1000);
    
    startBtn.textContent = 'GAME IN PROGRESS';
    startBtn.disabled = true;
    
    // Animate the light
    light.textContent = 'PULL!';
    light.classList.add('animate');
    setTimeout(() => light.classList.remove('animate'), 500);
    
    // Play background music
    try {
        bgMusic.currentTime = 0;
        bgMusic.play();
    } catch (e) {
        console.log("Audio error:", e);
    }
}

// Game update loop
function updateGame() {
    // CPU pulls automatically
    if (Math.random() < cpuPullStrength) {
        pullRope(false);
    }
    
    // Update rope marker position
    ropeMarker.style.left = `${ropePosition}%`;
    
    // Check win conditions
    if (ropePosition <= 10) {
        endGame('VICTORY! YOU WIN!', true);
    } else if (ropePosition >= 90) {
        endGame('ELIMINATED! CPU WINS!', false);
    }
}

// Handle rope pulling
function pullRope(isPlayer) {
    if (isPlayer) {
        ropePosition -= 2;
        playerScore++;
        playerScoreDisplay.textContent = playerScore;
        humanCard.classList.add('pull-animation');
        
        // Visual feedback
        ropeMarker.style.backgroundColor = '#d30000ff';
        setTimeout(() => {
            ropeMarker.style.backgroundColor = '#d30000ff';
            humanCard.classList.remove('pull-animation');
        }, 200);
        
        // Play pull sound
        try {
            pullSound.currentTime = 0;
            pullSound.play();
        } catch (e) {
            console.log("Audio error:", e);
        }
    } else {
        ropePosition += 1 * cpuPullStrength * 2;
        cpuScore++;
        cpuScoreDisplay.textContent = cpuScore;
        cpuCard.classList.add('pull-animation');
        
        // Visual feedback
        ropeMarker.style.backgroundColor = '#ff6666';
        setTimeout(() => {
            ropeMarker.style.backgroundColor = '#db4747ff';
            cpuCard.classList.remove('pull-animation');
        }, 200);
    }
    
    // Ensure ropePosition stays within bounds
    ropePosition = Math.max(0, Math.min(100, ropePosition));
}

// End the game
function endGame(message, isWin) {
    gameActive = false;
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    
    messageDisplay.textContent = message;
    startBtn.textContent = 'PLAY AGAIN';
    startBtn.disabled = false;
    
    if (isWin) {
        messageDisplay.classList.add('win-animation');
        light.textContent = 'VICTORY!';
        light.classList.add('victory');
        
        // Play win sound
        try {
            winSound.currentTime = 0;
            winSound.play();
        } catch (e) {
            console.log("Audio error:", e);
        }
    } else {
        ropeMarker.classList.add('lose');
        light.textContent = 'ELIMINATED!';
        light.classList.add('eliminated');
        
        // Play lose sound
        try {
            loseSound.currentTime = 0;
            loseSound.play();
        } catch (e) {
            console.log("Audio error:", e);
        }
        
        setTimeout(() => {
            ropeMarker.classList.remove('lose');
        }, 500);
    }
    
    // Stop background music
    try {
        bgMusic.pause();
    } catch (e) {
        console.log("Audio error:", e);
    }
}

// Update game displays
function updateDisplays() {
    timeDisplay.textContent = time;
    playerScoreDisplay.textContent = playerScore;
    cpuScoreDisplay.textContent = cpuScore;
    ropeMarker.style.left = `${ropePosition}%`;
}

// Handle keyboard input
function handleKeyDown(e) {
    if (e.code === 'Space' && gameActive) {
        e.preventDefault();
        pullRope(true);
    }
}

// Handle touch input
function handleTouch(e) {
    if (gameActive) {
        e.preventDefault();
        pullRope(true);
    }
}

// Initialize the game when page loads
window.addEventListener('DOMContentLoaded', initGame);