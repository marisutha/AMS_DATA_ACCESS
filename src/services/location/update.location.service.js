// Importing the Prisma Client and other dependencies
const { PrismaClient } = require('@prisma/client');
const Commons = require('../../utils/commons'); 
const locationMock = require('../../mock/location.mock.json');  

const prisma = new PrismaClient();
const commons = new Commons(); 

module.exports = class UpdateLocationService {
    
    // Method to update a location's details
    async UpdateLocation(isMockEnabled, input) {
        
        try {
            // If mock data is enabled, return mock data for testing purposes
            if (isMockEnabled) {
                const updateLocationData = locationMock.UpdateLocationData;  // Fetch mock data for location update
                return commons.generateOutput(updateLocationData.data, updateLocationData.status, updateLocationData.message);  // Return mock data
            }
            else {
                // Check if the location to be updated exists using the provided filter
                const existingLocation = await prisma.location.findMany({
                    where: input.filter,  // Apply the filter from the input
                });

                // If no matching location is found, throw an error
                if (existingLocation.length != 1) {
                    throw commons.generateOutput(null, 404, "Location not found with the given filter");  // Return 404 if location is not found
                }

                // If the location exists, proceed with the update
                const output = await prisma.location.updateMany({
                    where: input.filter,  // Apply the filter to find the location to update
                    data: input.fields  // Apply the fields to update
                });

                // Return a success message with the updated location data
                return commons.generateOutput(output, 200, "Location updated successfully");  // Return the updated data
            }
        }
        catch (error) {
            // If any error occurs during the process, return a standardized error response
            throw commons.generateOutput(error.data || null, error.status || 500, error.message);  // Return the error data with appropriate status and message
        }
    }
};
