const GRIDSIDE = 600;
let squaresPerSide = 16;


const sketchArea = document.querySelector("#sketch-area");
sketchArea.style.width = sketchArea.style.height =`${GRIDSIDE}px`;

function setCellBackgroundColor() {
    this.style.backgroundColor = "black";
}

function createGridCells() {
    const numOfSquares = (squaresPerSide * squaresPerSide);
    const widthOrHeight = `${(GRIDSIDE / squaresPerSide) - 2}px`;

    for(let i = 0; i < numOfSquares; i++) {
        const gridCell = document.createElement("div");
        
        gridCell.style.width = gridCell.style.height = widthOrHeight;
        gridCell.classList.add("cell");

        sketchArea.appendChild(gridCell);
        
        gridCell.addEventListener("mouseover", setCellBackgroundColor);
    }
}


createGridCells();
