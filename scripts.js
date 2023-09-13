const gridWidth = getComputedStyle(document.body).getPropertyValue("--grid-width");
const accentColor = getComputedStyle(document.body).getPropertyValue("--accent-color");
const inactiveColor = getComputedStyle(document.body).getPropertyValue("--inactive-color");

const sketchArea = document.querySelector("#sketch-area");
const slider = document.querySelector("#slider");
const sliderValue = document.querySelector("#slider-value");
const gridToggle = document.querySelector("#grid-toggle");

let squaresPerSide = 16;
let gridLinesVisible = false;
let isSketching = false

function toggleGridLinesVisibility() {
    gridLinesVisible = gridLinesVisible ? false : true;
    gridToggle.style.color = gridLinesVisible ? accentColor : inactiveColor;
    if (gridLinesVisible) {
        widthOrHeight = `${(parseInt(gridWidth) / squaresPerSide) - 2}px`
        sketchArea.childNodes.forEach(square => {square.style.border = "1px solid whitesmoke"});
    }
    else if (!gridLinesVisible) {
        widthOrHeight = `${(parseInt(gridWidth) / squaresPerSide)}px`
        sketchArea.childNodes.forEach(square => {square.style.border = "none"});
    }
    sketchArea.childNodes.forEach(square => {
        square.style.width = square.style.height = widthOrHeight
    });
}

function setSquareBackgroundColor(e) {
    if (e.type === "mousedown") {
        isSketching = true;
        e.target.style.backgroundColor = "black";
    }
    else if (e.type === "mouseover" && isSketching) {
        e.target.style.backgroundColor = "black";
    }
    else isSketching = false;
}

function createGridSquares() {
    const numOfSquares = (squaresPerSide * squaresPerSide);
    let widthOrHeight = 0;

    for(let i = 0; i < numOfSquares; i++) {
        const gridSquare = document.createElement("div");
        
        if (gridLinesVisible) {
            widthOrHeight = `${(parseInt(gridWidth) / squaresPerSide) - 2}px`
            gridSquare.style.border = "1px solid whitesmoke";
        }
        else if (!gridLinesVisible) {
            widthOrHeight = `${(parseInt(gridWidth) / squaresPerSide)}px`
            gridSquare.style.border = "none";
        }
        gridSquare.style.width = gridSquare.style.height = widthOrHeight;

        gridSquare.addEventListener("mousedown", (e) => setSquareBackgroundColor(e));
        gridSquare.addEventListener("mouseover", (e) => setSquareBackgroundColor(e));
        gridSquare.addEventListener("mouseup", (e) => setSquareBackgroundColor(e));
        
        gridSquare.addEventListener("dragstart", (e) => {
            e.preventDefault();
        });
        
        sketchArea.appendChild(gridSquare);
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
gridToggle.addEventListener("click", toggleGridLinesVisibility);

createGridSquares();
