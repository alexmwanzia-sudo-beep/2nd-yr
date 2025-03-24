// Function to extract query parameters from URL
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(params.entries());
}

// Function to display car details
function displayCarDetails() {
  const carDetails = getQueryParams();

  // Debugging: Log received data
  console.log("Car Details Received:", carDetails);

  // Set the image
  document.getElementById("car-image").src = carDetails.image || "default-image.jpg";

  // Set text details
  document.getElementById("car-make").textContent = carDetails.make || "N/A";
  document.getElementById("car-model").textContent = carDetails.model || "N/A";
  document.getElementById("car-year").textContent = carDetails.year || "N/A";
  document.getElementById("car-condition").textContent = carDetails.condition || "N/A";
  document.getElementById("car-mileage").textContent = carDetails.mileage || "N/A";
  document.getElementById("car-price").textContent = carDetails.price || "N/A";
  document.getElementById("car-owner").textContent = carDetails.owner || "N/A";
  document.getElementById("car-description").textContent = carDetails.description || "No description available.";
}

// Function to handle buying a car (to be implemented)
function buyCar(carId) {
  console.log("Buying car with ID:", carId);
  // Add logic to process the car purchase
}

// Run function when the page loads
window.onload = displayCarDetails;
