const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

const CELL_SIZE = 20; // Larger cells for better visibility
const ROWS = canvas.height / CELL_SIZE;
const COLS = canvas.width / CELL_SIZE;

let grid = createGrid();
let intervalId = null;
let generation = 0;

// Create an empty grid
function createGrid() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

// Draw the grid
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      ctx.fillStyle = grid[row][col] ? "yellow" : "#d3d3d3"; // Yellow for alive, light grey for dead
      ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      ctx.strokeStyle = "black"; // Black grid lines
      ctx.strokeRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
}

// Update the grid based on the rules of the Game of Life
function updateGrid() {
  const newGrid = createGrid();
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const neighbors = countNeighbors(row, col);
      if (grid[row][col] === 1) {
        newGrid[row][col] = neighbors === 2 || neighbors === 3 ? 1 : 0;
      } else {
        newGrid[row][col] = neighbors === 3 ? 1 : 0;
      }
    }
  }
  grid = newGrid;
  generation++;
  document.getElementById("generationCount").textContent = generation;
}

// Count live neighbors
function countNeighbors(row, col) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const x = row + i;
      const y = col + j;
      if (x >= 0 && x < ROWS && y >= 0 && y < COLS) {
        count += grid[x][y];
      }
    }
  }
  return count;
}

// Toggle cell state on click
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const col = Math.floor(x / CELL_SIZE);
  const row = Math.floor(y / CELL_SIZE);
  grid[row][col] = grid[row][col] ? 0 : 1;
  drawGrid();
});

// Start the simulation
document.getElementById("start").addEventListener("click", () => {
  if (!intervalId) {
    intervalId = setInterval(() => {
      updateGrid();
      drawGrid();
    }, 500); // Slower speed: 500ms per generation
  }
});

// Stop the simulation
document.getElementById("stop").addEventListener("click", () => {
  clearInterval(intervalId);
  intervalId = null;
});

// Reset the grid
document.getElementById("reset").addEventListener("click", () => {
  grid = createGrid();
  drawGrid();
  clearInterval(intervalId);
  intervalId = null;
  generation = 0;
  document.getElementById("generationCount").textContent = generation;
});

// Initial draw
drawGrid();
