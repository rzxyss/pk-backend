require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const setRoutes = require("./routes/index");
const mqttService = require("./services/mqttService");
const ngrok = require("@ngrok/ngrok");
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize MQTT connection
mqttService.connect();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS middleware (optional, jika diperlukan)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Parking System API",
    endpoints: {
      parkir: "/api/parkir",
      tickets: "/api/tickets",
      gate: "/api/gate",
    },
  });
});

// Set up routes
setRoutes(app);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
// app.listen(PORT, async () => {
//   console.log(`Server is running on port ${PORT}`);

//   // Start ngrok tunnel
//   try {
//     const listener = await ngrok.connect({
//       addr: PORT,
//       authtoken_from_env: true,
//     });
//     const url = listener.url();
//     console.log(`\n🌐 Ngrok tunnel established!`);
//     console.log(`📡 Public URL: ${url}`);
//     console.log(`\nYou can access your API at: ${url}\n`);
//   } catch (error) {
//     console.error("Ngrok connection failed:", error.message);
//     console.log("Server still running locally on port", PORT);
//   }
// });

// Export the app for Vercel
module.exports = app;
