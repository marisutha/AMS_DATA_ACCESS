// Importing the Prisma Client and other dependencies
const { PrismaClient } = require('@prisma/client');
const Commons = require('../../utils/commons');
const assetMaintenanceMock = require('../../mock/maintanance.mock.json');

const prisma = new PrismaClient();
const commons = new Commons();// Creating an instance of the Commons class for utility functions

module.exports = class UpdateAssetMaintenanceService {
    
    // Method to update an asset maintenance record
    async UpdateAssetMaintenance(isMockEnabled, input) {

        try {
            // Check if mock data is enabled, and if so, return mock response
            if (isMockEnabled) {
                const updateAssetMaintenanceData = assetMaintenanceMock.UpdateAssetMaintenanceData;
                return commons.generateOutput(updateAssetMaintenanceData.data, updateAssetMaintenanceData.status, updateAssetMaintenanceData.message);
            }
            else {
                // Search for the existing asset maintenance record based on the provided filter
                const existingAssetMaintenance = await prisma.assetMaintenance.findMany({
                    where: input.filter,
                });

                // If no matching record is found, throw an error
                if (existingAssetMaintenance.length != 1) {
                    throw commons.generateOutput(null, 404, "AssetMaintenance not found with the given filter");
                }
                
                // Update the asset maintenance record with the provided fields
                const updatedAssetMaintenance = await prisma.assetMaintenance.updateMany({
                    where: input.filter,
                    data: input.fields
                });

                // Return the updated asset maintenance record
                return commons.generateOutput(updatedAssetMaintenance, 200, "AssetMaintenance updated successfully");
            }
        }
        catch (error) {
            // Handle any errors and return the error message
            throw commons.generateOutput(error.data || null, error.status || 500, error.message);
        }
    }
};
