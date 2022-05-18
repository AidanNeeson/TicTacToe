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
    let playerTurn = document.createElement("span");
    gameCells[cellIndex] = currentPlayer;
    playerTurn.innerText = `${currentPlayer}`;
    cell.appendChild(playerTurn);
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
    let winningPattern = null;
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
            winningPattern = winCon;
            break;
        }
    }

    if (win) {
        gameInfo.innerHTML = winMessage();
        playing = false;
        drawLine(winningPattern);
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

function drawLine(winningPattern) {
    let cellOne = document.querySelector(`[data-cell='${winningPattern[0]}']`);
    let cellTwo = document.querySelector(`[data-cell='${winningPattern[2]}']`);

    console.log(winningPattern);

    if (winningPattern == winCons[0] || winningPattern == winCons[1] || winningPattern == winCons[2]) {
        ax = cellOne.offsetLeft + 10;
        ay = cellOne.offsetTop + (cellOne.offsetHeight / 2);
        bx = cellTwo.offsetLeft + cellTwo.offsetWidth - 10;
        by = cellTwo.offsetTop + (cellTwo.offsetHeight / 2);
    }

    if (winningPattern == winCons[3] || winningPattern == winCons[4] || winningPattern == winCons[5]) {
        ax = cellOne.offsetLeft + (cellOne.offsetWidth / 2);
        ay = cellOne.offsetTop + 10;
        bx = cellTwo.offsetLeft + (cellTwo.offsetWidth / 2);
        by = cellTwo.offsetTop + cellTwo.offsetHeight - 10;
    }

    if (winningPattern == winCons[6]) {
        ax = cellOne.offsetLeft + 10;
        ay = cellOne.offsetTop + 10;
        bx = cellTwo.offsetLeft + cellTwo.offsetWidth - 10;
        by = cellTwo.offsetTop + cellTwo.offsetHeight - 10;
    }

    if (winningPattern == winCons[7]) {
        ax = cellOne.offsetLeft+ cellOne.offsetWidth - 10;
        ay = cellOne.offsetTop + 10;
        bx = cellTwo.offsetLeft + 10;
        by = cellTwo.offsetTop  + cellOne.offsetHeight - 10;
    }

    if (ax > bx) {
        bx = ax + bx;
        ax = bx - ax;
        bx = bx - ax;

        by = ay + by;
        ay = by - ay;
        by = by - ay;
    }

    let distance = Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
    let calc = Math.atan((by - ay) / (bx - ax));
    let degree = calc * 180 / Math.PI;

    let line = document.createElement('div');
    line.setAttribute("id", "line");
    line.setAttribute("style",
        `position: absolute; height: 5px; transform-origin: top left; width: ${distance}; top: ${ay}px; left: ${ax}px; transform: rotate(${degree}deg); background: black;`
    );
    document.body.appendChild(line);
}

function restartGame() {
    playing = true;
    currentPlayer = "X";
    gameCells = ["", "", "", "", "", "", "", "", ""];
    gameInfo.innerHTML = currentTurn();
    document.querySelectorAll(".cell").forEach(cell => cell.innerHTML = "");
    const e  = document.querySelector("#line");
    e.parentElement.removeChild(e);
}

document.querySelectorAll(".cell").forEach(cell => cell.addEventListener("click", clickCell));
document.getElementById("restart").addEventListener("click", restartGame);