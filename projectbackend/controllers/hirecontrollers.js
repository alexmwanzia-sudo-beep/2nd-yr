const { 
  checkCarAvailability,
  getUserEmailById,
  createNotification,
} = require("../models/purchasemodels");

const { pool } = require("../config/db");

const {
  createHire,
  updateHireStatus,
  saveHirePaymentDetails,
  getHireByUserAndCar,
  getHireById,
  getHirePayment,
  updatePaymentStatus,
  updateCarAvailability,
  confirmCarReceipt,
  confirmCarReturn
} = require("../models/hiremodels");

const { processPayment } = require("../config/mpesa");
const { sendMail } = require("../config/email");

// ✅ Hire Car Controller
const hireCar = async (req, res) => {
  console.log("🔍 Received Request Body:", req.body);
  const { user_id, car_id, phone, start_date, duration, pickup, dropoff, amount } = req.body;
  
  // Set amount to null if reservation_type is "temporary"
 // const finalAmount = reservation_type === "temporary" ? null : amount;

  if (!user_id || !car_id || !phone || !start_date || !duration || !pickup || !dropoff ||  !amount) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const car = await checkCarAvailability(car_id);
    if (!car) {
      return res.status(400).json({ message: "Car is not available for hire" });
    }

    const userEmail = await getUserEmailById(user_id);
    if (!userEmail) {
      return res.status(400).json({ message: "User email not found." });
    }

    // Change status from "booked" to "pending" (assuming the allowed status is "pending")
    const status = "pending";
    const hireId = await createHire(user_id, car_id, phone, start_date, duration, pickup, dropoff, amount, status);
    if (!hireId) {
      throw new Error("Failed to create hire record.");
    }

    // Send confirmation email and notification
    await sendMail(userEmail, "Car Hire Confirmation", `Your hire request for car ID ${car_id} is confirmed. Thank you for your reservation.`);
    await createNotification(user_id, `Car hire confirmed for car ID ${car_id}.`);

    res.status(201).json({ message: "Car hired successfully", hireId });
  } catch (error) {
    console.error("❌ Error in hireCar controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Pay for Hire Controller
const payForHire = async (req, res) => {
  const { user_id, car_id, amount, phoneNumber } = req.body;
  console.log("🔍 Received Request Body:", req.body);

  if (!user_id || !car_id || !amount || !phoneNumber) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const userEmail = await getUserEmailById(user_id);
    if (!userEmail) {
      return res.status(400).json({ message: "User email not found." });
    }

    const hire = await getHireByUserAndCar(user_id, car_id);
    if (!hire) {
      return res.status(400).json({ message: "Hire record not found" });
    }

    // Validate hire status
    if (hire.status !== "pending") {
      return res.status(400).json({ 
        message: `Hire is already ${hire.status}. Cannot process payment again.`,
        currentStatus: hire.status
      });
    }

    try {
      // ✅ Call MPesa Payment
      const paymentResponse = await processPayment(amount, phoneNumber);
      
      // Save payment details
      await saveHirePaymentDetails(hire.id, amount, paymentResponse.mpesaTransactionId, "completed");
      
      // Send payment confirmation email
      await sendMail(userEmail, "Car Hire Payment Confirmation", `
          Your payment for car hire has been successfully processed.\n\n
          Transaction Details:\n
          Amount: KES ${amount}\n
          Transaction ID: ${paymentResponse.mpesaTransactionId}\n
          Reference Number: ${paymentResponse.referenceNumber}\n\n
          Your car will be available for pickup at the specified time.\n
          Thank you for choosing our car hire service.
      `);

      // Update hire status
      await updateHireStatus(hire.id, "confirmed");

      // Send simple response matching frontend expectations
      const response = {
          success: true,
          message: "Payment successful",
          transactionId: paymentResponse.mpesaTransactionId,
          referenceNumber: paymentResponse.referenceNumber,
          amount: paymentResponse.amount
      };
      
      // Only send response once
      if (!res.headersSent) {
          res.status(200).json(response);
      }

      // No more operations after response is sent
      return;
    } catch (error) {
      console.error("❌ Error processing payment:", error);
      
      // Send payment failure notification
      await createNotification(user_id, `Payment failed for car hire. Please try again.`);
      
      // Update hire status
      await updateHireStatus(hire.id, "payment_failed");
      
      // Send simple error response matching frontend expectations
      const errorResponse = {
          success: false,
          message: `Payment failed: ${error.message || "Please try again."}`
      };
      
      // Only send response once
      if (!res.headersSent) {
          res.status(500).json(errorResponse);
      }

      // No more operations after response is sent
      return;
    }
    await updateHireStatus(hire.id, "confirmed");

    // Send confirmation email and notification
    await sendMail(userEmail, "Hire Payment Confirmation", 
      `Your payment of KES ${amount} for hire ID ${hire.id} was successful.\nReference: ${referenceNumber}`);
    await createNotification(user_id, `Payment successful for hire ID ${hire.id}.`);

    res.status(201).json({ 
      success: true, 
      message: "Payment processed successfully",
      referenceNumber,
      transactionId: mpesaTransactionId
    });
  } catch (error) {
    console.error("Error in payForHire controller:", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Server error" 
    });
  }
};

