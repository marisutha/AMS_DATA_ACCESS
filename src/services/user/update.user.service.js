// Importing the Prisma Client and other dependencies
const { PrismaClient } = require('@prisma/client');
const Commons = require('../../utils/commons');
const userMock = require('../../mock/user.mock.json');

const prisma = new PrismaClient();
const commons = new Commons();// Creating an instance of the Commons class for utility functions

module.exports = class UpdateUserService {

    // Method to update a user based on the provided filter and fields
    async UpdateUser(isMockEnabled, input) {
        try {
            // Check if mock data is enabled, and if so, return mock response
            if (isMockEnabled) {
                const updateUserData = userMock.UpdateUserData;
                return commons.generateOutput(updateUserData.data, updateUserData.status, updateUserData.message);
            }
            else {
                // Check if the user exists based on the provided filter
                const existingUser = await prisma.user.findMany({
                    where: input.filter,
                });

                // If no user or more than one user is found, return an error
                if (existingUser.length != 1) {
                    throw commons.generateOutput(null, 404, "User not found with the given filter");
                }

                // Update the user with the provided fields
                const updatedUser = await prisma.user.updateMany({
                    where: input.filter,
                    data: input.fields
                });

                // Return the updated user data
                return commons.generateOutput(updatedUser, 200, "User updated successfully");
            }
        }
        catch (error) {
            // Handle any errors and return the error message
            throw commons.generateOutput(error.data || null, error.status || 500, error.message);
        }
    }
};
