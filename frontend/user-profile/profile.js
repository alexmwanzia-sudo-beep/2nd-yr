let authToken; // Global token variable

document.addEventListener("DOMContentLoaded", async () => {
  console.log('DOMContentLoaded event fired');
  authToken = localStorage.getItem("authToken");
  if (!authToken) {
    console.log('No auth token found');
    alert("You are not logged in. Redirecting to login...");
    window.location.href = "/user-registration/registration-form.html";
    return;
  }

  console.log('Auth token found:', authToken.substring(0, 10) + '...');
  try {
    // Check if required elements exist
    const requiredElements = [
      'user-name',
      'user-email',
      'profile-image',
      'hired-cars-container',
      'reserved-cars-container',
      'listed-cars-container'
    ];

    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    if (missingElements.length > 0) {
      console.error('Missing required elements:', missingElements);
      alert('Error: Some required elements are missing from the page. Please refresh and try again.');
      return;
    }

    console.log("Fetching profile data with token:", authToken.substring(0, 10) + "...");
    
    const response = await fetch("/api/profile/profile", {
      method: "GET",
      headers: { 
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json"
      },
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      console.error("HTTP error!", response.status, response.statusText);
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error("Error data:", errorData);
      throw new Error(errorData.message || `HTTP error ${response.status}`);
    }

    const data = await response.json();
    console.log("Profile data received:", data);

    // Check if required data exists
    if (!data || typeof data !== 'object') {
      console.error("Invalid response data:", data);
      throw new Error("Invalid response data format");
    }

    // Check if required data exists
    if (!data.profile || !data.profile.firstname || !data.profile.lastname) {
      console.error("Missing profile data:", data);
      throw new Error("Missing required profile data");
    }

    // Populate user details
    document.getElementById("user-name").textContent = `${data.profile.firstname} ${data.profile.lastname}`;
    document.getElementById("user-email").textContent = data.profile.email;
    
    // Set profile image
    if (data.profile.profile_picture) {
      document.getElementById("profile-image").src = data.profile.profile_picture;
    }

    // Update hired cars after token is fully initialized
    const hiredCarsContainer = document.getElementById("hired-cars-container");
    if (hiredCarsContainer && data.hireHistory && data.hireHistory.length > 0) {
      await displayHiredCars(data.hireHistory);
    } else {
      hiredCarsContainer.innerHTML = "<p>No cars hired yet.</p>";
    }

    // Update reserved cars
    const reservedCarsContainer = document.getElementById("reserved-cars-container");
    if (reservedCarsContainer && data.reservationHistory && data.reservationHistory.length > 0) {
      await displayReservedCars(data.reservationHistory);
    } else {
      reservedCarsContainer.innerHTML = "<p>No cars reserved yet.</p>";
    }

    // Update notifications
    updateNotifications(data.notifications);

    // Update listed cars
    const listedCarsContainer = document.getElementById("listed-cars-container");
    if (listedCarsContainer && data.cars && data.cars.length > 0) {
      await displayListedCars(data.cars);
    } else {
      listedCarsContainer.innerHTML = "<p>No cars listed yet.</p>";
    }

    // Add event listener for Confirm Receipt button after cars are loaded
    if (hiredCarsContainer) {
      hiredCarsContainer.addEventListener('click', async (event) => {
        if (event.target.classList.contains('confirm-receipt-btn')) {
          const carCard = event.target.closest('.car-card');
          if (carCard) {
            const carId = carCard.dataset.carId;
            if (!carId) {
              alert('Error: Car ID not found');
              return;
            }

            try {
              await updateHireStatus(carId, 'received');
              alert('Car receipt confirmed successfully!');
              // Update UI to show received status
              const statusElement = carCard.querySelector('.hire-status');
              if (statusElement) {
                statusElement.textContent = 'Status: Received';
              }
              // Hide the confirm receipt button
              event.target.style.display = 'none';
            } catch (error) {
              console.error('Error updating hire status:', error);
              alert('Failed to update hire status: ' + error.message);
            }
          }
        }
      });
    }
  } catch (error) {
    console.error("Error loading profile:", error);
    alert("Error loading profile: " + error.message);
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

// Function to display hired cars
async function displayHiredCars(hiredCars) {
    const container = document.getElementById('hired-cars-container');
    const template = document.getElementById('hired-car-template');
    
    if (!container || !template) {
        console.error('Required elements not found');
        return;
    }

    container.innerHTML = '';

    if (!hiredCars || hiredCars.length === 0) {
        container.innerHTML = '<p>No cars hired yet.</p>';
        return;
    }

    for (const hire of hiredCars) {
        const clone = template.content.cloneNode(true);
        const carCard = clone.querySelector('.car-card');
        
        // Set car details
        const imgElement = clone.querySelector('.car-image');
        const imagePath = hire.car_image_url ? 
            (hire.car_image_url.startsWith('/uploads/') ? hire.car_image_url : `/uploads/${hire.car_image_url}`) : 
            '/cars2/car3.jpg';
        imgElement.src = imagePath;
        imgElement.onerror = () => { imgElement.src = '/cars2/car3.jpg'; };
        
        clone.querySelector('.car-title').textContent = `${hire.car_make} ${hire.car_model} (${hire.car_year || 'N/A'})`;
        
        // Calculate and display hire dates
        const hireDates = clone.querySelector('.hire-dates');
        if (hireDates) {
            const startDate = new Date(hire.start_date);
            const endDate = new Date(hire.end_date);
            hireDates.textContent = `Hire Dates: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
        }
        
        // Display hire status
        const statusElement = clone.querySelector('.hire-status');
        if (statusElement) {
            statusElement.textContent = `Status: ${hire.status || 'Confirmed'}`;
        }
        
        // Show/hide buttons based on status
        const confirmReceiptBtn = clone.querySelector('.confirm-receipt-btn');
        const confirmReturnBtn = clone.querySelector('.confirm-return-btn');
        const cancelHireBtn = clone.querySelector('.cancel-hire-btn');
        
        if (confirmReceiptBtn) {
            confirmReceiptBtn.style.display = hire.status === 'confirmed' ? 'block' : 'none';
            confirmReceiptBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                updateHireStatus(hire.car_id, 'received').then(() => {
                    statusElement.textContent = 'Status: Received';
                    confirmReceiptBtn.style.display = 'none';
                    confirmReturnBtn.style.display = 'block';
                }).catch(error => {
                    alert(error.message);
                });
            };
        }
        
        if (confirmReturnBtn) {
            confirmReturnBtn.style.display = hire.status === 'received' ? 'block' : 'none';
            confirmReturnBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                updateHireStatus(hire.car_id, 'returned').then(() => {
                    statusElement.textContent = 'Status: Returned';
                    confirmReturnBtn.style.display = 'none';
                }).catch(error => {
                    alert(error.message);
                });
            };
        }
        
        if (cancelHireBtn) {
            cancelHireBtn.style.display = hire.status === 'confirmed' ? 'block' : 'none';
            cancelHireBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (confirm('Are you sure you want to cancel this hire?')) {
                    updateHireStatus(hire.car_id, 'cancelled').then(() => {
                        container.removeChild(carCard);
                    }).catch(error => {
                        alert(error.message);
                    });
                }
            };
        }
        
        // Set car ID for data attribute
        carCard.dataset.carId = hire.car_id;
        
        container.appendChild(clone);
    }
}

// Function to display listed cars
async function displayListedCars(listedCars) {
    const container = document.getElementById('listed-cars-container');
    const template = document.getElementById('listed-car-template');
    
    if (!container || !template) {
        console.error('Required elements not found');
        return;
    }

    container.innerHTML = '';

    if (!listedCars || listedCars.length === 0) {
        container.innerHTML = '<p>No cars listed yet.</p>';
        return;
    }

    for (const car of listedCars) {
        const clone = template.content.cloneNode(true);
        
        // Set car details
        const imgElement = clone.querySelector('.car-image');
        const imagePath = car.image_url ? 
            (car.image_url.startsWith('/uploads/') ? car.image_url : `/uploads/${car.image_url}`) : 
            '/cars2/car3.jpg';
        imgElement.src = imagePath;
        imgElement.onerror = () => { imgElement.src = '/cars2/car3.jpg'; };
        
        clone.querySelector('.car-title').textContent = `${car.make} ${car.model} (${car.year || 'N/A'})`;
        clone.querySelector('.car-price').textContent = `Price: $${car.price}`;
        clone.querySelector('.car-status').textContent = `Status: ${car.status || 'Available'}`;
        


        container.appendChild(clone);
    }
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

// Function to update hire status
async function updateHireStatus(carId, status) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('You must be logged in');
        }

        const response = await fetch(`/api/cars/${carId}/status`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update hire status');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating hire status:', error);
        throw error;
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

// Function to load user profile data
async function loadUserProfile() {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch("/api/profile/profile", {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        
        // Update hired cars
        const hiredCarsContainer = document.getElementById("hired-cars-container");
        if (hiredCarsContainer) {
            if (data.hireHistory && data.hireHistory.length > 0) {
                displayHiredCars(data.hireHistory);
            } else {
                hiredCarsContainer.innerHTML = "<p>No cars hired yet.</p>";
            }
        }

        // Update reserved cars
        const reservedCarsContainer = document.getElementById("reserved-cars-container");
        if (reservedCarsContainer) {
            if (data.reservationHistory && data.reservationHistory.length > 0) {
                displayReservedCars(data.reservationHistory);
            } else {
                reservedCarsContainer.innerHTML = "<p>No cars reserved yet.</p>";
            }
        }

        // Display listed cars
        await displayListedCars();
        
        return true;
    } catch (error) {
        console.error('Error loading profile:', error);
        return false;
    }
}

// Function to cancel a hire
async function cancelHire(hireId) {
    try {
        console.log('Attempting to cancel hire:', hireId);
        
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('No authentication token found');
        }

        // Ensure the URL is correct with proper formatting
        const url = `/api/hire/cancel/${hireId}`;
        console.log('Making API request to:', url);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Server response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text(); // Get the raw response text
            console.error('Error response text:', errorText);
            
            let errorMessage;
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || `Server returned ${response.status}`;
            } catch (e) {
                errorMessage = `Server returned ${response.status}: Non-JSON response`;
            }
            
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        console.log('Server response data:', data);

        if (data.success) {
            alert('Hire cancelled successfully');
            // Reload the profile data
            await loadUserProfile();
        } else {
            throw new Error(data.message || 'Failed to cancel hire - unknown error');
        }
    } catch (error) {
        console.error('Error cancelling hire:', error);
        alert(`Failed to cancel hire: ${error.message}`);
    }
}

// Function to cancel a reservation
async function cancelReservation(reservationId) {
    try {
        console.log('Attempting to cancel reservation:', reservationId);
        
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('No authentication token found');
        }

        console.log('Making cancellation request to server...');
        const response = await fetch(`/api/purchase/cancel/${reservationId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Server response status:', response.status);
        const data = await response.json();
        console.log('Server response data:', data);

        if (!response.ok) {
            throw new Error(data.message || `Server returned ${response.status}: ${data.error || 'Failed to cancel reservation'}`);
        }

        if (data.success) {
            alert('Reservation cancelled successfully');
            // Reload the profile data
            await loadUserProfile();
        } else {
            throw new Error(data.message || 'Failed to cancel reservation - unknown error');
        }
    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            error
        });
        alert(`Failed to cancel reservation: ${error.message}`);
    }
}

// Update the displayHiredCars function
async function displayHiredCars(hiredCars) {
    const container = document.getElementById('hired-cars-container');
    const template = document.getElementById('hired-car-template');
    
    if (!container || !template) {
        console.error('Required elements not found');
        return;
    }

    container.innerHTML = '';

    if (!hiredCars || hiredCars.length === 0) {
        container.innerHTML = '<p>No cars hired yet.</p>';
        return;
    }

    // Wait for token to be initialized
    await new Promise(resolve => setTimeout(resolve, 100));
    
    for (const hire of hiredCars) {
        const clone = template.content.cloneNode(true);
        const car = hire.car || {};
        
        // Skip favorite status check if token isn't available
        if (!authToken) {
            console.log('No token available, skipping favorite status check');
            continue;
        }
        
        console.log('Processing hire:', hire);
        console.log('Hire status:', hire.status);
        console.log('Hire ID:', hire.id);
        console.log('Car data:', car);
        
        // Fix image path handling
        const imgElement = clone.querySelector('.car-image');
        const imagePath = car.image_url ? 
            (car.image_url.startsWith('/uploads/') ? car.image_url : `/uploads/${car.image_url}`) : 
            '/cars2/car3.jpg';
        imgElement.src = imagePath;
        imgElement.onerror = () => { imgElement.src = '/cars2/car3.jpg'; };
        
        clone.querySelector('.car-title').textContent = `${car.make} ${car.model} (${car.year || 'N/A'})`;
        
        // Format and display hire dates
        const startDate = new Date(hire.start_date);
        const endDate = new Date(hire.end_date);
        clone.querySelector('.hire-dates').textContent = 
            `From: ${startDate.toLocaleDateString()} To: ${endDate.toLocaleDateString()}`;
        
        // Format status with badge
        const status = hire.status || 'Unknown';
        const statusText = document.createElement('span');
        statusText.textContent = `Status: ${status}`;
        
        const statusEl = clone.querySelector('.hire-status');
        statusEl.textContent = `Status: ${status}`;
        statusEl.className = `hire-status status-${status.toLowerCase()}`;

        container.appendChild(clone);
    }
}

// Function to confirm car receipt
async function confirmCarReceipt(hireId) {
    try {
        console.log('Confirming receipt of car with hire ID:', hireId);
        
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('No authentication token found');
        }

        // Ensure the URL is correct with proper formatting
        const url = `/api/hire/confirm-receipt/${hireId}`;
        console.log('Making API request to:', url);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Server response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text(); // Get the raw response text
            console.error('Error response text:', errorText);
            
            let errorMessage;
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || `Server returned ${response.status}`;
            } catch (e) {
                errorMessage = `Server returned ${response.status}: Non-JSON response`;
            }
            
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        console.log('Server response data:', data);

        if (data.success) {
            alert('Car receipt confirmed successfully');
            // Reload the profile data
            await loadUserProfile();
        } else {
            throw new Error(data.message || 'Failed to confirm receipt - unknown error');
        }
    } catch (error) {
        console.error('Error confirming car receipt:', error);
        alert(`Failed to confirm receipt: ${error.message}`);
    }
}

// Function to confirm car return
async function confirmCarReturn(hireId) {
    try {
        console.log('Confirming return of car with hire ID:', hireId);
        
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('No authentication token found');
        }

        // Ensure the URL is correct with proper formatting
        const url = `/api/hire/confirm-return/${hireId}`;
        console.log('Making API request to:', url);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Server response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text(); // Get the raw response text
            console.error('Error response text:', errorText);
            
            let errorMessage;
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || `Server returned ${response.status}`;
            } catch (e) {
                errorMessage = `Server returned ${response.status}: Non-JSON response`;
            }
            
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        console.log('Server response data:', data);

        if (data.success) {
            alert('Car return confirmed successfully');
            // Reload the profile data
            await loadUserProfile();
        } else {
            throw new Error(data.message || 'Failed to confirm return - unknown error');
        }
    } catch (error) {
        console.error('Error confirming car return:', error);
        alert(`Failed to confirm return: ${error.message}`);
    }
}

