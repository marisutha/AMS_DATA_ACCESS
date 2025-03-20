// Importing the Prisma Client and other dependencies
const { PrismaClient } = require('@prisma/client'); 
const Commons = require('../../utils/commons');  
const departmentMock = require('../../mock/department.mock.json'); 

const prisma = new PrismaClient(); 
const commons = new Commons();  // Create an instance of the Commons class to access utility functions

module.exports = class UpdateDepartmentService {

    // Method to update a department based on provided filter and fields
    async UpdateDepartment(isMockEnabled, input) {

        try {
            // If mock data is enabled, return mock data for testing purposes
            if (isMockEnabled) {
                const updateDepartmentData = departmentMock.UpdateDepartmentData;  // Fetch mock update data
                return commons.generateOutput(updateDepartmentData.data, updateDepartmentData.status, updateDepartmentData.message);  // Return the mock data
            }
            else {

                // Fetch the existing department based on the filter provided
                const existingDepartment = await prisma.department.findMany({
                    where: input.filter,  // Apply the filter to search for the department
                });

                // If no department or more than one department is found, throw an error
                if (existingDepartment.length != 1) {
                    throw commons.generateOutput(null, 404, "Department not found with the given filter");  // Return an error if no department is found
                }

                // Update the department with the new fields provided
                const output = await prisma.department.updateMany({
                    where: input.filter,  // Find the department based on the filter
                    data: input.fields  // Update the department with the fields provided
                });

                // Return the result of the update operation along with a success message
                return commons.generateOutput(output, 200, "Department updated successfully");
            }
        }
        catch (error) {
            // If an error occurs, return a standardized error response
            throw commons.generateOutput(error.data || null, error.status || 500, error.message);  // Return the error with the appropriate status and message
        }
    }
};
