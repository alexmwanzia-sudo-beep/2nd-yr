const axios = require("axios");

// MPesa credentials
const MPESA_CONSUMER_KEY = "exampleConsumerKey123"; // Replace with actual consumer key
const MPESA_CONSUMER_SECRET = "exampleConsumerSecret45"; // Replace with actual consumer secret

// Function to generate an MPesa access token
const getAccessToken = async () => {
  const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"; // Replace with production URL when ready
  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString("base64");

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    return response.data.access_token; // Return access token
  } catch (error) {
    console.error("❌ Error getting MPesa access token:", error.message);
    throw new Error("Failed to generate MPesa access token");
  }
};

// Function to simulate Buy Goods and Services payment
const processPayment = async (
  amount,
  transactionId = "MOCK_TRANSACTION_ID_12345", // Placeholder for testing
  phoneNumber = "254700123456" // Placeholder for testing
) => {
  const token = await getAccessToken();
  const url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate"; // Replace with production URL when ready

  const payload = {
    ShortCode: "600000", // Replace with actual shortcode during production
    CommandID: "CustomerPayBillOnline",
    Amount: amount,
    Msisdn: phoneNumber, // Mock phone number
    BillRefNumber: transactionId, // Mock transaction ID
  };

  console.log("🔍 Payment Payload:", payload); // Log payload for debugging

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ MPesa Payment Response:", response.data); // Log response for debugging
    return response.data; // Return MPesa response data
  } catch (error) {
    console.error("❌ Error processing MPesa payment:", error.message);
    throw new Error("Failed to process MPesa payment");
  }
};

module.exports = { processPayment };
