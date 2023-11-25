# Project - Getting Started with MongoDB and Mongoose

## Table of Contents

- [Further Reading]()
  1. [dev.to - Getting Started with MongoDB & Mongoose](https://dev.to/codestackr/getting-started-with-mongodb-mongoose-2h6a)

# Environment Setup

- step 1: install [Node.js](https://nodejs.org/en)
- step 2: create `mongodb-mongoose` directory and switch to the folder:

  ```sh
      # create directory
      mkdir mongodb-mongoose
      cd mongodb-mongoose

      npm i mongoose
      npm i -D nodemon
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
    ```
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

# Creating a Schema and Model

- before connecting to the database, we first need to create a **schema** and **model**
- Ideally, you would create a schema/model file for each **schema** that is needed.
- so, we create a new folder/file structure: `model/Users_v2.js`

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

# Connecting to MongoDB

- create an `index.js` file and use **Mongoose** to connect to **MongoDB**

  ```js
  // index.js
  import mongoose from "mongoose";
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

# Inserting Data

## Inserting Data: Method 1

- in the `index.js` file, let's insert a new user

  ```js
  // inserting data
  import mongoose from "mongoose";
  import User from "./model/User.js";

  mongoose.connect(
    "mongodb+srv://<username>:<password>-cluster.uo4jsy5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  );

  // create a new user
  const firstUser = new Users({
    title: "Mr.",
    slug: "Rodgy",
    firstName: "Rodgers",
    lastName: "Nyangweso",
  });

  // insert a new user in our MongoDB database
  await firstUser.save();

  // find a single user in our MongoDB database
  const findUser = await User.findOne({});
  console.log(findUser);
  ```

- first, `import` the `Users` model then we create a new user object and then use the `save()` method to insert it into our **MongoDB** database.
- run the code in the terminal with:
  ```sh
      npm run dev
  ```

## Inserting Data: Method 2

- in Method 1, we used the `save()` Mongoose method to insert the document into our database. This requires two actions: instantiating the object, and then saving it
- Alternatively, we can do this in one action using the Mongoose `create()` method.

  ```js
  // index.js
  import mongoose from "mongoose";
  import User from "./model/User.js";

  mongoose.connect(
    "mongodb+srv://<username>:<password>@test-cluster.uo4jsy5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  );

  // create a new user and insert into the database
  const insertUser = await User.create({
    title: "Mr.",
    slug: "Willy",
    firstName: "Wilson",
    lastName: "Oyare",
    location: [
      {
        country: "Kenya",
        city: "Nairobi",
      },
    ],
  });

  // find a single user in our MongoDB database
  console.log(insertUser);
  ```

- This method is much better! Not only can we insert our document, but we also get returned the document along with its `_id` when we console log it.

# Updating Data

- Task:
  - change the `title` of one of the `users`

# Finding Data

- Task:

  - use a special Mongoose method, `findById()` to get a document bu its `ObjectId`

    ```js
    import mongoose from "mongoose";
    import User from "./model/User.js";

    mongoose.connect(
      "mongodb+srv://<username>:<password>@test-cluster.uo4jsy5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    );

    // Create

    // Find data
    const findUser = await User.findById("655e57a30cae0ca936573a71").exec();
    console.log(findUser);
    ```

  - Notice that we use the `exec()` Mongoose function. This is technically optional and returns a promise.

- Task:

  - we can also project specific fields we need
  - get only `title` and `slug`

    ```js
    import mongoose from "mongoose";
    import User from "./model/User.js";

    mongoose.connect(
      "mongodb+srv://<username>:<password>@test-cluster.uo4jsy5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    );

    // Create

    // Find data
    const findUser = await User.findById(
      "655e57a30cae0ca936573a71",
      "title, slug"
    ).exec();
    console.log(findUser);
    ```

# Deleting Data

- we have `deleteOne()` and `deleteMany()` methods to delete documents from a collection.

  ```js
  import mongoose from "mongoose";
  import User from "./model/User.js";

  mongoose.connect(
    "mongodb+srv://<username>:<password>@test-cluster.uo4jsy5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  );

  // Create

  // Find data
  // Delete data
  const deleteUser = await User.deleteOne({ slug: "Rodgy" });
  console.log(deleteUser);
  ```

# Other Useful methods

## `exists()` method

- returns either `null` or the `ObjectId` of a document that matches the provided query.

  ```js
  // other useful methods
  // exists()
  const findUser = await User.exists({ slug: "Rodgy" });

  console.log(findUser);
  ```

## `where()` method

- `where()` method allows us to chain and build queries

  ```js
  // where() method
  // instead of using a standard find method
  const userFind = await User.findOne({ slug: "Rodgy" });

  // use the equivalent where() method
  const userWhere = await User.where("slug").equals("Rodgy");

  console.log(userWhere);
  ```

## `select()` method

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
