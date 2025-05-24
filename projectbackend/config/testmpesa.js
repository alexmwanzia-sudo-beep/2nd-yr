const { processPayment } = require("./mpesa"); // Import your MPesa module

const testPayment = async () => {
  try {
    // Test with a small amount
    const amount = 1; // 1 KES
    const phoneNumber = "254708374149"; // Updated test phone number
    const transactionType = "TEST";

    console.log("🚀 Initiating Test Payment...");
    console.log("Amount:", amount);
    console.log("Phone:", phoneNumber);

    const response = await processPayment(amount, phoneNumber, transactionType);
    console.log("✅ Test Payment Response:", response);
  } catch (error) {
    console.error("❌ Test Payment Failed:", error.message);
    if (error.response?.data) {
      console.error("Error details:", error.response.data);
    }
  }
};

// Run the test
testPayment();
