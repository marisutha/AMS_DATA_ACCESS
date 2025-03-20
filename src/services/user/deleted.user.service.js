// Importing the Prisma Client and other dependencies
const { PrismaClient } = require('@prisma/client');
const Commons = require('../../utils/commons');
const userMock = require('../../mock/user.mock.json');

const prisma = new PrismaClient();
const commons = new Commons();// Creating an instance of the Commons class for utility functions

module.exports = class DeleteUserService {
    // Method to delete a user
    async DeleteUser(isMockEnabled, input) {

        try {
            // Check if mock data is enabled, and if so, return mock response
            if (isMockEnabled) {
                const deleteUserData = userMock.RemoveUserData;
                return commons.generateOutput(deleteUserData.data, deleteUserData.status, deleteUserData.message);
            }

            // Look for the user with the provided UserID and check if the user is not marked as deleted
            const existingUser = await prisma.user.findFirst({
                where: {
                    UserID: parseInt(input.UserID),
                    IsDeleted: false
                }
            });

            // If no user is found, throw a 404 error
            if (!existingUser) {
                throw commons.generateOutput(null, 404, "User not found with the given filter");
            }

            // Mark the user as deleted by updating the IsDeleted field
            const updatedUser = await prisma.user.update({
                where: {
                    UserID: parseInt(input.UserID)
                },
                data: { IsDeleted: true },
            });

            // Return a success message along with the updated user details
            return commons.generateOutput(updatedUser, 200, "User marked as deleted successfully");
        } catch (error) {
            // Handle any errors and return the error message
            throw commons.generateOutput(error.data || null, error.status || 500, error.message);
        }
    }
};
