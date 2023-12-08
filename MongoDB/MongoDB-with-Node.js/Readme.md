# MongoDB with `Node.js`

## Table of Contents

- [Description](#Description)
- [Further Reading]()
  1. [official documentation website - mongoosejs.com](https://mongoosejs.com/)
  2. [official documentation - mongodb](https://www.mongodb.com/)
  3. [download - node.js](https://nodejs.org/en/)
  4. [mongoose.docs - connections](https://mongoosejs.com/docs/connections.html)

# Description

- How to use **MongoDB** database in `Node.js` using **Mongoose** library

# Introduction to Mongoose

- **Mongoose** is an **Object Data Modelling** (ODM) for **MongoDB** in `Node.js` i.e., wrapper around **MongoDB**
- With **Mongoose** we do not need to wait to get **MongoDB** connected. **Mongoose** will queue up all the command you make and only make those command after it connect to mongoDB
- It manages relationships between data, provides schema validation, and is used to translate between objects in code and the representation of those objects in **MongoDB**.
- **Mongoose** is good for:
  - **Mongoose** is primarily useful when you want to interact with structured data in **MongoDB**.
  - It allows you to define a schema for your data, so that you can interact with your MongoDB data in a structured and repeatable way.

# 3 Basic Concepts in Mongoose

## Concept 1: schema

- **schema** defines what the data structure looks like
- **schema** definition can be as simple as the following:
  ```js
  // sample schema definition
  var userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    age: Number,
    created_at: Date,
    location: [
      {
        country: String,
        city: String,
      },
    ],
  });
  ```
- with **schemas**, we define each field and its **data type**. Permitted types include:
  1. `String`
  2. `Number`
  3. `Date`
  4. `Buffer`
  5. `Boolean`
  6. `Mixed`
  7. `ObjectId`
  8. `Array`
  9. `Decimal128`
  10. `Map`
- a document in **MongoDB** created from this schema would look like this:

  ```json
    // sample documents
    "__v" : 0,
    "_id" : ObjectId("51412597e8e6d3e35c000001"),
    "created_at" : ISODate("2023-11-17T08:29:19.866Z"),
    "first_name" : "Rodgers",
    "last_name " : "Nyangweso"
  ```

- **schema validation**
  - we can set some required fields in the schema as follows:
    ```js
    const userSchema = new Schema({
      title: {
        type: String,
        required: false,
      },
      slug: {
        type: String,
        required: false,
        lowercase: true,
      },
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        requested: true,
      },
      createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true,
      },
      updatedAt: Date,
      email: {
        type: String,
        minLength: 10,
        required: false,
        lowercase: true,
      },
    });
    ```

## Concept 2: Model

- **model** is the actual form of a **schema**.
- A **model** is a class with which we construct documents i.e., takes a **schema** and apply it to each **document** in its **collection**.
- **models** are responsible for all document interactions like **creating**, **reading**, **updating**, and **deleting** (CRUD)
- Example:
  - create a `User` model
    ```js
    // creating a model
    const User = mongoose.model("User", userSchema);
    ```

# Installation and Setup

- Step 1: install [Node.js](https://nodejs.org/en) and [mongodb](https://www.mongodb.com/try)
- Step 2: Install **mongoose** using `npm`
  ```sh
    # install mongoose
    npm install mongoose
  ```
- Step 3: import mongoose

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
  // import a model
  import Users from "./model/Users_v2.js";

  mongoose.connect(
    "mongodb+srv://<username>:<password>@test-cluster.uo4jsy5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  );

  // check and Test Connection
  const db = mongoose.connection;
  db.on("error", (error) => console.error("Connection error:", error));
  db.once("open", () => console.log("Connected to MongoDB Atlas"));
  ```

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

# Creating a Schema and Model

- before connecting to the database, we first need to create a **schema** and **model**
- Ideally, you would create a schema/model file for each **schema** that is needed.
- so, we create a new folder/file structure: `model/Users_v2.js`
  ````js
    const userSchema = new Schema({
      title: {
        type: String,
        required: false,
      },
      slug: {
        type: String,
        required: false,
        lowercase: true,
      },
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        requested: true,
      },
      createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true,
      },
      updatedAt: Date,
      email: {
        type: String,
        minLength: 10,
        required: false,
        lowercase: true,
      },
    });
    ```
  ````

# Other Useful methods

1. `exists()`:

   - returns either `null` or the `ObjectId` of a document that matches the provided query.

     ```js
     // other useful methods
     // exists()
     const findUser = await User.exists({ slug: "Rodgy" });

     console.log(findUser);
     ```

2. `where()`:

   - allows us to chain and build queries

     ```js
     // where() method
     // instead of using a standard find method
     const userFind = await User.findOne({ slug: "Rodgy" });

     // use the equivalent where() method
     const userWhere = await User.where("slug").equals("Rodgy");

     console.log(userWhere);
     ```

3. `select()`

   - To include projection when using the `where()` method, chain the `select()` method after your query.

     ```js
     // use the equivalent where() method
     const userWhere = await User.where("slug")
       .equals("Rodgy")
       .select("firstName, createdAt");

     console.log(userWhere);
     ```

# Multiple schemas

- how multiple schemas can be used together

# Middleware

- In **Mongoose**, **middleware** are functions that run before and/or during the execution of asynchronous functions at the schema level.
- Examples:
  - let's updated the `updatedAt` date, everytime a **document** is saved or updated.
  - we add this to our models
    ```js
    //
    ```
