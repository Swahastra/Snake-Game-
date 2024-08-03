const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const levelElement = document.querySelector(".level");
const controls = document.querySelectorAll(".controls i");
const gameOverModal = document.getElementById("gameOverModal");
const restartButton = document.getElementById("restartButton");
const levels = document.getElementById("levelSelection");
const gameSection = document.getElementById("gameSection");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
let level = 1;
let gameSpeed = 150;

// Getting high score from the local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;
levelElement.innerText = `Level: ${level}`;

const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
    clearInterval(setIntervalId);
    gameOver = true;
    gameOverModal.style.display = "block";
    restartButton.style.display = "block";
};

const restartGame = () => {
    gameOver = false;
    snakeX = 5;
    snakeY = 5;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    score = 0;

    scoreElement.innerText = `Score: ${score}`;
    levelElement.innerText = `Level: ${level}`;
    highScoreElement.innerText = `High Score: ${highScore}`;
    updateFoodPosition();
    
    gameOverModal.style.display = "none";
    restartButton.style.display = "none";
    
    setIntervalId = setInterval(initGame, gameSpeed);
};

const changeDirection = e => {
    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
};

controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () => {
    if(gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    if(snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); // Pushing food position to snake body array
        score++; // increment score by 1
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }
    // Updating the snake's head position based on the current velocity
    snakeX += velocityX;
    snakeY += velocityY;
    
    // Shifting forward the values of the elements in the snake body by one
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY]; // Setting first element of snake body to current snake position

    // Checking if the snake's head is out of wall, if so setting gameOver to true
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        // Adding a div for each part of the snake's body
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // Checking if the snake head hit the body, if so set gameOver to true
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
};

document.addEventListener("keydown", changeDirection);

const selectLevel = e => {
    level = e.target.dataset.level;
    gameSpeed = level === "1" ? 200 : level === "2" ? 150 : 100;
    levelElement.innerText = `Level: ${level}`;
    
    levels.style.display = "none";
    gameSection.style.display = "flex";
    
    restartGame();
};

const backButton = document.getElementById("backButton");

const goBack = () => {
    clearInterval(setIntervalId); // Stop the game if it's running
    gameOver = false;
    levels.style.display = "flex";
    gameSection.style.display = "none";
    gameOverModal.style.display = "none";
    restartButton.style.display = "none";
};

backButton.addEventListener("click", goBack);

document.querySelectorAll('.level-button').forEach(button => {
    button.addEventListener('click', selectLevel);
});

restartButton.addEventListener("click", restartGame);
