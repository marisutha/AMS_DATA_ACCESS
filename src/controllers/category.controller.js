// Importing necessary modules
const CreateCategoryService = require('../services/category/create.category.service');
const ReadCategoryService = require('../services/category/read.category.service');
const EditCategoryService = require('../services/category/update.category.service');
const DeleteCategoryService = require('../services/category/delete.category.service');
const MetricCategoryService = require('../services/category/metric.category.service');

const Common = require('../utils/commons');

// Creating objects of the services and utilities
const createCategoryService = new CreateCategoryService();  
const readCategoryService = new ReadCategoryService();      
const editCategoryService = new EditCategoryService();      
const deleteCategoryService = new DeleteCategoryService();  
const metricCategoryService = new MetricCategoryService();  

const commons = new Common();  // Utility class for common functions like generating output

// Function for creating a category
const createCategory = async (req, res) => {
    try {
        const isMockEnabled = false;  // Set mock data flag (false means live data)
        const input = req.body;  // Extract data from the request body

        // Call the createCategory service to process the category creation
        const response = await createCategoryService.CreateCategory(isMockEnabled, input);

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

// Function for reading all categories
const readCategorys = async (req, res) => {
    try {
        const isMockEnabled = false;  
        const input = req.body;  

        const response = await readCategoryService.ReadCategory(isMockEnabled, input);

        return res.status(response.status).json(
            commons.generateOutput(response.data, response.status, response.message));
    } catch (error) {
        return res.status(error.status).json(
            commons.generateOutput(null, error.status, error.message)
        );
    }
};

// Function for editing an existing category
const editCategory = async (req, res) => {
    try {
        const isMockEnabled = false;  
        const input = req.body;  

        const response = await editCategoryService.UpdateCategory(isMockEnabled, input);

        return res.status(response.status).json(
            commons.generateOutput(response.data, response.status, response.message)
        );
    } catch (error) {
        return res.status(error.status).json(
            commons.generateOutput(null, error.status, error.message)
        );
    }
};

// Function for deleting a category
const deleteCategory = async (req, res) => {
    try {
        const isMockEnabled = false;  
        const input = req.params;  

        const response = await deleteCategoryService.DeleteCategory(isMockEnabled, input);

        return res.status(response.status).json(
            commons.generateOutput(response.data, response.status, response.message)
        );
    } catch (error) {
        return res.status(error.status).json(
            commons.generateOutput(null, error.status, error.message)
        );
    }
};

// Function for reading category metrics
const readCategoryMetrics = async (req, res) => {
    try {
        const isMockEnabled = false;  

        const response = await metricCategoryService.ReadCategoryMetric(isMockEnabled);

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
module.exports = { createCategory, readCategorys, editCategory, deleteCategory, readCategoryMetrics };
