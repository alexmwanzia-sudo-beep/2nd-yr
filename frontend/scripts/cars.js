

// Fetch car details from the backend API
fetch("http://localhost:3000/api/cars") // Replace the URL if the endpoint changes
    .then((response) => response.json()) // Parse the JSON response
    .then((cars) => {
        console.log(cars); // Debugging: Display fetched car data in the console
        window.carData = cars; // Make the fetched car data globally available for other scripts
    })
    .catch((error) => {
        console.error("Error fetching car details:", error);
    });




             