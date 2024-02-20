# Project - MongoDB with Mongoose

## Table of Contents

- [Further Reading]()
  1. [dev.to - Getting Started with MongoDB & Mongoose](https://dev.to/codestackr/getting-started-with-mongodb-mongoose-2h6a)

# Environment Setup

# Creating a Schema and Model

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