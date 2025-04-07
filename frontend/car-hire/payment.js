// hirepayment.js – for the payment page

document.addEventListener("DOMContentLoaded", () => {
  validateSession();
  displayHireAmount();
  attachPaymentListener();
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

function displayHireAmount() {
  const amountDisplay = document.getElementById("amount");
  const storedAmount = localStorage.getItem("hireAmount") || "0.00";
  amountDisplay.textContent = `KES ${storedAmount}`;
}

function attachPaymentListener() {
  const payButton = document.getElementById("pay-button");
  if (!payButton) {
    console.error("❌ Payment button not found!");
    return;
  }
  payButton.addEventListener("click", processHirePayment);
}

function processHirePayment() {
  const carId = localStorage.getItem("car_id");
  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("authToken");
  const hireAmount = localStorage.getItem("hireAmount");
  const phoneNumber= localStorage.getItem("phone");


  if (!carId || !userId || !hireAmount) {
    alert("❌ Missing payment details.");
    return;
  }

  const paymentData = {
    car_id: carId,
    user_id: userId,
    amount: hireAmount,
    phoneNumber: phoneNumber,
    token: token,
  };
  console.log("🚀 Sending payment request to backend...");


  fetch("/api/hire/pay", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(paymentData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert("✅ Payment processed successfully.");
      window.location.href = '../home.html';
    } else {
      alert(`❌ Payment failed: ${data.error || "Please try again."}`);
    }
  })
  .catch(error => {
    console.error("❌ Error processing payment:", error);
    alert("❌ An error occurred. Please try again.");
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
