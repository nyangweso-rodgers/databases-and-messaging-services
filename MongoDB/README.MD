# MongoDB

## Table of Contents
- [Getting Started with MongoDB]()
- [Further Reading]() 
  1. [MongoDB Documentation](https://www.mongodb.com/docs/)
  - [Dev Community - Basics of MongoDB](https://dev.to/moreno8423/basics-of-mongodb-2lme)
  - [Dev Community - Getting started with MongoDB](https://dev.to/iamadhee/getting-started-with-mongodb-52pm)

# Access MongoDB shell
## Create a Database
* use the `use` command to create a database
  ```sh
    # create a user database
    use users
  ```
## Create a collection
* in MongoDB, data is stored in `collections` which can be created using the `db.createCollection()` command:
  ```sh
    # create a collection
    db.createCollection("users")
  ```

## Insert Data
* use `insertOne()` or `insertMany()` method

## Query Data
* retrieve data using the `find()` method
  ```sh
    # retrieve data
    db.collection.find()
  ```

## Update Data
* use the `updateOne()` or `updateMany()` method

## Delete Data
* remove data using the `deleteOne()` or `deleteMany()` method

## Indexing
* indexes can improve query performance. Create an index using the `createIndex()` method