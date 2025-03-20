// Importing the Prisma Client and other dependencies
const { PrismaClient } = require('@prisma/client');
const Commons = require('../../utils/commons');
const assetMaintenanceMock = require('../../mock/maintanance.mock.json');

// Create an instance of the Commons class for utility functions
const commons = new Commons();
const prisma = new PrismaClient();

module.exports = class CreateAssetMaintenanceService {

    // Method to create asset maintenance
    async CreateAssetMaintenance(isMockEnabled, input) {

        try {
            // Check if mock data is enabled, and if so, return mock response
            if (isMockEnabled) {
                const createAssetMaintenanceData = assetMaintenanceMock.CreateAssetMaintenanceData;
                return commons.generateOutput(createAssetMaintenanceData.data, createAssetMaintenanceData.status, createAssetMaintenanceData.message);
            }
            else {
                // Extract necessary fields from the input data
                const { AssetID, UserID, Issue, Status, CreatedBy, Description } = input.data;

                // Validate if required fields are provided
                if (!AssetID || !UserID || !Issue || !Status || !CreatedBy) {
                    throw commons.generateOutput(null, 422, "Missing required fields");
                }

                // Check if the AssetID, Issue, and Status combination already exists in the database
                const existingAsset = await prisma.assetMaintenance.findMany({
                    where: {
                        AND: [
                            { AssetID: input.data.AssetID },
                            { Issue: input.data.Issue },
                            { Status: input.data.Status }
                        ]
                    }
                });

                // If the combination exists, throw a conflict error
                if (existingAsset.length > 0) {
                    throw commons.generateOutput(null, 409, "AssetID, Issue & Status is already exists.");
                }

                // Validate if the asset exists and is not deleted
                const asset = await prisma.asset.findMany({
                    where: {
                        AssetID: input.data.AssetID,
                        IsDeleted: false
                    }
                });

                // If asset does not exist, throw a 404 error
                if (!asset) {
                    throw commons.generateOutput(null, 404, `Asset with ID ${AssetID} does not exist`);
                }

                // Validate if the user exists and is not deleted
                const user = await prisma.user.findMany({
                    where: {
                        UserID: input.data.UserID,
                        IsDeleted: false
                    },
                });

                // If user does not exist, throw a 404 error
                if (!user) {
                    throw commons.generateOutput(null, 404, `User with ID ${UserID} does not exist`);
                }

                // Create the new asset maintenance record
                const createdMaintenance = await prisma.assetMaintenance.create({
                    data: input.data,
                });

                // Return success response with the created asset maintenance record
                return commons.generateOutput(createdMaintenance, 200, "AssetMaintenance has been created successfully");
            }
        }
        catch (error) {
            // Handle any errors and return the error message
            throw commons.generateOutput(error.data || null, error.status || 500, error.message);
        }
    }
};
