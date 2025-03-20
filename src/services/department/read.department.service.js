// Importing the Prisma Client and other dependencies
const { PrismaClient } = require('@prisma/client'); 
const Commons = require('../../utils/commons');  
const departmentMock = require('../../mock/department.mock.json'); 

const prisma = new PrismaClient(); 
const commons = new Commons();  // Create an instance of the Commons class to access utility functions

module.exports = class ReadDepartmentService {

    // Method to read department data based on the input parameters
    async ReadDepartment(isMockEnabled, input) {

        try {

            let output = []

            // If mock data is enabled, return mock department data
            if (isMockEnabled) {
                const departmentMockData = departmentMock.ReadDepartmentData;  // Fetch mock data for departments
                return commons.generateOutput(departmentMockData.data, departmentMockData.status, departmentMockData.message);  // Return mock data in standard format
            }
            else {

                // Destructure the input parameters
                const { filter, fields, page, limit, sort } = input;

                // Check if any required fields are missing and throw an error if so
                if (filter === undefined || fields === undefined || page === undefined || limit === undefined || sort === undefined) {
                    throw commons.generateOutput(null, 422, "Missing required fields: filter, fields, page, limit, or sort");  // Return error for missing fields
                }

                // Define the fields to be selected in the Prisma query
                let field = {
                    DepartmentID: true,
                    DepartmentName: true,
                    DepartmentCode: true,
                    CreatedBy: true,
                    CreatedDate: true,
                    IsDeleted: true,
                    ModifiedBy: true,
                    ModifiedDate: true,
                    _count: {
                        select: {
                            User:  // Count the number of users in the department that are not deleted
                            {
                                where: {
                                    "IsDeleted": false
                                }
                            }
                        },
                    }
                }

                // Construct the Prisma query with filters, pagination, and sorting
                const prismaQuery = {
                    where: {
                        ...filter,  // Apply any filter conditions
                        DepartmentName: filter.DepartmentName ? { contains: filter.DepartmentName, mode: "insensitive" } : undefined,  // Case-insensitive search for department name
                    },
                    take: limit,  // Limit the number of records fetched
                    skip: page * limit,  // Skip the records based on the page number
                    orderBy: Object.keys(sort).length
                        ? Object.entries(sort).map(([key, value]) => ({ [key]: value }))  // Apply sorting if specified
                        : undefined,
                    select: field,  // Select the specified fields in the query
                };

                // Execute the Prisma query to fetch the departments
                const departments = await prisma.department.findMany(prismaQuery);

                // Format the data and push it to the output array
                for (let departmentData of departments) {
                    const formatData = {
                        DepartmentID: departmentData.DepartmentID,
                        DepartmentName: departmentData.DepartmentName,
                        DepartmentCode: departmentData.DepartmentCode,
                        CreatedBy: departmentData.CreatedBy,
                        CreatedDate: departmentData.CreatedDate,
                        IsDeleted: departmentData.IsDeleted,
                        ModifiedBy: departmentData.ModifiedBy,
                        ModifiedDate: departmentData.ModifiedDate,
                        User: departmentData._count.User,  // Include the count of non-deleted users in the department
                    }
                    output.push(formatData)  // Add the formatted data to the output array
                }

                // Return the formatted department data with a success message
                return commons.generateOutput(output, 200, "Department retrieved successfully");
            }
        }
        catch (error) {
            // Catch any errors and return a standardized error response
            throw commons.generateOutput(error.data || null, error.status || 500, error.message);
        }
    }
};
