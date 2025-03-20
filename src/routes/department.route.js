// Importing necessary libraries and modules
const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/department.controller');
const EndPoint = require('../utils/endpoint');

// Creating objects of the utility classes
const endpoint = new EndPoint()

// Defining routes for department operations
router.post(endpoint?.DEPARTMENT_CREATE, departmentController.createDepartment);
router.post(endpoint?.DEPARTMENT_READ_ALL, departmentController.readDepartments);
router.patch(endpoint?.DEPARTMENT_EDIT, departmentController.editDepartment);
router.delete(endpoint?.DEPARTMENT_DELETE, departmentController.deleteDepartment);
router.get(endpoint?.DEPARTMENT_METRIC, departmentController.readDepartmentMetrics);

// Exporting the router to be used in the app
module.exports = router;

