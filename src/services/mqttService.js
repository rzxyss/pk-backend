const mqtt = require("mqtt");

class MQTTService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.connectionOptions = {
      host: process.env.MQTT_HOST || "your-hivemq-cloud-url.hivemq.cloud",
      port: process.env.MQTT_PORT || 8883,
      protocol: "mqtts",
      username: process.env.MQTT_USERNAME || "",
      password: process.env.MQTT_PASSWORD || "",
      clientId: `parking_backend_${Math.random().toString(16).slice(3)}`,
      clean: true,
      reconnectPeriod: 5000,
    };
  }

  connect() {
    if (this.client && this.isConnected) {
      console.log("MQTT already connected");
      return;
    }

    try {
      this.client = mqtt.connect(this.connectionOptions);

      this.client.on("connect", () => {
        this.isConnected = true;
        console.log("✓ MQTT connected to HiveMQ Cloud");
      });

      this.client.on("error", (error) => {
        console.error("MQTT connection error:", error.message);
        this.isConnected = false;
      });

      this.client.on("offline", () => {
        console.log("MQTT client offline");
        this.isConnected = false;
      });

      this.client.on("reconnect", () => {
        console.log("MQTT attempting to reconnect...");
      });
    } catch (error) {
      console.error("Failed to connect to MQTT:", error.message);
    }
  }

  publish(topic, message, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.client || !this.isConnected) {
        return reject(new Error("MQTT client not connected"));
      }

      this.client.publish(topic, message, options, (error) => {
        if (error) {
          console.error(`Failed to publish to ${topic}:`, error.message);
          reject(error);
        } else {
          console.log(`✓ Published to ${topic}: ${message}`);
          resolve();
        }
      });
    });
  }

  subscribe(topic, callback) {
    if (!this.client || !this.isConnected) {
      console.error("MQTT client not connected");
      return;
    }

    this.client.subscribe(topic, (error) => {
      if (error) {
        console.error(`Failed to subscribe to ${topic}:`, error.message);
      } else {
        console.log(`✓ Subscribed to ${topic}`);
      }
    });

    this.client.on("message", (receivedTopic, message) => {
      if (receivedTopic === topic) {
        callback(message.toString());
      }
    });
  }

  disconnect() {
    if (this.client) {
      this.client.end();
      this.isConnected = false;
      console.log("MQTT disconnected");
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

module.exports = new MQTTService();
