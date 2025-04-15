document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("You are not logged in. Redirecting to login...");
    window.location.href = "/user-registration/registration-form.html";
    return;
  }

  try {
    console.log("Fetching profile data with token:", token.substring(0, 10) + "...");
    
    const response = await fetch("/api/profile/profile", {
      method: "GET",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });

    console.log("Response status:", response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log("Profile data received:", data);

      // Populate user details
      document.getElementById("user-name").textContent = `${data.profile.firstname} ${data.profile.lastname}`;
      document.getElementById("user-email").textContent = data.profile.email;
      
      // Set profile image
      if (data.profile.profile_picture) {
        document.getElementById("profile-image").src = data.profile.profile_picture;
      }

      // Populate Cars Listed
      const carsListedContainer = document.getElementById("cars-listed-container");
      carsListedContainer.innerHTML = ""; // Clear placeholder
      
      if (data.cars && data.cars.length > 0) {
        data.cars.forEach((car) => {
          const carItem = document.createElement("div");
          carItem.className = "car-item";
          
          // Fix image path
          const imagePath = car.image_url || '/cars2/car3.jpg';
          console.log("Car image path:", imagePath);
          
          carItem.innerHTML = `
            <img src="${imagePath}" alt="${car.make} ${car.model}" onerror="this.src='/cars2/car3.jpg'"/>
            <p><strong>${car.make} ${car.model}</strong> (${car.year})</p>
            <button onclick='showMoreInfo(${JSON.stringify(car).replace(/'/g, "\\'")})'>More Info</button>
          `;
          carsListedContainer.appendChild(carItem);
        });
      } else {
        carsListedContainer.innerHTML = "<p>No cars listed yet.</p>";
      }

      // Populate Cars Hired
      const carsHiredContainer = document.getElementById("cars-hired-container");
      carsHiredContainer.innerHTML = ""; // Clear placeholder
      
      if (data.hireHistory && data.hireHistory.length > 0) {
        data.hireHistory.forEach((hire) => {
          const carItem = document.createElement("div");
          carItem.className = "car-item";
          
          // Get car details from the hire record
          const car = hire.car || {};
          const imagePath = car.image_url || '/cars2/car3.jpg';
          console.log("Hire car details:", car);
          
          carItem.innerHTML = `
            <img src="${imagePath}" alt="${car.make} ${car.model}" onerror="this.src='/cars2/car3.jpg'"/>
            <p><strong>${car.make} ${car.model}</strong> (${car.year})</p>
            <p>Status: ${hire.status}</p>
            <p>Start Date: ${new Date(hire.start_date).toLocaleDateString()}</p>
            <p>Duration: ${hire.duration} days</p>
            <button onclick='showMoreInfo(${JSON.stringify(car).replace(/'/g, "\\'")})'>More Info</button>
          `;
          carsHiredContainer.appendChild(carItem);
        });
      } else {
        carsHiredContainer.innerHTML = "<p>No cars hired yet.</p>";
      }

      // Populate Cars Reserved
      const carsPurchasedContainer = document.getElementById("cars-purchased-container");
      carsPurchasedContainer.innerHTML = ""; // Clear placeholder
      
      if (data.reservationHistory && data.reservationHistory.length > 0) {
        data.reservationHistory.forEach((reservation) => {
          const carItem = document.createElement("div");
          carItem.className = "car-item";
          
          // Get car details from the reservation record
          const car = reservation.car || {};
          const imagePath = car.image_url || '/cars2/car3.jpg';
          console.log("Reservation car details:", car);
          
          carItem.innerHTML = `
            <img src="${imagePath}" alt="${car.make} ${car.model}" onerror="this.src='/cars2/car3.jpg'"/>
            <p><strong>${car.make} ${car.model}</strong> (${car.year})</p>
            <p>Status: ${reservation.status}</p>
            <p>Start Date: ${new Date(reservation.start_date).toLocaleDateString()}</p>
            <p>Duration: ${reservation.duration} days</p>
            <button onclick='showMoreInfo(${JSON.stringify(car).replace(/'/g, "\\'")})'>More Info</button>
          `;
          carsPurchasedContainer.appendChild(carItem);
        });
      } else {
        carsPurchasedContainer.innerHTML = "<p>No cars reserved yet.</p>";
      }

      // Populate Notifications
      updateNotifications(data.notifications);
    } else {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      
      if (response.status === 401) {
        alert("Authentication error: " + (errorData.message || "Please log in again."));
        localStorage.removeItem("authToken");
        window.location.href = "/user-registration/registration-form.html";
      } else {
        alert("Failed to fetch profile data: " + (errorData.message || "Unknown error"));
      }
    }
  } catch (error) {
    console.error("Error fetching profile data:", error);
    alert("Network error: " + error.message);
  }
});

