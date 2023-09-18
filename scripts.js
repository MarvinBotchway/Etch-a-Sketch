const gridWidth = getComputedStyle(document.body).getPropertyValue("--grid-width");
const accentColor = getComputedStyle(document.body).getPropertyValue("--accent-color");
const inactiveColor = getComputedStyle(document.body).getPropertyValue("--inactive-color");

const sketchArea = document.querySelector("#sketch-area");
const slider = document.querySelector("#slider");
const sliderValue = document.querySelector("#slider-value");
const gridToggle = document.querySelector("#grid-toggle");
const penColorPicker = document.querySelector("#pen-color");
const radonColorToggle = document.querySelector("#rainbow");
const shadingToggle = document.querySelector("#gradient");
const eraserToggle = document.querySelector("#eraser");
const clearSketchButton = document.querySelector("#clear");

let squaresPerSide = 16;

let gridLinesVisible = false;
let sketching = false;
let randomizingColors = false;
let shading = false;
let erasing = false;
let squarePainted = false;

let penColor = "#000000";
let colorPickerColor = "#000000";
let shadeAmountHex = "00";

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
    let currentShade = "0";
    let color = "";
    
    if (e.type === "mousedown") {
        sketching = true;
        if (randomizingColors) penColor = createRandomColor();
        // By default e.target.style.background = ""
        if (shading) {
            if (e.target.style.backgroundColor != "") {
                // e.target.style.backgroundColor returns an rgba string
                // it needs to be converted and broken into penColor and shadingPercentage(opacity)
                // eg. "rgba(0, 0, 0, 0.7)"
                penColor = convertRGBAToHexA(e.target.style.backgroundColor);
                color =  e.target.style.backgroundColor;
                currentShade = color.substring((color.length - 4), (color.length - 1));
                penColor = penColor.substring(0, 7) + createShading(currentShade);
            }
            else penColor = penColor.substring(0, 7) + "1A";
            
        }
        e.target.style.backgroundColor = penColor;
    }
    else if (e.type === "mouseover" && sketching) {
        if (randomizingColors) penColor = createRandomColor();
        if (shading) {
            if (e.target.style.backgroundColor != "") {
                penColor = convertRGBAToHexA(e.target.style.backgroundColor);
                color =  e.target.style.backgroundColor;
                currentShade = color.substring((color.length - 4), (color.length - 1));
                penColor = penColor.substring(0, 7) + createShading(currentShade);
            }
            else penColor = penColor.substring(0, 7) + "1A";       
        }   
        e.target.style.backgroundColor = penColor;
    }
    else sketching = false;
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

penColorPicker.addEventListener("input", (e) => {
    penColor = colorPickerColor = e.target.value;
    if (shading) toggleShading();
    if (randomizingColors) toggleUseOfRandomColors();
    if (erasing) toggleEraser();
})

function toggleUseOfRandomColors() {
    randomizingColors = randomizingColors ? false : true;
    if (randomizingColors && erasing) toggleEraser();
    radonColorToggle.style.color = randomizingColors ? accentColor : inactiveColor;
    penColor = !randomizingColors ? colorPickerColor : penColor; 
}

function createRandomColor() {
    let newColor = "#";
    let possibleChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
    for (let i = 0; i < 6; i++){
        randomIndex = Math.floor(Math.random() * (possibleChars.length + 1));
        newColor += possibleChars[randomIndex];
    }
    return newColor;
}

function toggleShading() {
    shading = shading ? false : true;
    if (shading && erasing) toggleEraser();
    shadingToggle.style.color = shading ? accentColor : inactiveColor;
    penColor = !shading ? colorPickerColor : penColor;
}

function createShading(currentShade) {
    let shadePercentage = currentShade * 100;
    if (shadePercentage < 100) shadePercentage += 10;

    shadeAmountHex = (Math.round((shadePercentage / 100) * 255)).toString(16);
    return (shadeAmountHex);
}

function toggleEraser() {
    erasing = erasing ? false : true;
    if (erasing) {
        if (randomizingColors) toggleUseOfRandomColors();
        if (shading) toggleShading();
    }
    eraserToggle.style.color = erasing ? accentColor : inactiveColor;
    penColor = erasing ? "" : colorPickerColor;
}

function clearSketch() {
    removeGridSquares();
    createGridSquares();
}

function confirmClear(){
    if (confirm("Your sketch wound deleted!")) clearSketch();
}

function convertRGBAToHexA(rgba, forceRemoveAlpha = false) {
    return "#" + rgba.replace(/^rgba?\(|\s+|\)$/g, '') // Get's rgba / rgb string values
      .split(',') // splits them at ","
      .filter((string, index) => !forceRemoveAlpha || index !== 3)
      .map(string => parseFloat(string)) // Converts to numbers
      .map((number, index) => index === 3 ? Math.round(number * 255) : number) // Converts alpha to 255 number
      .map(number => number.toString(16)) // Converts numbers to hex
      .map(string => string.length === 1 ? "0" + string : string) // Adds 0 when length of one number is 1
      .join("") // Puts the array to togehter to create a string
}

shadingToggle.addEventListener("click", toggleShading);
radonColorToggle.addEventListener("click", toggleUseOfRandomColors);
eraserToggle.addEventListener("click", toggleEraser);
gridToggle.addEventListener("click", toggleGridLinesVisibility);
clearSketchButton.addEventListener("click", confirmClear);

slider.oninput = function() {
    squaresPerSide = this.value;
    sliderValue.textContent = `${this.value} x ${this.value} (Resolution)`;
    removeGridSquares();
    createGridSquares();
}
sliderValue.textContent = `${slider.value} x ${slider.value} (Resolution)`;

createGridSquares();
