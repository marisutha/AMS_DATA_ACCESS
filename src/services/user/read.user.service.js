// Importing the Prisma Client and other dependencies
const { PrismaClient } = require('@prisma/client');
const Commons = require('../../utils/commons');
const userMock = require('../../mock/user.mock.json');

const prisma = new PrismaClient();
const commons = new Commons();// Creating an instance of the Commons class for utility functions

module.exports = class ReadUserService {

    // Method to read a single user and their associated assets
    async ReadOneUser(isMockEnabled, input) {

        try {
            // Check if mock data is enabled, and if so, return mock response
            if (isMockEnabled) {
                const asserMockData = userMock.ReadOneUserData;
                return commons.generateOutput(asserMockData.data, asserMockData.status, asserMockData.message);
            }
            else {
                let output = [];

                // Fetch the user by UserID
                const user = await prisma.user.findUnique({
                    where: {
                        UserID: parseInt(input.UserID)
                    }
                });

                // If user is not found, return a 404 error
                if (!user) {
                    throw commons.generateOutput(null, 404, "User not found");
                }

                // Define the fields to select for assets associated with the user
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
                            CategoryName: true
                        }
                    },
                    "Location": {
                        "select": {
                            LocationName: true
                        }
                    },
                    "User": {
                        "select": {
                            UserName: true,
                        }
                    }
                };

                // Fetch the assets associated with the user
                const assets = await prisma.asset.findMany({
                    where: {
                        UserID: user?.UserID ? user?.UserID : null,
                        IsDeleted: false
                    },
                    select: Object.keys(field).length > 0 ? field : undefined,
                });

                // Format the user data
                const formattedUser = {
                    UserID: user.UserID,
                    UserCode: user.UserCode,
                    UserName: user.UserName
                };

                // Format the asset data
                const formattedAssets = assets.map(asset => ({
                    AssetID: asset?.AssetID,
                    AssetName: asset?.AssetName,
                    AssetCode: asset?.AssetCode,
                    SerialNumber: asset?.SerialNumber,
                    Status: asset?.Status,
                    PurchaseDate: asset?.PurchaseDate,
                    Model: asset?.Model,
                    CreatedBy: asset?.CreatedBy,
                    IsDeleted: asset?.IsDeleted,
                    CategoryID: asset?.CategoryID,
                    CategoryName: asset?.Category?.CategoryName,
                    LocationID: asset?.LocationID,
                    LocationName: asset?.Location?.LocationName,
                }));

                // Push the user and asset data to the output
                output.push({
                    userData: formattedUser,
                    assetData: formattedAssets
                });

                // Return the data in the specified format
                return commons.generateOutput(output, 200, "User retrieved successfully");
            }
        }
        catch (error) {
            // Handle any errors and return the error message
            throw commons.generateOutput(error.data || null, error.status || 500, error.message);
        }
    }

    // Method to read multiple users with pagination and filtering
    async ReadUser(isMockEnabled, input) {

        try {
            let output = [];

            // Check if mock data is enabled, and if so, return mock response
            if (isMockEnabled) {
                const userMockData = userMock.ReadUserData;
                return commons.generateOutput(userMockData.data, userMockData.status, userMockData.message);
            }
            else {

                const { filter, fields, page, limit, sort } = input;

                // Check if any required fields are missing, return error if so
                if (filter === undefined || fields === undefined || page === undefined || limit === undefined || sort === undefined) {
                    throw commons.generateOutput(null, 422, "Missing required fields : filter, fields, page, limit, or sort");
                }

                // Define the fields to select for the user data
                const field = {
                    UserID: true,
                    UserName: true,
                    UserCode: true,
                    Status: true,
                    JoiningDate: true,
                    RelievedDate: true,
                    CreatedBy: true,
                    IsDeleted: true,
                    DepartmentID: true,
                    LocationID: true,
                    "Department": {
                        "select": {
                            DepartmentName: true
                        }
                    },
                    "Location": {
                        "select": {
                            LocationName: true
                        }
                    }
                };

                // Construct the query for the Prisma client
                const prismaQuery = {
                    where: {
                        ...filter,
                        UserName: filter.UserName ? { contains: filter.UserName, mode: "insensitive" } : undefined
                    },
                    take: limit,
                    skip: page * limit,
                    orderBy: Object.keys(sort).length
                        ? Object.entries(sort).map(([key, value]) => ({ [key]: value }))
                        : undefined,
                    select: Object.keys(field).length > 0 ? field : undefined,
                };

                // Fetch the users based on the query
                const users = await prisma.user.findMany(prismaQuery);

                // Format each user data
                for (let userData of users) {
                    const formatData = {
                        UserID: userData?.UserID,
                        UserName: userData?.UserName,
                        UserCode: userData?.UserCode,
                        Status: userData?.Status,
                        JoiningDate: userData?.JoiningDate,
                        RelievedDate: userData?.RelievedDate,
                        CreatedBy: userData?.CreatedBy,
                        IsDeleted: userData?.IsDeleted,
                        DepartmentID: userData?.DepartmentID,
                        DepartmentName: userData?.Department?.DepartmentName,
                        LocationID: userData?.LocationID,
                        LocationName: userData?.Location?.LocationName
                    };
                    output.push(formatData);
                }

                // Return the formatted user data
                return commons.generateOutput(output, 200, "Users retrieved successfully");
            }
        }
        catch (error) {
            // Handle any errors and return the error message
            throw commons.generateOutput(error.data || null, error.status || 500, error.message);
        }
    }
};
