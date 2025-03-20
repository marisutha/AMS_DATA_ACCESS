// Importing the Prisma Client and other dependencies
const { PrismaClient } = require('@prisma/client');
const Commons = require('../../utils/commons');
const assetmaintenanceMock = require('../../mock/maintanance.mock.json');

const prisma = new PrismaClient();
const commons = new Commons();// Create an instance of the Commons class for utility functions

module.exports = class DeleteAssetMaintenanceService {
    // Method to delete asset maintenance
    async DeleteAssetMaintenance(isMockEnabled, input) {

        try {
            // Check if mock data is enabled, and if so, return mock response
            if (isMockEnabled) {
                const deleteAssetMaintenanceData = assetmaintenanceMock.RemoveAssetMaintenanceData;
                return commons.generateOutput(deleteAssetMaintenanceData.data, deleteAssetMaintenanceData.status, deleteAssetMaintenanceData.message);
            }

            // Check if the asset maintenance record exists and is not deleted
            const existingAssetMaintenance = await prisma.assetMaintenance.findFirst({
                where: {
                    MaintenanceID: parseInt(input.MaintenanceID),
                    IsDeleted: false
                }
            });

            // If the asset maintenance record doesn't exist, throw an error
            if (!existingAssetMaintenance) {
                throw commons.generateOutput(null, 404, "AssetMaintenance not found with the given filter");
            }

            // Mark the asset maintenance record as deleted
            const updatedAssetMaintenance = await prisma.assetMaintenance.update({
                where: {
                    MaintenanceID: parseInt(input.MaintenanceID)
                },
                data: { IsDeleted: true },
            });

            // Return success response
            return commons.generateOutput(updatedAssetMaintenance, 200, "AssetMaintenance marked as deleted successfully");
        } catch (error) {
            // Handle any errors and return the error message
            throw commons.generateOutput(error.data || null, error.status || 500, error.message);
        }
    }
};
