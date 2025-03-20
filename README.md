# Project Name 
Asset Management System 

# Layer Name
Backend

# Application Version
1.0.0

# Tools

    1.Node js
    2.Microsoft Visual Studio Code 
    3.PgAdmin 
    4.PostgreSQL Server
    5.Postman 

# Description

    * The Backend Layer of the Asset Management System is a Node.js application built with Express and Prisma. 
    * It serves as the intermediary between the frontend and the PostgreSQL database, handling requests and returning appropriate responses. 
    * This layer provides the functionality for the frontend to interact with the database using RESTful API endpoints.

# schema (schema.prisma)

    * The schema.prisma file defines the structure of the database tables. 
    * Prisma connects to the PostgreSQL database using the credentials specified in the .env file. 
    * In this file, we define the models (tables) and their fields that map to the actual database schema.

# Tables 

    Category         : Stores information about asset categories.
    Location         : Stores details about asset and user locations.
    Department       : Stores details about user department.
    Asset            : Stores details about the assets.
    User             : Stores information about users who interact with the system.
    AssetMaintenance : Stores records of maintenance activities for the assets.

# env

    * The .env file contains environment variables, including the database connection string. 
    * This file connects the backend to the PostgreSQL database. Here's a sample connection string:

    DATABASE_URL = "postgresql://username:password@server:port/DatabaseName"

# server (server.js)

    * The server.js file is the entry point of the backend application. 
    * It initializes the server and defines the port on which the application will run. 
    * This is where the application begins listening for incoming API requests.

# Basic need (app.js)

    * The app.js file contains the configuration for API security (using Basic Auth) and the routing for all API endpoints. 
    * It uses Express to define and manage the different routes and HTTP methods for CRUD operations.

# mock

    * The following mock data files are included for testing and development purposes:

    asset.mock       : Contains mock data for assets.
    category.mock    : Contains mock data for categories.
    department.mock  : Contains mock data for departments.
    location.mock    : Contains mock data for locations.
    maintenance.mock : Contains mock data for maintenance records.
    user.mock        : Contains mock data for users.


# routers (src/routers)

    * This directory contains the routing logic for the application. 
    * It defines all HTTP methods and the corresponding API endpoints. 
    * Each route maps to a controller that handles the request.

# controllers (src/controllers)

    * Controllers manage incoming API requests and generate the appropriate response. 
    * Each controller corresponds to a specific resource (asset, category, etc.) and processes requests related to that resource.

# services (src/services)

    * The services directory contains the core logic for CRUD operations. 
    * It interacts with the database via Prisma to perform operations such as creating, reading, updating, and deleting resources.

# API Endpoint (src/utils/endpoints.js)

    * The endpoints.js file contains constants defining the API endpoints used in the backend. 
    * These endpoints correspond to the routes defined in the routers directory.

# Common File

    * The common response format is provided in a common file, ensuring consistency in the structure of the API responses throughout the application.

# How to Run

    1.Ensure the Database is up and connected:
        
        * Make sure that your PostgreSQL database is running and accessible using the credentials specified in the .env file.

    2.Run the Backend:
        
        * Clone or download the project repository from your version control system or as a ZIP file.

    3.Install Required Dependencies:
        
        * Open Command Prompt or Terminal, and navigate to the folder containing the project files. 
        * Run the following command to install the necessary dependencies:

          npm install

    4. Define the Database Connection:

        * Ensure that the PostgreSQL database is configured and connected using the credentials from the .env file.
        * Next, run the following commands to generate the Prisma client and push the schema to the database:

          npx prisma generate
          npx prisma db push

    4.Start the Backend Server:

        * Once the installation is complete, you can start the backend server by running:

          npm start

# Dependencies

    * For the Backend to run properly, ensure that the PostgreSQL database is up and running. 
    * The application relies on this connection to perform CRUD operations.

    Backend Layer --> Database
