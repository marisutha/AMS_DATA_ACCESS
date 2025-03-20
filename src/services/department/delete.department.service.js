// Importing the Prisma Client and other dependencies
const { PrismaClient } = require('@prisma/client'); 
const Commons = require('../../utils/commons');  
const departmentMock = require('../../mock/department.mock.json'); 

const prisma = new PrismaClient(); 
const commons = new Commons();  // Create an instance of the Commons class to access utility functions

module.exports = class DeleteDepartmentService {
    
    // Method to delete (mark as deleted) a department based on the provided input
    async DeleteDepartment(isMockEnabled, input) {

        try {

            // If mock data is enabled, return the mock department removal data
            if (isMockEnabled) {
                const deleteDepartmentData = departmentMock.RemoveDepartmentData;  // Fetch mock data for department removal
                return commons.generateOutput(deleteDepartmentData.data, deleteDepartmentData.status, deleteDepartmentData.message);  // Return mock data in standard format
            }

            // Check if the department exists and is not already marked as deleted
            const existingDepartment = await prisma.department.findFirst({
                where: {
                    DepartmentID: parseInt(input.DepartmentID),  // Search for department by ID
                    IsDeleted: false  // Ensure the department is not already deleted
                }
            });

            // If the department doesn't exist, throw an error
            if (!existingDepartment) {
                throw commons.generateOutput(null, 404, "Department not found with the given filter");  // Return error if department not found
            }

            // Mark the department as deleted (IsDeleted = true)
            const output = await prisma.department.update({
                where: {
                    DepartmentID: parseInt(input.DepartmentID)  // Find department by ID
                },
                data: { IsDeleted: true },  // Update the department's IsDeleted flag to true
            });

            // Return the result with a success message
            return commons.generateOutput(output, 200, "Department marked as deleted successfully");
        } catch (error) {
            // Catch any errors and return a standardized error response
            throw commons.generateOutput(error.data || null, error.status || 500, error.message);
        }
    }
};
