// JavaScript code for drawing on the canvas with the mouse

// Get the canvas element and its context
const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

// Variables to track drawing state
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Event listeners for mouse actions
canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top];
});

canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", () => isDrawing = false);
canvas.addEventListener("mouseout", () => isDrawing = false);

// Function to draw on the canvas
function draw(e) {
    if (!isDrawing) return;

    ctx.strokeStyle = "#000"; // Set the stroke color (black)
    ctx.lineWidth = 2; // Set the line width

    ctx.beginPath();
    ctx.moveTo(lastX, lastY); // Start from the last position
    [lastX, lastY] = [e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top];
    ctx.lineTo(lastX, lastY); // Draw a line to the current position
    ctx.stroke(); // Apply the stroke
}

// Clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Add a button to clear the canvas
const clearButton = document.createElement("button");
clearButton.textContent = "Clear Canvas";
clearButton.addEventListener("click", clearCanvas);
document.body.appendChild(clearButton);
