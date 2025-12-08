const mqttService = require("../services/mqttService");

class GateController {
  // Control gate (open or close)
  async controlGate(req, res) {
    try {
      const { action } = req.body;

      // Validate action
      if (!action || !["open", "close"].includes(action.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: "Invalid action. Must be 'open' or 'close'",
        });
      }

      // Check MQTT connection
      if (!mqttService.getConnectionStatus()) {
        return res.status(503).json({
          success: false,
          message: "MQTT service not connected",
        });
      }

      // Publish to MQTT topic
      const topic = "gate_action";
      const message = action.toLowerCase();

      await mqttService.publish(topic, message);

      res.status(200).json({
        success: true,
        message: `Gate ${action} command sent successfully`,
        data: {
          topic,
          action: message,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Error controlling gate:", error);
      res.status(500).json({
        success: false,
        message: "Failed to control gate",
        error: error.message,
      });
    }
  }

  // Get MQTT connection status
  async getStatus(req, res) {
    try {
      const isConnected = mqttService.getConnectionStatus();
      const gateStatus = mqttService.getGateStatus();

      res.status(200).json({
        success: true,
        data: {
          mqtt_connected: isConnected,
          mqtt_status: isConnected ? "connected" : "disconnected",
          gate_status: gateStatus,
        },
      });
    } catch (error) {
      console.error("Error getting status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get status",
        error: error.message,
      });
    }
  }
}

module.exports = new GateController();
