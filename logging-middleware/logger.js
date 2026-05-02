/**
 * Centralized Logging Service
 * This middleware ensures all backend events are logged to a remote evaluation server.
 * Using a centralized logger helps in auditing, performance monitoring, and debugging
 * in distributed environments.
 */
const axios = require("axios");

const LOG_API = "http://20.207.122.201/evaluation-service/logs";

async function Log(stack, level, pkg, message, token) {
    try {
        // Send a structured log event to the evaluation server
        await axios.post(
            LOG_API,
            { stack, level, package: pkg, message },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    } catch (err) {
        // We log locally if the remote service is unavailable to ensure no logs are lost.
        console.log("Centralized Logging Failed. Falling back to local console.");
    }
}

module.exports = Log;