// ✅ Validate Hire Payment Controller
const validateHirePayment = async (req, res) => {
  const { transactionId, car_id, user_id } = req.body;
  if (!transactionId || !car_id || !user_id) {
    return res.status(400).json({ message: "Transaction ID, Car ID, and User ID are required." });
  }

  try {
    const userEmail = await getUserEmailById(user_id);
    if (!userEmail) {
      return res.status(400).json({ message: "User email not found." });
    }

    const hire = await getHireByUserAndCar(user_id, car_id);
    if (!hire) {
      return res.status(400).json({ message: "No matching hire record found." });
    }

    const payment = await getHirePayment(transactionId);
    if (!payment || payment.hire_id !== hire.id) {
      return res.status(400).json({ message: "Invalid transaction ID or payment mismatch." });
    }

    if (payment.status !== "completed") {
      return res.status(400).json({ message: "Payment not completed yet." });
    }

    await updateHireStatus(hire.id, "confirmed");
    await sendMail(userEmail, "Hire Payment Validation", `Your payment has been successfully validated, and your hire for car ID ${car_id} is confirmed.`);
    await createNotification(user_id, `Payment validation successful for car ID ${car_id}.`);

    res.status(200).json({ message: "Payment validated successfully." });
  } catch (error) {
    console.error("Error in validateHirePayment controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Cancel a hire
const cancelHire = async (req, res) => {
    try {
        const userId = req.user.userId;
        const hireId = req.params.hireId;
        
        if (!hireId) {
            return res.status(400).json({ 
                success: false, 
                message: "Hire ID is required" 
            });
        }
        
        // Get hire to check if it belongs to the user
        const hire = await getHireById(hireId);
        
        if (!hire) {
            return res.status(404).json({ 
                success: false, 
                message: "Hire not found" 
            });
        }
        
        if (hire.user_id !== userId) {
            return res.status(403).json({ 
                success: false, 
                message: "Unauthorized - This hire does not belong to you" 
            });
        }
        
        // Only allow cancellation of 'pending' or 'confirmed' hires
        if (!['pending', 'confirmed'].includes(hire.status.toLowerCase())) {
            return res.status(400).json({ 
                success: false, 
                message: `Cannot cancel a hire with status '${hire.status}'` 
            });
        }
        
        // Update hire status to 'cancelled'
        const result = await updateHireStatus(hireId, 'cancelled');
        
        if (result) {
            return res.json({ 
                success: true, 
                message: "Hire cancelled successfully" 
            });
        } else {
            return res.status(500).json({ 
                success: false, 
                message: "Failed to cancel hire" 
            });
        }
    } catch (error) {
        console.error("Error cancelling hire:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
};

// Rename the function to avoid conflicts
const updateHireStatusWithCustomStates = async (hireId, status) => {
  try {
    // Check if hire record exists
    const [existingHire] = await pool.execute("SELECT id FROM hires WHERE id = ?", [hireId]);
    if (!existingHire.length) {
      throw new Error("Hire record not found.");
    }

    // Allow custom statuses including: received, returned, completed
    const allowedStatuses = ["pending", "confirmed", "cancelled", "received", "returned", "completed"];
    if (!allowedStatuses.includes(status)) {
      throw new Error("Invalid status update.");
    }

    const sql = "UPDATE hires SET status = ? WHERE id = ?";
    const [result] = await pool.execute(sql, [status, hireId]);
    console.log(`✅ Hire status updated for ID ${hireId}: ${status}`);
    return result.affectedRows; // Returns the number of rows affected
  } catch (error) {
    console.error(`❌ Error in updateHireStatusWithCustomStates() at ${new Date().toISOString()}:`, error.message);
    throw error;
  }
};

/**
 * Confirm receipt of a hired car
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const confirmReceipt = async (req, res) => {
    try {
        const userId = req.user.userId;
        const hireId = req.params.hireId;
        
        if (!hireId) {
            return res.status(400).json({ 
                success: false, 
                message: "Hire ID is required" 
            });
        }
        
        // Check if the hire is in 'confirmed' status
        const hire = await getHireById(hireId);
        
        if (!hire) {
            return res.status(404).json({ 
                success: false, 
                message: "Hire not found" 
            });
        }
        
        if (hire.user_id !== userId) {
            return res.status(403).json({ 
                success: false, 
                message: "Unauthorized - This hire does not belong to you" 
            });
        }
        
        if (hire.status.toLowerCase() !== 'confirmed') {
            return res.status(400).json({ 
                success: false, 
                message: `Can only confirm receipt for a hire with 'confirmed' status. Current status: '${hire.status}'` 
            });
        }
        
        // Two ways to handle this:
        // 1. Use the model function
        const result = await confirmCarReceipt(hireId, userId);
        
        // 2. As a fallback, we can directly update the status if needed
        if (!result.success) {
            // Try the direct status update
            try {
                await updateHireStatusWithCustomStates(hireId, "received");
                return res.json({ 
                    success: true, 
                    message: "Car receipt confirmed successfully (fallback method)" 
                });
            } catch (updateError) {
                console.error("Error in fallback update:", updateError);
                return res.status(400).json({ 
                    success: false, 
                    message: result.message || "Failed to update status" 
                });
            }
        }
        
        return res.json({ 
            success: true, 
            message: result.message 
        });
    } catch (error) {
        console.error("Error confirming car receipt:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
};

/**
 * Confirm return of a hired car
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const confirmReturn = async (req, res) => {
    try {
        const userId = req.user.userId;
        const hireId = req.params.hireId;
        
        if (!hireId) {
            return res.status(400).json({ 
                success: false, 
                message: "Hire ID is required" 
            });
        }
        
        // Check if the hire is in 'received' status
        const hire = await getHireById(hireId);
        
        if (!hire) {
            return res.status(404).json({ 
                success: false, 
                message: "Hire not found" 
            });
        }
        
        if (hire.user_id !== userId) {
            return res.status(403).json({ 
                success: false, 
                message: "Unauthorized - This hire does not belong to you" 
            });
        }
        
        if (hire.status.toLowerCase() !== 'received') {
            return res.status(400).json({ 
                success: false, 
                message: `Can only confirm return for a hire with 'received' status. Current status: '${hire.status}'` 
            });
        }
        
        // Two ways to handle this:
        // 1. Use the model function
        const result = await confirmCarReturn(hireId, userId);
        
        // 2. As a fallback, we can directly update the status if needed
        if (!result.success) {
            // Try the direct status update
            try {
                await updateHireStatusWithCustomStates(hireId, "returned");
                // Also update car availability
                const carId = hire.car_id;
                try {
                    await updateCarAvailability(carId, true);
                    console.log(`✅ Car (ID: ${carId}) marked as available for hire again`);
                } catch (err) {
                    console.warn(`⚠ Could not update car availability: ${err.message}`);
                    // Continue even if this fails
                }
                
                return res.json({ 
                    success: true, 
                    message: "Car return confirmed successfully (fallback method)" 
                });
            } catch (updateError) {
                console.error("Error in fallback update:", updateError);
                return res.status(400).json({ 
                    success: false, 
                    message: result.message || "Failed to update status" 
                });
            }
        }
        
        return res.json({ 
            success: true, 
            message: result.message 
        });
    } catch (error) {
        console.error("Error confirming car return:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
};

module.exports = {
    cancelHire,
    confirmReceipt,
    confirmReturn,
    hireCar,
    payForHire,
    validateHirePayment
};
