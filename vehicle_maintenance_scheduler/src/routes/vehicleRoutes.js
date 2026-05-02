const express = require("express");
const router = express.Router();
const { addVehicle, scheduleMaintenance } = require("../controller/vehicleController");

router.post("/vehicles", addVehicle);
router.post("/maintenance/schedule", scheduleMaintenance);

module.exports = router;
