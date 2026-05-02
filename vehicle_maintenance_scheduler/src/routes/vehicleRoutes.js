const express = require("express");
const router = express.Router();
const { addVehicle, scheduleMaintenance, optimizeMaintenance, getSchedule } = require("../controller/vehicleController");

router.post("/vehicles", addVehicle);
router.post("/maintenance/schedule", scheduleMaintenance);
router.post("/maintenance/optimize", optimizeMaintenance);
router.get("/schedule", getSchedule);

module.exports = router;
