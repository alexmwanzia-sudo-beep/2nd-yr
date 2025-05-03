const { 
  createSale, 
  getCarOwner, 
  removeCar, 
  getCarReservations 
} = require("../models/salemodels");

const { createNotification } = require("../models/purchasemodels");
const { sendMail } = require("../config/email");

// Sell car to a specific buyer
const sellCar = async (req, res) => {
  try {
    const { carId, buyerId, amount } = req.body;
    const sellerId = req.user.userId;

    if (!carId || !buyerId || !amount) {
      return res.status(400).json({ 
        success: false, 
        message: "Car ID, buyer ID, and amount are required" 
      });
    }

    // Verify the seller owns the car
    const carOwner = await getCarOwner(carId);
    if (!carOwner || carOwner !== sellerId) {
      return res.status(403).json({ 
        success: false, 
        message: "You are not authorized to sell this car" 
      });
    }

    // Create sale record
    const saleId = await createSale(carId, sellerId, buyerId, amount);
    if (!saleId) {
      throw new Error("Failed to create sale record");
    }

    // Remove car from the system
    const carRemoved = await removeCar(carId);
    if (!carRemoved) {
      throw new Error("Failed to remove car from system");
    }

    // Send notifications
    await createNotification(sellerId, `Car ID ${carId} has been sold successfully`);
    await createNotification(buyerId, `You have successfully purchased car ID ${carId}`);

    // Send emails
    await sendMail(req.user.email, "Car Sale Confirmation", 
      `Your car (ID: ${carId}) has been sold successfully for ${amount}`);
    
    res.status(200).json({ 
      success: true, 
      message: "Car sold successfully", 
      saleId 
    });
  } catch (error) {
    console.error("❌ Error in sellCar controller:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// Get all reservations for a car
const getCarReservationsController = async (req, res) => {
  try {
    const { carId } = req.params;
    const userId = req.user.userId;

    // Verify the user owns the car
    const carOwner = await getCarOwner(carId);
    if (!carOwner || carOwner !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: "You are not authorized to view reservations for this car" 
      });
    }

    const reservations = await getCarReservations(carId);
    res.status(200).json({ 
      success: true, 
      data: reservations 
    });
  } catch (error) {
    console.error("❌ Error in getCarReservationsController:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

module.exports = {
  sellCar,
  getCarReservationsController
}; 