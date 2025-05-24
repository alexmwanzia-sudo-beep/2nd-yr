// Function to display car details
function displayCars(cars) {
    const carsContainer = document.getElementById('cars-container');
    carsContainer.innerHTML = ''; // Clear the container before adding new cars

    // Check if user is logged in
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;

    cars.forEach(car => {
        const carItem = document.createElement('div');
        carItem.className = 'car-item';

        carItem.innerHTML = `
            <img src="${car.image_url}" alt="${car.make} ${car.model}" class="car-image">
            <div class="car-details">
                <h3 class="car-title">${car.make} ${car.model}</h3>
                <p class="car-status ${car.status === 'Reserved' ? 'status-reserved' : 'status-hired'}">
                    ${car.status}
                </p>
                <p class="hire-dates">Available from: ${car.available_from}</p>
                <div class="car-actions">
                    <button class="message-owner-btn" data-contact="${car.owner_contact}">
                        Message Owner
                    </button>
                    ${isLoggedIn ? `
                        <button class="favorite-btn" data-car-id="${car.id}" onclick="toggleFavorite(${car.id}, this)">
                            <i class="far fa-heart"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;

        carsContainer.appendChild(carItem);

        // Check if car is favorited
        if (isLoggedIn) {
            checkFavoriteStatus(car.id, carItem.querySelector('.favorite-btn'));
        }
    });

    // Add event listeners to "Message Owner" buttons
    const messageButtons = document.querySelectorAll('.message-owner-btn');
    messageButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const ownerContact = event.target.getAttribute('data-contact');
            redirectToWhatsApp(ownerContact);
        });
    });
}

// Function to check if a car is favorited
async function checkFavoriteStatus(carId, button) {
    try {
        if (!carId) {
            console.error('Car ID is undefined');
            return;
        }
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('No authentication token found');
            return;
        }
        const response = await fetch(`/api/favorites/check/${carId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to check favorite status');
        }

        const { isFavorited } = await response.json();
        updateFavoriteButton(button, isFavorited);
    } catch (error) {
        console.error('Error checking favorite status:', error);
    }
}

// Function to toggle favorite status
async function toggleFavorite(carId, button) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '../user-registration/login.html';
            return;
        }

        const isFavorited = button.querySelector('i').classList.contains('fas');
        const method = isFavorited ? 'DELETE' : 'POST';
        const url = isFavorited ? `/api/favorites/remove/${carId}` : '/api/favorites/add';

        const response = await fetch(url, {
            method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: method === 'POST' ? JSON.stringify({ carId }) : undefined
        });

        if (!response.ok) {
            throw new Error('Failed to update favorite status');
        }

        updateFavoriteButton(button, !isFavorited);
    } catch (error) {
        console.error('Error toggling favorite:', error);
        alert('Failed to update favorite status. Please try again later.');
    }
}

// Function to update favorite button appearance
function updateFavoriteButton(button, isFavorited) {
    const icon = button.querySelector('i');
    if (isFavorited) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        button.classList.add('favorited');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        button.classList.remove('favorited');
    }
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
}