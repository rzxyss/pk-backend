const Ticket = require("../models/Ticket");
const Parkir = require("../models/Parkir");

class TicketController {
  // Create a new ticket (Check-in)
  async createTicket(req, res) {
    try {
      const { number_plate, parking_id } = req.body;

      if (!number_plate || !parking_id) {
        return res.status(400).json({
          success: false,
          message: "Number plate and parking ID are required",
        });
      }

      // Check if parking spot exists
      const parking = await Parkir.findById(parking_id);
      if (!parking) {
        return res.status(404).json({
          success: false,
          message: "Parking spot not found",
        });
      }

      // Check if parking spot is already used
      if (parking.is_used) {
        return res.status(400).json({
          success: false,
          message: "Parking spot is already in use",
        });
      }

      // Create ticket
      const result = await Ticket.create(number_plate, parking_id);

      // Update parking spot status to used
      // await Parkir.updateStatus(parking_id, 1);

      res.status(201).json({
        success: true,
        message: "Ticket created successfully (Check-in)",
        data: {
          id: result.insertId,
          number_plate,
          parking_id,
          parking_number: parking.parking_number,
        },
      });
    } catch (error) {
      console.error("Error creating ticket:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create ticket",
        error: error.message,
      });
    }
  }

  // Get all tickets
  async getAllTickets(req, res) {
    try {
      const tickets = await Ticket.findAll();
      res.status(200).json({
        success: true,
        data: tickets,
      });
    } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch tickets",
        error: error.message,
      });
    }
  }

  // Get active tickets (not paid)
  async getActiveTickets(req, res) {
    try {
      const tickets = await Ticket.findActive();
      res.status(200).json({
        success: true,
        data: tickets,
      });
    } catch (error) {
      console.error("Error fetching active tickets:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch active tickets",
        error: error.message,
      });
    }
  }

  // Get ticket by ID
  async getTicketById(req, res) {
    try {
      const { id } = req.params;
      const ticket = await Ticket.findById(id);

      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: "Ticket not found",
        });
      }

      res.status(200).json({
        success: true,
        data: ticket,
      });
    } catch (error) {
      console.error("Error fetching ticket:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch ticket",
        error: error.message,
      });
    }
  }

  // Update ticket
  async updateTicket(req, res) {
    try {
      const { id } = req.params;
      const { number_plate, parking_id, is_paid } = req.body;

      const existing = await Ticket.findById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Ticket not found",
        });
      }

      // If parking_id is being changed
      if (parking_id && parking_id !== existing.parking_id) {
        const newParking = await Parkir.findById(parking_id);
        if (!newParking) {
          return res.status(404).json({
            success: false,
            message: "New parking spot not found",
          });
        }

        // Free up old parking spot
        await Parkir.updateStatus(existing.parking_id, 0);
        // Mark new parking spot as used
        await Parkir.updateStatus(parking_id, 1);
      }

      const result = await Ticket.update(
        id,
        number_plate || existing.number_plate,
        parking_id || existing.parking_id,
        is_paid !== undefined ? is_paid : existing.is_paid
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Ticket not found",
        });
      }

      const updated = await Ticket.findById(id);
      res.status(200).json({
        success: true,
        message: "Ticket updated successfully",
        data: updated,
      });
    } catch (error) {
      console.error("Error updating ticket:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update ticket",
        error: error.message,
      });
    }
  }

  // Checkout ticket (mark as paid and set check_out time)
  async checkoutTicket(req, res) {
    try {
      const { id } = req.params;

      const existing = await Ticket.findById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Ticket not found",
        });
      }

      if (existing.is_paid) {
        return res.status(400).json({
          success: false,
          message: "Ticket already paid",
        });
      }

      // Checkout ticket
      await Ticket.checkout(id);

      // Free up parking spot
      // await Parkir.updateStatus(existing.parking_id, 0);

      const updated = await Ticket.findById(id);
      res.status(200).json({
        success: true,
        message: "Checkout successful",
        data: updated,
      });
    } catch (error) {
      console.error("Error checking out ticket:", error);
      res.status(500).json({
        success: false,
        message: "Failed to checkout ticket",
        error: error.message,
      });
    }
  }

  // Delete ticket
  async deleteTicket(req, res) {
    try {
      const { id } = req.params;

      const existing = await Ticket.findById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Ticket not found",
        });
      }

      // Free up parking spot if ticket was active
      // if (!existing.is_paid) {
      //   await Parkir.updateStatus(existing.parking_id, 0);
      // }

      await Ticket.delete(id);

      res.status(200).json({
        success: true,
        message: "Ticket deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting ticket:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete ticket",
        error: error.message,
      });
    }
  }
}

module.exports = new TicketController();
