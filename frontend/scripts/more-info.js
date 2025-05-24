// Function to extract URL parameters
function getURLParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    image: params.get("image"),
    make: params.get("make"),
    model: params.get("model"),
    year: params.get("year"),
    price: params.get("price"),
    mileage: params.get("mileage"),
    condition: params.get("condition"),
    owner: params.get("owner"),
    description: params.get("description"),
    car_id: params.get("car_id"),
    user_id: params.get("user_id"),
    owner_contact: params.get("owner_contact")
  };
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
  document.getElementById("car-description").textContent = carDetails.description || "N/A";

  // Store car_id and user_id in sessionStorage for later use
  if (carDetails.car_id) {
    sessionStorage.setItem("car_id", carDetails.car_id);
  }
  if (carDetails.user_id) {
    sessionStorage.setItem("user_id", carDetails.user_id);
  }
}

// Function to redirect to the Buy page
function redirectToBuy() {
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
function redirectToHire() {
  const carDetails = getURLParams();
  console.log("Redirecting to Hire Page with details:", carDetails);

  window.location.href = `car-hire/car-hire.html?carid=${encodeURIComponent(carDetails.car_id)}&model=${encodeURIComponent(carDetails.model)}&year=${encodeURIComponent(carDetails.year)}&price=${encodeURIComponent(carDetails.price)}&image=${encodeURIComponent(carDetails.image)}&owner=${encodeURIComponent(carDetails.owner)}`;
}

// Function to redirect to Owner details page
function goToOwnerPage() {
  const carDetails = getURLParams();
  window.location.href = `carowner.html?owner=${encodeURIComponent(carDetails.owner)}&contact=${encodeURIComponent(carDetails.owner_contact)}`;
}

// Placeholder for Video Demo function
function viewVideoDemo() {
  alert("Video demo feature coming soon!");
}

// Function to load car reviews
async function loadCarReviews(carId) {
    try {
        console.log('Loading reviews for car:', carId);
        const response = await fetch(`/api/reviews/car/${carId}`);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to load reviews');
        }

        const data = await response.json();
        console.log('Reviews data:', data);

        const reviewsContainer = document.getElementById('reviews-container');
        if (!reviewsContainer) {
            throw new Error('Reviews container not found');
        }

        // Check if response has the expected structure
        if (!data.success) {
            throw new Error(data.message || 'Invalid response format');
        }

        const reviews = data.data?.reviews || [];
        
        if (reviews.length > 0) {
            reviewsContainer.innerHTML = reviews.map(review => `
                <div class="review-card">
                    <div class="review-header">
                        <span class="reviewer-name">${review.firstname || 'Anonymous'} ${review.lastname || ''}</span>
                        <span class="review-rating">${'★'.repeat(review.car_rating || 0)}${'☆'.repeat(5 - (review.car_rating || 0))}</span>
                    </div>
                    <p class="review-content">${review.car_review || 'No review text'}</p>
                    <span class="review-date">
                        <i class="far fa-calendar-alt"></i>
                        ${new Date(review.created_at || Date.now()).toLocaleDateString()}
                    </span>
                </div>
            `).join('');
        } else {
            reviewsContainer.innerHTML = '<p class="no-reviews">No reviews yet</p>';
        }

        // Update average rating
        const averageRating = document.getElementById('average-rating-stars');
        const totalReviews = document.getElementById('total-reviews');
        
        if (averageRating && totalReviews) {
            const avgRating = reviews.reduce((sum, review) => sum + (review.car_rating || 0), 0) / reviews.length || 0;
            averageRating.innerHTML = '★'.repeat(Math.round(avgRating)) + '☆'.repeat(5 - Math.round(avgRating));
            totalReviews.textContent = ` (${reviews.length} reviews)`;
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
        const reviewsContainer = document.getElementById('reviews-container');
        if (reviewsContainer) {
            reviewsContainer.innerHTML = 
                '<p class="no-reviews">Failed to load reviews. Please try again.</p>';
        }
    }
}

// Function to initialize event listeners
function initializeEventListeners() {
  // Hire button
  document.getElementById("hire-button").addEventListener("click", () => {
    const carDetails = getURLParams();
    window.location.href = `car-hire/car-hire.html?carid=${encodeURIComponent(carDetails.car_id)}&model=${encodeURIComponent(carDetails.model)}&year=${encodeURIComponent(carDetails.year)}&price=${encodeURIComponent(carDetails.price)}&image=${encodeURIComponent(carDetails.image)}&owner=${encodeURIComponent(carDetails.owner)}`;
  });

  // Purchase button
  document.getElementById("purchase-button").addEventListener("click", () => {
    const carDetails = getURLParams();
    window.location.href = `car-purchase/buy-car.html?carid=${encodeURIComponent(carDetails.car_id)}&price=${encodeURIComponent(carDetails.price)}&model=${encodeURIComponent(carDetails.model)}`;
  });

  // Owner details button
  document.getElementById("owner-button").addEventListener("click", () => {
    const carDetails = getURLParams();
    window.location.href = `carowner.html?owner=${encodeURIComponent(carDetails.owner)}&contact=${encodeURIComponent(carDetails.owner_contact)}`;
  });

  // Video demo button
  document.getElementById("video-demo-button").addEventListener("click", () => {
    alert("Video demo feature coming soon!");
  });
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
