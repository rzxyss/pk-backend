const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UserController {
  // Login
  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Username and password are required",
        });
      }

      // Find user by username
      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid username or password",
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid username or password",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "24h" }
      );

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          id: user.id,
          name: user.name,
          username: user.username,
          token,
        },
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({
        success: false,
        message: "Failed to login",
        error: error.message,
      });
    }
  }

  // Create a new user
  async createUser(req, res) {
    try {
      const { name, username, password } = req.body;

      if (!name || !username || !password) {
        return res.status(400).json({
          success: false,
          message: "Name, username, and password are required",
        });
      }

      // Check if username already exists
      const existing = await User.findByUsername(username);
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Username already exists",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await User.create(name, username, hashedPassword);

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: {
          id: result.insertId,
          name,
          username,
        },
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create user",
        error: error.message,
      });
    }
  }

  // Get all users
  async getAllUsers(req, res) {
    try {
      const users = await User.findAll();

      res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: users,
      });
    } catch (error) {
      console.error("Error getting users:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get users",
        error: error.message,
      });
    }
  }

  // Get user by ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: user,
      });
    } catch (error) {
      console.error("Error getting user:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get user",
        error: error.message,
      });
    }
  }

  // Update user
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, username, password } = req.body;

      // Check if user exists
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Check if new username is already taken by another user
      if (username && username !== user.username) {
        const existing = await User.findByUsername(username);
        if (existing) {
          return res.status(400).json({
            success: false,
            message: "Username already exists",
          });
        }
      }

      // Hash password if provided
      let hashedPassword = null;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      await User.update(
        id,
        name || user.name,
        username || user.username,
        hashedPassword
      );

      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: {
          id,
          name: name || user.name,
          username: username || user.username,
        },
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update user",
        error: error.message,
      });
    }
  }

  // Delete user
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Check if user exists
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      await User.delete(id);

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete user",
        error: error.message,
      });
    }
  }
}

module.exports = new UserController();
