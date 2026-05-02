const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Log = require("../../logging-middleware/logger");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes Placeholder
// app.use('/api/notifications', require('./routes/notificationRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Notification Service running on port ${PORT}`);
});

module.exports = app;
