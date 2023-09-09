const gridWidth = getComputedStyle(document.body).getPropertyValue("--grid-width");
const accentColor = getComputedStyle(document.body).getPropertyValue("--accent-color");
const inactiveColor = getComputedStyle(document.body).getPropertyValue("--inactive-color");

const sketchArea = document.querySelector("#sketch-area");
const slider = document.querySelector("#slider");
const sliderValue = document.querySelector("#slider-value");
const gridToggle = document.querySelector("#grid-toggle");

let squaresPerSide = 16;
let gridVisible = false;

function toggleGrid() {
    gridVisible = gridVisible ? false : true;
    gridToggle.style.color = gridVisible ? accentColor : inactiveColor;
    removeGridSquares();
    createGridSquares();    
}

function setSquareBackgroundColor() {
    this.style.backgroundColor = "black";
}

function createGridSquares() {
    const numOfSquares = (squaresPerSide * squaresPerSide);
    let widthOrHeight = 0;

    for(let i = 0; i < numOfSquares; i++) {
        const gridCell = document.createElement("div");
        
        if (gridVisible) {
            widthOrHeight = `${(parseInt(gridWidth) / squaresPerSide) - 2}px`
            gridCell.style.border = "1px solid whitesmoke";
        }
        else if (!gridVisible) {
            widthOrHeight = `${(parseInt(gridWidth) / squaresPerSide)}px`
            gridCell.style.border = "none";
        }
        gridCell.style.width = gridCell.style.height = widthOrHeight;
        gridCell.addEventListener("mouseover", setSquareBackgroundColor);
        
        sketchArea.appendChild(gridCell);
    }
}

function removeGridSquares() {
    while (sketchArea.firstChild) {
        sketchArea.removeChild(sketchArea.firstChild);
    }
}

slider.oninput = function() {
    squaresPerSide = this.value;
    sliderValue.textContent = `${this.value} x ${this.value} (Resolution)`;
    removeGridSquares();
    createGridSquares();
}

sliderValue.textContent = `${slider.value} x ${slider.value} (Resolution)`;
gridToggle.addEventListener("click", toggleGrid);

createGridSquares();
