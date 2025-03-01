
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("buy-form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Get form values
        const fullName = document.getElementById("full-name").value.trim();
        const phoneNumber = document.getElementById("phone-number").value.trim();
        const address = document.getElementById("address").value.trim();
        const kraPin = document.getElementById("kra-pin").value.trim();
        const reservationAmount = parseInt(document.getElementById("reservation-amount").value.trim());

        // Validate inputs
        if (!fullName || !phoneNumber || !address || !kraPin || reservationAmount < 50000) {
            alert("Please fill in all fields correctly.");
            return;
        }

        // Prepare data for the backend
        const requestData = {
            fullName,
            phoneNumber,
            address,
            kraPin,
            reservationAmount,
            carId: "123" // Placeholder, replace with dynamic car ID
        };

        try {
            const response = await fetch("http://localhost:5000/buy", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();
            if (response.ok) {
                alert("Reservation successful! Check your email for details.");
                form.reset();
            } else {
                alert(data.message || "Error processing your request.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to connect to the server.");
        }
    });
});
