document.addEventListener("DOMContentLoaded", () => {
    validateSession(); // Ensure user is authenticated
    displayReservationDetails(); // Populate car details
    attachReservationListeners(); // Attach button listeners
});

function validateSession() {
    const token = localStorage.getItem("authToken");

    if (!token) {
        alert("Unauthorized access. Please log in.");
        window.location.href = "/user-registration/registration-form.html";
        return;
    }

    try {
        const decodedToken = parseJwt(token);
        const userId = decodedToken.userId;

        if (!userId) {
            throw new Error("Invalid token: Missing userId");
        }

        sessionStorage.setItem("user_id", userId);
        console.log("✅ User authenticated. user_id:", userId);
    } catch (error) {
        console.error("❌ Error decoding token:", error.message);
        alert("Session expired. Please log in again.");
        localStorage.removeItem("authToken");
        window.location.href = "/login.html";
    }
}

function displayReservationDetails() {
    const params = new URLSearchParams(window.location.search);
    const carName = params.get("model") || "Unknown Car";
    const price = params.get("price");
    const car_id = params.get("carid");

    // Store reservation details for forwarding
    sessionStorage.setItem("car_id", car_id);
    sessionStorage.setItem("price", price);

    document.getElementById("car-name").textContent = carName;
    document.getElementById("car-price").textContent = price;
    document.getElementById("car_id").textContent = car_id;
}

function attachReservationListeners() {
    // Remove any existing listeners first
    const withFeeBtn = document.querySelector(".reserve-with-fee-btn");
    const withoutFeeBtn = document.querySelector(".reserve-without-fee-btn");
    
    if (withFeeBtn) {
        withFeeBtn.replaceWith(withFeeBtn.cloneNode(true));
        document.querySelector(".reserve-with-fee-btn").addEventListener("click", reserveWithFee);
    }
    
    if (withoutFeeBtn) {
        withoutFeeBtn.replaceWith(withoutFeeBtn.cloneNode(true));
        document.querySelector(".reserve-without-fee-btn").addEventListener("click", reserveWithoutPayment);
    }
}

function reserveWithFee() {
    const car_id = sessionStorage.getItem("car_id");
    const user_id = sessionStorage.getItem("user_id");

    if (!car_id || !user_id) {
        alert("❌ Missing essential reservation details.");
        return;
    }

    console.log("🚀 Redirecting to payment page...");
    window.location.href = `reservationpayment.html?carid=${car_id}&user_id=${user_id}`;
}

// Flag to prevent duplicate submissions
let isSubmitting = false;

// Function to show loading overlay
function showLoading(message = "Processing your request...") {
    const overlay = document.getElementById("loadingOverlay");
    const loadingText = overlay.querySelector(".loading-text");
    loadingText.textContent = message;
    overlay.classList.add("active");
}

// Function to hide loading overlay
function hideLoading() {
    const overlay = document.getElementById("loadingOverlay");
    overlay.classList.remove("active");
}

function reserveWithoutPayment() {
    if (isSubmitting) {
        console.log("⚠️ Submission already in progress");
        return;
    }

    const car_id = sessionStorage.getItem("car_id");
    const user_id = sessionStorage.getItem("user_id");

    if (!car_id || !user_id) {
        alert("❌ Missing reservation details.");
        return;
    }

    isSubmitting = true; // Set flag to prevent duplicate submissions
    showLoading("Processing your reservation..."); // Show loading overlay

    const token = localStorage.getItem("authToken");
    const requestData = {
        car_id,
        user_id,
        reservationType: "temporary",
    };

    console.log("🚀 Sending reservation without payment request:", requestData);

    fetch("/api/purchase/reserve", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("✅ Response received:", data);
        if (data.success) {
            alert("✅ Reservation successful! A confirmation email will be sent.");
            window.location.href = '../home.html';
        } else {
            alert("❌ Failed to process reservation.");
        }
    })
    .catch(error => {
        console.error("❌ Error in reservation process:", error);
        alert("❌ An error occurred. Please try again.");
    })
    .finally(() => {
        isSubmitting = false; // Reset flag regardless of success/failure
        hideLoading(); // Hide loading overlay
    });
}

function parseJwt(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(atob(base64).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join(""));
    return JSON.parse(jsonPayload);
}
