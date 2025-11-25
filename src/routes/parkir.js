const express = require("express");
const parkirController = require("../controllers/parkirController");

const router = express.Router();

// Create a new parking spot
router.post("/", parkirController.createParkir.bind(parkirController));

// Get all parking spots
router.get("/", parkirController.getAllParkir.bind(parkirController));

// Get parking spot by ID
router.get("/:id", parkirController.getParkirById.bind(parkirController));

// Update parking spot by ID
router.put("/:id", parkirController.updateParkir.bind(parkirController));

// Update parking spot status only
router.patch(
  "/:id/status",
  parkirController.updateStatus.bind(parkirController)
);

// Delete parking spot by ID
router.delete("/:id", parkirController.deleteParkir.bind(parkirController));

module.exports = router;
