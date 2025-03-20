// Importing necessary libraries and modules
const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location.controller');
const EndPoint = require('../utils/endpoint');

// Creating objects of the utility classes
const endpoint = new EndPoint()

// Defining routes for location operations
router.post(endpoint?.LOCATION_CREATE, locationController.createLocation);
router.post(endpoint?.LOCATION_READ_ALL, locationController.readLocations);
router.patch(endpoint?.LOCATION_EDIT, locationController.editLocation);
router.delete(endpoint?.LOCATION_DELETE, locationController.deleteLocation);
router.get(endpoint?.LOCATION_METRIC, locationController.readLocationMetrics);

// Exporting the router to be used in the app
module.exports = router;

