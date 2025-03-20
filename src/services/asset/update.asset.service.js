// Importing necessary dependencies: Prisma Client for DB interactions, Commons utility for shared functions, and mock data for testing
const { PrismaClient } = require('@prisma/client'); 
const Commons = require('../../utils/commons');  
const assetMock = require('../../mock/asset.mock.json'); 

const prisma = new PrismaClient();  
const commons = new Commons();  // Create an instance of the Commons class to access utility functions

module.exports = class UpdateAssetService {
    
    // Method to update asset data based on the input filter and fields
    async UpdateAsset(isMockEnabled, input) {
        
        try {

            // If mock data is enabled, return the mock asset update data
            if (isMockEnabled) {
                const updateAssetData = assetMock.UpdateAssetData;  // Fetch mock update data
                return commons.generateOutput(updateAssetData.data, updateAssetData.status, updateAssetData.message);  // Return mock data in standard format
            }
            else {
                // Fetch the existing asset(s) based on the provided filter
                const existingAsset = await prisma.asset.findMany({
                    where: input.filter,  // Apply the filter to find the asset(s)
                });

                // If no asset is found or more than one is found, throw an error
                if (existingAsset.length != 1) {
                    throw commons.generateOutput(null, 404, "Asset not found with the given filter");  // Return error if no asset or more than one asset is found
                }

                // If exactly one asset is found, proceed to update it
                const updatedAsset = await prisma.asset.updateMany({
                    where: input.filter,  // Apply the same filter to identify the asset to update
                    data: input.fields  // Apply the fields to update the asset
                });

                // Return the updated asset along with a success message
                return commons.generateOutput(updatedAsset, 200, "Asset updated successfully");
            }
        }
        catch (error) {
            // If any error occurs, catch it and return a standardized error response
            throw commons.generateOutput(error.data || null, error.status || 500, error.message);
        }
    }
};
