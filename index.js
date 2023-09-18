// Load your TensorFlow.js model here
const model = await tf.loadLayersModel("model/model.json");

// Function to run when the user draws and predicts
async function predictDrawing() {
  // Preprocess the drawn image
  const preprocessedImage = preprocess(imgData);

  // Make a prediction using the loaded model
  const prediction = await model.predict(preprocessedImage).data();

  // Process the prediction to determine what the user drew
  // You will need to define your own logic here based on your model's output

  // For example, if you have a model that predicts digits (0-9):
  const maxPredictionIndex = prediction.indexOf(Math.max(...prediction));
  const predictedDigit = maxPredictionIndex.toString();

  // You can then display the predicted result or take further actions based on it
  console.log("Predicted Digit: " + predictedDigit);
}

// Add an event listener to run predictDrawing() when the user interacts with the canvas
canvas.on("mouse:up", predictDrawing);


//the minimum boudning box around the current drawing
const mbb = getMinBox();
//cacluate the dpi of the current window
const dpi = window.devicePixelRatio;
//extract the image data
const imgData = canvas.contextContainer.getImageData(
  mbb.min.x * dpi,
  mbb.min.y * dpi,
  (mbb.max.x - mbb.min.x) * dpi,
  (mbb.max.y - mbb.min.y) * dpi
);

function preprocess(imgData) {
  return tf.tidy(() => {
    //convert the image data to a tensor
    let tensor = tf.browser.fromPixels(imgData, (numChannels = 1));
    //resize to 28 x 28
    const resized = tf.image.resizeBilinear(tensor, [28, 28]).toFloat();
    // Normalize the image
    const offset = tf.scalar(255.0);
    const normalized = tf.scalar(1.0).sub(resized.div(offset));
    //We add a dimension to get a batch shape
    const batched = normalized.expandDims(0);
    return batched;
  });
}

//record the current drawing coordinates
function recordCoor(event) {
  //get current mouse coordinate
  var pointer = canvas.getPointer(event.e);
  var posX = pointer.x;
  var posY = pointer.y;

  //record the point if withing the canvas and the mouse is pressed
  if (posX >= 0 && posY >= 0 && mousePressed) {
    coords.push(pointer);
  }
}

//get the best bounding box by finding the top left and bottom right cornders
function getMinBox() {
  var coorX = coords.map(function (p) {
    return p.x;
  });
  var coorY = coords.map(function (p) {
    return p.y;
  });
  //find top left corner
  var min_coords = {
    x: Math.min.apply(null, coorX),
    y: Math.min.apply(null, coorY),
  };
  //find right bottom corner
  var max_coords = {
    x: Math.max.apply(null, coorX),
    y: Math.max.apply(null, coorY),
  };
  return {
    min: min_coords,
    max: max_coords,
  };
}
