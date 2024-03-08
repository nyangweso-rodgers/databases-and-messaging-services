# MongoDB with Node.js

## Table of Contents

- [Description](#Description)

# Description

- How to use **MongoDB** database in `Node.js` using **Mongoose** library

# Installation and Setup

- Step #1: install [Node.js](https://nodejs.org/en) and [mongodb](https://www.mongodb.com/try)

- Step #2: Create a new project folder, `test/` and `cd`

  ```sh
    # Create a new project
    mkdir test
    # switch to the test directory
    cd test
  ```

- Step #3: Initialize a new Node.js Project with `package.json` file with default configuration settings

  ```sh
    # initialize a new Node.js Project
    npm init -y
  ```

- Step #4: Install `mongoose` and `nodemon` using `npm`

  ```sh
    # install mongoose
    npm i mongoose
    # install nodemon
    npm i -D nodemon
  ```

  - `nodemon` is a utility that monitors for changes in your `Node.js` application and automatically restarts the server when changes are detected. It is commonly used during development to streamline the development workflow.
  - `npm i -D nodemon` is used to install `nodemon` package as a development dependency in a `Node.js` project.
  - the `D` flag is short for `--save-dev`. It tells `npm` to add the package as a development dependency in the `package.json` file.
  - **Development dependencies** are typically packages that are only needed during development and testing, not in the production environment.

- Step #5: Modify `package.json` file for running the project.

  - add the below script to `package.json` for running our project.
  - We will also use ES Modules instead of Common JS, so we’ll add the module type as well. This will also allow us to use top-level await.
    ```json
        // package.json
         "scripts": {
            "dev": "nodemon index.js"
         },
         type: "module",
    ```

- Step #6: create an `index.js` file and import `mongoose`

  - using Node.js `require()`

    ```js
    // using Node.js `require()`
    const mongoose = require("mongoose");
    ```

  - or, using ES6 imports

    ```js
    // or, using ES6 imports
    import mongoose from "mongoose";
    ```

# Connecting to MongoDB

- create an `index.js` file and use **Mongoose** to connect to **MongoDB**

  ```js
  // index.js
  import mongoose from "mongoose";

  mongoose.connect(
    "mongodb+srv://<username>:<password>@test-cluster.uo4jsy5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  );

  // check and test Connection
  const db = mongoose.connection;
  db.on("error", (error) => console.error("Connection error:", error));
  db.once("open", () => console.log("Connected to MongoDB Atlas"));
  ```

- The connection URI specifies the MongoDB server address, the database name, and certain connection options related to retryable writes and write concern.
- General format of a MongoDB connection URI is:
  ```js
      mongodb://<username>:<password>@<host>:<port>/myFirstDatabase?retryWrites=true&w=majority
  ```
- Remarks:

  - The above URI contains various options and parameters that configure the behavior of the **MongoDB** driver when connecting to the database.

    - **Database Name** (`/myFirstDatabase`):

      - This specifies the name of the **MongoDB** database you want to connect to. In this case, the database name is "`myFirstDatabase`".
      - The `/` character separates the server address from the database name.
      - If you don't specify a **database name** in your **MongoDB connection URI**, the **MongoDB** driver will connect to the default database of the authenticated user. In **MongoDB**, the default database is often named "`admin`" for users with administrator privileges.
      - Here's an example URI without specifying a database name:
        ```js
          mongodb://username:password@host:port/?retryWrites=true&w=majority
        ```
      - In this case, the **MongoDB** driver will connect to the default database associated with the provided credentials. If the user does not have specific authentication details or privileges for a particular database, the default behavior is to connect to the "admin" database.

    - **Retryable Writes** (`retryWrites=true`):

      - `retryWrites=true` enables retryable writes.
      - This allows **MongoDB** to automatically retry certain write operations that may have been interrupted due to network issues or other transient errors. Retryable writes help ensure data consistency.

    - **Write Concern** (`w=majority`):
      - The `w=majority `parameter specifies the write concern, which determines the level of acknowledgment requested from MongoDB for write operations.
      - In this case, it is set to "`majority`," which means that the write operation is considered successful when acknowledged by a majority of replica set members. This helps ensure data durability.

- Alternatively (and for security reasons)
  - if we are adding this project to a public repo, it is best that no one can see the **MongoDB** URI since we have included our password. Hence, we can create an `.env` file in our root directory and write our URI inside it like:
  ```env
    MONGODB_URI='mongodb+srv://<username>:<password>@test-cluster.uo4jsy5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"'
  ```
  - back to `index.js` file, we replace the URI inside `mongoose.connect()` with `process.env.MONGODB_URI` to hide the sensitive information.
  - ensure, `.env` file is included in the `.gitignore` file.
  - install the package `dotnev`, [dotnev npm](https://www.npmjs.com/package/dotenv) for us to use the `.env` file in the project.
    ```sh
      # install dotnev
      npm install dotnev
    ```
  - import `dotnev` then add the following line at the top of the `index.js` file
    ```js
    // index.js
    import dotenv from "dotenv";
    dotenv.config();
    ```

# Optional Parameters for Connecting to MongoDB

1. `auth`

   - Specify credentials for authentication.
   - E.g.,

   ```js
   mongoose.connect("mongodb://username:password@localhost/your-database", {
     auth: { authSource: "admin" }, // Specify the authentication source (if not default)
   });
   ```

2. `dbName`
   - Specify the name of the database to connect to.
   - This can be useful if you want to connect to a different database than the one specified in the connection string:
     ```js
     mongoose.connect("mongodb://localhost", { dbName: "your-database" });
     ```
3. `poolSize`
   - Set the size of the connection pool.
   - The **connection pool** helps manage the number of simultaneous connections to the **MongoDB** server:
     ```js
     mongoose.connect("mongodb://localhost/your-database", { poolSize: 10 });
     ```
4. `bufferCommands`
   - Enable or disable the buffering of commands.
   - When set to `false`, **Mongoose** immediately sends write operations to **MongoDB**:
     ```js
     mongoose.connect("mongodb://localhost/your-database", {
       bufferCommands: false,
     });
     ```
5. `useCreateIndex`

   - **Mongoose** uses this option to enable the use of `createIndex() `instead of `ensureIndex()` for automatic index creation:

     ```js
     mongoose.connect("mongodb://localhost/your-database", {
       useCreateIndex: true,
     });
     ```

6. `useFindAndModify`

   - Set to `false` to disable the use of `findOneAndUpdate()`, `findOneAndDelete()`, etc. Instead, use `updateOne()`, `deleteOne()`, etc.

     ```js
     mongoose.connect("mongodb://localhost/your-database", {
       useFindAndModify: false,
     });
     ```

7. `autoIndex`

   - **Mongoose** automatically builds indexes defined in your schemas.
   - Set to `false` to disable automatic index building:

     ```js
     mongoose.connect("mongodb://localhost/your-database", {
       autoIndex: false,
     });
     ```

8. `useNewUrlParser`
9. `useUnifiedTopology`

# Resources

1. [official documentation - mongodb](https://www.mongodb.com/)
2. [download - node.js](https://nodejs.org/en/)
