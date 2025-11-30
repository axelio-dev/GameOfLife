// ===================================
// GLOBAL VARIABLES
// ===================================
let cols; // Number of columns
let rows; // Number of rows
let grid = []; 
let cellSize = 16; // Size of a cell
let cellDensity = 0.3; // Initial density of living cells
let playing = false; // Play/Pause state
let isMultiplayer = false; // Solo/Multiplayer state
let previousGrids = []; // History of previous generations
let nextGrids = []; // History of next generations
let modifiedCells = new Set(); // Cells already modified during drag operation
let playPauseButton, prevButton, nextButton, resetExampleButton, clearButton; // Buttons
let multiplayerButton; 

// ===================================
// INITIALIZATION
// ===================================
function setup() {
    createCanvas(400, 400);
    cols = floor(width / cellSize);
    rows = floor(height / cellSize);
    grid = createRandomGrid();
    frameRate(10);
    console.log("[✅] - Grid initialized");

    // Buttons (Linked with an ID)
    playPauseButton = select('#play-pause-button');
    playPauseButton.mousePressed(togglePlayPause);
    prevButton = select('#prev-button');
    prevButton.mousePressed(prevStep);
    nextButton = select('#next-button');
    nextButton.mousePressed(nextStep);
    resetExampleButton = select('#reset-example-button');
    resetExampleButton.mousePressed(resetWithRandom);
    clearButton = select('#clear-button');
    clearButton.mousePressed(clearGrid);
    multiplayerButton = select('#multiplayer-button');
    multiplayerButton.mousePressed(toggleMultiplayer);
    playPauseButton.html('<i class="fas fa-play"></i> Play');
    multiplayerButton.html('Mode: Solo');
}

// ===================================
// MAIN LOOP
// ===================================
function draw() {
    background(220);
    if (playing) {
        saveCurrentGrid();
        runSimulation();
    }
    drawGrid();
}

// ===================================
// CONTROL FUNCTIONS
// ===================================
function togglePlayPause() {
    playing = !playing;
    if (playing) {
        playPauseButton.html('<i class="fas fa-pause"></i> Pause');
    } else {
        playPauseButton.html('<i class="fas fa-play"></i> Play');
    }
}

function prevStep() {
    if (previousGrids.length > 0) {
        nextGrids.push(grid);
        grid = previousGrids.pop();
    }
}

function nextStep() {
    if (nextGrids.length > 0) {
        previousGrids.push(grid);
        grid = nextGrids.pop();
    } else {
        saveCurrentGrid();
        runSimulation();
    }
}

function resetWithRandom() {
    grid = createRandomGrid();
    previousGrids = [];
    nextGrids = [];
}

function clearGrid() {
    grid = createEmptyGrid();
    previousGrids = [];
    nextGrids = [];
}

function toggleMultiplayer() {
    isMultiplayer = !isMultiplayer;
    multiplayerButton.html(isMultiplayer ? 'Mode: Multiplayer' : 'Mode: Solo');
    clearGrid(); 
}

// ===================================
// GRID SAVING
// ===================================
function saveCurrentGrid() {
    let copy = grid.map(arr => arr.slice());
    previousGrids.push(copy);
    nextGrids = [];
}

function createRandomGrid() {
    let newGrid = [];
    for (let x = 0; x < cols; x++) {
        newGrid[x] = [];
        for (let y = 0; y < rows; y++) {
            newGrid[x][y] = random(0, 1) < cellDensity ? 1 : 0; 
        }
    }
    return newGrid;
}

function createEmptyGrid() {
    let newGrid = [];
    for (let x = 0; x < cols; x++) {
        newGrid[x] = [];
        for (let y = 0; y < rows; y++) {
            newGrid[x][y] = 0;
        }
    }
    return newGrid;
}

function drawGrid() {
    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            
            let cellState = grid[x][y];
            
            if (isMultiplayer) {
                if (cellState === 1) {
                    fill(0, 0, 255); // Blue for Player 1
                } else if (cellState === 2) {
                    fill(255, 0, 0); // Red for Player 2
                } else {
                    fill(255);       // White for dead cell
                }
            } else {
                if (cellState === 1) {
                    fill(0);        // Black for living cell
                } else {
                    fill(255);      // White for dead cell (0 or 2)
                }
            }

            stroke(0);
            rect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}

function countColorNeighbors(x, y) {
    let count1 = 0; 
    let count2 = 0; 

    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue;

            let nx = x + dx;
            let ny = y + dy;

            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
                if (grid[nx][ny] === 1) count1++;
                if (grid[nx][ny] === 2) count2++;
            }
        }
    }

    return { total: count1 + count2, count1: count1, count2: count2 };
}

function runSimulation() {
    let nextGrid = createEmptyGrid();

    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            let currentState = grid[x][y];
            let neighbors = countColorNeighbors(x, y);
            let totalNeighbors = neighbors.total;

            if (currentState !== 0) { // Alive Cell (1 or 2)
                if (totalNeighbors < 2 || totalNeighbors > 3) {
                    nextGrid[x][y] = 0; // Death
                } else {
                    nextGrid[x][y] = currentState; // Survival
                }
            } else { // Dead Cell (0)
                if (totalNeighbors === 3) {
                    if (neighbors.count1 > neighbors.count2) {
                        nextGrid[x][y] = 1; // Born as P1
                    } else if (neighbors.count2 > neighbors.count1) {
                        nextGrid[x][y] = 2; // Born as P2
                    } else {
                        nextGrid[x][y] = 0; 
                    }
                } else {
                    nextGrid[x][y] = 0;
                }
            }
        }
    }

    grid = nextGrid;
}

document.oncontextmenu = function() {
    return false;
}

function mousePressed() {
    modifiedCells.clear();
    if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
        toggleCellAtMouse();
    }
}

function mouseDragged() {
    if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
        toggleCellAtMouse();
    }
}

function toggleCellAtMouse() {
    let x = floor(mouseX / cellSize);
    let y = floor(mouseY / cellSize);

    if (x >= 0 && x < cols && y >= 0 && y < rows) {
        let key = x + ',' + y;
        if (!modifiedCells.has(key)) {
            
            if (isMultiplayer) {
                if (mouseButton === LEFT) {
                    grid[x][y] = 1; 
                } else if (mouseButton === RIGHT) {
                    grid[x][y] = 2;
                }
            } else {
                if (mouseButton === LEFT) {
                    grid[x][y] = grid[x][y] === 0 ? 1 : 0;
                }
            }
            
            modifiedCells.add(key);
        }
    }
}