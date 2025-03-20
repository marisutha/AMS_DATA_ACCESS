// Importing necessary modules
const CreateAssetService = require('../services/asset/create.asset.service');
const ReadAssetService = require('../services/asset/read.asset.service');
const EditAssetService = require('../services/asset/update.asset.service');
const DeleteAssetService = require('../services/asset/delete.asset.service');
const AssetMetricsService = require('../services/asset/metric.asset.service');

const Common = require('../utils/commons');

// Creating object of the services and utilities
const createAssetService = new CreateAssetService();  
const readAssetService = new ReadAssetService();      
const editAssetService = new EditAssetService();      
const deleteUserService = new DeleteAssetService();  
const assetMetricsService = new AssetMetricsService();  

const commons = new Common();  // Utility class for common functions like generating output

// Function for creating an asset
const createAsset = async (req, res) => {
    try {
        const isMockEnabled = false;  // Set mock data flag (false means live data)
        const input = req.body;  // Extract data from the request body

        // Call the createAsset service to process the asset creation
        const response = await createAssetService.CreateAsset(isMockEnabled, input);

        // Return the response with proper status, data, and message
        return res.status(response.status).json(
            commons.generateOutput(response.data, response.status, response.message)
        );
    } catch (error) {
        // Handle errors and return an error response
        return res.status(error.status).json(
            commons.generateOutput(null, error.status || 500, error.message || "An error occurred while creating asset metrics")
        );
    }
};

// Function for reading all assets
const readAssets = async (req, res) => {
    try {
        const isMockEnabled = false;  
        const input = req.body;  

        const response = await readAssetService.ReadAsset(isMockEnabled, input);

        return res.status(response.status).json(
            commons.generateOutput(response.data, response.status, response.message)
        );
    } catch (error) {
        return res.status(error.status).json(
            commons.generateOutput(null, error.status, error.message || "An error occurred while retrieving the assets")
        );
    }
};

// Function for editing an existing asset
const editAsset = async (req, res) => {
    try {
        const isMockEnabled = false;  
        const input = req.body;  

        const response = await editAssetService.UpdateAsset(isMockEnabled, input);

        return res.status(response.status).json(
            commons.generateOutput(response.data, response.status, response.message)
        );
    } catch (error) {
        return res.status(error.status).json(
            commons.generateOutput(null, error.status || 500, error.message || "An error occurred while updating asset metrics")
        );
    }
};

// Function for deleting an asset
const deleteAsset = async (req, res) => {
    try {
        const isMockEnabled = false;  
        const input = req.params; 
        
        const response = await deleteUserService.DeleteAsset(isMockEnabled, input);

        return res.status(response.status).json(
            commons.generateOutput(response.data, response.status, response.message)
        );
    } catch (error) {
        return res.status(error.status).json(
            commons.generateOutput(null, error.status || 500, error.message || "An error occurred while deleting asset metrics")
        );
    }
};

// Function for reading asset metrics
const readAssetMetrics = async (req, res) => {
    try {
        const isMockEnabled = false;  

        const response = await assetMetricsService.ReadAssetMetric(isMockEnabled);

        return res.status(response.status).json(
            commons.generateOutput(response.data, response.status, response.message)
        );
    } catch (error) {
        return res.status(error.status || 500).json(
            commons.generateOutput(null, error.status || 500, error.message || "An error occurred while retrieving asset metrics")
        );
    }
};

// Exporting functions to be used in the route controllers
module.exports = { createAsset, readAssets, editAsset, deleteAsset, readAssetMetrics };
