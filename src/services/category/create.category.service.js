// Importing the Prisma Client and other dependencies
const { PrismaClient } = require('@prisma/client'); 
const Commons = require('../../utils/commons');  
const categoryMock = require('../../mock/category.mock.json'); 

const prisma = new PrismaClient();  
const commons = new Commons();  // Create an instance of the Commons class to access utility functions

module.exports = class CreateCategoryService {

    // Method to create a new category
    async CreateCategory(isMockEnabled, input) {

        try {
            // If mock data is enabled, return the mock category creation data
            if (isMockEnabled) {
                const createCategoryData = categoryMock.CreateCategoryData;  
                return commons.generateOutput(createCategoryData.data, createCategoryData.status, createCategoryData.message); 
            }
            else {

                // Destructure the input to retrieve CategoryName and CreatedBy
                const { CategoryName, CreatedBy } = input.data;

                // Check if the required fields (CategoryName and CreatedBy) are provided in the input
                if (!CategoryName || !CreatedBy) {
                    throw commons.generateOutput(null, 422, "Missing required fields"); 
                }

                // Check if a category with the same CategoryName and CategoryCode already exists
                const existingCategory = await prisma.category.findMany({
                    where: {
                        CategoryName: input.data.CategoryName,  // Check if CategoryName is provided and matches
                        CategoryCode: input.data.CategoryCode  // Check if CategoryCode is provided and matches
                    }
                });

                // If a category with the same name and code already exists, return a conflict error
                if (existingCategory.length > 0) {
                    throw commons.generateOutput(null, 409, "CategoryName already exists.");  
                }

                // If no conflict, proceed to create the new category
                const createdCategory = await prisma.category.create({
                    data: input.data,  // Create the category with the provided data
                });

                // Return the created category along with a success message
                return commons.generateOutput(createdCategory, 200, "Category has been created successfully");
            }
        }
        catch (error) {
            // If any error occurs, catch it and return a standardized error response
            throw commons.generateOutput(error.data || null, error.status || 500, error.message);
        }
    }
};
