const express = require('express');
const ticketRoutes = require('./tickets');
const parkirRoutes = require('./parkir');

const setRoutes = (app) => {
    app.use('/api/tickets', ticketRoutes);
    app.use('/api/parkir', parkirRoutes);
};

module.exports = setRoutes;