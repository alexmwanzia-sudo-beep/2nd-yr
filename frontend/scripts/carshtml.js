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
            car_id:item.car_id,
            user_id:item.user_id
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

    document.querySelector(".js-cars-grid").innerHTML = carsHTML;
};

// Ensure data is loaded
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(renderCars, 200);
});