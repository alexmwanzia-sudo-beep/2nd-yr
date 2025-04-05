const { processPayment } = require("./mpesa"); // Import your MPesa module

const testPayment = async () => {
  try {
    const amount = 100; // Test amount in KES
    const transactionId = "TEST123456"; // Mock transaction ID
    const phoneNumber = "254700123456"; // Mock phone number in MPesa format

    console.log("🚀 Initiating Mock Payment...");

    const response = await processPayment(amount, transactionId, phoneNumber);
    console.log("✅ Mock Payment Response:", response);
  } catch (error) {
    console.error("❌ Mock Payment Failed:", error.message);
  }
};

// Run the test function
testPayment();
