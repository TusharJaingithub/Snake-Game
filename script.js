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
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    blocks[`${row}-${col}`] = block;
  }
}

function render() {
  let head = null;

  blocks[`${food.x}-${food.y}`].classList.add("food");

  if (direction === "left") head = { x: snake[0].x, y: snake[0].y - 1 };
  else if (direction === "right") head = { x: snake[0].x, y: snake[0].y + 1 };
  else if (direction === "up") head = { x: snake[0].x - 1, y: snake[0].y };
  else if (direction === "down") head = { x: snake[0].x + 1, y: snake[0].y };

  // Wall collision
  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
  clearInterval(intervalId);
  clearInterval(timerIntervalId);

  // clear snake from board
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill", "head");
  });

  modal.style.display = "flex";
  startGameModal.style.display = "none";
  gameOverModal.style.display = "flex";
  return;
}

  // Self collision
  if (snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
  clearInterval(intervalId);
  clearInterval(timerIntervalId);

  // clear snake from board
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill", "head");
  });

  modal.style.display = "flex";
  startGameModal.style.display = "none";
  gameOverModal.style.display = "flex";
  return;
}

  let ateFood = false;

  // Food eat
  if (head.x === food.x && head.y === food.y) {
    blocks[`${food.x}-${food.y}`].classList.remove("food");

    food = generateFood();
    score += 10;
    scoreElement.innerText = score;

    if (score > highScore) {
      highScore = score;
      highScoreElement.innerText = highScore;
      localStorage.setItem("highScore", highScore.toString());
    }

    ateFood = true;
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

  // Draw new snake
  snake.forEach((segment, index) => {
    const block = blocks[`${segment.x}-${segment.y}`];
    block.classList.add("fill");

    if (index === 0) {
      block.classList.add("head");
    }
  });
}

startButton.addEventListener("click", () => {
  modal.style.display = "none";
  intervalId = setInterval(() => {
    render();
  }, 300);
  timerIntervalId = setInterval(() => {
    let [min, sec] = time.split(":").map(Number);
    if (sec === 59) {
      min++;
      sec = 0;
    } else {
      sec++;
    }
    time = `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
    timeElement.innerText = time;
  }, 1000);
});

restartButton.addEventListener("click", restartGame);

function restartGame() {
  clearInterval(intervalId);
  clearInterval(timerIntervalId);

  blocks[`${food.x}-${food.y}`].classList.remove("food");
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });

  score = 0;
  scoreElement.innerText = score;

  time = `00:00`;
  timeElement.innerText = time;

  modal.style.display = "none";

  snake = [{ x: 1, y: 3 }];
  direction = "right";

  food = generateFood();

  intervalId = setInterval(render, 300);

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

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && direction !== "right") {
    direction = "left";
  } else if (e.key === "ArrowRight" && direction !== "left") {
    direction = "right";
  } else if (e.key === "ArrowUp" && direction !== "down") {
    direction = "up";
  } else if (e.key === "ArrowDown" && direction !== "up") {
    direction = "down";
  }
});
