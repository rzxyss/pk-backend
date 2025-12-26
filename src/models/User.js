const db = require("../config/database");

class User {
  // Create a new user
  static async create(name, username, password) {
    const [result] = await db.execute(
      "INSERT INTO users (name, username, password) VALUES (?, ?, ?)",
      [name, username, password]
    );
    return result;
  }

  // Get all users
  static async findAll() {
    const [rows] = await db.execute(
      "SELECT id, name, username, created_at, updated_at FROM users ORDER BY id ASC"
    );
    return rows;
  }

  // Get user by ID
  static async findById(id) {
    const [rows] = await db.execute(
      "SELECT id, name, username, created_at, updated_at FROM users WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  // Get user by username (for login)
  static async findByUsername(username) {
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    return rows[0];
  }

  // Update user
  static async update(id, name, username, password = null) {
    if (password) {
      const [result] = await db.execute(
        "UPDATE users SET name = ?, username = ?, password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [name, username, password, id]
      );
      return result;
    } else {
      const [result] = await db.execute(
        "UPDATE users SET name = ?, username = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [name, username, id]
      );
      return result;
    }
  }

  // Delete user
  static async delete(id) {
    const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);
    return result;
  }
}

module.exports = User;
