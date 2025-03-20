// Importing the Prisma Client and other dependencies
const { PrismaClient } = require('@prisma/client'); 
const Commons = require('../../utils/commons');  
const locationMock = require('../../mock/location.mock.json'); 

const prisma = new PrismaClient();
const commons = new Commons();  // Create an instance of the Commons class for utility functions

module.exports = class ReadLocationService {

    // Method to fetch location data based on provided filters and pagination
    async ReadLocation(isMockEnabled, input) {

        try {
            // If mock data is enabled, return mock data for testing purposes
            if (isMockEnabled) {
                const locationMockData = locationMock.ReadLocationData;  // Fetch mock location data
                return commons.generateOutput(locationMockData.data, locationMockData.status, locationMockData.message);  // Return mock data
            }
            else {

                let output = []  // Initialize an empty array to store the final result

                // Destructure input parameters (filter, fields, page, limit, sort)
                const { filter, fields, page, limit, sort } = input;

                // Check if any of the required parameters are missing
                if (filter === undefined || fields === undefined || page === undefined || limit === undefined || sort === undefined) {
                    throw commons.generateOutput(null, 422, "Missing required fields: filter, fields, page, limit, or sort");  // Throw error if any field is missing
                }

                // Define the fields to be selected from the location table
                let field = {
                    LocationID: true,
                    LocationName: true,
                    LocationCode: true,
                    CreatedBy: true,
                    CreatedDate: true,
                    IsDeleted: true,
                    ModifiedBy: true,
                    ModifiedDate: true,
                    _count: {  // Include a count of related Asset and User records
                        select: {
                            Asset: {
                                where: { "IsDeleted": false }  // Count only non-deleted assets
                            },
                            User: {
                                where: { "IsDeleted": false }  // Count only non-deleted users
                            }
                        },
                    }
                }

                // Prepare the Prisma query with filtering, pagination, and sorting
                const prismaQuery = {
                    where: {
                        ...filter,  // Apply any additional filters
                        LocationName: filter.LocationName ? { contains: filter.LocationName, mode: "insensitive" } : undefined,  // Filter by location name if provided
                    },
                    take: limit,  // Limit the number of results returned
                    skip: page * limit,  // Apply pagination (skip items based on the current page)
                    orderBy: Object.keys(sort).length
                        ? Object.entries(sort).map(([key, value]) => ({ [key]: value }))  // Apply sorting based on input
                        : undefined,
                    select: field,  // Select only the specified fields
                };

                // Fetch the locations from the database based on the constructed query
                const locations = await prisma.location.findMany(prismaQuery)

                // Format each location's data before returning it
                for (let locationData of locations) {
                    const formatData = {
                        LocationID: locationData.LocationID,
                        LocationName: locationData.LocationName,
                        LocationCode: locationData.LocationCode,
                        CreatedBy: locationData.CreatedBy,
                        CreatedDate: locationData.CreatedDate,
                        IsDeleted: locationData.IsDeleted,
                        ModifiedBy: locationData.ModifiedBy,
                        ModifiedDate: locationData.ModifiedDate,
                        User: locationData._count.User,  // Include the count of related users
                        Asset: locationData._count.Asset,  // Include the count of related assets
                    }
                    output.push(formatData)  // Add the formatted data to the output array
                }

                // Return the formatted location data along with a success message
                return commons.generateOutput(output, 200, "Location retrieved successfully");
            }
        }
        catch (error) {
            // If an error occurs, return a standardized error response
            throw commons.generateOutput(error.data || null, error.status || 500, error.message);  // Return error data with appropriate status and message
        }
    }
};
