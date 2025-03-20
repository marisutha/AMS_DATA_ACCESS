// Importing the Prisma Client and other dependencies
const { PrismaClient } = require('@prisma/client'); 
const Commons = require('../../utils/commons');  
const categoryMock = require('../../mock/category.mock.json'); 

const prisma = new PrismaClient();  
const commons = new Commons();  // Create an instance of the Commons class to access utility functions

module.exports = class ReadCategoryService {

    // Method to read category data based on input filters and other parameters
    async ReadCategory(isMockEnabled, input) {

        try {

            let output = []  // Initialize an empty array to store the final results

            // If mock data is enabled, return the mock category data
            if (isMockEnabled) {
                const categoryMockData = categoryMock.ReadCategoryData;  // Fetch mock category data
                return commons.generateOutput(categoryMockData.data, categoryMockData.status, categoryMockData.message);  // Return mock data in standard format
            }
            else {

                // Destructure the input to get filter, fields, pagination (page/limit), and sorting information
                const { filter, fields, page, limit, sort } = input;

                // Check if any required fields are missing
                if (filter === undefined || fields === undefined || page === undefined || limit === undefined || sort === undefined) {
                    // Return an error if required fields are not provided
                    throw commons.generateOutput(null, 422, "Missing required fields: filter, fields, page, limit, or sort");
                }

                // Define the fields to be selected for each category, including asset count
                let field = {
                    CategoryID: true,
                    CategoryName: true,
                    CategoryCode: true,
                    CreatedBy: true,
                    CreatedDate: true,
                    IsDeleted: true,
                    ModifiedBy: true,
                    ModifiedDate: true,
                    _count: {
                        select: {
                            Asset: {  // Count assets that are not marked as deleted
                                where: { "IsDeleted": false }
                            }
                        },
                    }
                }

                // Build the query for Prisma with the provided filters, pagination, and sorting
                const prismaQuery = {
                    where: {
                        ...filter,  // Apply the filter to narrow down the categories
                        CategoryName: filter.CategoryName ? { contains: filter.CategoryName, mode: "insensitive" } : undefined,  // Case-insensitive filter for CategoryName
                    },
                    take: limit,  // Limit the number of results based on pagination
                    skip: page * limit,  // Skip records based on the page number
                    orderBy: Object.keys(sort).length
                        ? Object.entries(sort).map(([key, value]) => ({ [key]: value }))  // Apply sorting if provided
                        : undefined,
                    select: field  // Select the defined fields in the result
                };

                // Execute the Prisma query to fetch category data
                const categories = await prisma.category.findMany(prismaQuery);

                // Loop through each category and format the result
                for (let categoryData of categories) {
                    const formatData = {
                        CategoryID: categoryData.CategoryID,
                        CategoryName: categoryData.CategoryName,
                        CategoryCode: categoryData.CategoryCode,
                        CreatedBy: categoryData.CreatedBy,
                        CreatedDate: categoryData.CreatedDate,
                        IsDeleted: categoryData.IsDeleted,
                        ModifiedBy: categoryData.ModifiedBy,
                        ModifiedDate: categoryData.ModifiedDate,
                        Asset: categoryData._count.Asset,  // Include the count of non-deleted assets
                    }
                    output.push(formatData);  // Push the formatted data into the output array
                }

                // Return the formatted category data with a success message
                return commons.generateOutput(output, 200, "Category retrieved successfully");
            }
        }
        catch (error) {
            // If an error occurs, catch it and return a standardized error response
            throw commons.generateOutput(error.data || null, error.status || 500, error.message);
        }
    }
};
