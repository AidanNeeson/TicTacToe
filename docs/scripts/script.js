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

function playTurn(cell, cellIndex) {
    gameCells[cellIndex] = currentPlayer;
    cell.innerHTML = currentPlayer;
}

function switchTurn() {
    if(currentPlayer === "X") {
        currentPlayer = "O";
    } else {
        currentPlayer = "X";
    }
    gameInfo.innerHTML = currentTurn();
}

function winCheck() {
    let win = false;
    let draw = !gameCells.includes("");
    for (let i = 0; i < 8; i++) {
        const winCon = winCons[i];
        let one = gameCells[winCon[0]];
        let two = gameCells[winCon[1]];
        let three = gameCells[winCon[2]];

        if (one === "" || two === "" || three === "") { 
            continue;
        }

        if (one === two && two == three) {
            win = true;
            break;
        }
    }

    if (win) {
        gameInfo.innerHTML = winMessage();
        playing = false;
        return;
    }

    if (draw) {
        gameInfo.innerHTML = drawMessage();
        playing = false;
        return;
    }

    switchTurn();
}

function clickCell(cell) {
    const clickedCell = cell.target;
    const clickedCellIndex = clickedCell.getAttribute("data-cell");

    if (gameCells[clickedCellIndex] !== "" || !playing) {
        return;
    } else {
        playTurn(clickedCell, clickedCellIndex);
        winCheck();
    }
}

function restartGame() {
    playing = true;
    currentPlayer = "X";
    gameCells = ["", "", "", "", "", "", "", "", ""];
    gameInfo.innerHTML = currentTurn();
    document.querySelectorAll(".cell").forEach(cell => cell.innerHTML = "");
}

document.querySelectorAll(".cell").forEach(cell => cell.addEventListener("click", clickCell));
document.getElementById("restart").addEventListener("click", restartGame);