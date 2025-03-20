// Importing necessary modules
const CreateDepartmentService = require('../services/department/create.department.service');
const ReadDepartmentService = require('../services/department/read.department.service');
const EditDepartmentService = require('../services/department/update.department.service');
const DeleteDepartmentService = require('../services/department/delete.department.service');
const MetricDepartmentService = require('../services/department/metric.department.service');

const Common = require('../utils/commons');

// Creating objects of the services and utilities
const createDepartmentService = new CreateDepartmentService();  
const readDepartmentService = new ReadDepartmentService();      
const editDepartmentService = new EditDepartmentService();      
const deleteDepartmentService = new DeleteDepartmentService();  
const metricDepartmentService = new MetricDepartmentService();  

const commons = new Common();  // Utility class for common functions like generating output

// Function for creating a department
const createDepartment = async (req, res) => {
    try {
        const isMockEnabled = false;  // Set mock data flag (false means live data)
        const input = req.body;  // Extract data from the request body

        // Call the createDepartment service to process the department creation
        const response = await createDepartmentService.CreateDepartment(isMockEnabled, input);

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

// Function for reading all departments
const readDepartments = async (req, res) => {
    try {
        const isMockEnabled = false; 
        const input = req.body;  

        const response = await readDepartmentService.ReadDepartment(isMockEnabled, input);

        return res.status(response.status).json(
            commons.generateOutput(response.data, response.status, response.message));
    } catch (error) {
        return res.status(error.status).json(
            commons.generateOutput(null, error.status, error.message)
        );
    }
};

// Function for editing an existing department
const editDepartment = async (req, res) => {
    try {
        const isMockEnabled = false; 
        const input = req.body; 

        const response = await editDepartmentService.UpdateDepartment(isMockEnabled, input);

        return res.status(response.status).json(
            commons.generateOutput(response.data, response.status, response.message)
        );
    } catch (error) {
        return res.status(error.status).json(
            commons.generateOutput(null, error.status, error.message)
        );
    }
};

// Function for deleting a department
const deleteDepartment = async (req, res) => {
    try {
        const isMockEnabled = false; 
        const input = req.params;  

        const response = await deleteDepartmentService.DeleteDepartment(isMockEnabled, input);

        return res.status(response.status).json(
            commons.generateOutput(response.data, response.status, response.message)
        );
    } catch (error) {
        return res.status(error.status).json(
            commons.generateOutput(null, error.status, error.message)
        );
    }
};

// Function for reading department metrics
const readDepartmentMetrics = async (req, res) => {
    try {
        const isMockEnabled = false; 

        const response = await metricDepartmentService.ReadDepartmentMetric(isMockEnabled);

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
module.exports = { createDepartment, readDepartments, editDepartment, deleteDepartment, readDepartmentMetrics };
