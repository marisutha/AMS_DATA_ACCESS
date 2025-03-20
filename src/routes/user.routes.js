// Importing necessary libraries and modules
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const EndPoint = require('../utils/endpoint');

// Creating objects of the utility classes
const endpoint = new EndPoint()

// Defining routes for user operations
router.post(endpoint?.USER_CREATE, userController.createUser);
router.get(endpoint?.USER_READ_ONE, userController.readOneUser);
router.post(endpoint?.USER_READ_ALL, userController.readUsers);
router.patch(endpoint?.USER_EDIT, userController.editUser);
router.delete(endpoint?.USER_DELETE, userController.deleteUser);
router.get(endpoint?.USER_METRIC, userController.readUserMetrics);

// Exporting the router to be used in the app
module.exports = router;
