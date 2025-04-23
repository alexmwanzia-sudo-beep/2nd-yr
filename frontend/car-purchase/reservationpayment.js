document.addEventListener("DOMContentLoaded", () => {
  validateSession(); // Ensure user is authenticated
  populateAmount(); // Display forwarded car price
  attachPaymentListener(); // Attach event listener for payment form submission
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

function populateAmount() {
  const price = sessionStorage.getItem("price");
  if (price) {
      document.getElementById("amount").value = price; // Ensure amount is set in input field
  } else {
      console.error("❌ Missing price data.");
  }
}

function attachPaymentListener() {
  document.querySelector("#payment-form").addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent default form submission
      submitPayment();
  });
}

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

function submitPayment() {
    const user_id = sessionStorage.getItem("user_id");
    const car_id = sessionStorage.getItem("car_id");
    const amountInput = document.getElementById("amount").value.trim();
    const amount = Number(parseFloat(amountInput).toFixed(2));  // ✅ Convert to decimal format
    const phoneNumber = document.getElementById("phone-number").value.trim();

    // Validate phone number format (starting with '07' and followed by 8 digits)
    if (!user_id || !car_id || !amount || !phoneNumber.match(/^07\d{8}$/)) {
        alert("❌ Enter a valid Kenyan phone number in the format 07XXXXXXXX.");
        return;
    }

    showLoading("Processing your payment..."); // Show loading overlay

    const token = localStorage.getItem("authToken");
    const requestData = { car_id, user_id, amount, phoneNumber, reservationType: "paid" };

    console.log("🚀 Sending reservation request:", requestData);

    // Send the request to the /api/purchase/reserve endpoint to handle both reservation and payment
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
        if (data.message === "Car reserved successfully") {
            alert("✅ Payment successful! Your reservation is confirmed.");
            window.location.href = '../home.html';
        } else {
            alert("❌ Reservation failed. Please try again.");
        }
    })
    .catch(error => {
        console.error("❌ Error processing reservation:", error);
        alert("❌ An error occurred. Please try again.");
    })
    .finally(() => {
        hideLoading(); // Hide loading overlay
    });
}

function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(atob(base64).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join(""));
  return JSON.parse(jsonPayload);
}
