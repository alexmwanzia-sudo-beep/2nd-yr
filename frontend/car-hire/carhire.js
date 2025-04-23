document.addEventListener("DOMContentLoaded", () => {
    // Run our code immediately, as this JS is only loaded on car-hire.html.
    validateSession();
    displayHireDetails();
    attachHireFormListener();
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
      if (!userId) throw new Error("Invalid token: Missing userId");
      localStorage.setItem("user_id", userId);
      console.log("✅ User authenticated. user_id:", userId);
    } catch (error) {
      console.error("❌ Error decoding token:", error.message);
      alert("Session expired. Please log in again.");
      localStorage.removeItem("authToken");
      window.location.href = "/login.html";
    }
  }
  
  function displayHireDetails() {
    // Extract details from URL parameters.
    const params = new URLSearchParams(window.location.search);
    const carModel = params.get("model") || "Unknown Car";
    const hirePrice = params.get("price");
    const carId = params.get("carid");
    
    // Store the car id for later use.
    localStorage.setItem("car_id", carId);
    
    // Optionally, update page elements if present.
    const carModelEl = document.getElementById("car-model");
    if (carModelEl) carModelEl.textContent = carModel;
    const hirePriceEl = document.getElementById("hire-price");
    if (hirePriceEl) hirePriceEl.textContent = hirePrice;
    const carIdEl = document.getElementById("car_id");
    if (carIdEl) carIdEl.textContent = carId;
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
  
  function attachHireFormListener() {
    const hireForm = document.getElementById("hire-form");
    const proceedButton = document.getElementById("proceed-button");
    
    if (!hireForm || !proceedButton) {
      console.error("❌ Hire form or Proceed button not found!");
      return;
    }
    
    // Attach a submit event listener to the form.
    hireForm.addEventListener("submit", async function(event) {
      event.preventDefault(); // Prevent default form submission.
      console.log("🚀 Proceed button clicked!");
  
      const carId = localStorage.getItem("car_id");
      const userId = localStorage.getItem("user_id");
      if (!carId || !userId) {
        alert("❌ Missing user or car details.");
        return;
      }
  
      // Retrieve form input values.
      const phone = document.getElementById("phone").value.trim();
      const startDate = document.getElementById("start-date").value;
      const duration = parseInt(document.getElementById("duration").value);
      const pickup = document.getElementById("pickup").value.trim();
      const dropoff = document.getElementById("dropoff").value.trim();
  
      // Validate inputs.
      if (!phone.match(/^\d{10}$/)) {
        alert("❌ Enter a valid 10-digit phone number.");
        return;
      }
      if (!startDate) {
        alert("❌ Select a valid start date.");
        return;
      }
      if (isNaN(duration) || duration < 1) {
        alert("❌ Enter a valid hire duration (at least 1 day).");
        return;
      }
      if (!pickup || !dropoff) {
        alert("❌ Enter both pickup and drop-off locations.");
        return;
      }
      
      // Calculate the hire amount.
      const hireAmount = calculateAmount(duration);
      localStorage.setItem("hireAmount", hireAmount);
      
      // Store the phone number for later use.
      localStorage.setItem("phone", phone);

      const hireData = { phone, startDate, duration, pickup, dropoff };
      localStorage.setItem("hireDetails", JSON.stringify(hireData));
      
      // Prepare the payload to send to the backend.
      const hireDetailsForBackend = {
        car_id: carId,
        user_id: userId,
        phone: phone,
        start_date: startDate,
        duration: duration,
        pickup: pickup,
        dropoff: dropoff,
        amount: hireAmount,
        status: "booked"
      };
      
      showLoading("Processing your hire request..."); // Show loading overlay

      try {
        // Send the booking details to the backend.
        const success = await new Promise((resolve) => {
          sendHireDetailsToBackend(hireDetailsForBackend, function(success, hireId) {
            if (success) {
              localStorage.setItem("hireId", hireId);
              resolve(true);
            } else {
              resolve(false);
            }
          });
        });

        if (success) {
          alert("✅ Car hire booked successfully.");
          window.location.href = "hirepayment.html";
        } else {
          alert("❌ Failed to book car for hire.");
        }
      } catch (error) {
        console.error("Error during hire process:", error);
        alert("❌ An error occurred during the hire process.");
      } finally {
        hideLoading(); // Hide loading overlay
      }
    });
  }
  
  function calculateAmount(duration) {
    const ratePerDay = 2000; // Daily rate in KES.
    return duration * ratePerDay;
  }
  
  function sendHireDetailsToBackend(hireDetails, callback) {
    const token = localStorage.getItem("authToken");
    fetch("/api/hire/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(hireDetails)
    })
    .then(response => response.json())
    .then(data => {
      if (data.message && data.hireId) {
        callback(true, data.hireId);
      } else {
        callback(false);
      }
    })
    .catch(error => {
      console.error("❌ Error sending hire details:", error);
      callback(false);
    });
  }
  
  function parseJwt(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  }
  