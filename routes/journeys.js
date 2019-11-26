// Prerequisites
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Journey = require('../models/Journey');
const mongoose = require('mongoose');

// Add New Journey
router.post('/', ensureAuthenticated, async (req, res) => {
    try {
        await Journey.create({
            startId: req.body.startId,
            endId: req.body.endId,
            userId: req.user._id
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    };
});

// Get Current User's Journeys
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const journeys = await Journey.find({userid: req.body._id});
        res.send(journeys);
    } catch (err) {
        res.status(500),send(err);
    };
})

// Delete Journey By ID
router.delete('/:id', ensureAuthenticated, async (req, res) => {
    try {
        await Journey.findByIdAndDelete(req.param.id);
    } catch (err) {
        res.status(500).send(err);
    };
});

module.exports = router