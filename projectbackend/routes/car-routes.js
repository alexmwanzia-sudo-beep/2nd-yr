const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploads");
const carController = require("../controllers/carcontrollers");

// Route for adding a car
router.post("/add", upload.single("image"), carController.createCar);

module.exports = router;

