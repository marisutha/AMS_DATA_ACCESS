// Importing the Prisma Client and other dependencies
const { PrismaClient } = require('@prisma/client'); 
const Commons = require('../../utils/commons');  
const departmentMock = require('../../mock/department.mock.json'); 

const prisma = new PrismaClient();  
const commons = new Commons();  // Create an instance of the Commons class to access utility functions

module.exports = class CreateDepartmentService {

    // Method to create a new department
    async CreateDepartment(isMockEnabled, input) {

        try {
            // If mock data is enabled, return the mock department creation data
            if (isMockEnabled) {
                const createDepartmentData = departmentMock.CreateDepartmentData;  // Fetch mock data for department creation
                return commons.generateOutput(createDepartmentData.data, createDepartmentData.status, createDepartmentData.message);  // Return mock data in standard format
            }
            else {

                // Destructure the input to get DepartmentName and CreatedBy
                const { DepartmentName, CreatedBy } = input.data;

                // Check if required fields are missing
                if (!DepartmentName || !CreatedBy) {
                    // Return an error if any required fields are missing
                    throw commons.generateOutput(null, 422, "Missing required fields");
                }

                // Check if the department already exists in the database by matching DepartmentName and DepartmentCode
                const existingDepartment = await prisma.department.findMany({
                    where: {
                        DepartmentName: input.data.DepartmentName,  // Match DepartmentName
                        DepartmentCode: input.data.DepartmentCode  // Match DepartmentCode
                    }
                });

                // If the department already exists, return a conflict error
                if (existingDepartment.length > 0) {
                    throw commons.generateOutput(null, 409, "Department Name or Department Code already exists.");  // Return conflict error if department exists
                }

                // Create a new department in the database
                const createdDepartment = await prisma.department.create({
                    data: input.data,  // Insert the new department data
                });

                // Return the created department data along with a success message
                return commons.generateOutput(createdDepartment, 200, "Department has been created successfully");
            }
        }
        catch (error) {
            // If any error occurs, catch it and return a standardized error response
            throw commons.generateOutput(error.data || null, error.status || 500, error.message);
        }
    }
};
