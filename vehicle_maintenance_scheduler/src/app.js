const express = require("express");
const app = express();

const vehicleRoutes = require("./routes/vehicleRoutes");

app.use(express.json());
app.use("/api", vehicleRoutes);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
