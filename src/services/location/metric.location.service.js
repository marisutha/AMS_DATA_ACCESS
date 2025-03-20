// Importing the Prisma Client and other dependencies
const { PrismaClient } = require('@prisma/client'); 
const Commons = require('../../utils/commons');  
const locationMock = require('../../mock/location.mock.json'); 

const prisma = new PrismaClient();
const commons = new Commons();  // Create an instance of the Commons class to access utility functions

module.exports = class ReadLocationMetricService {

    // Method to fetch location metrics (e.g., total locations)
    async ReadLocationMetric(isMockEnabled) {

        try {
            // If mock data is enabled, return mock data for testing purposes
            if (isMockEnabled) {
                const locationMetricMockData = locationMock.MetricLocationData;  // Fetch mock location metric data
                return commons.generateOutput(locationMetricMockData.data, locationMetricMockData.status, locationMetricMockData.message);  // Return mock data
            }
            else {
                // Fetch all locations that are not marked as deleted
                const totalLocation = await prisma.location.findMany({
                    where: { IsDeleted: false }  // Filter for locations that are not deleted
                });

                // Calculate the location metrics
                const locationMetrics = {
                    TotalLocation: totalLocation.length  // Count the total number of locations
                };

                // Return the calculated metrics along with a success message
                return commons.generateOutput(locationMetrics, 200, "Location metrics retrieved successfully");
            }
        }
        catch (error) {
            // If an error occurs, return a standardized error response
            throw commons.generateOutput(error.data || null, error.status || 500, error.message);  // Return error data with appropriate status and message
        }
    }
};
