const Log = require("../../../logging-middleware/logger");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../../.env") });

const token = process.env.ACCESS_TOKEN;

exports.addVehicle = async (req, res) => {
    try {
        Log("backend", "info", "controller", "Add vehicle API called", token);

        const { vehicleId } = req.body;

        if (!vehicleId) {
            Log("backend", "error", "handler", "vehicleId missing", token);
            return res.status(400).json({ error: "vehicleId required" });
        }

        Log("backend", "debug", "service", "Vehicle added successfully", token);

        res.status(201).json({ message: "Vehicle added" });

    } catch (err) {
        Log("backend", "fatal", "controller", err.message, token);
        res.status(500).json({ error: "Server error" });
    }
};

exports.scheduleMaintenance = async (req, res) => {
    try {
        const { date } = req.body;

        if (!date) {
            return res.status(400).json({ error: "Date is required" });
        }

        const maintenanceDate = new Date(date);
        const today = new Date();
        const diffTime = Math.abs(maintenanceDate - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 7) {
            Log("backend", "warn", "service", "Maintenance due soon", token);
        }

        res.status(200).json({ message: "Maintenance scheduled" });

    } catch (err) {
        Log("backend", "fatal", "controller", err.message, token);
        res.status(500).json({ error: "Server error" });
    }
};
