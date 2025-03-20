// Importing the Prisma Client and other dependencies
const { PrismaClient } = require('@prisma/client'); 
const Commons = require('../../utils/commons');  
const locationMock = require('../../mock/location.mock.json'); 

const prisma = new PrismaClient();  
const commons = new Commons();  // Create an instance of the Commons class to access utility functions

module.exports = class CreateLocationService {

    // Method to create a new location
    async CreateLocation(isMockEnabled, input) {

        try {
            // If mock data is enabled, return mock data for testing purposes
            if (isMockEnabled) {
                const createLocationData = locationMock.CreateLocationData;  // Fetch mock location data
                return commons.generateOutput(createLocationData.data, createLocationData.status, createLocationData.message);  // Return mock data
            }
            else {
                
                // Destructure the input data to extract location fields
                const { LocationName, LocationCode, CreatedBy } = input.data;

                // Check if any required fields are missing, and throw an error if so
                if (!LocationName || !CreatedBy || !LocationCode) {
                    throw commons.generateOutput(null, 422, "Missing required fields");  // Return an error if required fields are missing
                }

                // Check if a location with the same name and code already exists
                const existingLocation = await prisma.location.findMany({
                    where: {
                        LocationName: input.data.LocationName,
                        LocationCode: input.data.LocationCode
                    }
                });

                // If the location already exists, throw a conflict error
                if (existingLocation.length > 0) {
                    throw commons.generateOutput(null, 409, "LocationName already exists.");  // Return an error if location already exists
                }

                // Create the new location in the database
                const createdLocation = await prisma.location.create({
                    data: input.data,  // Use the input data to create the location
                });

                // Return the created location along with a success message
                return commons.generateOutput(createdLocation, 200, "Location has been created successfully");
            }
        }
        catch (error) {
            // If an error occurs, return a standardized error response
            throw commons.generateOutput(error.data || null, error.status || 500, error.message);  // Return error data with appropriate status and message
        }
    }
};
