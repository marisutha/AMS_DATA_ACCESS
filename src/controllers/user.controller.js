// Importing necessary modules
const CreateUserService = require('../services/user/create.user.service');
const ReadUserService = require('../services/user/read.user.service');
const EditUserService = require('../services/user/update.user.service');
const DeleteUserService = require('../services/user/deleted.user.service');
const UserMetricService = require('../services/user/metric.user.service');

const Common = require('../utils/commons'); 

// Creating objects of the services and utilities
const createUserService = new CreateUserService();  
const readUserService = new ReadUserService();      
const editUserService = new EditUserService();      
const deleteUserService = new DeleteUserService();  
const userMetricService = new UserMetricService();  

const commons = new Common();  // Utility class for common functions like generating output

// Function for creating a user
const createUser = async (req, res) => {
    try {
        const isMockEnabled = false;  // Set mock data flag (false means live data)
        const input = req.body;  // Extract data from the request body

        // Call the createUserService to process the user creation
        const response = await createUserService.CreateUser(isMockEnabled, input);

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

// Function for reading a single user
const readOneUser = async (req, res) => {
    try {
        const isMockEnabled = false;  
        const input = req.params;  // Extract user ID from request parameters

        const response = await readUserService.ReadOneUser(isMockEnabled, input);
        
        return res.status(response.status).json(
            commons.generateOutput(response.data, response.status, response.message));
    } catch (error) {
        return res.status(error.status).json(
            commons.generateOutput(null, error.status, error.message || "An error occurred while retrieving the User")
        );
    }
};

// Function for reading all users
const readUsers = async (req, res) => {
    try {
        const isMockEnabled = false;  
        const input = req.body; 

        const response = await readUserService.ReadUser(isMockEnabled, input);

        return res.status(response.status).json(
            commons.generateOutput(response.data, response.status, response.message));
    } catch (error) {
        return res.status(error.status).json(
            commons.generateOutput(null, error.status, error.message || "An error occurred while retrieving the Users")
        );
    }
};

// Function for editing an existing user
const editUser = async (req, res) => {
    try {
        const isMockEnabled = false;  
        const input = req.body; 

        const response = await editUserService.UpdateUser(isMockEnabled, input);

        return res.status(response.status).json(
            commons.generateOutput(response.data, response.status, response.message)
        );
    } catch (error) {
        return res.status(error.status).json(
            commons.generateOutput(null, error.status, error.message)
        );
    }
};

// Function for deleting a user
const deleteUser = async (req, res) => {
    try {
        const isMockEnabled = false;  
        const input = req.params; 

        const response = await deleteUserService.DeleteUser(isMockEnabled, input);

        return res.status(response.status).json(
            commons.generateOutput(response.data, response.status, response.message)
        );
    } catch (error) {
        return res.status(error.status).json(
            commons.generateOutput(null, error.status, error.message)
        );
    }
};

// Function for reading user metrics
const readUserMetrics = async (req, res) => {
    try {
        const isMockEnabled = false;  

        const response = await userMetricService.ReadUserMetric(isMockEnabled);

        return res.status(response.status).json(
            commons.generateOutput(response.data, response.status, response.message)
        );
    } catch (error) {
        return res.status(error.status || 500).json(
            commons.generateOutput(null, error.status || 500, error.message || "An error occurred while retrieving user metrics")
        );
    }
};

// Exporting functions to be used in the route controllers
module.exports = { createUser, readOneUser, readUsers, editUser, deleteUser, readUserMetrics };