// Update the displayReservedCars function
function displayReservedCars(reservedCars) {
    const container = document.getElementById('reserved-cars-container');
    const template = document.getElementById('reserved-car-template');
    
    if (!container || !template) {
        console.error('Required elements not found');
        return;
    }

    container.innerHTML = '';

    if (!reservedCars || reservedCars.length === 0) {
        container.innerHTML = '<p>No cars reserved yet.</p>';
        return;
    }

    reservedCars.forEach(reservation => {
        const clone = template.content.cloneNode(true);
        const car = reservation.car || {};
        
        // Fix image path handling
        const imgElement = clone.querySelector('.car-image');
        const imagePath = car.image_url ? 
            (car.image_url.startsWith('/uploads/') ? car.image_url : `/uploads/${car.image_url}`) : 
            '/cars2/car3.jpg';
        imgElement.src = imagePath;
        imgElement.onerror = () => { imgElement.src = '/cars2/car3.jpg'; };
        
        clone.querySelector('.car-title').textContent = `${car.make} ${car.model} (${car.year || 'N/A'})`;
        clone.querySelector('.reservation-dates').textContent = `Reserved on: ${new Date(reservation.reserved_at).toLocaleDateString()}`;
        clone.querySelector('.reservation-status').textContent = `Status: ${reservation.status || 'Unknown'}`;
        
        // Set up Message Owner link with WhatsApp integration
        const messageOwnerLink = clone.querySelector('.message-owner-link');
        if (messageOwnerLink && car.owner_contact) {
            messageOwnerLink.setAttribute('data-contact', car.owner_contact);
            messageOwnerLink.style.display = 'inline-block';
            messageOwnerLink.addEventListener('click', (event) => {
                event.preventDefault();
                redirectToWhatsApp(car.owner_contact);
            });
        } else if (messageOwnerLink) {
            messageOwnerLink.style.display = 'none';
        }
        
        // Show cancel button only for active reservations
        const cancelBtn = clone.querySelector('.cancel-reservation-btn');
        if (reservation.status && ['reserved', 'interested'].includes(reservation.status.toLowerCase())) {
            cancelBtn.style.display = 'block';
            cancelBtn.onclick = () => {
                if (confirm('Are you sure you want to cancel this reservation?')) {
                    cancelReservation(reservation.id);
                }
            };
        }

        container.appendChild(clone);
    });
}

