// Declare some constants and initialize some variables
const gameInfo = document.getElementById("game-info")

const winCons = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

const winMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `It's a draw!`;
const currentTurn = () => `It's ${currentPlayer}'s turn`;

let playing = true;
let currentPlayer = "X";
let gameCells = ["", "", "", "", "", "", "", "", ""]

gameInfo.innerHTML = currentTurn();

// Function that plays a turn
function playTurn(cell, cellIndex) {
    // Create a new HTML element
    let playerTurn = document.createElement("span");
    // Add the turn to the record of the game cells
    gameCells[cellIndex] = currentPlayer;
    // Put the played turn into the HTML element
    playerTurn.innerText = `${currentPlayer}`;
    // Append this element to the DOM
    cell.appendChild(playerTurn);
}

// Function that switches turns
function switchTurn() {
    // Check if the current is X
    if(currentPlayer === "X") {
        // Change it to O if it is
        currentPlayer = "O";
    // Otherwise change it to X
    } else {
        currentPlayer = "X";
    }
    // Update the status of the game
    gameInfo.innerHTML = currentTurn();
}

// Function that checks if there is a win
function winCheck() {
    // Initialize variables
    let win = false;
    let draw = !gameCells.includes("");
    let winningPattern = null;
    // Loop according to the size of the grid
    for (let i = 0; i < 8; i++) {
        // Grab each possible winning condition
        const winCon = winCons[i];
        // Grab the corresponding value of the cells in game
        let one = gameCells[winCon[0]];
        let two = gameCells[winCon[1]];
        let three = gameCells[winCon[2]];
        // Check if all of the cells are empty
        if (one === "" || two === "" || three === "") { 
            // Let the flow continue if they are
            continue;
        }
        // Check if all cells are the same
        if (one === two && two == three) {
            // Indicate a win
            win = true;
            // Set the winning pattern
            winningPattern = winCon;
            // Stop itteration
            break;
        }
    }
    // Check if there was a win
    if (win) {
        // Update the status to show there was a win
        gameInfo.innerHTML = winMessage();
        // Indicate that the game is no longer being played
        playing = false;
        // Call the drawLine function to draw a line through the winning pattern
        drawLine(winningPattern);
        // Leave the function
        return;
    }
    // Check if there was a draw
    if (draw) {
        // Update the status to show there was a draw
        gameInfo.innerHTML = drawMessage();
        // Indicate that the game is no longer being played
        playing = false;
        // Leave the function
        return;
    }
    // When there is no win or draw, change the turn
    switchTurn();
}
// Function that handles what happens when a call is played
function clickCell(cell) {
    // Get the cell that was clicked
    const clickedCell = cell.target;
    // Get the index of the clicked cell
    const clickedCellIndex = clickedCell.getAttribute("data-cell");
    // Check if there is a value in the cell or if the game is being played
    if (gameCells[clickedCellIndex] !== "" || !playing) {
        // Do nothing if either are true
        return;
    // Otherwise perform an action based on the clicked cell
    } else {
        // Call the function to play the turn
        playTurn(clickedCell, clickedCellIndex);
        // Call the function to check if this turn resulted in a win
        winCheck();
    }
}
// Function that draws a line through the winning pattern
function drawLine(winningPattern) {
    // Get the starting and ending cells that the line will be drawn through
    let cellOne = document.querySelector(`[data-cell='${winningPattern[0]}']`);
    let cellTwo = document.querySelector(`[data-cell='${winningPattern[2]}']`);
    // Check if the winning pattern matches the "across" win possibiliy
    if (winningPattern == winCons[0] || winningPattern == winCons[1] || winningPattern == winCons[2]) {
        // Get the coordinates of the start and end point of the line
        ax = cellOne.offsetLeft + 10;
        ay = cellOne.offsetTop + (cellOne.offsetHeight / 2);
        bx = cellTwo.offsetLeft + cellTwo.offsetWidth - 10;
        by = cellTwo.offsetTop + (cellTwo.offsetHeight / 2);
    }
    // Check if the winning pattern matches the "up and down" win possibility
    if (winningPattern == winCons[3] || winningPattern == winCons[4] || winningPattern == winCons[5]) {
        // Get the coordinates of the start and end point of the line
        ax = cellOne.offsetLeft + (cellOne.offsetWidth / 2);
        ay = cellOne.offsetTop + 10;
        bx = cellTwo.offsetLeft + (cellTwo.offsetWidth / 2);
        by = cellTwo.offsetTop + cellTwo.offsetHeight - 10;
    }
    // Check if the winning pattern matches the "top to bottom diagonal" win possibility
    if (winningPattern == winCons[6]) {
        // Get the coordinates of the start and end point of the line
        ax = cellOne.offsetLeft + 10;
        ay = cellOne.offsetTop + 10;
        bx = cellTwo.offsetLeft + cellTwo.offsetWidth - 10;
        by = cellTwo.offsetTop + cellTwo.offsetHeight - 10;
    }
    // Check if the winning pattern matches the "bottom to top diagonal" win possibility
    if (winningPattern == winCons[7]) {
        // Get the coordinates of the start and end point of the line
        ax = cellOne.offsetLeft+ cellOne.offsetWidth - 10;
        ay = cellOne.offsetTop + 10;
        bx = cellTwo.offsetLeft + 10;
        by = cellTwo.offsetTop  + cellOne.offsetHeight - 10;
    }
    // Check if the starting points x coordinate is bigger than the end's
    if (ax > bx) {
        // Swap the coordinates around so they match up correctly on the grid
        bx = ax + bx;
        ax = bx - ax;
        bx = bx - ax;

        by = ay + by;
        ay = by - ay;
        by = by - ay;
    }
    // Calculate the distance between the start and end point
    let distance = Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
    // Calculate angle of the line
    let calc = Math.atan((by - ay) / (bx - ax));
    // Change this angle value to degrees
    let degree = calc * 180 / Math.PI;
    // Create a div element to represent the line
    let line = document.createElement('div');
    // Set the id of the line div
    line.setAttribute("id", "line");
    // Set some of the style of the line div to allow for it to generate properly
    line.setAttribute("style",
        `position: absolute; height: 5px; transform-origin: top left; width: ${distance}px; top: ${ay}px; left: ${ax}px; transform: rotate(${degree}deg);`
    );
    // Append the created line to the body of the HTML
    document.body.appendChild(line);
}
// Function that restarts the game
function restartGame() {
    // Indicate that the game is being played again
    playing = true;
    // Set the current player to X
    currentPlayer = "X";
    // Clear the log of the game cells
    gameCells = ["", "", "", "", "", "", "", "", ""];
    // Set the status of the game to the starting turn
    gameInfo.innerHTML = currentTurn();
    // Remove the X's and O's from the grid on screen
    document.querySelectorAll(".cell").forEach(cell => cell.innerHTML = "");
    // Get the line div
    const e  = document.querySelector("#line");
    // Remove it from the DOM
    e.parentElement.removeChild(e);
}
// Add click event listeners to each of the cells
document.querySelectorAll(".cell").forEach(cell => cell.addEventListener("click", clickCell));
// Add a click event listener to the restart button
document.getElementById("restart").addEventListener("click", restartGame);