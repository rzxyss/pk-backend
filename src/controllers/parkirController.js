const Parkir = require("../models/Parkir");

class ParkirController {
  // Create a new parking spot
  async createParkir(req, res) {
    try {
      const { parking_number, is_used, trig, echo } = req.body;

      if (!parking_number) {
        return res.status(400).json({
          success: false,
          message: "Parking number is required",
        });
      }

      // Check if parking number already exists
      const existing = await Parkir.findByParkingNumber(parking_number);
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Parking number already exists",
        });
      }

      const result = await Parkir.create(
        parking_number,
        is_used || 0,
        trig,
        echo
      );

      res.status(201).json({
        success: true,
        message: "Parking spot created successfully",
        data: {
          id: result.insertId,
          parking_number,
          is_used: is_used || 0,
          trig,
          echo,
        },
      });
    } catch (error) {
      console.error("Error creating parking spot:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create parking spot",
        error: error.message,
      });
    }
  }

  // Get all parking spots
  async getAllParkir(req, res) {
    try {
      const parkings = await Parkir.findAll();
      res.status(200).json({
        success: true,
        data: parkings,
      });
    } catch (error) {
      console.error("Error fetching parking spots:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch parking spots",
        error: error.message,
      });
    }
  }

  // Get parking spot by ID
  async getParkirById(req, res) {
    try {
      const { id } = req.params;
      const parking = await Parkir.findById(id);

      if (!parking) {
        return res.status(404).json({
          success: false,
          message: "Parking spot not found",
        });
      }

      res.status(200).json({
        success: true,
        data: parking,
      });
    } catch (error) {
      console.error("Error fetching parking spot:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch parking spot",
        error: error.message,
      });
    }
  }

  // Update parking spot
  async updateParkir(req, res) {
    try {
      const { id } = req.params;
      const { parking_number, is_used, trig, echo } = req.body;

      const existing = await Parkir.findById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Parking spot not found",
        });
      }

      // Check if new parking number already exists (and it's not the same record)
      if (parking_number && parking_number !== existing.parking_number) {
        const duplicate = await Parkir.findByParkingNumber(parking_number);
        if (duplicate && duplicate.id != id) {
          return res.status(400).json({
            success: false,
            message: "Parking number already exists",
          });
        }
      }

      const result = await Parkir.update(
        id,
        parking_number || existing.parking_number,
        is_used !== undefined ? is_used : existing.is_used,
        trig !== undefined ? trig : existing.trig,
        echo !== undefined ? echo : existing.echo
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Parking spot not found",
        });
      }

      const updated = await Parkir.findById(id);
      res.status(200).json({
        success: true,
        message: "Parking spot updated successfully",
        data: updated,
      });
    } catch (error) {
      console.error("Error updating parking spot:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update parking spot",
        error: error.message,
      });
    }
  }

  // Update parking spot status only
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { is_used } = req.body;

      if (is_used === undefined) {
        return res.status(400).json({
          success: false,
          message: "is_used field is required",
        });
      }

      const result = await Parkir.updateStatus(id, is_used);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Parking spot not found",
        });
      }

      const updated = await Parkir.findById(id);
      res.status(200).json({
        success: true,
        message: "Parking status updated successfully",
        data: updated,
      });
    } catch (error) {
      console.error("Error updating parking status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update parking status",
        error: error.message,
      });
    }
  }

  // Delete parking spot
  async deleteParkir(req, res) {
    try {
      const { id } = req.params;

      const existing = await Parkir.findById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Parking spot not found",
        });
      }

      await Parkir.delete(id);

      res.status(200).json({
        success: true,
        message: "Parking spot deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting parking spot:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete parking spot",
        error: error.message,
      });
    }
  }
}

module.exports = new ParkirController();
