// Importing the Prisma Client and other dependencies
const { PrismaClient } = require('@prisma/client');
const Commons = require('../../utils/commons'); 
const assetMock = require('../../mock/asset.mock.json');  

const prisma = new PrismaClient();  
const commons = new Commons();  // Creating an instance of Commons to handle standard output generation

module.exports = class DeleteAssetService {
    
    // Method for deleting (marking as deleted) an asset
    async DeleteAsset(isMockEnabled, input) {

        try {
            // If mock data is enabled, return mock data instead of interacting with the database
            if (isMockEnabled) {
                const deleteAssetData = assetMock.RemoveAssetData;  
                return commons.generateOutput(deleteAssetData.data, deleteAssetData.status, deleteAssetData.message);
            }

            // Check if the asset exists and is not marked as deleted
            const existingAsset = await prisma.asset.findFirst({
                where: {
                    AssetID: parseInt(input.AssetID),  // Search for the asset using the provided AssetID
                    IsDeleted: false  // Ensure the asset is not already deleted
                }
            });

            // If the asset is not found, throw an error
            if (!existingAsset) {
                throw commons.generateOutput(null, 404, "Asset not found with the given filter");
            }

            // If the asset exists, update it and mark it as deleted
            const updatedAsset = await prisma.asset.update({
                where: {
                    AssetID: parseInt(input.AssetID)  // Find the asset using the AssetID
                },
                data: { IsDeleted: true },  // Set the IsDeleted flag to true
            });

            // Return a success response indicating that the asset was marked as deleted
            return commons.generateOutput(updatedAsset, 200, "Asset marked as deleted successfully");
        } catch (error) {
            // If there’s an error, return an error response with the appropriate message and status
            throw commons.generateOutput(error.data || null, error.status || 500, error.message || "An error occurred while deleting the asset");
        }
    }
};
