const db = require("../config/database");

class Parkir {
  // Create a new parking spot
  static async create(parkingNumber, isUsed = 0, trig, echo) {
    const [result] = await db.execute(
      "INSERT INTO parkir (parking_number, is_used, trig, echo) VALUES (?, ?, ?, ?)",
      [parkingNumber, isUsed, trig, echo]
    );
    return result;
  }

  // Get all parking spots
  static async findAll() {
    const [rows] = await db.execute("SELECT * FROM parkir ORDER BY id ASC");
    return rows;
  }

  // Get parking spot by ID
  static async findById(id) {
    const [rows] = await db.execute("SELECT * FROM parkir WHERE id = ?", [id]);
    return rows[0];
  }

  // Get parking spot by parking number
  static async findByParkingNumber(parkingNumber) {
    const [rows] = await db.execute(
      "SELECT * FROM parkir WHERE parking_number = ?",
      [parkingNumber]
    );
    return rows[0];
  }

  // Get parking spot by trig and echo pins
  static async findByPins(trig, echo) {
    const [rows] = await db.execute(
      "SELECT * FROM parkir WHERE trig = ? AND echo = ?",
      [trig, echo]
    );
    return rows[0];
  }

  // Update parking spot status by trig and echo pins
  static async updateStatusByPins(trig, echo, isUsed) {
    const [result] = await db.execute(
      "UPDATE parkir SET is_used = ?, updated_at = CURRENT_TIMESTAMP WHERE trig = ? AND echo = ?",
      [isUsed, trig, echo]
    );
    return result;
  }

  // Update parking spot
  static async update(id, parkingNumber, isUsed, trig, echo) {
    const [result] = await db.execute(
      "UPDATE parkir SET parking_number = ?, is_used = ?, trig = ?, echo = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [parkingNumber, isUsed, trig, echo, id]
    );
    return result;
  }

  // Update parking spot status
  static async updateStatus(id, isUsed) {
    const [result] = await db.execute(
      "UPDATE parkir SET is_used = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [isUsed, id]
    );
    return result;
  }

  // Delete parking spot
  static async delete(id) {
    const [result] = await db.execute("DELETE FROM parkir WHERE id = ?", [id]);
    return result;
  }

  // Count available parking spots (is_used = 0)
  static async countAvailable() {
    const [rows] = await db.execute(
      "SELECT COUNT(*) as count FROM parkir WHERE is_used = 0"
    );
    return rows[0].count;
  }
}

module.exports = Parkir;
