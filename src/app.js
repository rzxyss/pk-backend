require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const setRoutes = require("./routes/index");
const mqttService = require("./services/mqttService");

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================
// MQTT
// ==========================
mqttService.connect();

// ==========================
// Middleware dasar
// ==========================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ==========================
// CORS CONFIG (AMAN)
// ==========================
const allowedOrigins = [
  "https://parking-team.vercel.app", // Web production
  "http://localhost:3000", // Dev lokal (opsional)
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow mobile apps & Postman (no origin)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// APPLY CORS
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ preflight fix

// ==========================
// Root endpoint
// ==========================
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

// ==========================
// Routes
// ==========================
setRoutes(app);

// ==========================
// Error handling
// ==========================
app.use((err, req, res, next) => {
  console.error(err.stack);

  // CORS error
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS blocked this request",
    });
  }

  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: err.message,
  });
});

// ==========================
// 404
// ==========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ==========================
// Start server
// ==========================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Export for Vercel
module.exports = app;
