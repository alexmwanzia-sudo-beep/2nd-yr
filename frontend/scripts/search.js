document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const carsGrid = document.querySelector('.js-cars-grid');
    let allCars = []; // Will store all cars data

    // Get cars from the existing carData
    function initializeCars() {
        // Wait for the carData to be loaded from cars.js
        const checkCarsInterval = setInterval(() => {
            if (window.carData && window.carData.length > 0) {
                clearInterval(checkCarsInterval);
                allCars = window.carData;
                displayCars(allCars);
            }
        }, 100);
    }

    // Display cars in the grid
    function displayCars(cars) {
        if (!cars || cars.length === 0) {
            carsGrid.innerHTML = '<div class="no-results">No cars found matching your search.</div>';
            return;
        }

        let carsHTML = "";

        cars.forEach((item) => {
            // Ensure a proper image path
            let imagePath = "/uploads/default-image.jpg"; // Default fallback
            if (item.image_url && typeof item.image_url === "string" && item.image_url.trim() !== "") {
                let formattedImage = item.image_url.replace(/\\/g, "/"); // Fix Windows-style paths
                imagePath = formattedImage.startsWith("/uploads/") ? formattedImage : `/uploads/${formattedImage}`;
            }

            // Convert car object into a query string (encoding values)
            const queryString = new URLSearchParams({
                image: imagePath,
                make: item.make,
                model: item.model,
                year: item.year,
                price: item.price,
                mileage: item.mileage,
                condition: item.car_condition,
                owner: item.owner_name,
                description: item.description || "No description available",
                car_id: item.car_id,
                user_id: item.user_id
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
                        <p><strong>Make:</strong> ${item.make}</p>
                        <p><strong>Model:</strong> ${item.model}</p>
                        <p><strong>Year:</strong> ${item.year}</p>
                    </div>
                    <button onclick="location.href='more-info.html?${queryString}'">
                        More Info
                    </button>
                </div>
            `;
        });

        carsGrid.innerHTML = carsHTML;
    }

    // Search functionality
    function searchCars(query) {
        query = query.toLowerCase().trim();
        
        if (!query) {
            displayCars(allCars);
            return;
        }

        const filteredCars = allCars.filter(car => {
            const searchableText = `
                ${car.make || ''} 
                ${car.model || ''} 
                ${car.year || ''} 
                ${car.price || ''}
                ${car.description || ''}
                ${car.car_condition || ''}
                ${car.owner_name || ''}
            `.toLowerCase();

            return searchableText.includes(query);
        });

        displayCars(filteredCars);
    }

    // Event Listeners
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        searchCars(searchInput.value);
    });

    // Real-time search as user types
    searchInput.addEventListener('input', (e) => {
        searchCars(e.target.value);
    });

    // Initialize
    initializeCars();
}); 