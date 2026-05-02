const axios = require("axios");

const LOG_API = "http://20.207.122.201/evaluation-service/logs";

async function Log(stack, level, pkg, message, token) {
    try {
        await axios.post(
            LOG_API,
            {
                stack: stack,
                level: level,
                package: pkg,
                message: message
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    } catch (err) {
        console.log("Log failed:", err.response ? err.response.data : err.message);
    }
}

module.exports = Log;
