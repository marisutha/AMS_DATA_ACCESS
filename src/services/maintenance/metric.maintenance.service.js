// Importing the Prisma Client and other dependencies
const { PrismaClient } = require('@prisma/client');
const Commons = require('../../utils/commons');
const assetMaintenanceMock = require('../../mock/maintanance.mock.json');

const prisma = new PrismaClient();
const commons = new Commons();// Create an instance of the Commons class for utility functions

module.exports = class ReadMaintenanceMetricService {

    // Method to read the maintenance metrics for asset maintenance
    async ReadAssetMaintenanceMetric(isMockEnabled) {

        try {
            // Check if mock data is enabled, and if so, return mock response
            if (isMockEnabled) {
                const assetMaintenanceMetricMockData = assetMaintenanceMock.MetricMaintenanceData;
                return commons.generateOutput(assetMaintenanceMetricMockData.data, assetMaintenanceMetricMockData.status, assetMaintenanceMetricMockData.message);
            }
            else {
                // Fetch the total asset maintenance records that are not deleted
                const totalAssetMaintenance = await prisma.assetMaintenance.findMany({
                    where: { IsDeleted: false }
                });

                // Fetch the resolved asset maintenance records
                const resolvedMaintenance = await prisma.assetMaintenance.findMany({
                    where: {
                        Status: 'Closed',
                        IsDeleted: false
                    }
                });

                // Fetch the pending asset maintenance records
                const pendingMaintenance = await prisma.assetMaintenance.findMany({
                    where: {
                        Status: 'Inprogress',
                        IsDeleted: false
                    }
                });

                // Fetch the new asset maintenance records
                const newMaintenance = await prisma.assetMaintenance.findMany({
                    where: {
                        Status: 'New',
                        IsDeleted: false
                    }
                });

                // Prepare the maintenance metrics
                const maintenanceMetrics = {
                    TotalIssue: totalAssetMaintenance.length,
                    NewIssue: newMaintenance.length,
                    PendingIssue: pendingMaintenance.length,
                    ResolvedIssue: resolvedMaintenance.length
                };

                // Return the maintenance metrics
                return commons.generateOutput(maintenanceMetrics, 200, "Maintenance metrics retrieved successfully");
            }
        }
        catch (error) {
            // Handle any errors and return the error message
            throw commons.generateOutput(error.data || null, error.status || 500, error.message);
        }
    }
};
