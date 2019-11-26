// Prerequisites
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Profile = require('../models/Profile');
const mongoose = require('mongoose');

// New Profile Created With User
router.post('/', ensureAuthenticated, async (req, res) => {
    try {
        await Profile.create({
            imgurl: false,
            firstname: false,
            lastname: false,
            aboutme: false,
            userId: req.user._id
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    };
});

// Get Current User's Profile
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const profile = await Profile.findById(req.user._id);
        res.send(profile);
    } catch (err) {
        res.status(500),send(err);
    };
})

// Update Current User's Profile
router.put('/', ensureAuthenticated, async (req, res) => {
    const { imgurl, firstname, lastname, aboutme } = req.body;
    const profile = {
        imgurl,
        firstname,
        lastname,
        aboutme
    };
    try {
        await User.findByIdAndUpdate(req.user._id, profile, {new:true});
    } catch (err) {
        res.status(500).send(err);
    };
});

// No delete option for profiles, this is intentional.

module.exports = router