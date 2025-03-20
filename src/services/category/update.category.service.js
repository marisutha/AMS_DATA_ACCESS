// Importing the Prisma Client and other dependencies
const { PrismaClient } = require('@prisma/client'); 
const Commons = require('../../utils/commons');  
const categoryMock = require('../../mock/category.mock.json'); 

const prisma = new PrismaClient();  
const commons = new Commons();  // Create an instance of the Commons class to access utility functions

module.exports = class UpdateCategoryService {
    
    // Method to update an existing category based on the provided filter and fields
    async UpdateCategory(isMockEnabled, input) {
        
        try {
            // If mock data is enabled, return the mock category update data
            if (isMockEnabled) {
                const updateCategoryData = categoryMock.UpdateCategoryData;  // Fetch mock update category data
                return commons.generateOutput(updateCategoryData.data, updateCategoryData.status, updateCategoryData.message);  // Return mock data in standard format
            }
            else {
                // Search for the existing category based on the provided filter
                const existingCategory = await prisma.category.findMany({
                    where: input.filter,  // Apply the filter to search for the category
                });

                // If no category or more than one category is found, return an error
                if (existingCategory.length != 1) {
                    throw commons.generateOutput(null, 404, "Category not found with the given filter");  // Return error if category not found or multiple categories match the filter
                }

                // Update the category with the provided fields and filter
                const output = await prisma.category.updateMany({
                    where: input.filter,  // Filter to find the category to be updated
                    data: input.fields  // Fields to update
                });

                // Return the updated category data along with a success message
                return commons.generateOutput(output, 200, "Category updated successfully");
            }
        }
        catch (error) {
            // If any error occurs, catch it and return a standardized error response
            throw commons.generateOutput(error.data || null, error.status || 500, error.message);
        }
    }
};
