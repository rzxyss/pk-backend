const db = require("../config/database");

class Ticket {
  // Create a new ticket
  static async create(numberPlate, parkingId) {
    const [result] = await db.execute(
      "INSERT INTO ticket (number_plate, parking_id, is_paid, check_in) VALUES (?, ?, 0, NOW())",
      [numberPlate, parkingId]
    );
    return result;
  }

  // Get all tickets
  static async findAll() {
    const [rows] = await db.execute(`
            SELECT t.*, p.parking_number 
            FROM ticket t 
            LEFT JOIN parkir p ON t.parking_id = p.id 
            ORDER BY t.id ASC
        `);
    return rows;
  }

  // Get ticket by ID
  static async findById(id) {
    const [rows] = await db.execute(
      `
            SELECT t.*, p.parking_number 
            FROM ticket t 
            LEFT JOIN parkir p ON t.parking_id = p.id 
            WHERE t.id = ?
        `,
      [id]
    );
    return rows[0];
  }

  // Get tickets by parking ID
  static async findByParkingId(parkingId) {
    const [rows] = await db.execute(
      "SELECT * FROM ticket WHERE parking_id = ?",
      [parkingId]
    );
    return rows;
  }

  // Get active tickets (not paid)
  static async findActive() {
    const [rows] = await db.execute(`
            SELECT t.*, p.parking_number 
            FROM ticket t 
            LEFT JOIN parkir p ON t.parking_id = p.id 
            WHERE t.is_paid = 0 
            ORDER BY t.id DESC
        `);
    return rows;
  }

  // Update ticket
  static async update(id, numberPlate, parkingId, isPaid) {
    const [result] = await db.execute(
      "UPDATE ticket SET number_plate = ?, parking_id = ?, is_paid = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [numberPlate, parkingId, isPaid, id]
    );
    return result;
  }

  // Checkout ticket
  static async checkout(id) {
    const [result] = await db.execute(
      "UPDATE ticket SET is_paid = 1, check_out = NOW(), updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [id]
    );
    return result;
  }

  // Delete ticket
  static async delete(id) {
    const [result] = await db.execute("DELETE FROM ticket WHERE id = ?", [id]);
    return result;
  }
}

module.exports = Ticket;
