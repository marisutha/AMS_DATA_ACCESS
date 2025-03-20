// Importing the Prisma Client and other dependencies
const { PrismaClient } = require('@prisma/client'); 
const Commons = require('../../utils/commons');  
const categoryMock = require('../../mock/category.mock.json'); 

const prisma = new PrismaClient();  
const commons = new Commons();  // Create an instance of the Commons class to access utility functions

module.exports = class ReadCategoryMetricService {

    // Method to retrieve category metrics, either from mock data or the database
    async ReadCategoryMetric(isMockEnabled) {

        try {

            // If mock data is enabled, return the mock category metric data
            if (isMockEnabled) {
                const categoryMetricMockData = categoryMock.MetricCategoryData;  // Fetch mock category metric data
                return commons.generateOutput(categoryMetricMockData.data, categoryMetricMockData.status, categoryMetricMockData.message);  // Return mock data in standard format
            }
            else {

                // Fetch all categories that are not marked as deleted
                const totalCategory = await prisma.category.findMany({
                    where: { IsDeleted: false }  // Filter out deleted categories
                });

                // Prepare the metrics (total number of categories)
                const categoryMetrics = {
                    TotalCategory: totalCategory.length  // Count the total categories
                };

                // Return the calculated category metrics with a success message
                return commons.generateOutput(categoryMetrics, 200, "Category metrics retrieved successfully");
            }
        }
        catch (error) {
            // If an error occurs, catch it and return a standardized error response
            throw commons.generateOutput(error.data || null, error.status || 500, error.message);
        }
    }
};
