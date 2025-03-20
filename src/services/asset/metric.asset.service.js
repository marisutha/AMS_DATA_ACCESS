// Importing the Prisma Client and other dependencies
const { PrismaClient } = require('@prisma/client'); 
const Commons = require('../../utils/commons');  
const assetMock = require('../../mock/asset.mock.json'); 

const prisma = new PrismaClient();  
const commons = new Commons();  // Creating an instance of Commons class to access utility functions

module.exports = class ReadAssetMetricService {

    // Method to fetch asset metrics
    async ReadAssetMetric(isMockEnabled) {

        try {

            // Check if mock data is enabled (useful for testing)
            if (isMockEnabled) {
                const assetMetricMockData = assetMock.MetricAssetData;  // Fetch mock asset data
                return commons.generateOutput(assetMetricMockData.data, assetMetricMockData.status, assetMetricMockData.message);
            }
            else {

                // If mock data is not enabled, fetch data from the database using Prisma

                // Fetch all assets that are not marked as deleted
                const totalAssets = await prisma.asset.findMany({
                    where: { IsDeleted: false }
                });

                // Fetch assets that are marked as 'Assigned'
                const activeAssets = await prisma.asset.findMany({
                    where: {
                        Status: 'Assigned',
                        IsDeleted: false
                    }
                });

                // Fetch assets that are marked as 'Available'
                const inactiveAssets = await prisma.asset.findMany({
                    where: {
                        Status: 'Available',
                        IsDeleted: false
                    }
                });

                // Fetch assets that are marked as 'Damaged'
                const scrapedAssets = await prisma.asset.findMany({
                    where: {
                        Status: 'Damaged',
                        IsDeleted: false
                    }
                });

                // Calculate the metrics based on the data retrieved
                const assetMetrics = {
                    totalAssets: totalAssets.length,  // Total number of assets
                    activeAssets: activeAssets.length,  // Number of active (assigned) assets
                    inactiveAssets: inactiveAssets.length,  // Number of inactive (available) assets
                    scrapedAssets: scrapedAssets.length  // Number of damaged (scrapped) assets
                };

                // Return the calculated metrics along with a success message
                return commons.generateOutput(assetMetrics, 200, "Asset metrics retrieved successfully");
            }
        }
        catch (error) {
            // Catch any error and return a standardized error response
            throw commons.generateOutput(error.data || null, error.status || 500, error.message);
        }
    }
};
