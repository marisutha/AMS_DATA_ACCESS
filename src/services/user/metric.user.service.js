// Importing the Prisma Client and other dependencies
const { PrismaClient } = require('@prisma/client');
const Commons = require('../../utils/commons');
const userMetricMock = require('../../mock/user.mock.json');

const prisma = new PrismaClient();
const commons = new Commons();// Creating an instance of the Commons class for utility functions

module.exports = class ReadUserMetricService {

    // Method to read user metrics
    async ReadUserMetric(isMockEnabled) {

        try {
            // Check if mock data is enabled, and if so, return mock response
            if (isMockEnabled) {
                const userMetricMockData = userMetricMock.ReadUserMetric;
                return commons.generateOutput(userMetricMockData.data, userMetricMockData.status, userMetricMockData.message);
            }
            else {
                // Retrieve the total number of users
                const totalUser = await prisma.user.findMany({
                    where: { IsDeleted: false }
                });

                // Retrieve the number of active users
                const activeUser = await prisma.user.findMany({
                    where: {
                        Status: 'Active',
                        IsDeleted: false
                    }
                });

                // Retrieve the number of inactive users
                const inactiveUser = await prisma.user.findMany({
                    where: {
                        Status: 'InActive',
                        IsDeleted: false
                    }
                });

                // Aggregate the user metrics
                const userMetrics = {
                    TotalUser: totalUser.length,
                    ActiveUser: activeUser.length,
                    InactiveUser: inactiveUser.length,
                };

                // Return the aggregated metrics with a success message
                return commons.generateOutput(userMetrics, 200, "User metrics retrieved successfully");
            }
        }
        catch (error) {
            // Handle any errors and return the error message
            throw commons.generateOutput(error.data || null, error.status || 500, error.message);
        }
    }
};
