const axios = require("axios");
const crypto = require("crypto");

// MPesa credentials (Hardcoded for testing)
const MPESA_CONSUMER_KEY = 'iAoDlWg4SD9vh7IjPXGJ53L3lAjxJVGnkt1yeJN6dBBoANiL';
const MPESA_CONSUMER_SECRET = 'WaTEYmaY0uHrJHCgxjmpwSWQOWbNkD3nRX5xFwQfajdJin9FoHJrGMOAoSWWi91G';


// Standard sandbox credentials
const SANDBOX_SHORTCODE = "174379";
const SANDBOX_PASSKEY = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
const SANDBOX_INITIATOR = "apitest";
const SANDBOX_INITIATOR_PASSWORD = "Safaricom999!*!";

// Function to generate an MPesa access token with automatic retries
const getAccessToken = async (retryCount = 3) => {
  const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString("base64");

  console.log("🔍 Requesting MPesa Access Token...");

  for (let attempt = 0; attempt < retryCount; attempt++) {
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Basic ${auth}` },
      });

      console.log(`✅ Access Token Generated (Attempt ${attempt + 1}):`, response.data.access_token);
      return response.data.access_token;
    } catch (error) {
      console.error(`❌ Attempt ${attempt + 1} - Failed to Get MPesa Access Token:`, error.response?.data || error.message);
      if (attempt === retryCount - 1) throw new Error("Failed to generate MPesa access token after multiple attempts");
    }
  }
};

// Helper function to format and validate phone number for MPesa
const formatPhoneNumber = (phoneNumber) => {
  console.log("🔍 Formatting Phone Number:", phoneNumber);
  let cleanPhone = phoneNumber.replace(/[^0-9]/g, "");

  if (cleanPhone.startsWith("07")) {
    cleanPhone = `254${cleanPhone.slice(1)}`;
  } else if (!cleanPhone.startsWith("254")) {
    throw new Error("Invalid phone number format. Expected 07XXXXXXXX or 2547XXXXXXXX");
  }

  console.log("✅ Formatted Phone:", cleanPhone);
  return cleanPhone;
};

// Function to generate security credential
const generateSecurityCredential = () => {
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, -3);
  const password = `${SANDBOX_SHORTCODE}${SANDBOX_PASSKEY}${timestamp}`;
  // For sandbox, use the initiator password directly
  return SANDBOX_INITIATOR_PASSWORD;
};

// Function to process MPesa payment with improved error handling
const processPayment = async (amount, phoneNumber) => {
  console.log("🚀 Initiating MPesa Payment Simulation...");
  
  if (!amount || !phoneNumber) {
    throw new Error("❌ Missing required payment fields (Amount, Phone Number)");
  }

  const token = await getAccessToken();
  console.log("✅ Retrieved MPesa Access Token:", token);
  
  // Use B2C Simulation endpoint
  const url = "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest";
  const formattedPhone = formatPhoneNumber(phoneNumber);

  // Generate timestamp and security credential
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, -3);
  const securityCredential = generateSecurityCredential();

  const payload = {
    InitiatorName: SANDBOX_INITIATOR,
    SecurityCredential: securityCredential,
    CommandID: "BusinessPayment",
    Amount: amount.toString(),
    PartyA: SANDBOX_SHORTCODE,
    PartyB: formattedPhone,
    Remarks: "Payment for car reservation",
    QueueTimeOutURL: "https://mydomain.com/timeout",
    ResultURL: "https://mydomain.com/result",
    Occasion: "Payment"
  };

  console.log("🔍 Sending Payment Simulation Request to MPesa:", JSON.stringify(payload, null, 2));

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });

    console.log("✅ MPesa Payment Simulation Response:", JSON.stringify(response.data, null, 2));

    if (response.data.ResponseCode && response.data.ResponseCode !== "0") {
      throw new Error(`MPesa Error: ${response.data.ResponseDescription || 'Unknown error'}`);
    }

    return { 
      success: true, 
      mpesaTransactionId: response.data.ConversationID || response.data.OriginatorConversationID,
      responseData: response.data 
    };
  } catch (error) {
    console.error("❌ MPesa Payment Simulation Error:", JSON.stringify(error.response?.data || error.message, null, 2));
    
    // Handle specific error cases
    if (error.response?.data?.errorCode === "500.002.1001") {
      throw new Error("Invalid security credential. Please check your MPesa configuration.");
    }
    
    throw new Error(`Payment simulation failed: ${error.response?.data?.errorMessage || error.message}`);
  }
};

module.exports = { processPayment };