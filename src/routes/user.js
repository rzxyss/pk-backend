const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

// Login
router.post("/login", userController.login.bind(userController));

// Create a new user (register)
router.post("/", userController.createUser.bind(userController));

// Get all users
router.get("/", userController.getAllUsers.bind(userController));

// Get user by ID
router.get("/:id", userController.getUserById.bind(userController));

// Update user by ID
router.put("/:id", userController.updateUser.bind(userController));

// Delete user by ID
router.delete("/:id", userController.deleteUser.bind(userController));

module.exports = router;
