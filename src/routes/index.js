const express = require("express");
const ticketRoutes = require("./tickets");
const parkirRoutes = require("./parkir");
const gateRoutes = require("./gate");

const setRoutes = (app) => {
  app.use("/api/tickets", ticketRoutes);
  app.use("/api/parkir", parkirRoutes);
  app.use("/api/gate", gateRoutes);
};

module.exports = setRoutes;
