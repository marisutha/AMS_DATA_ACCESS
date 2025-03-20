// Importing the Prisma Client and other dependencies
const { PrismaClient } = require('@prisma/client');
const Commons = require('../../utils/commons');  
const assetMock = require('../../mock/asset.mock.json'); 

const prisma = new PrismaClient();  
const commons = new Commons();  // Utility instance to handle common tasks like generating output

// Creating the CreateAssetService class
module.exports = class CreateAssetService {

    // Main function for creating an asset
    async CreateAsset(isMockEnabled, input) {        

        try {
            // If mock data is enabled, return mock data
            if (isMockEnabled) {
                const createAssetData = assetMock.CreateAssetData;  
                return commons.generateOutput(createAssetData.data, createAssetData.status, createAssetData.message);
            }
            else {
                // Extracting necessary fields from the input
                const { AssetCode, SerialNumber, CategoryID, LocationID, AssetName, UserID } = input.data;

                // Check if required fields are missing
                if (!AssetCode || !SerialNumber || !CategoryID || !LocationID || !AssetName) {
                    throw commons.generateOutput(null, 422, "Missing required fields");
                }

                // If UserID is provided, verify that the user exists in the database
                if (input.data.UserID) {
                    let user = await prisma.user.findUnique({
                        where: {
                            UserID: input.data.UserID  // Search for the user in the database by ID
                        }
                    });
                    
                    // If user does not exist, throw an error
                    if (!user) {
                        throw commons.generateOutput(null, 404, `User with ID ${input.data.UserID} does not exist`);
                    }
                }

                // Check if an asset with the same AssetCode or SerialNumber already exists
                const existingAsset = await prisma.asset.findMany({
                    where: {
                        OR: [
                            { AssetCode: input.data.AssetCode },  // Check if the AssetCode already exists
                            { SerialNumber: input.data.SerialNumber }  // Check if the SerialNumber already exists
                        ]
                    }
                });

                // If any duplicate asset exists, throw a conflict error
                if (existingAsset.length > 0) {
                    throw commons.generateOutput(null, 409, "AssetCode or SerialNumber already exists.");
                }
                
                // Create the new asset in the database
                const createdAsset = await prisma.asset.create({
                    data: input.data,  // Insert the asset data
                });
             

                // Return success response with the created asset data
                return commons.generateOutput(createdAsset, 200, "Asset has been created successfully");
            }
        }
        catch (error) {
            // Handle any errors by generating an error response
            throw commons.generateOutput(error.data || null, error.status || 500, error.message);
        }
    }
};
