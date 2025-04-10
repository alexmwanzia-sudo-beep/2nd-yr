// Function to extract URL parameters
function getURLParams() {
  const urlParams = new URLSearchParams(window.location.search);
  return Object.fromEntries(urlParams.entries());
}

// Function to display car details
function displayCarDetails() {
  const carDetails = getURLParams();

  // Debugging: Log received details
  console.log("Car Details Received on More Info Page:", carDetails);

  // Set car details on the page
  document.getElementById("car-image").src = carDetails.image || "default-image.jpg";
  document.getElementById("car-make").textContent = carDetails.make || "N/A";
  document.getElementById("car-model").textContent = carDetails.model || "N/A";
  document.getElementById("car-year").textContent = carDetails.year || "N/A";
  document.getElementById("car-condition").textContent = carDetails.condition || "N/A";
  document.getElementById("car-mileage").textContent = carDetails.mileage || "N/A";
  document.getElementById("car-price").textContent = carDetails.price || "N/A";
  document.getElementById("car-owner").textContent = carDetails.owner || "N/A";
  document.getElementById("car-description").textContent = carDetails.description || "No description available.";
}

// Function to redirect to the Buy page
function goToBuyCarPage() {
  const carDetails = getURLParams();

  // Log for debugging
  console.log("Redirecting to Buy Page with details:", {
    car_id: carDetails.car_id,
    price: carDetails.price,
    model: carDetails.model,
  });

  // Redirect to the Buy page with required parameters
  window.location.href = `car-purchase/buy-car.html?carid=${encodeURIComponent(carDetails.car_id)}&price=${encodeURIComponent(carDetails.price)}&model=${encodeURIComponent(carDetails.model)}`;
}

// Function to redirect to the Hire page
function redirectToHirePage() {
  const carDetails = getURLParams();
  console.log("Redirecting to Hire Page with details:", carDetails);

  window.location.href = `car-hire/car-hire.html?&carid=${encodeURIComponent(carDetails.car_id)}&model=${encodeURIComponent(carDetails.model)}&year=${encodeURIComponent(carDetails.year)}&price=${encodeURIComponent(carDetails.price)}&image=${encodeURIComponent(carDetails.image)}&owner=${encodeURIComponent(carDetails.owner)}`;
}

document.getElementById("hire-button").addEventListener("click", redirectToHirePage);


// Function to redirect to Owner details page
function goToOwnerPage() {
  const carDetails = getURLParams();
  window.location.href = `carowner.html?owner=${carDetails.owner}`;
}

// Placeholder for Video Demo function
function viewVideoDemo() {
  alert("Video demo functionality coming soon!");
}

// Attach event listeners to buttons when the page loads
function initializeEventListeners() {
  document.getElementById("purchase-button").addEventListener("click", goToBuyCarPage);
  document.getElementById("hire-button").addEventListener("click", redirectToHirePage);
  document.getElementById("owner-button").addEventListener("click", goToOwnerPage);
  document.getElementById("video-demo-button").addEventListener("click", viewVideoDemo);
}

// Run functions when the page loads
window.onload = function () {
  displayCarDetails();
  initializeEventListeners();
};
