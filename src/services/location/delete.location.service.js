// Importing the Prisma Client and other dependencies
const { PrismaClient } = require('@prisma/client'); 
const Commons = require('../../utils/commons');  
const locationMock = require('../../mock/location.mock.json'); 

const prisma = new PrismaClient();
const commons = new Commons();  // Create an instance of the Commons class to access utility functions

module.exports = class DeleteLocationService {

    // Method to delete a location by marking it as deleted
    async DeleteLocation(isMockEnabled, input) {

        try {
            // If mock data is enabled, return mock data for testing purposes
            if (isMockEnabled) {
                const deleteLocationData = locationMock.RemoveLocationData;  // Fetch mock location removal data
                return commons.generateOutput(deleteLocationData.data, deleteLocationData.status, deleteLocationData.message);  // Return mock data
            }

            // Check if the location exists and is not already marked as deleted
            const existingLocation = await prisma.location.findFirst({
                where: {
                    LocationID: parseInt(input.LocationID),  // Parse the LocationID to integer
                    IsDeleted: false  // Check if the location is not deleted
                }
            });

            // If no such location is found, return an error
            if (!existingLocation) {
                throw commons.generateOutput(null, 404, "Location not found with the given filter");  // Return an error if location is not found
            }

            // Mark the location as deleted (set IsDeleted to true)
            const output = await prisma.location.update({
                where: {
                    LocationID: parseInt(input.LocationID)  // Ensure the correct location is targeted
                },
                data: { IsDeleted: true },  // Set IsDeleted to true to mark it as deleted
            });

            // Return success message along with the updated location
            return commons.generateOutput(output, 200, "Location marked as deleted successfully");

        } catch (error) {
            // If an error occurs, return a standardized error response
            throw commons.generateOutput(error.data || null, error.status || 500, error.message);  // Return error data with appropriate status and message
        }
    }
};
