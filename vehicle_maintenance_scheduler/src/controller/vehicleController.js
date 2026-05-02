const Log = require("../../../logging-middleware/logger");
const path = require("path");
const axios = require("axios");
require("dotenv").config({ path: path.join(__dirname, "../../../.env") });

const token = process.env.ACCESS_TOKEN;
const EVAL_API = "http://20.207.122.201/evaluation-service";

/**
 * Adds a new vehicle record to the system.
 * This is the entry point for vehicle management.
 */
exports.addVehicle = async (req, res) => {
    try {
        Log("backend", "info", "service", "Registering a new vehicle in the system inventory", token);

        const { vehicleId } = req.body;

        if (!vehicleId) {
            Log("backend", "error", "handler", "Attempted to add vehicle without a valid ID", token);
            return res.status(400).json({ error: "A unique vehicleId is required for registration." });
        }

        Log("backend", "debug", "service", `Vehicle [${vehicleId}] successfully staged for processing.`, token);

        res.status(201).json({ message: "Vehicle successfully added to inventory." });

    } catch (err) {
        Log("backend", "fatal", "controller", `Internal AddVehicle failure: ${err.message}`, token);
        res.status(500).json({ error: "Failed to process vehicle registration." });
    }
};

/**
 * Schedules a maintenance event and checks if it's within the critical 'warning' window.
 * If maintenance is due within 7 days, we trigger a warning log for the fleet manager.
 */
exports.scheduleMaintenance = async (req, res) => {
    try {
        Log("backend", "info", "service", "Processing new maintenance schedule request", token);
        const { date } = req.body;

        if (!date) {
            return res.status(400).json({ error: "Maintenance date is required." });
        }

        const maintenanceDate = new Date(date);
        const today = new Date();
        const diffTime = Math.abs(maintenanceDate - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Critical Check: If the maintenance is imminent, notify the system.
        if (diffDays <= 7) {
            Log("backend", "warn", "service", `Maintenance Alert: Vehicle scheduled for service in just ${diffDays} days!`, token);
        }

        res.status(200).json({ message: "Maintenance window successfully confirmed." });

    } catch (err) {
        Log("backend", "fatal", "controller", `Scheduling error: ${err.message}`, token);
        res.status(500).json({ error: "System error occurred while confirming the maintenance window." });
    }
};

exports.optimizeMaintenance = async (req, res) => {
    try {
        const { vehicles, capacity } = req.body;

        if (!vehicles || !capacity) {
            return res.status(400).json({ error: "Vehicles and capacity are required" });
        }

        Log("backend", "info", "service", "Fetching vehicles for optimization", token);

        if (vehicles.length > 50) {
            Log("backend", "warn", "service", "High load detected: optimizing large number of vehicles", token);
        }

        Log("backend", "debug", "service", "Running knapsack algorithm", token);

        const n = vehicles.length;
        const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));

        for (let i = 1; i <= n; i++) {
            const { Duration, Impact } = vehicles[i - 1];

            for (let w = 0; w <= capacity; w++) {
                if (Duration <= w) {
                    dp[i][w] = Math.max(
                        Impact + dp[i - 1][w - Duration],
                        dp[i - 1][w]
                    );
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }

        const maxImpact = dp[n][capacity];
        Log("backend", "debug", "service", `Optimization complete. Result: ${maxImpact}`, token);

        res.status(200).json({ maxImpact });

    } catch (err) {
        Log("backend", "fatal", "controller", err.message, token);
        res.status(500).json({ error: "Server error" });
    }
};

/**
 * Optimization Engine: Solves the Knapsack Problem to find the best maintenance schedule.
 * We use Dynamic Programming here because it guarantees an optimal solution within the 
 * mechanic hour constraints, unlike a greedy approach which might miss high-impact tasks.
 */
exports.getSchedule = async (req, res) => {
    try {
        Log("backend", "info", "service", "Starting automated maintenance scheduling sequence...", token);

        // Fetching data from the remote evaluation service
        // We use Promise.all to keep the network latency to a minimum
        const [depotsRes, vehiclesRes] = await Promise.all([
            axios.get(`${EVAL_API}/depots`, { headers: { Authorization: `Bearer ${token}` } }),
            axios.get(`${EVAL_API}/vehicles`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const depots = depotsRes.data.depots;
        const vehicles = vehiclesRes.data.vehicles;

        if (!depots || !vehicles || depots.length === 0) {
            throw new Error("Could not retrieve necessary data for optimization.");
        }

        // Logic: Using the first depot as our primary resource for this run
        const capacity = depots[0].MechanicHours;
        const n = vehicles.length;
        Log("backend", "info", "service", `Optimizing for Depot ${depots[0].ID} (Capacity: ${capacity} hours)`, token);

        // DP Table Initialization
        const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));

        // Core Knapsack Algorithm: 
        // We iterate through each vehicle and decide whether adding it provides a better 
        // total impact than skipping it, considering our remaining mechanic hours.
        for (let i = 1; i <= n; i++) {
            const { Duration, Impact } = vehicles[i - 1];
            for (let w = 0; w <= capacity; w++) {
                if (Duration <= w) {
                    dp[i][w] = Math.max(Impact + dp[i - 1][w - Duration], dp[i - 1][w]);
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }

        // Backtracking Logic:
        // Now we retrace our steps through the DP table to identify exactly which vehicles
        // were selected to achieve the 'totalImpact'.
        let resImpact = dp[n][capacity];
        let w = capacity;
        const selectedTasks = [];
        for (let i = n; i > 0 && resImpact > 0; i--) {
            if (resImpact !== dp[i - 1][w]) {
                selectedTasks.push(vehicles[i - 1]);
                resImpact -= vehicles[i - 1].Impact;
                w -= vehicles[i - 1].Duration;
            }
        }

        Log("backend", "debug", "service", `Schedule generated! Total Impact: ${dp[n][capacity]}`, token);

        // Return the final result to the client
        res.status(200).json({
            totalImpact: dp[n][capacity],
            selectedTasks: selectedTasks
        });

    } catch (err) {
        Log("backend", "fatal", "controller", `Optimization Error: ${err.message}`, token);
        res.status(500).json({ error: "An internal error occurred while generating the schedule." });
    }
};
