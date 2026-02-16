const grid = document.getElementById("grid");

const WIDTH = 10;
const HEIGHT = 10;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// position du joueur
let playerCoordinatesAndDirection = {
    "x": 1,
    "y": 8,
    "direction": 4
};

for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        let index = y * WIDTH + x;

        if (x === playerCoordinatesAndDirection["x"] && y === playerCoordinatesAndDirection["y"]) {
            cell.classList.add("player");
        }

        grid.appendChild(cell);
    }
}


const cells = grid.children;

document.getElementById("run").addEventListener('click', (event) => {
    event.preventDefault();
    let program = parse(getInputProgramm());

    execute(program, playerCoordinatesAndDirection);
});

function updatePlayerPos(playerCoordinatesIn, cells) {
    if (playerCoordinatesIn["y"] >= HEIGHT || playerCoordinatesIn["x"] >= WIDTH || playerCoordinatesIn["y"] < 0 || playerCoordinatesIn["x"] < 0) {
        alert("too far away")
        return;
    }
    if (document.querySelector(".player") != null) {
        document.querySelector(".player").classList.remove("player");
    }
    let playerCoordinatesAndDirection = playerCoordinatesIn["y"] * WIDTH + playerCoordinatesIn["x"];
    cells[playerCoordinatesAndDirection].classList.add("player");
}
function mouveToDirrection(direction, playerCoordinatesIn, amount) {
    if (amount < 0) {
        direction = -direction;
        amount = -amount
    }
    for (let index = 0; index < amount; index++) {      
        switch (direction) {
            case 1:
            case -3:
                playerCoordinatesIn["y"]--;
                break;
            case 3:
            case -1:
                playerCoordinatesIn["y"]++;
                break;
            case 2:
            case -4:
                playerCoordinatesIn["x"]--;
                break;
            case 4:
            case -2:
                playerCoordinatesIn["x"]++;
                break;

            default:
                break;
        }

    }
    return playerCoordinatesIn;
}
function getInputProgramm() {
    let program = document.getElementById("commands").value;

    return program
        .split(";")
        .map(line => line.trim())
        .filter(line => line !== "");
}
function parse(program) {
    // defining paterns for commands
    const movingPattern = /^\s*avancer\s+(\d+)\s*$/i;
    const movingBackPattern = /^\s*reculer\s+(\d+)\s*$/i;
    const turnPatern = /^\s*tourner\s+(droite|gauche)\s*$/i;
    const loopPatern = /^\s*boucler\s+(\d+)\s*fois\s*$/i;
    const endPatern = /^\s*fin\s*$/i;
    const waitPattern = /^\s*attendre\s+(\d+)\s*$/i;
    let programOut = [];

    //iterating on each line of code

    for (let i = 0; i < program.length; i++) {
        let line = program[i];
        //for the current line, verifying if it match any patern
        let matchAvancer = line.match(movingPattern);
        let matchReculer = line.match(movingBackPattern);
        let matchTourner = line.match(turnPatern);
        let matchBoucler = line.match(loopPatern);
        let matchFIN = line.match(endPatern);
        let matchAttendre = line.match(waitPattern);

        
        if (line.startsWith('//')) {
            
            console.log("comment");
            
        } else if (matchAvancer) {
            
            let _amount = Number(matchAvancer[1]);
            
            programOut.push({ type: "MOVE", amount: _amount });
            
        } else if (matchReculer) {
            
            let _amount = Number(matchReculer[1]);
            
            programOut.push({ type: "MOVE", amount: -_amount });
            
        } else if (matchTourner){
            
            let _direction = matchTourner[1].toUpperCase();
            
            programOut.push({ type: "TURN", direction: _direction });
            
        } else if(matchBoucler) {
            i++;
            let depth = 1;
            let underBlock = [];
            let END = false;
            while (depth!==0) {
                let Line = program[i];
                if (!Line) {
                    alert("fin manquant pour une boucle");
                    break;
                }
                if (Line.match(loopPatern)) {
                    depth++;
                } else if (Line.match(endPatern)){
                    depth--
                }
                if (depth>0) {
                    underBlock.push(Line);
                } 
                i++
            }
            let block = parse(underBlock);
            for (let m = 0; m < Number(matchBoucler[1]); m++) {
                block.forEach(element => {
                    programOut.push(element);
                });
            }
            i--;
            console.log("boucle parsée : ");
            console.log(programOut);
            
        } else if (matchAttendre) {
            programOut.push({ type: "WAIT", duration: Number(matchAttendre[1]) });
        } else {
            alert("unknown command : " + line);
        }

    };
    
    
    console.log("programme final : ");
    console.log(programOut);
    return programOut;
}
//const dirrectionIndex = {
//        "UP":1,
//        "LEFT":2,
//        "DOWN":3,
//        "RIGHT":4
//}
async function execute(program, playerCoordinatesAndDirection) {
    
    playerCoordinatesAndDirection = {
        "x": 1,
        "y": 8,
        "direction": 4
    };
    updatePlayerPos(playerCoordinatesAndDirection, cells);
    for (const line of program) {
        await sleep(500);
        if (line.type == "MOVE") {

            playerCoordinatesAndDirection = mouveToDirrection(playerCoordinatesAndDirection["direction"], playerCoordinatesAndDirection, line.amount);
            updatePlayerPos(playerCoordinatesAndDirection, cells);

        } else if (line.type == "TURN") {
            if (line.direction === "DROITE") playerCoordinatesAndDirection["direction"] = playerCoordinatesAndDirection["direction"] - 1;
            if (line.direction === "GAUCHE") playerCoordinatesAndDirection["direction"] = playerCoordinatesAndDirection["direction"] + 1;
            if (playerCoordinatesAndDirection["direction"] <-4) playerCoordinatesAndDirection["direction"] = -1;
            if (playerCoordinatesAndDirection["direction"] > 4) playerCoordinatesAndDirection["direction"] = 1;
        } else if (line.type === "WAIT") {
            await sleep(line.duration * 1000);
        }

    }
}