// Importing the Prisma Client and other dependencies
const { PrismaClient } = require('@prisma/client'); 
const Commons = require('../../utils/commons');  
const departmentMock = require('../../mock/department.mock.json'); 

const prisma = new PrismaClient(); 
const commons = new Commons();  // Create an instance of the Commons class to access utility functions

module.exports = class ReadDepartmentMetricService {

    // Method to fetch department metrics (total number of departments)
    async ReadDepartmentMetric(isMockEnabled) {

        try {

            // If mock data is enabled, return the mock department metric data
            if (isMockEnabled) {
                const departmentMetricMockData = departmentMock.MetricDepartmentData;  // Fetch mock department metric data
                return commons.generateOutput(departmentMetricMockData.data, departmentMetricMockData.status, departmentMetricMockData.message);  // Return mock data in standard format
            }
            else {

                // Fetch all departments that are not marked as deleted
                const totalDepartment = await prisma.department.findMany({
                    where: { IsDeleted: false }  // Ensure only departments that are not deleted are counted
                });

                // Prepare the department metrics data
                const departmentMetrics = {
                    TotalDepartment: totalDepartment.length  // Count the total number of departments
                };

                // Return the department metrics along with a success message
                return commons.generateOutput(departmentMetrics, 200, "Department metrics retrieved successfully");
            }
        }
        catch (error) {
            // Catch any errors and return a standardized error response
            throw commons.generateOutput(error.data || null, error.status || 500, error.message);
        }
    }
};
