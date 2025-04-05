const axios = require("axios");

// MPesa credentials (Hardcoded for testing)
const MPESA_CONSUMER_KEY = 'OhrGtP9RLkDzivaxsRN9eyEMb3RtOJEz2fimAL0QIZiYlfiq';
const MPESA_CONSUMER_SECRET = 'YLuqeviG1ZfecooQBZk8FmGZr8Z69bAracZEtxfVAtBOj5S2BcWV1aqyjDAAjJrM';

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

// Function to process MPesa payment with improved error handling
const processPayment = async (amount, phoneNumber) => {
  console.log("🚀 Initiating MPesa Payment...");
  
  if (!amount || !phoneNumber) {
    throw new Error("❌ Missing required payment fields (Amount, Phone Number)");
  }

  const token = await getAccessToken();
  console.log("✅ Retrieved MPesa Access Token:", token);
  
  const url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate";
  const formattedPhone = formatPhoneNumber(phoneNumber);

  const payload = {
    ShortCode: "600000", // Use actual shortcode in production
    CommandID: "CustomerPayBillOnline",
    Amount: amount,
    Msisdn: formattedPhone,
    BillRefNumber: "PAYMENT" // MPesa generates Transaction ID
  };

  console.log("🔍 Sending Payment Request to MPesa:", JSON.stringify(payload, null, 2));

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ MPesa Payment Response:", JSON.stringify(response.data, null, 2));

    // ✅ Ensure MPesa's actual Transaction ID is retrieved
    const mpesaTransactionId = response.data.TransactionID || response.data.OriginatorConversationID;
    
    if (!mpesaTransactionId || mpesaTransactionId.length < 10) {
      console.warn("⚠ MPesa did not return a Transaction ID, using Conversation ID instead:", response.data);
    }

    if (response.data.ResponseCode && response.data.ResponseCode !== "0") {
      console.error("❌ MPesa API Error:", response.data);
      throw new Error(`MPesa Error: ${response.data.ResponseDescription}`);
    }

    console.log(`✅ Confirmed Transaction ID: ${mpesaTransactionId}`);

    return { 
      success: true, 
      mpesaTransactionId,
      responseData: response.data 
    };
  } catch (error) {
    console.error("❌ MPesa Payment Processing Error:", JSON.stringify(error.response?.data || error.message, null, 2));
    throw new Error(`Payment failed: ${error.response?.data?.errorMessage || error.message}`);
  }
};

module.exports = { processPayment };
