// Importing necessary dependencies: Prisma Client for DB interactions, Commons utility for shared functions, and mock data for testing
const { PrismaClient } = require('@prisma/client'); 
const Commons = require('../../utils/commons');  
const assetMock = require('../../mock/asset.mock.json'); 

const prisma = new PrismaClient();  
const commons = new Commons();  // Create an instance of the Commons class to access utility functions

module.exports = class ReadAssetService {

    // Method to read asset data based on various input filters and settings
    async ReadAsset(isMockEnabled, input) {

        try {

            // If mock data is enabled, return the mock asset data
            if (isMockEnabled) {
                const assetMockData = assetMock.ReadAssetData;  
                return commons.generateOutput(assetMockData.data, assetMockData.status, assetMockData.message);  
            }
            else {

                // Initialize an empty array to hold the final output
                let output = []

                // Destructure the input to retrieve the filter, fields, pagination (page/limit), and sorting information
                const { filter, fields, page, limit, sort } = input;

                // Check if any required input parameters are missing
                if (filter === undefined || fields === undefined || page === undefined || limit === undefined || sort === undefined) {
                    // If missing, throw an error indicating which parameters are required
                    throw commons.generateOutput(null, 422, "Missing required fields: filter, fields, page, limit, or sort");
                }

                // Define the fields to be selected for each asset record
                const field = {
                    AssetID: true,
                    AssetName: true,
                    AssetCode: true,
                    SerialNumber: true,
                    Status: true,
                    PurchaseDate: true,
                    Model: true,
                    CreatedBy: true,
                    IsDeleted: true,
                    CategoryID: true,
                    LocationID: true,
                    UserID: true,
                    "Category": {
                        "select": {
                            CategoryName: true  // Include category name in the result
                        }
                    },
                    "Location": {
                        "select": {
                            LocationName: true  // Include location name in the result
                        }
                    }
                }

                // Build the query for Prisma with the given filters, fields, pagination, and sorting
                const prismaQuery = {
                    where: {
                        ...filter,  // Add any additional filters passed in the input
                        AssetCode: filter.AssetCode ? { contains: filter.AssetCode, mode: "insensitive" } : undefined,  // Filter by AssetCode if provided
                    },
                    select: Object.keys(field).length > 0 ? field : undefined,  // Select the defined fields
                    take: limit,  // Limit the results based on pagination
                    skip: page * limit,  // Skip records based on the page number
                    orderBy: Object.keys(sort).length
                        ? Object.entries(sort).map(([key, value]) => ({ [key]: value }))  // Sort the results based on the provided sort parameters
                        : undefined
                };

                // Execute the Prisma query to fetch asset data
                const assets = await prisma.asset.findMany(prismaQuery);

                // Loop through the assets to format the data as per the desired structure
                for (let assetData of assets) {
                    const formatData = {
                        AssetID: assetData?.AssetID,
                        AssetName: assetData?.AssetName,
                        AssetCode: assetData?.AssetCode,
                        SerialNumber: assetData?.SerialNumber,
                        Status: assetData?.Status,
                        PurchaseDate: assetData?.PurchaseDate,
                        Model: assetData?.Model,
                        CreatedBy: assetData?.CreatedBy,
                        IsDeleted: assetData?.IsDeleted,
                        CategoryID: assetData?.CategoryID,
                        CategoryName: assetData?.Category?.CategoryName,
                        LocationID: assetData?.LocationID,
                        LocationName: assetData?.Location?.LocationName,
                        UserID: assetData?.UserID,
                    }
                    output.push(formatData)  // Push the formatted data to the output array
                }

                // Return the formatted output with a success message
                return commons.generateOutput(output, 200, "Assets retrieved successfully");
            }
        }
        catch (error) {
            // If any error occurs, catch it and return a standardized error response
            throw commons.generateOutput(error.data || null, error.status || 500, error.message);
        }
    }
};
