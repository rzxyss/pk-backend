const db = require("../config/database");

class Parkir {
  // Create a new parking spot
  static async create(parkingNumber, isUsed = 0) {
    const [result] = await db.execute(
      "INSERT INTO parkir (parking_number, is_used) VALUES (?, ?)",
      [parkingNumber, isUsed]
    );
    return result;
  }

  // Get all parking spots
  static async findAll() {
    const [rows] = await db.execute("SELECT * FROM parkir DESC");
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

  // Update parking spot
  static async update(id, parkingNumber, isUsed) {
    const [result] = await db.execute(
      "UPDATE parkir SET parking_number = ?, is_used = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [parkingNumber, isUsed, id]
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
}

module.exports = Parkir;
