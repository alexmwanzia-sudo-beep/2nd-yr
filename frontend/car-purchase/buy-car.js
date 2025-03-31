document.addEventListener("DOMContentLoaded", () => {
    const currentPage = getPageContext();

    if (currentPage === "buy-car") {
        validateSession(); // Validate user session securely
        displayReservationDetails(); // Update car details dynamically
        attachReservationListeners(); // Attach event listeners
    }

    if (currentPage === "reservationpayment") {
        validateSession(); // Validate user session for payment page
        guidePayment(); // Provide MPesa payment instructions
        attachPaymentValidationListener(); // Validate payment on button click
    }
});

function getPageContext() {
    if (window.location.href.includes("reservationpayment.html")) {
        return "reservationpayment";
    } else if (window.location.href.includes("buy-car.html")) {
        return "buy-car";
    }
    return null;
}

function validateSession() {
    const token = localStorage.getItem("authToken");

    if (!token) {
        alert("Unauthorized access. Please log in.");
        window.location.href = "/user-registration/registration-form.html";
        return;
    }

    try {
        const decodedToken = parseJwt(token); // Decode JWT
        const userId = decodedToken.userId; // Extract userId

        if (!userId) {
            throw new Error("Invalid token: Missing userId");
        }

        sessionStorage.setItem("user_id", userId);
        console.log("User authenticated. user_id:", userId);
    } catch (error) {
        console.error("Error decoding token:", error.message);
        alert("Session expired. Please log in again.");
        localStorage.removeItem("authToken");
        window.location.href = "/login.html";
    }
}

function displayReservationDetails() {
    const params = new URLSearchParams(window.location.search);
    const carName = params.get("model") || "Unknown Car";
    const price = params.get("price");
    const car_id = params.get("carid"); // Ensure consistency in key usage
    document.getElementById("car-name").textContent = carName;
    document.getElementById("car-price").textContent = price;
    document.getElementById("car_id").textContent = car_id;
}

function attachReservationListeners() {
    const reserveWithFeeButton = document.querySelector(".reserve-with-fee-btn");
    const reserveWithoutFeeButton = document.querySelector(".reserve-without-fee-btn");

    if (reserveWithFeeButton) {
        reserveWithFeeButton.addEventListener("click", reserveWithFee);
    }

    if (reserveWithoutFeeButton) {
        reserveWithoutFeeButton.addEventListener("click", reserveWithoutPayment);
    }
}

function reserveWithFee() {
    const params = new URLSearchParams(window.location.search);
    const car_id = params.get("carid"); // Ensure consistency in key usage
    const user_id = sessionStorage.getItem("user_id");

    if (!car_id || !user_id) {
        alert("Missing essential reservation details.");
        return;
    }

    const token = localStorage.getItem("authToken");
    const requestData = {
        car_id: car_id,
        user_id: user_id,
        type: "paid",
    };

    console.log("Sending reservation with fee request:", requestData);

    axios.post("/api/purchase/reserve", requestData, {
        headers: { Authorization: `Bearer ${token}` },
    }).then(response => {
        console.log("Response received:", response.data);
        if (response.data.success) {
            alert("Redirecting to the payment page.");
            window.location.href = `reservationpayment.html?carid=${car_id}`;
        } else {
            alert("Failed to process your reservation. Please try again.");
        }
    }).catch(error => {
        console.error("Error processing reservation with payment:", error);
        alert("An error occurred. Please try again.");
    });
}

function reserveWithoutPayment() {
    const params = new URLSearchParams(window.location.search);
    const car_id = params.get("carid"); // Ensure consistency in key usage
    const user_id = sessionStorage.getItem("user_id");

    if (!car_id || !user_id) {
        alert("Missing reservation details. Please try again.");
        return;
    }

    const token = localStorage.getItem("authToken");
    const requestData = {
        car_id: car_id,
        user_id: user_id,
        type: "temporary",
    };

    console.log("Sending reservation without payment request:", requestData);

    axios.post("/api/purchase/reserve", requestData, {
        headers: { Authorization: `Bearer ${token}` },
    }).then(response => {
        console.log("Response received:", response.data);
        if (response.data.success) {
            alert("Your reservation has been made. A confirmation email will be sent shortly.");
        } else {
            alert("Failed to process your reservation. Please try again.");
        }
    }).catch(error => {
        console.error("Error processing reservation without payment:", error);
        alert("An error occurred. Please try again.");
    });
}

function parseJwt(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(atob(base64).split("").map(c => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(""));
    return JSON.parse(jsonPayload);
}
