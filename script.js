const board = document.querySelector(".board");
const startButton = document.querySelector(".start-btn");
const restartButton = document.querySelector(".restart-btn");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const scoreElement = document.querySelector("#score");
const highScoreElement = document.querySelector("#high-score");
const timeElement = document.querySelector("#time");

const blockHeight = 50;
const blockWidth = 50;
const blocks = [];

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let snake = [{ x: 1, y: 3 }];
let direction = "right";
let intervalId = null;
let timerIntervalId = null;

let highScore = localStorage.getItem("highScore") || 0;
highScoreElement.innerText = highScore;

let score = 0;
let time = `00:00`;

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    blocks[`${row}-${col}`] = block;
  }
}

function generateFood() {
  let newFood;

  do {
    newFood = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
  } while (snake.some((seg) => seg.x === newFood.x && seg.y === newFood.y));

  return newFood;
}

let food = generateFood();

function gameOver() {
  clearInterval(intervalId);
  clearInterval(timerIntervalId);

  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill", "head");
  });

  modal.style.display = "flex";
  startGameModal.style.display = "none";
  gameOverModal.style.display = "flex";
}

function render() {
  let head = null;

  if (direction === "left") head = { x: snake[0].x, y: snake[0].y - 1 };
  else if (direction === "right") head = { x: snake[0].x, y: snake[0].y + 1 };
  else if (direction === "up") head = { x: snake[0].x - 1, y: snake[0].y };
  else if (direction === "down") head = { x: snake[0].x + 1, y: snake[0].y };

  // Wall Collision
  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    gameOver();
    return;
  }

  // Self Collision
  if (snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
    gameOver();
    return;
  }

  let ateFood = false;

  // Food Eat
  if (head.x === food.x && head.y === food.y) {
    blocks[`${food.x}-${food.y}`].classList.remove("food");

    food = generateFood();
    ateFood = true;

    score += 10;
    scoreElement.innerText = score;

    if (score > highScore) {
      highScore = score;
      highScoreElement.innerText = highScore;
      localStorage.setItem("highScore", highScore.toString());
    }
  }

  // Clear old snake
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill", "head");
  });

  // Move snake
  snake.unshift(head);

  if (!ateFood) {
    snake.pop();
  }

  // Draw snake
  snake.forEach((segment, index) => {
    const block = blocks[`${segment.x}-${segment.y}`];
    block.classList.add("fill");

    if (index === 0) {
      block.classList.add("head");
    }
  });

  // Draw food
  blocks[`${food.x}-${food.y}`].classList.add("food");
}

function startGame() {
  clearInterval(intervalId);
  clearInterval(timerIntervalId);

  intervalId = setInterval(render, 250);

  timerIntervalId = setInterval(() => {
    let [min, sec] = time.split(":").map(Number);

    if (sec === 59) {
      min++;
      sec = 0;
    } else {
      sec++;
    }

    time = `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;

    timeElement.innerText = time;
  }, 1000);
}

startButton.addEventListener("click", () => {
  modal.style.display = "none";
  startGameModal.style.display = "flex";
  gameOverModal.style.display = "none";

  startGame();
});

restartButton.addEventListener("click", restartGame);

function restartGame() {
  clearInterval(intervalId);
  clearInterval(timerIntervalId);

  // clear old snake and food
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill", "head");
  });

  blocks[`${food.x}-${food.y}`].classList.remove("food");

  score = 0;
  scoreElement.innerText = score;

  time = "00:00";
  timeElement.innerText = time;

  snake = [{ x: 1, y: 3 }];
  direction = "right";
  food = generateFood();

  modal.style.display = "none";

  startGame();
}

// Desktop Keyboard Controls
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && direction !== "right") direction = "left";
  else if (e.key === "ArrowRight" && direction !== "left") direction = "right";
  else if (e.key === "ArrowUp" && direction !== "down") direction = "up";
  else if (e.key === "ArrowDown" && direction !== "up") direction = "down";
});

// Mobile Controls Buttons
document.querySelector(".up").addEventListener("click", () => {
  if (direction !== "down") direction = "up";
});

document.querySelector(".down").addEventListener("click", () => {
  if (direction !== "up") direction = "down";
});

document.querySelector(".left").addEventListener("click", () => {
  if (direction !== "right") direction = "left";
});

document.querySelector(".right").addEventListener("click", () => {
  if (direction !== "left") direction = "right";
});