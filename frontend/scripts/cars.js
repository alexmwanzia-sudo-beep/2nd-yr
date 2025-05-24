// Fetch car details from the backend API
fetch("http://localhost:3000/api/cars") // Replace the URL if the endpoint changes
    .then((response) => response.json()) // Parse the JSON response
    .then((cars) => {
        console.log(cars); // Debugging: Display fetched car data in the console
        window.carData = cars; // Make the fetched car data globally available for other scripts
        displayCars(cars);
    })
    .catch((error) => {
        console.error("Error fetching car details:", error);
    });

// Function to render cars - moved to carshtml.js
function displayCars(cars) {
    window.carData = cars;
    renderCars();
}

// Initialize all button interactions
document.addEventListener('DOMContentLoaded', () => {

    // Initialize message owner button listeners
    const messageButtons = document.querySelectorAll('.message-owner-btn');
    messageButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const ownerContact = button.getAttribute('data-contact');
            if (!ownerContact) {
                alert('Owner contact is not available.');
                return;
            }

            try {
                // Format the phone number
                let phoneNumber = ownerContact.trim();
                // Remove any non-digit characters except +
                phoneNumber = phoneNumber.replace(/[\D]/g, '');
                // Add country code if not present
                if (!phoneNumber.startsWith('+')) {
                    phoneNumber = '+254' + phoneNumber;
                }

                // Prepare the message
                const carContainer = button.closest('.car-container');
                const carTitle = carContainer.querySelector('h3').textContent;
                const message = encodeURIComponent(`Hi! I'm interested in your ${carTitle}. Could you tell me more about it?`);

                // Create WhatsApp URL
                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

                // Open WhatsApp in new tab
                window.open(whatsappUrl, '_blank');

                // Add loading state to button
                button.disabled = true;
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';

                // Reset button after 2 seconds
                setTimeout(() => {
                    button.disabled = false;
                    button.innerHTML = '<i class="fab fa-whatsapp"></i> Message Owner';
                }, 2000);

            } catch (error) {
                console.error('Error opening WhatsApp:', error);
                alert('Failed to open WhatsApp. Please try again.');
                button.disabled = false;
                button.innerHTML = '<i class="fab fa-whatsapp"></i> Message Owner';
            }
        });
    });

    // Initialize more info button listeners
    const moreInfoButtons = document.querySelectorAll('.more-info-btn');
    moreInfoButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const carContainer = button.closest('.car-container');
            const carId = carContainer.querySelector('.like-btn').getAttribute('data-car-id');
            if (!carId) {
                console.error('No car ID found for more info button');
                return;
            }

            // Find the car data in the window.carData array
            const car = window.carData.find(c => c.id === parseInt(carId));
            if (!car) {
                console.error('Car data not found for ID:', carId);
                return;
            }

            // Create query string
            const queryString = new URLSearchParams({
                image: car.image_url,
                make: car.make,
                model: car.model,
                year: car.year,
                price: car.price,
                owner_contact: car.owner_contact
            }).toString();

            window.location.href = `more-info.html?${queryString}`;
        });
    });
});




             