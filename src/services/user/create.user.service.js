// Importing the Prisma Client and other dependencies
const { PrismaClient } = require('@prisma/client');
const Commons = require('../../utils/commons');
const userMock = require('../../mock/user.mock.json');

const prisma = new PrismaClient();
const commons = new Commons();// Creating an instance of the Commons class for utility functions

module.exports = class CreateUserService {

    // Method to create a new user
    async CreateUser(isMockEnabled, input) {
        
        try {
            // Check if mock data is enabled, and if so, return mock response
            if (isMockEnabled) {
                const createUserData = userMock.CreateUserData;
                return commons.generateOutput(createUserData.data, createUserData.status, createUserData.message);
            }
            else {
                // Destructure the required fields from the input data
                const { UserName, UserCode, LocationID, DepartmentID, Status, CreatedBy, JoiningDate } = input.data;

                // Check for missing required fields
                if (!UserName || !LocationID || !DepartmentID || !Status || !CreatedBy || !UserCode || !JoiningDate) {
                    throw commons.generateOutput(null, 422, "Missing required fields");
                }
                
                // Check if the UserName or UserCode already exists in the database
                const existingUser = await prisma.user.findMany({
                    where: {
                        OR: [
                            { UserName: input.data.UserName },
                            { UserCode: input.data.UserCode }
                        ]
                    }
                });

                // If the user already exists, throw a conflict error
                if (existingUser.length > 0) {
                    throw commons.generateOutput(null, 409, "UserCode or UserName already exists.");
                }

                // Create the new user in the database
                const createdUser = await prisma.user.create({
                    data: input.data,
                });

                // Return the created user details
                return commons.generateOutput(createdUser, 200, "User has been created successfully");
            }
        }
        catch (error) {
            // Handle any errors and return the error message
            throw commons.generateOutput(error.data || null, error.status || 500, error.message);
        }
    }
};
