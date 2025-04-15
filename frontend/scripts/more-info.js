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

// Function to load car reviews
async function loadCarReviews(carId) {
    try {
        console.log('Loading reviews for car:', carId);
        const response = await fetch(`/api/reviews/car/${carId}`);
        
        if (!response.ok) {
            throw new Error('Failed to load reviews');
        }

        const data = await response.json();
        console.log('Reviews data:', data);

        // Update average rating display
        const averageRating = data.data.averageRating || 0;
        const totalReviews = data.data.totalReviews || 0;
        
        document.getElementById('average-rating-stars').innerHTML = '★'.repeat(Math.round(averageRating)) + '☆'.repeat(5 - Math.round(averageRating));
        document.getElementById('average-rating-text').textContent = `${averageRating.toFixed(1)} out of 5`;
        document.getElementById('total-reviews').textContent = `(${totalReviews} ${totalReviews === 1 ? 'review' : 'reviews'})`;

        const reviewsContainer = document.getElementById('reviews-container');

        if (data.data.reviews && data.data.reviews.length > 0) {
            reviewsContainer.innerHTML = data.data.reviews.map(review => `
                <div class="review-card">
                    <div class="review-header">
                        <span class="reviewer-name">${review.firstname} ${review.lastname}</span>
                        <span class="review-rating">${'★'.repeat(review.car_rating)}${'☆'.repeat(5 - review.car_rating)}</span>
                    </div>
                    <p class="review-content">${review.car_review}</p>
                    <span class="review-date">${new Date(review.created_at).toLocaleDateString()}</span>
                </div>
            `).join('');
        } else {
            reviewsContainer.innerHTML = '<p class="no-reviews">No reviews yet</p>';
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
        document.getElementById('reviews-container').innerHTML = 
            '<p class="no-reviews">Failed to load reviews. Please try again.</p>';
    }
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

  // Get car details from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  
  // Load car reviews
  const carId = urlParams.get('car_id');
  if (carId) {
    loadCarReviews(carId);
  }
};