// Function to redirect to WhatsApp
function redirectToWhatsApp(phoneNumber) {
    if (!phoneNumber) {
        alert('Owner contact is not available.');
        return;
    }

    // Format the phone number (remove spaces, dashes, etc.)
    const formattedPhoneNumber = phoneNumber.replace(/\D/g, '');

    // Redirect to WhatsApp
    const whatsappUrl = `https://wa.me/${formattedPhoneNumber}`;
    console.log(`Redirecting to WhatsApp: ${whatsappUrl}`); // Debugging log
    window.open(whatsappUrl, '_blank');

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert("You are not logged in. Redirecting to login...");
        window.location.href = "/user-registration/registration-form.html";
        return;
    }

    // Load profile data
    loadUserProfile();
});
}



// Function to display listed cars with reservations
async function displayListedCars() {
    const container = document.getElementById('listed-cars-container');
    const template = document.getElementById('listed-car-template');
    
    if (!container || !template) {
        console.error('Required elements not found');
        return;
    }

    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('No authentication token found');
        }

        console.log('Fetching listed cars...');
        console.log('Token:', token);
        
        const response = await fetch('/api/cars/listed', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Listed cars response status:', response.status);
        console.log('Listed cars response headers:', response.headers);
        
        const cars = await response.json();
        console.log('Received cars:', cars);
        console.log('Cars type:', typeof cars);
        container.innerHTML = '';

        // Check if response is an error
        if (response.status !== 200) {
            throw new Error(cars.message || 'Failed to fetch cars');
        }

        // If it's a success response, cars should be an array
        if (!Array.isArray(cars)) {
            throw new Error('Invalid response format');
        }

        if (cars.length === 0) {
            container.innerHTML = '<p>No cars listed yet.</p>';
            return;
        }

        for (const car of cars) {
            const clone = template.content.cloneNode(true);
            
            // Set car details
            const imgElement = clone.querySelector('.car-image');
            if (imgElement) {
                imgElement.src = car.image_url ? `/uploads/${car.image_url}` : '/cars2/car3.jpg';
                imgElement.onerror = () => { imgElement.src = '/cars2/car3.jpg'; };
            }
            
            const carTitle = clone.querySelector('.car-title');
            if (carTitle) {
                carTitle.textContent = `${car.make} ${car.model} (${car.year || 'N/A'})`;
            }
            
            const carPrice = clone.querySelector('.car-price');
            if (carPrice) {
                carPrice.textContent = `Price: $${car.price}`;
            }
            
            const carStatus = clone.querySelector('.car-status');
            if (carStatus) {
                carStatus.textContent = `Status: ${car.status || 'Available'}`;
            }
            
            // Load reservations asynchronously
            const buyersList = clone.querySelector('.interested-buyers');
            if (buyersList) {
                loadReservations(car.car_id, buyersList);
            }

            // Set up sell button
            const sellButton = clone.querySelector('.sell-car-btn');
            if (sellButton) {
                sellButton.setAttribute('data-car-id', car.car_id);
                sellButton.addEventListener('click', () => handleSellCar(car.car_id));
            }
            
            // Set up favorite button
            const favoriteButton = clone.querySelector('.favorite-btn');
            if (favoriteButton) {
                checkFavoriteStatus(car.car_id, favoriteButton);
                favoriteButton.addEventListener('click', () => toggleFavorite(car.car_id, favoriteButton));
            }
            
            container.appendChild(clone);
        }
    } catch (error) {
        console.error('Error displaying listed cars:', error);
        container.innerHTML = '<p>Error loading cars. Please try again later.</p>';
    }
}

