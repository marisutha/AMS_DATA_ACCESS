// Importing necessary modules
const CreateLocationService = require('../services/location/create.location.service');
const ReadLocationService = require('../services/location/read.location.service');
const EditLocationService = require('../services/location/update.location.service');
const DeleteLocationService = require('../services/location/delete.location.service');
const MetricLocationService = require('../services/location/metric.location.service');

const Common = require('../utils/commons');

// Creating objects of the services and utilities
const createLocationService = new CreateLocationService();  
const readLocationService = new ReadLocationService();      
const editLocationService = new EditLocationService();      
const deleteLocationService = new DeleteLocationService();  
const metricLocationService = new MetricLocationService();  

const commons = new Common();  // Utility class for common functions like generating output

// Function for creating a location
const createLocation = async (req, res) => {
    try {
        const isMockEnabled = false;  // Set mock data flag (false means live data)
        const input = req.body;  // Extract data from the request body

        // Call the createLocation service to process the location creation
        const response = await createLocationService.CreateLocation(isMockEnabled, input);

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

// Function for reading all locations
const readLocations = async (req, res) => {
    try {
        const isMockEnabled = false;  
        const input = req.body;  // Extract data from the request body

        // Call the readLocation service to retrieve location data
        const response = await readLocationService.ReadLocation(isMockEnabled, input);

        // Return the response with proper status, data, and message
        return res.status(response.status).json(
            commons.generateOutput(response.data, response.status, response.message));
    } catch (error) {
        // Handle errors and return an error response
        return res.status(error.status).json(
            commons.generateOutput(null, error.status, error.message)
        );
    }
};

// Function for editing an existing location
const editLocation = async (req, res) => {
    try {
        const isMockEnabled = false;  
        const input = req.body;  

        const response = await editLocationService.UpdateLocation(isMockEnabled, input);

        return res.status(response.status).json(
            commons.generateOutput(response.data, response.status, response.message)
        );
    } catch (error) {
        return res.status(error.status).json(
            commons.generateOutput(null, error.status, error.message)
        );
    }
};

// Function for deleting a location
const deleteLocation = async (req, res) => {
    try {
        const isMockEnabled = false;  
        const input = req.params; 

        const response = await deleteLocationService.DeleteLocation(isMockEnabled, input);

        return res.status(response.status).json(
            commons.generateOutput(response.data, response.status, response.message)
        );
    } catch (error) {
        return res.status(error.status).json(
            commons.generateOutput(null, error.status, error.message)
        );
    }
};

// Function for reading location metrics
const readLocationMetrics = async (req, res) => {
    try {
        const isMockEnabled = false;  

        const response = await metricLocationService.ReadLocationMetric(isMockEnabled);

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
module.exports = { createLocation, readLocations, editLocation, deleteLocation, readLocationMetrics };
