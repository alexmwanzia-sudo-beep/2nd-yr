const express=require('express')
const router=express.Router();
const carcontroller=require('../controllers/carcontrollers')
router.post('/add',carController,carcontroller.addCar)
module.exports=router;
