// Importing necessary libraries and modules
const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenance.controller');
const EndPoint = require('../utils/endpoint');

// Creating objects of the utility classes
const endpoint = new EndPoint()

// Defining routes for maintenance operations
router.post(endpoint?.MAINTENANCE_CREATE , maintenanceController.createAssetMaintenance);
router.post(endpoint?.MAINTENANCE_READ_ALL, maintenanceController.readAssetMaintenances);
router.patch(endpoint?.MAINTENANCE_EDIT, maintenanceController.editAssetMaintenance);
router.delete(endpoint?.MAINTENANCE_DELETE, maintenanceController.deleteAssetMaintenance);
router.get(endpoint?.MAINTENANCE_METRIC, maintenanceController.readAssetMaintenanceMetrics);

// Exporting the router to be used in the app
module.exports = router;
