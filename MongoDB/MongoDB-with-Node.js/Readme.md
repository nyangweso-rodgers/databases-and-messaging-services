# MongoDB with Node.js

## Table of Contents

- [Further Reading]()
  1. [official documentation website - mongoosejs.com](https://mongoosejs.com/)
  2. [official documentation - mongodb](https://www.mongodb.com/)
  3. [download - node.js](https://nodejs.org/en/)

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
- with schemas, we define each field and its data type. Permitted types include:
  1. String
  2. Number
  3. Date
  4. Buffer
  5. Boolean
  6. Mixed
  7. ObjectId
  8. Array
  9. Decimal128
  10. Map
- a document in MongoDB created from this schema would look like this:

  ```json
    // sample documents
    "__v" : 0,
    "_id" : ObjectId("51412597e8e6d3e35c000001"),
    "created_at" : ISODate("2023-11-17T08:29:19.866Z"),
    "first_name" : "Rodgers",
    "last_name " : "Nyangweso"
  ```

## Concept 2: Model

- **model** is the actual form of a **schema**.
- A **model** is a class with which we construct documents i.e., takes a **schema** and apply it to each **document** in its **collection**.
- **models** are responsible for all document interactions like **creating**, **reading**, **updating**, and **deleting** (CRUD)

## Concept 3: Query

- A query is just a query we make against mongoDB database.

# Installation and Setup

- Step 1: install [Node.js](https://nodejs.org/en) and [mongodb](https://www.mongodb.com/try)
- Step 2: Install mongoose using `npm`
  ```sh
    # install mongoose
    npm install mongoose
  ```
- Step 3: import mongoose

  ```js
  // using Node.js `require()`
  const mongoose = require("mongoose");

  // or, using ES6 imports
  import mongoose from "mongoose";
  ```
