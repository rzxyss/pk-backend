const express = require("express");
const ticketController = require("../controllers/ticketController");

const router = express.Router();

// Create a new ticket (Check-in)
router.post("/", ticketController.createTicket.bind(ticketController));

// Get all tickets
router.get("/", ticketController.getAllTickets.bind(ticketController));

// Get active tickets (not paid)
router.get("/active", ticketController.getActiveTickets.bind(ticketController));

// Get a ticket by ID
router.get("/:id", ticketController.getTicketById.bind(ticketController));

// Update a ticket by ID
router.put("/:id", ticketController.updateTicket.bind(ticketController));

// Checkout ticket (mark as paid)
router.patch(
  "/:id/checkout",
  ticketController.checkoutTicket.bind(ticketController)
);

// Delete a ticket by ID
router.delete("/:id", ticketController.deleteTicket.bind(ticketController));

module.exports = router;