// Function to show more info about a car
function showMoreInfo(car) {
    if (!car) {
        alert("Car details are missing");
        return;
    }
    
    // Create query string with car details
    const queryString = new URLSearchParams({
        image: car.image_url || '/uploads/default-image.jpg',
        make: car.make,
        model: car.model,
        year: car.year,
        price: car.price,
        mileage: car.mileage,
        condition: car.car_condition,
        owner: car.owner_name,
        description: car.description || "No description available",
        car_id: car.car_id,
        user_id: car.user_id
    }).toString();

    window.location.href = `../more-info.html?${queryString}`;
}

// Function to show hire details
function showHireDetails(hireId) {
  if (!hireId) {
    alert("Hire ID is missing");
    return;
  }
  alert(`Hire ID: ${hireId}\nMore details will be shown here.`);
}

// Function to show reservation details
function showReservationDetails(reservationId) {
  if (!reservationId) {
    alert("Reservation ID is missing");
    return;
  }
  alert(`Reservation ID: ${reservationId}\nMore details will be shown here.`);
}

function updateNotifications(notifications) {
    const notificationsContainer = document.querySelector('.notifications-container');
    const notificationCount = document.querySelector('.notification-count');
    
    // Clear existing notifications
    notificationsContainer.innerHTML = '';
    
    if (notifications && notifications.length > 0) {
        // Update notification count
        notificationCount.textContent = notifications.length;
        notificationCount.style.display = 'block';
        
        // Add each notification
        notifications.forEach(notification => {
            const notificationItem = document.createElement('div');
            notificationItem.className = 'notification-item';
            
            const notificationContent = document.createElement('div');
            notificationContent.className = 'notification-content';
            
            const message = document.createElement('div');
            message.className = 'notification-message';
            message.textContent = notification.message;
            
            notificationContent.appendChild(message);
            notificationItem.appendChild(notificationContent);
            notificationsContainer.appendChild(notificationItem);
        });
    } else {
        // Show "No notifications" message
        notificationCount.style.display = 'none';
        const noNotifications = document.createElement('div');
        noNotifications.className = 'notification-item';
        noNotifications.textContent = 'No notifications';
        notificationsContainer.appendChild(noNotifications);
    }
}

// Toggle notifications dropdown
const notificationBtn = document.querySelector('.notification-btn');
const notificationsList = document.querySelector('.notifications-list');

notificationBtn.addEventListener('click', () => {
    notificationsList.classList.toggle('hidden');
});

// Close notifications when clicking outside
document.addEventListener('click', (event) => {
    if (!notificationsList.contains(event.target) && !notificationBtn.contains(event.target)) {
        notificationsList.classList.add('hidden');
    }
});

// Clear notifications
const clearNotificationsBtn = document.getElementById('clear-notifications');
clearNotificationsBtn.addEventListener('click', () => {
    const notificationsContainer = document.querySelector('.notifications-container');
    notificationsContainer.innerHTML = '';
    document.querySelector('.notification-count').style.display = 'none';
});

