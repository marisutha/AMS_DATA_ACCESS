// Importing necessary libraries and modules
const express = require('express');
const router = express.Router();
const assetController = require('../controllers/asset.controller');
const EndPoint = require('../utils/endpoint')

// Creating objects of the utility classes
const endpoint = new EndPoint()

// Defining routes for asset operations
router.post(endpoint?.ASSET_CREATE, assetController.createAsset);
router.post(endpoint?.ASSET_READ_ALL,assetController.readAssets);
router.patch(endpoint?.ASSET_EDIT, assetController.editAsset);
router.delete(endpoint?.ASSET_DELETE, assetController.deleteAsset);
router.get(endpoint?.ASSET_METRIC, assetController.readAssetMetrics);

// Exporting the router to be used in the app
module.exports = router;

