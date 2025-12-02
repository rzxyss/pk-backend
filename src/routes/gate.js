const express = require("express");
const gateController = require("../controllers/gateController");

const router = express.Router();

// Control gate (open/close)
router.post("/control", gateController.controlGate.bind(gateController));

// Get MQTT connection status
router.get("/status", gateController.getStatus.bind(gateController));

module.exports = router;
