// Importing necessary modules
const CreateAssetMaintenanceService = require('../services/maintenance/create.maintenance.service');
const ReadAssetMaintenanceService = require('../services/maintenance/read.maintenance.service');
const EditAssetMaintenanceService = require('../services/maintenance/update.maintenace.service');
const DeleteAssetMaintenanceService = require('../services/maintenance/delete.maintenance.service');
const ReadAssetMaintenanceMetricService = require('../services/maintenance/metric.maintenance.service');

const Common = require('../utils/commons');

// Creating objects of the services and utilities
const createAssetMaintenanceService = new CreateAssetMaintenanceService();  
const readAssetMaintenanceService = new ReadAssetMaintenanceService();      
const editAssetMaintenanceService = new EditAssetMaintenanceService();      
const deleteAssetMaintenanceService = new DeleteAssetMaintenanceService();  
const readAssetMaintenanceMetricService = new ReadAssetMaintenanceMetricService();  

const commons = new Common();  // Utility class for common functions like generating output

// Function for creating an asset maintenance
const createAssetMaintenance = async (req, res) => {
    try {
        const isMockEnabled = false;  // Set mock data flag (false means live data)
        const input = req.body;  // Extract data from the request body

        // Call the createAssetMaintenance service to process the asset maintenance creation
        const response = await createAssetMaintenanceService.CreateAssetMaintenance(isMockEnabled, input);

        // Return the response with proper status, data, and message
        return res.status(response.status).json(
            commons.generateOutput(response.data, response.status, response.message)
        );
    } catch (error) {
        // Handle errors and return an error response
        return res.status(error.status).json(
            commons.generateOutput(null, error.status, error.message)
        );
    }
};

// Function for reading all asset maintenances
const readAssetMaintenances = async (req, res) => {
    try {
        const isMockEnabled = false;  
        const input = req.body;

        const response = await readAssetMaintenanceService.ReadAssetMaintenance(isMockEnabled, input);

        return res.status(response.status).json(
            commons.generateOutput(response.data, response.status, response.message));
    } catch (error) {
        return res.status(error.status).json(
            commons.generateOutput(null, error.status, error.message || "An error occurred while retrieving the assets")
        );
    }
};

// Function for editing an existing asset maintenance
const editAssetMaintenance = async (req, res) => {
    try {
        const isMockEnabled = false;  
        const input = req.body; 

        const response = await editAssetMaintenanceService.UpdateAssetMaintenance(isMockEnabled, input);

        return res.status(response.status).json(
            commons.generateOutput(response.data, response.status, response.message)
        );
    } catch (error) {
        return res.status(error.status).json(
            commons.generateOutput(null, error.status, error.message)
        );
    }
};

// Function for deleting an asset maintenance
const deleteAssetMaintenance = async (req, res) => {
    try {
        const isMockEnabled = false; 
        const input = req.params;  

        const response = await deleteAssetMaintenanceService.DeleteAssetMaintenance(isMockEnabled, input);

        return res.status(response.status).json(
            commons.generateOutput(response.data, response.status, response.message)
        );
    } catch (error) {
        return res.status(error.status).json(
            commons.generateOutput(null, error.status, error.message)
        );
    }
};

// Function for reading asset maintenance metrics
const readAssetMaintenanceMetrics = async (req, res) => {
    try {
        const isMockEnabled = false;  

        const response = await readAssetMaintenanceMetricService.ReadAssetMaintenanceMetric(isMockEnabled);

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
module.exports = { createAssetMaintenance, readAssetMaintenances, editAssetMaintenance, deleteAssetMaintenance, readAssetMaintenanceMetrics };
