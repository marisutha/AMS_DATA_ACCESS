// Importing necessary libraries and modules
const express = require('express');
const cors = require('cors');
const app = express();
const basicAuth = require("express-basic-auth");
const Common = require('./utils/commons');
const EndPoint = require('./utils/endpoint')

// Creating objects of the utility classes
const commons = new Common();
const endpoint = new EndPoint()

// Importing route handlers for different entities
const assetRoute = require('./routes/asset.route');
const categoryRouter = require('./routes/category.route');
const departmentRouter = require('./routes/department.route');
const locationRouter = require('./routes/location.route');
const userRouter = require('./routes/user.routes');
const maintenanceRouter = require('./routes/maintenanceRoutes');

// Using middlewares
app.use(cors());
app.use(express.json());

// Setting up Basic Authentication with a predefined username and password 
app.use(basicAuth({
  users: { "admin": "password123" },
  unauthorizedResponse: commons.generateOutput(null, 401, "Basic authentication failed, incorrect username or password")
}))

// Registering routes for different entities with their respective base URLs from the endpoint module
app.use(endpoint?.ASSET_BASE_URL, assetRoute);
app.use(endpoint?.CATEGORY_BASE_URL, categoryRouter);
app.use(endpoint?.DEPARTMENT_BASE_URL, departmentRouter);
app.use(endpoint?.LOCATION_BASE_URL, locationRouter);
app.use(endpoint?.USER_BASE_URL, userRouter);
app.use(endpoint?.MAINTENANCE_BASE_URL, maintenanceRouter);

// Global error handling middleware
app.use((err,req,res,next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Exporting the app to be used in the server setup
module.exports = app;
