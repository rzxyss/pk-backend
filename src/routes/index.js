const express = require("express");
const ticketRoutes = require("./tickets");
const parkirRoutes = require("./parkir");
const gateRoutes = require("./gate");
const userRoutes = require("./user");

const setRoutes = (app) => {
  app.use("/api/tickets", ticketRoutes);
  app.use("/api/parkir", parkirRoutes);
  app.use("/api/gate", gateRoutes);
  app.use("/api/users", userRoutes);
};

module.exports = setRoutes;
