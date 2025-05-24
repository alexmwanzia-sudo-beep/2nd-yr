const renderCars = () => {
    if (!window.carData || window.carData.length === 0) {
        console.error("Car data not loaded yet. Retrying...");
        setTimeout(renderCars, 100);
        return;
    }

    let carsHTML = "";

    window.carData.forEach((item) => {
        console.log("Raw Image URL from DB:", item.image_url);

        // Ensure a proper image path
        let imagePath = "/uploads/default-image.jpg"; // Default fallback
        if (item.image_url && typeof item.image_url === "string" && item.image_url.trim() !== "") {
            let formattedImage = item.image_url.replace(/\\/g, "/"); // Fix Windows-style paths
            imagePath = formattedImage.startsWith("/uploads/") ? formattedImage : `/uploads/${formattedImage}`;
        }

        // Debugging
        console.log("Final Image Path:", imagePath);
        console.log("Car ID from item object:", item.id);

        // Convert car object into a query string (encoding values)
        const queryString = new URLSearchParams({
            image: imagePath,
            make: item.make,
            model: item.model,
            year: item.year,
            price: item.price,
            mileage: item.mileage,
            condition: item.car_condition, // Ensure the correct property name from your API
            owner: item.owner_name, // Make sure this matches your backend response
            description: item.description || "No description available",
            car_id: item.car_id,
            user_id: item.user_id,
            owner_contact: item.owner_contact,

        }).toString();

        // Generate car listing HTML
        carsHTML += `
            <div class="car-container">
                <div class="car-image">
                    <img src="${imagePath}" 
                         alt="${item.make}" 
                         onerror="this.onerror=null; this.src='/uploads/default-image.jpg';">
                </div>
                <div class="car-info">
                    <h3>${item.make} ${item.model}</h3>
                    <p>Year: ${item.year}</p>
                    <p>Price: $${item.price}</p>
                    <div class="car-actions">
                        <a href="https://wa.me/${item.owner_contact}" target="_blank" class="message-owner-link">
                            <img src="cars2/whatsup.png" alt="WhatsApp">
                            <span>Message Owner</span>
                        </a>
                    </div>
                    <div class="car-actions">
                        <button onclick="location.href='more-info.html?${queryString}'" class="more-info-btn">
                            More Info
                        </button>
                        <button class="heart-btn" onclick="toggleHeart(this)">
                            <i class="far fa-heart"></i>
                        </button>

                    </div>
                </div>
            </div>
        `;
    });

    document.querySelector(".js-cars-grid").innerHTML = carsHTML;


};

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

// Function to toggle heart icon
async function toggleHeart(button) {
    const icon = button.querySelector('i');
    const carContainer = button.closest('.car-container');
    const carId = carContainer.querySelector('.more-info-btn').getAttribute('onclick').match(/car_id=(\d+)/)[1];

    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Please log in to add cars to favorites');
        return;
    }

    try {
        // Make API call to add favorite
        const response = await fetch('/api/favorites/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ carId })
        });

        const data = await response.json();

        if (response.ok) {
            // Update UI
            icon.classList.remove('far');
            icon.classList.add('fas');
            button.classList.add('hearted');
            
            // Show success message
            alert(data.message || 'Car added to favorites!');
        } else {
            throw new Error(data.message || 'Failed to add car to favorites');
        }
    } catch (error) {
        console.error('Error adding to favorites:', error);
        alert(error.message || 'Failed to add car to favorites. Please try again.');
    }
}

// Ensure data is loaded
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(renderCars, 200);
});