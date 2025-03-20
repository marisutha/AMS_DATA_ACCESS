// Importing necessary libraries and modules
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const EndPoint = require('../utils/endpoint');

// Creating objects of the utility classes
const endpoint = new EndPoint()

// Defining routes for category operations
router.post(endpoint?.CATEGORY_CREATE, categoryController.createCategory);
router.post(endpoint?.CATEGORY_READ_ALL, categoryController.readCategorys);
router.patch(endpoint?.CATEGORY_EDIT, categoryController.editCategory);
router.delete(endpoint?.CATEGORY_DELETE, categoryController.deleteCategory);
router.get(endpoint?.CATEGORY_METRIC, categoryController.readCategoryMetrics);

// Exporting the router to be used in the app
module.exports = router;