// Load reviewable cars
async function loadReviewableCars() {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('You must be logged in to view reviewable cars');
        }

        console.log('Fetching reviewable cars...');
        const response = await fetch('/api/user/reviewable-cars', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load reviewable cars');
        }

        const data = await response.json();
        console.log('Reviewable cars data:', data);

        const carSelect = document.getElementById('carSelect');
        carSelect.innerHTML = '<option value="">Select a car to review</option>';

        if (data.data && data.data.cars && data.data.cars.length > 0) {
            data.data.cars.forEach(car => {
                const option = document.createElement('option');
                option.value = car.car_id;
                option.textContent = `${car.year} ${car.make} ${car.model} (${car.status})`;
                carSelect.appendChild(option);
            });
        } else {
            const option = document.createElement('option');
            option.disabled = true;
            option.textContent = 'No cars available for review';
            carSelect.appendChild(option);
        }
    } catch (error) {
        console.error('Error loading reviewable cars:', error);
        const carSelect = document.getElementById('carSelect');
        carSelect.innerHTML = '<option value="">Error loading cars</option>';
    }
}

// Load user's reviews
async function loadUserReviews() {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('You must be logged in to view reviews');
        }

        console.log('Fetching user reviews...');
        const response = await fetch('/api/reviews/user', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load reviews');
        }

        const data = await response.json();
        console.log('User reviews data:', data);

        const reviewsContainer = document.getElementById('userReviews');
        
        if (data.data && data.data.reviews && data.data.reviews.length > 0) {
            reviewsContainer.innerHTML = data.data.reviews.map(review => {
                if (review.car_review) {
                    // Car review
                    return `
                        <div class="review-card car-review">
                            <div class="review-header">
                                <h4>${review.make} ${review.model} (${review.year})</h4>
                                <div class="rating">
                                    ${'★'.repeat(review.car_rating)}${'☆'.repeat(5 - review.car_rating)}
                                </div>
                            </div>
                            <p class="review-content">${review.car_review}</p>
                            <div class="review-footer">
                                <span class="review-date">${new Date(review.created_at).toLocaleDateString()}</span>
                                <button onclick="deleteReview(${review.id})" class="delete-btn">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </div>
                        </div>
                    `;
                } else if (review.system_review) {
                    // System review
                    return `
                        <div class="review-card system-review">
                            <div class="review-header">
                                <h4>System Review</h4>
                            </div>
                            <p class="review-content">${review.system_review}</p>
                            <div class="review-footer">
                                <span class="review-date">${new Date(review.created_at).toLocaleDateString()}</span>
                                <button onclick="deleteReview(${review.id})" class="delete-btn">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </div>
                        </div>
                    `;
                }
            }).join('');
        } else {
            reviewsContainer.innerHTML = '<p class="no-reviews">No reviews yet</p>';
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
        document.getElementById('userReviews').innerHTML = 
            '<p class="error">Failed to load reviews. Please try again.</p>';
    }
}

// Handle car review submission
async function handleCarReviewSubmit(event) {
    event.preventDefault();
    console.log('Car review form submission started');
    
    const form = event.target;
    const formData = new FormData(form);

    try {
        // Validate form
        const carId = formData.get('carId');
        const rating = formData.get('rating');
        const content = formData.get('content');

        console.log('Form data:', {
            carId,
            rating,
            content
        });

        if (!carId) {
            throw new Error('Please select a car to review');
        }
        if (!rating) {
            throw new Error('Please provide a rating');
        }
        if (!content.trim()) {
            throw new Error('Please write a review');
        }

        // Submit review
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('You must be logged in to submit a review');
        }

        console.log('Submitting review to server...');
        const response = await fetch('/api/reviews/car', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                carId: parseInt(carId),
                carRating: parseInt(rating),
                carReview: content.trim()
            })
        });

        console.log('Server response status:', response.status);
        const responseData = await response.json();
        console.log('Server response:', responseData);

        if (!response.ok) {
            throw new Error(responseData.message || 'Failed to submit car review');
        }

        // Success handling
        alert('Car review submitted successfully!');
        form.reset();
        await loadUserReviews();

    } catch (error) {
        console.error('Car review submission error:', error);
        alert(error.message);
    }
}

// Handle system review submission
async function handleSystemReviewSubmit(event) {
    event.preventDefault();
    const form = document.getElementById('systemReviewForm');
    const formData = new FormData(form);

    try {
        // Validate form
        const systemReview = formData.get('systemReview');

        if (!systemReview.trim()) {
            throw new Error('Please write a review');
        }

        // Submit review
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('You must be logged in to submit a review');
        }

        const response = await fetch('/api/reviews/system', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                systemReview: systemReview.trim()
            })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to submit system review');
        }

        // Success handling
        alert('System review submitted successfully!');
        form.reset();
        await loadUserReviews();

    } catch (error) {
        alert(error.message);
        console.error('System review submission error:', error);
    }
}

