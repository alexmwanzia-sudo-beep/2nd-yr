const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const carController = require("../controllers/carController");

// Route for adding a car
router.post("/add", upload.single("image"), carController.addCar);

module.exports = router;