// Function to handle car sale
async function handleSellCar(carId) {
    try {
        const buyerId = prompt('Enter the buyer\'s user ID:');
        if (!buyerId) return;

        const amount = prompt('Enter the sale amount:');
        if (!amount) return;

        const response = await fetch('/api/sales/sell', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                carId,
                buyerId,
                amount: parseFloat(amount)
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to sell car');
        }

        const data = await response.json();
        alert('Car sold successfully!');
        // Refresh the listed cars display
        loadUserProfile();
    } catch (error) {
        console.error('Error selling car:', error);
        alert(`Error selling car: ${error.message}`);
        alert('Error selling car. Please try again.');
    }
}

// Function to load and display reservations
async function loadReservations(carId, buyersList) {
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            buyersList.innerHTML = '<li>Please log in to view reservations</li>';
            return;
        }

        const response = await fetch(`/api/sales/reservations/${carId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error fetching reservations:', errorText);
            buyersList.innerHTML = `<li>Error: ${errorText}</li>`;
            return;
        }

        const data = await response.json();
        console.log('Reservations data:', data);
        
        if (data.success === false) {
            buyersList.innerHTML = `<li>Error: ${data.message}</li>`;
            return;
        }

        const reservations = Array.isArray(data) ? data : [];
        
        if (reservations.length > 0) {
            reservations.forEach(reservation => {
                const li = document.createElement('li');
                li.textContent = `Buyer: ${reservation.email} (${reservation.firstname} ${reservation.lastname})`;
                buyersList.appendChild(li);
            });
        } else {
            buyersList.innerHTML = '<li>No interested buyers yet</li>';
        }
    } catch (error) {
        console.error('Error loading reservations:', error);
        buyersList.innerHTML = `<li>Error loading buyer information</li>`;
    }
}


