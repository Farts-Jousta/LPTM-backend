const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const Journey = require('../models/Journey');
// const hmacsha1 = require('hmacsha1-generate');
const ptvSig = require ('ptv-api-signature');
require('dotenv').config();

// Main Page
router.get('/', async (req, res) => {
  try {
    // Collecting User Data
    console.log("Collecting User Data...");
    const mapSrc = `<script src="https://maps.googleapis.com/maps/api/js?key=${process.env.MAPS_API_KEY}&callback=initMap" async defer></script>`;
    let userData = { data: {
      status: 404,
      msg: "No User Signed In",
      mapSrc: mapSrc
    }};
    if (req.user) {
      const profile = await Profile.findOne({userId: req.user._id});
      const journeys = await Journey.find({userId: req.user._id});
      
      // Function to get data off the PTV API. Due to the need for complicated, route dependent signatures, it was easier to create a simple function that collects a request.
      // Requests do not start with a '/', must be a string, and any request requiring a variable should be formated as such "request/variable".
      // Example Request: "departures/route_type/0/stop/1071/route/1"
      // const ptvApi = (request) => {
      //   const key = process.env.PTV_API_KEY.toString()
      //   const devid = process.env.PTV_USER_ID.toString()
      //   const baseUrl = "http://timetableapi.ptv.vic.gov.au"
      //   const path = "/v3/" + request
      //   const result = `${baseUrl}${ptvSig.pathWithSig(`${path}`, [], devid, key)}`
      //   return result
      // }

      userData = { data: {
        status: 200,
        user: req.user,
        profile: profile,
        journeys: journeys,
        ptvApi: (request) => {
          const key = process.env.PTV_API_KEY.toString()
          const devid = process.env.PTV_USER_ID.toString()
          const baseUrl = "http://timetableapi.ptv.vic.gov.au"
          const path = "/v3/" + request
          const result = `${baseUrl}${ptvSig.pathWithSig(`${path}`, [], devid, key)}`
          return result
        },
        mapSrc: mapSrc
      }};

      console.log(userData.data.ptvApi("departures/route_type/0/stop/1071/route/1"));
    };
    res.render('index', userData);
  } catch (err) {
    res.status(500).send(err)
  };
});

module.exports = router;