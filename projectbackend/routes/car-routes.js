const express = require('express');
const { hireCar, checkHireStatus, buyCar } = require('../controllers/carController');

const router = express.Router();

router.post('/hire', hireCar);
router.get('/checkHire', checkHireStatus);
router.post('/buy', buyCar);

module.exports = router;
;
