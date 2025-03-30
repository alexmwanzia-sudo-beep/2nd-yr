document.addEventListener("DOMContentLoaded", () => {
    const currentPage = getPageContext();

    if (currentPage === "buy-car") {
        validateSession(); // Validate user session for buy page
        displayReservationDetails(); // Update car details dynamically
        attachReservationListeners(); // Attach event listeners
    }

    if (currentPage === "reservationpayment") {
        validateSession(); // Validate user session for payment page
        guidePayment(); // Provide MPesa payment instructions
        attachPaymentValidationListener(); // Validate payment on button click
    }
});

/**
 * Determines the current page based on URL or unique DOM elements.
 */
function getPageContext() {
    if (window.location.href.includes("reservationpayment.html")) {
        return "reservationpayment";
    } else if (window.location.href.includes("buy-car.html")) {
        return "buy-car";
    }
    return null;
}

/**
 * Validates the user's session or checks for required URL parameters.
 */
function validateSession() {
    const params = new URLSearchParams(window.location.search);
    const carid = params.get("carid");
    const userid = params.get("userid");

    if (!carid || !userid) {
        alert("Unauthorized access. Please start the reservation process again.");
        window.location.href = "/reservation-start.html"; // Redirect to a safe page
    }
}

/**
 * Displays car reservation details dynamically on the "Buy" page.
 */
function displayReservationDetails() {
    const params = new URLSearchParams(window.location.search);
    const carName = params.get("model") || "Unknown Car";
    document.getElementById("car-name").textContent = carName;
}

/**
 * Attaches event listeners for reservation actions on the "Buy" page.
 */
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

/**
 * Handles car reservation with payment.
 */
function reserveWithFee() {
    const params = new URLSearchParams(window.location.search);
    const carid = params.get("carid");
    const userid = params.get("userid");

    if (!carid || !userid) {
        alert("Missing essential reservation details.");
        console.error("Validation failed. Missing details:", { carid, userid });
        return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
        alert("You must be logged in to make a reservation.");
        window.location.href = "/login.html";
        return;
    }

    console.log("Sending reservation request with payment:", { carid, userid, type: "paid" });

    axios.post("/api/purchase/reserve", {
        carid: carid,
        userid: userid,
        type: "paid",
    }, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(response => {
        if (response.data.success) {
            alert("Redirecting to the payment page.");
            window.location.href = `reservationpayment.html?carid=${carid}&userid=${userid}`;
        } else {
            alert("Failed to process your reservation. Please try again.");
        }
    }).catch(error => {
        console.error("Error processing reservation with payment:", error.response?.data || error.message);
        alert("An error occurred. Please try again.");
    });
}

/**
 * Handles car reservation without payment.
 */
function reserveWithoutPayment() {
    const params = new URLSearchParams(window.location.search);
    const carid = params.get("carid");
    const userid = params.get("userid");

    if (!carid || !userid) {
        alert("Missing reservation details. Please try again.");
        console.error("Validation failed. Missing details:", { carid, userid });
        return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
        alert("You must be logged in to make a reservation.");
        window.location.href = "/login.html";
        return;
    }

    console.log("Sending reservation request without payment:", { carid, userid, type: "temporary" });

    axios.post("/api/purchase/reserve", {
        carid: carid,
        userid: userid,
        type: "temporary",
    }, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(response => {
        if (response.data.success) {
            alert("Your reservation has been made. A confirmation email will be sent shortly.");
        } else {
            alert("Failed to process your reservation. Please try again.");
        }
    }).catch(error => {
        console.error("Error processing reservation without payment:", error.response?.data || error.message);
        alert("An error occurred. Please try again.");
    });
}

/**
 * Provides MPesa payment instructions on the "Reservation Payment" page.
 */
function guidePayment() {
    const paymentInstructions = `
        To reserve this car using MPesa's Buy Goods and Services option:
        
        1. Open MPesa.
        2. Select 'Lipa na MPesa' > 'Buy Goods and Services'.
        3. Enter Business Number: 123456.
        4. Enter Amount: KES 10,000.
        5. Enter your MPesa PIN to complete the transaction.
    `;

    console.log(paymentInstructions); // Log instructions for debugging
    alert(paymentInstructions); // Display instructions to the user
}

/**
 * Attaches payment validation logic on the "Reservation Payment" page.
 */
function attachPaymentValidationListener() {
    const button = document.querySelector(".button");

    if (button) {
        button.addEventListener("click", async () => {
            const params = new URLSearchParams(window.location.search);
            const transactionId = "MOCK_TRANSACTION_ID_12345"; // Mock ID for testing
            const token = localStorage.getItem("authToken");

            if (!token) {
                alert("You must be logged in to validate payment.");
                window.location.href = "/user-registration/registration-form.html";
                return;
            }

            console.log("Sending payment validation request:", {
                carid: params.get("carid"),
                userid: params.get("userid"),
                transactionId: transactionId,
                businessNumber: "123456",
            });

            try {
                const response = await axios.post("/api/purchase/validate-payment", {
                    transactionId: transactionId,
                    businessNumber: "123456",
                    carid: params.get("carid"),
                    userid: params.get("userid"),
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data.success) {
                    alert("Payment verified successfully! Your reservation is complete.");
                    window.location.href = "/confirmation-page.html";
                } else {
                    alert("Payment verification failed. Please try again.");
                }
            } catch (error) {
                console.error("Error during payment validation:", error.response?.data || error.message);
                alert("An error occurred while validating your payment. Please contact support.");
            }
        });
    }
}
