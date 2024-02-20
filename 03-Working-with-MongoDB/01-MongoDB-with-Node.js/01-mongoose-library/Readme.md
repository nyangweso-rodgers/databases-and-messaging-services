# `mongoose` Library

## Table Of Contents

# Introduction to Mongoose

- `mongoose` is an **Object Data Modelling** (ODM) for **MongoDB** in **Node.js** i.e., wrapper around **MongoDB**
- With `mongoose` we do not need to wait to get **MongoDB** connected. `mongoose` will queue up all the command you make and only make those command after it connect to mongoDB
- It manages relationships between data, provides schema validation, and is used to translate between objects in code and the representation of those objects in **MongoDB**.
- **Mongoose** is good for:
  - **Mongoose** is primarily useful when you want to interact with structured data in **MongoDB**.
  - It allows you to define a schema for your data, so that you can interact with your MongoDB data in a structured and repeatable way.

# Concepts in Mongoose

## Concept #1: Schema

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
- a **document** in **MongoDB** created from this **schema** would look like this:

  ```json
    // sample documents
    "__v" : 0,
    "_id" : ObjectId("51412597e8e6d3e35c000001"),
    "created_at" : ISODate("2023-11-17T08:29:19.866Z"),
    "first_name" : "Rodgers",
    "last_name " : "Nyangweso"
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

## Concept #2: Model

- **model** is the actual form of a **schema**.
- A **model** is a class with which we construct documents i.e., takes a **schema** and apply it to each **document** in its **collection**.
- **models** are responsible for all document interactions like **creating**, **reading**, **updating**, and **deleting** (CRUD)
- Example:
  - create a `User` model
    ```js
    // creating a model
    const User = mongoose.model("User", userSchema);
    ```

# How to Create a Schema and Model

- before connecting to the database, we first need to create a **schema** and **model**
- Ideally, you would create a `schema`/`model` file for each **schema** that is needed.
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

# Resources

1. [official documentation website - mongoosejs.com](https://mongoosejs.com/)
2. [mongoose.docs - connections](https://mongoosejs.com/docs/connections.html)