// Delete a review
async function deleteReview(reviewId) {
    if (!confirm('Are you sure you want to delete this review?')) {
        return;
    }

    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('You must be logged in to delete a review');
        }

        const response = await fetch(`/api/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete review');
        }

        await loadUserReviews();
        alert('Review deleted successfully');

    } catch (error) {
        alert(error.message);
        console.error('Error deleting review:', error);
    }
}

// Handle review filtering
function initializeReviewFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const reviewCards = document.querySelectorAll('.review-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter reviews
            const filter = button.dataset.filter;
            reviewCards.forEach(card => {
                if (filter === 'all' || card.classList.contains(`${filter}-review`)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Handle character count
function initializeCharacterCount() {
    const textareas = document.querySelectorAll('textarea');
    const maxLength = 500;

    textareas.forEach(textarea => {
        const wordCount = textarea.nextElementSibling;
        
        textarea.addEventListener('input', () => {
            const remaining = maxLength - textarea.value.length;
            wordCount.textContent = `${textarea.value.length}/${maxLength} characters`;
            
            if (remaining < 0) {
                wordCount.style.color = '#dc3545';
                textarea.value = textarea.value.substring(0, maxLength);
            } else {
                wordCount.style.color = '#6c757d';
            }
        });
    });
}

// Initialize star rating functionality
function initializeStarRating() {
    const starContainer = document.querySelector('.star-input');
    const starLabels = document.querySelectorAll('.star-input label');
    const starInputs = document.querySelectorAll('.star-input input[type="radio"]');
    
    // Handle keyboard navigation
    starLabels.forEach((label) => {
        label.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                const input = document.getElementById(label.getAttribute('for'));
                input.checked = true;
                updateStarDisplay(input.value);
            }
        });

        // Handle mouse hover
        label.addEventListener('mouseenter', () => {
            const rating = label.getAttribute('for').replace('star', '');
            updateStarDisplay(rating, true); // true for hover state
        });
    });

    // Handle mouse leave from container
    starContainer.addEventListener('mouseleave', () => {
        const checkedStar = document.querySelector('.star-input input[type="radio"]:checked');
        if (checkedStar) {
            updateStarDisplay(checkedStar.value);
        } else {
            updateStarDisplay(0);
        }
    });

    // Handle click events
    starInputs.forEach((input) => {
        input.addEventListener('change', (e) => {
            updateStarDisplay(e.target.value);
        });
    });
}

// Update star display
function updateStarDisplay(rating, isHover = false) {
    const stars = document.querySelectorAll('.star-input label');
    stars.forEach((star, index) => {
        const starValue = 5 - index; // Reverse index since stars are in reverse order
        if (isHover) {
            star.style.color = starValue <= rating ? '#ffd700' : '#ddd';
        } else {
            star.style.color = starValue <= rating ? '#ffd700' : '#ddd';
        }
    });
}

// Initialize review forms
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing review forms');
    
    // Initialize form elements
    const carReviewForm = document.getElementById('carReviewForm');
    const systemReviewForm = document.getElementById('systemReviewForm');

    // Initialize star rating
    initializeStarRating();

    // Car review form submission
    if (carReviewForm) {
        console.log('Car review form found:', carReviewForm);
        carReviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Car review form submitted');
            await handleCarReviewSubmit(e);
        });
    } else {
        console.error('Car review form not found');
    }

    // System review form submission
    if (systemReviewForm) {
        console.log('System review form found:', systemReviewForm);
        systemReviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('System review form submitted');
            await handleSystemReviewSubmit(e);
        });
    } else {
        console.error('System review form not found');
    }

    // Initialize character count
    initializeCharacterCount();

    // Load initial data
    loadReviewableCars();
    loadUserReviews().then(() => {
        // Initialize filters after reviews are loaded
        initializeReviewFilters();
    });
});
