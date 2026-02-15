const grid = document.getElementById("grid");

const WIDTH = 10;
const HEIGHT = 10;


// position du joueur
let playerCoordinates = {
    "x" : 1,
    "y" : 8
};


for (let y = 0; y < HEIGHT; y++) {
  for (let x = 0; x < WIDTH; x++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    let index = y * WIDTH + x;

    if (x === playerCoordinates["x"] && y === playerCoordinates["y"]) {
      cell.classList.add("player");
    }

    grid.appendChild(cell);
  }
}
const cells = grid.children;

document.getElementById("run").addEventListener('click', (event)=>{
    event.preventDefault();
    parseAndExec(getInputProgramm());
});

function updatePlayerPos(playerCoordinatesIn, cells) {
    if (playerCoordinatesIn["y"]>=HEIGHT  || playerCoordinatesIn["x"]>=WIDTH ||playerCoordinatesIn["y"]<0 || playerCoordinatesIn["x"]< 0 ) {
        alert("too far away")
        return;
    }
    if (document.querySelector(".player") != null) {
        document.querySelector(".player").classList.remove("player");
    }
    let playerCoordinates = playerCoordinatesIn["y"]*WIDTH+playerCoordinatesIn["x"];
    cells[playerCoordinates].classList.add("player");
}

function mouveToDirrection(dirrection, playerCoordinatesIn, amount) {
    
    for (let index = 0; index < amount; index++) {
        switch (dirrection) {
            case 1:
                playerCoordinatesIn["y"]--;
                break;
            case 2:
                playerCoordinatesIn["y"]++;
                break;
            case 3:
                playerCoordinatesIn["x"]--;
                break;
            case 4:
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

function parseAndExec(program) {
    // defining paterns for commands
    const mouvingPatern = /AVANCER (\d+)$/i;
    const mouvingBackPatern = /reculer (\d+)$/i;

    //iterating on each line of code
    program.forEach(line => { 
        // defining the direction 
        let direction = 4;
        //for the current line, verifying if it match any patern
        let matchAvancer = line.match(mouvingPatern);
        let matchReculer = line.match(mouvingBackPatern);
        if (line.startsWith('//')){
            console.log("comment");
            
        } else if (matchAvancer){

            // if it does, updating the position
            let amount = Number(matchAvancer[1]);
            console.log((dirrection%5)+1);
            
            playerCoordinates = mouveToDirrection((direction%5)+1, playerCoordinates, amount);

            updatePlayerPos(playerCoordinates, cells)

        } else if (matchReculer) {
            let amount = Number(matchReculer[1]);
            console.log(((dirrection+2)%5)+1);

            playerCoordinates = mouveToDirrection(((direction)+2%5)+1, playerCoordinates, amount);

            updatePlayerPos(playerCoordinates, cells)
        } else {
            alert("unknown command : "+line);
        }
    });
}



//const dirrectionIndex = {
//        "UP":1,
//        "DOWN":2,
//        "LEFT":3,
//        "RIGHT":4
//    }