// Importing the Prisma Client and other dependencies
const { PrismaClient } = require('@prisma/client');

const Commons = require('../../utils/commons');
const assetMaintenanceMock = require('../../mock/maintanance.mock.json');

const prisma = new PrismaClient();
const commons = new Commons();// Create an instance of the Commons class for utility functions

module.exports = class ReadAssetMaintenanceService {

    // Method to read the asset maintenance records
    async ReadAssetMaintenance(isMockEnabled, input) {

        try {
            let output = []

            // Check if mock data is enabled, and if so, return mock response
            if (isMockEnabled) {
                const AssetMaintenanceMockData = assetMaintenanceMock.ReadAssetMaintenanceData;
                return commons.generateOutput(AssetMaintenanceMockData.data, AssetMaintenanceMockData.status, AssetMaintenanceMockData.message);
            }
            else {

                // Destructure input parameters
                const { filter, fields, page, limit, sort } = input;

                // Validate required fields
                if (filter === undefined || fields === undefined || page === undefined || limit === undefined || sort === undefined) {
                    throw commons.generateOutput(null, 422, "Missing required fields: filter, fields, page, limit, or sort");
                }

                // Define the fields to be selected in the response
                let field = {
                    "MaintenanceID": true,
                    "AssetID": true,
                    "UserID": true,
                    "Issue": true,
                    "Status": true,
                    "StartDate": true,
                    "EndDate": true,
                    "CreatedBy": true,
                    "Description": true,
                    "IsDeleted": true,
                    "Asset": {
                        "select": {
                            "AssetCode": true,
                            "AssetName": true,
                            "Model": true
                        }
                    },
                    "User": {
                        "select": {
                            "UserName": true
                        }
                    }
                }

                let assetIDs = []

                // Filter asset by AssetCode if provided in the filter
                if(filter.AssetCode !== undefined){

                    const asset = await prisma.asset.findMany({
                        where: {
                            AssetCode: filter.AssetCode ? { contains: filter.AssetCode, mode: "insensitive" } : undefined
                        }
                    })

                    assetIDs.push(asset)
                }

                // Prepare Prisma query with pagination, sorting, and filtering
                const prismaQuery = {
                    where: {
                        IsDeleted : filter.IsDeleted,
                        AssetID: assetIDs.length ? { in: assetIDs[0]?.map((item) => item?.AssetID) } : undefined
                    },
                    take: limit,
                    skip: page * limit,
                    orderBy: Object.keys(sort).length
                        ? Object.entries(sort).map(([key, value]) => ({ [key]: value }))
                        : undefined,
                    select: Object.keys(field).length > 0 ? field : undefined,
                };

                // Fetch asset maintenance records
                const AssetMaintenances = await prisma.assetMaintenance.findMany(prismaQuery);
                
                // Format the asset maintenance data
                for (let assetMaintenanceData of AssetMaintenances) {

                    const formatData = {
                        MaintenanceID: assetMaintenanceData?.MaintenanceID,
                        AssetID: assetMaintenanceData?.AssetID,
                        AssetCode: assetMaintenanceData?.Asset?.AssetCode,
                        AssetName: assetMaintenanceData?.Asset?.AssetName,
                        Model: assetMaintenanceData?.Asset?.Model,
                        UserID: assetMaintenanceData?.UserID,
                        UserName: assetMaintenanceData?.User?.UserName,
                        Issue: assetMaintenanceData?.Issue,
                        StartDate: assetMaintenanceData?.StartDate,
                        EndDate: assetMaintenanceData?.EndDate,
                        Description: assetMaintenanceData?.Description,
                        Status: assetMaintenanceData?.Status,
                        CreatedBy: assetMaintenanceData?.CreatedBy,
                        IsDeleted : assetMaintenanceData?.IsDeleted
                    }
                    output.push(formatData)
                }

                // Return the formatted data
                return commons.generateOutput(output, 200, "AssetMaintenances retrieved successfully");
            }
        }
        catch (error) {
            // Handle any errors and return the error message
            throw commons.generateOutput(error.data || null, error.status || 500, JSON.stringify(error.message));
        }
    }
};
