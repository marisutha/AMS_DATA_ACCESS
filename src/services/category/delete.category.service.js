// Importing the Prisma Client and other dependencies
const { PrismaClient } = require('@prisma/client'); 
const Commons = require('../../utils/commons');  
const categoryMock = require('../../mock/category.mock.json'); 

const prisma = new PrismaClient();  
const commons = new Commons();  // Create an instance of the Commons class to access utility functions

module.exports = class DeleteCategoryService {

    // Method to delete (mark as deleted) a category based on CategoryID
    async DeleteCategory(isMockEnabled, input) {

        try {

            // If mock data is enabled, return the mock category deletion data
            if (isMockEnabled) {
                const deleteCategoryData = categoryMock.RemoveCategoryData;  // Fetch mock delete category data
                return commons.generateOutput(deleteCategoryData.data, deleteCategoryData.status, deleteCategoryData.message);  // Return mock data in standard format
            }

            // Find the existing category by CategoryID and ensure it's not already marked as deleted
            const existingCategory = await prisma.category.findFirst({
                where: {
                    CategoryID: parseInt(input.CategoryID),  // Parse the CategoryID from input to integer
                    IsDeleted: false  // Check that the category isn't already marked as deleted
                }
            });
            
            // If no category is found or it has already been deleted, throw a 404 error
            if (!existingCategory) {
                throw commons.generateOutput(null, 404, "Category not found with the given filter");  // Return error if category doesn't exist or is already deleted
            }

            // Mark the category as deleted (soft delete) by updating the IsDeleted field to true
            const output = await prisma.category.update({
                where: {
                    CategoryID: parseInt(input.CategoryID)  // Match the category by CategoryID
                },
                data: { IsDeleted: true },  // Update the IsDeleted field to true
            });

            // Return the success message after marking the category as deleted
            return commons.generateOutput(output, 200, "Category marked as deleted successfully");
        } 
        catch (error) {
            // If any error occurs, catch it and return a standardized error response
            throw commons.generateOutput(error.data || null, error.status || 500, error.message);
        }
    }
};
