# Order Management Database

## Table of Contents

# Setup Development Environment

- step 1: install [Node.js](https://nodejs.org/en)
- step 2: create `02-Order-Management` directory and switch to the folder:

  ```sh
      # create directory
      mkdir 02-Order-Management
      cd   02-Order-Management
  ```

- step 3:

  - run the following command in the terminal
    ```sh
        # initialize Node.js project
        npm init -y
    ```
  - this initializes a new `Node.js` project with a `package.json` file with default configuration settings

- step 4:

  - install `mongoose` and `nodemon`
    ```sh
        npm i mongoose
        npm i -D nodemon
        npm i dotenv
    ```

- Remarks:
  - `npm i -D nodemon` is used to install `nodemon` package as a development dependency in a `Node.js` project.
  - the `D` flag is short for `--save-dev`. It tells `npm` to add the package as a development dependency in the `package.json` file.
  - **Development dependencies** are typically packages that are only needed during development and testing, not in the production environment.
  - `nodemon` is a utility that monitors for changes in your `Node.js` application and automatically restarts the server when changes are detected. It is commonly used during development to streamline the development workflow.
- step 5:
  - add the below script to `package.json` for running our project.
  - We will also use ES Modules instead of Common JS, so we’ll add the module type as well. This will also allow us to use top-level await.
    ```json
        // package.json
         "scripts": {
            "dev": "nodemon index.js"
         },
         type: "module",
    ```

## Create an `order-management` Database with a `sale_orders` Collection

- Create an `order-management` Database with a `sale_orders` Collection

  ```js
  // create an order-management Database

  import mongoose, { mongo } from "mongoose";
  import dotenv from "dotenv";
  dotenv.config(); // Load environment variables from .env file

  // connect to database
  mongoose
    .connect(
      "<connection_string>/order-management?retryWrites=true&w=majority" //TODO: insert a connection string
    )
    .then(() => {
      // create sale-order collection within the order-management DB
      return mongoose.connection.createCollection("sale_order");
    })
    .then(() =>
      console.log(
        "Connected to MongoDB, created an order-management DB with sale-order collection"
      )
    )
    .catch(() => console.log("MongoDB connection error!"));
  ```

- Remark:

  - we can also use `async`/`await` to re-write the above code:

    ```js
    // create an order-management Database with a sale_order collection

    const mongoose = require("mongoose");
    const dotenv = require("dotenv");
    dotenv.config(); // Load environment variables from .env file

    const connectionURI = ""; //TODO: insert a connection string

    const createCollections = async () => {
      try {
        await mongoose.connect(connectionURI);

        // create a collection
        await mongoose.connection.createCollection("sale_orders");

        console.log("Connected to MongoDB...");
        console.log("Created sale_orders collection!");
      } catch (error) {
        console.error("MongoDB connection error:", error);
      } finally {
        mongoose.disconnect(); // Close the connection when done
      }
    };

    // Call the function to create collections
    createCollections();
    ```

  - we can also use `createCollection` method to create multiple collections.
  - it is important to note that the `createCollection` method returns a **promise**. Therefore, we should handle the creation of multiple collections using separate promises or use `async`/`await` to ensure sequential execution.

    ```js
    // create an order-management Database with a multiple collections

    const mongoose = require("mongoose");
    const dotenv = require("dotenv");
    dotenv.config(); // Load environment variables from .env file

    const connectionURI =
      "mongodb+srv://<user_name>:<password>/order-management?retryWrites=true&w=majority"; //TODO: insert a connection string

    const createCollections = async () => {
      try {
        await mongoose.connect(connectionURI);

        // create collections sequencially
        await mongoose.connection.createCollection("sale_orders");
        await mongoose.connection.createCollection("customers");
        await mongoose.connection.createCollection("sale_order_items");

        console.log("Connected to MongoDB...");
        console.log("Created collection1!");
      } catch (error) {
        console.error("MongoDB connection error:", error);
      } finally {
        mongoose.disconnect(); // Close the connection when done
      }
    };

    // Call the function to create collections
    createCollections();
    ```

# Resources
