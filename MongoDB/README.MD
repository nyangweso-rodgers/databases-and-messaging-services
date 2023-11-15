# MongoDB

![](../images/mongodb-image.png)

## Table of Contents

- [Getting Started with MongoDB]()
- [Further Reading]()
  1. [MongoDB Documentation](https://www.mongodb.com/docs/)
  2. [https://www.mongodb.com/docs/manual/introduction/#introduction-to-mongodb](https://www.mongodb.com/docs/manual/introduction/)
  3. [MongoDB for VS Code](https://www.mongodb.com/docs/mongodb-vscode/)
  4. [Dev Community - Basics of MongoDB](https://dev.to/moreno8423/basics-of-mongodb-2lme)
  5. [Dev Community - Getting started with MongoDB](https://dev.to/iamadhee/getting-started-with-mongodb-52pm)

# Introduction to MongoDB

- **MongoDB** is a `NoSQL` document-based database written in `C++`.

- **MongoDB** vs **RDBMS** Concepts

| RDBMS Concept | MongoDB Concept |
| ------------- | --------------- |
| Database      | Database        |
| Tables        | Collections     |
| Rows          | Documents       |
| Columns       | Fields          |
| Index         | Index           |

## When should I use MongoDB instead of MySQL?

- _MySQL_ and _MongoDB_ are two rather specific types of databases. Generally you first pick the _storage method_ you want.

  - The storage methods divide themselves into two groups: _relational_ and _NoSQL_.
  - And the _NoSQL storage_ methods can be divided in about four groups (there’s a lot of division methods):
    - column store,
    - key-value store,
    - graph store,
    - document store.
  - _MongoDB_ is a _document store database system_.

- But just to compare the two: a _relational database_ is excellent for storing facts that all have intrinsic connections between them, that are the same every time.
  - Let’s say you have a school, and there’s classes that have students, and students attend courses, and courses have teachers, who teach students, give out grades, e.t.c.,. Every noun in that sentence could be made into a table, with fixed, intrinsic relations with the other tables. A student never teaches classes, a teacher never receives grades, and so on. You could still make a relational database that allows students to teach classes, using association tables, but if that keeps happening you’ll probably want to have a different kind of database altogether.
- _NoSQL databases_ in general are for when the data you are storing does not have (that many) fixed and intrinsic inner relations. Say, you want to store your error logs. A log has a code, a message, a level, and so on. But those are all attributes of your log, not separate entities with many-to-many relations with other entities.
- Now, one of the other store methods I mentioned is _key-value store_. That means getting rid of all connections between data. You’ve got just a single row with a key and your value(s) (using JSON you can store as many values in a single field as you want). Document store can be called a variant of that, except it accommodates more complex values more easily.

## How to run MongoDB

- Two common ways to run **MongoDB** include:

  1. "MongoDB Atlas," and
  2. Locally Installed MongoDB.

- You can download a free **MongoDB database** at https://www.mongodb.com Or get started right away with a **MongoDB cloud service** at https://www.mongodb.com/cloud/atlas.

# Installing MongoDB on Windows

- Download the **MongoDB installer** from the [MongoDB Download Center](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/)
- After you download the installer, you install MongoDB following the instructions of the installer.
- For Most operating systems we use **MongoDB Community Edition**. It's free, and by now it's also all you need.

# MongoDB Atlas

- **MongoDB Atlas** is a fully-managed cloud database that handles all the complexity of _deploying_, _managing_, and healing your deployments on the cloud service provider of your choice (AWS , Azure, and GCP)

## MongoDB Atlas Free Cluster

- Atlas free clusters provide a small-scale development environment to host your data.
- Free clusters never expire, and provide access to a subset of Atlas features and functionality.
- Under the free tier you’ll have access to a subset of Atlas features, like
  - Charts and
  - Realm
- Paid clusters provide full access to Atlas features, configuration options, and operational capabilities.
- You can create and [Deploy a Free Cluster](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/) by first going to [MongoDB Atlas registration page](https://account.mongodb.com/account/register?tck=docs_atlas&_ga=2.33670369.1905865679.1639760133-686843528.1638558648)
- Follow the below steps to create a free cluster:

  1. Click on Build a Cluster
  2. Click on Create a Cluster

- Next Step is to create a user to access the cluster , this is different from the user you created at the beginning, this new user is for database access, the previous one was for MongoDB Atlas platform administration.

# MongoDB Concepts

1. **MongoDB Server**:
   - this is a server-side component which can host multiple databases.
2. A **MongoDB database**:
   - this is a physical container of collections.
3. A **Collection**:
   - in **MongoDB** is equivalent to a relational database table and it exists within a single database.
   - It includes a group of **MongoDB** documents.
4. **Document**:
   - includes a set of `key` `value` pairs.
   - All documents include a dynamic schema which means documents which comprise of same collection do not need to have same set of fields and structure.
5. **Replica Sets**: are a set of a few connected mongodb instances that store the same data.

## MongoDB Concept 1: Cluster

- a **cluster** refers to a group of servers that work together to store and manage data.
- The primary purpose of a **cluster** is to distribute data across multiple nodes to ensure high availability, fault tolerance, and scalability.
- MongoDB clusters provide several key features:
  1. Replication
  2. Sharding
  3. Load Balancing
  4. High availability

## MongoDB Conncept 2: Indexing

- Note that **MongoDB** by default indexes the automatically generated field `_id` of documents.

# Access MongoDB shell

## Create a Database

- use the `use` command to create a database
  ```sh
    # create a user database
    use users
  ```

## Create a collection

- in MongoDB, data is stored in `collections` which can be created using the `db.createCollection()` command:
  ```sh
    # create a collection
    db.createCollection("users")
  ```

## Insert Data

- use `insertOne()` or `insertMany()` method

## Query Data

- retrieve data using the `find()` method
  ```sh
    # retrieve data
    db.collection.find()
  ```

## Update Data

- use the `updateOne()` or `updateMany()` method

## Delete Data

- remove data using the `deleteOne()` or `deleteMany()` method

## Indexing

- indexes can improve query performance. Create an index using the `createIndex()` method

# MongoDB for VS Code

- **MongoDB** provides an extension for [VS Code](https://code.visualstudio.com/) which lets you work with **MongoDB** and your data directly within your coding environment.
- **Features** include:
  - Connect to a **MongoDB** or **Atlas cluster** to:
    - navigate through your databases and collections,
    - Explore your MongoDB Data.
    - get a quick overview of your schema and indexes, and see the documents in your collections.
    - Prototype queries and run MongoDB commands.
- To get started:
  - Install [MongoDB for VS Code](https://code.visualstudio.com/docs/azure/mongodb) from the VS Code Marketplace.
  - Connect to your deployment using MongoDB for VS Code.
  - Explore your databases, collections, and documents.
  - Use JavaScript environments to interact your data. Prototype queries, run aggregations, and more.

## Using Playgrounds

- One of the most powerful features of the VS Code **MongoDB** integration is **Mongo Playgrounds**.
- Playgrounds let you _create_, _run_, and _save_ **MongoDB** commands from a VS Code editor.
- Create a new playground with the **MongoDB**: **Create MongoDB Playground** command.
- In a playground, you can reference **MongoDB** entities and commands and you get rich IntelliSense as you type. Playgrounds are useful for prototyping database operations and queries. Execute selected lines in the playground queries with the **MongoDB**: Run Selected Lines From Playground command.

```js
/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use("mongodbVSCodePlaygroundDB");

// Insert a few documents into the sales collection.
db.getCollection("sales").insertMany([
  {
    item: "abc",
    price: 10,
    quantity: 2,
    date: new Date("2014-03-01T08:00:00Z"),
  },
  {
    item: "jkl",
    price: 20,
    quantity: 1,
    date: new Date("2014-03-01T09:00:00Z"),
  },
  {
    item: "xyz",
    price: 5,
    quantity: 10,
    date: new Date("2014-03-15T09:00:00Z"),
  },
  {
    item: "xyz",
    price: 5,
    quantity: 20,
    date: new Date("2014-04-04T11:21:39.736Z"),
  },
  {
    item: "abc",
    price: 10,
    quantity: 10,
    date: new Date("2014-04-04T21:23:13.331Z"),
  },
  {
    item: "def",
    price: 7.5,
    quantity: 5,
    date: new Date("2015-06-04T05:08:13Z"),
  },
  {
    item: "def",
    price: 7.5,
    quantity: 10,
    date: new Date("2015-09-10T08:43:00Z"),
  },
  {
    item: "abc",
    price: 10,
    quantity: 5,
    date: new Date("2016-02-06T20:20:13Z"),
  },
]);

// Run a find command to view items sold on April 4th, 2014.
const salesOnApril4th = db
  .getCollection("sales")
  .find({
    date: { $gte: new Date("2014-04-04"), $lt: new Date("2014-04-05") },
  })
  .count();

// Print a message to the output window.
console.log(`${salesOnApril4th} sales occurred in 2014.`);

// Here we run an aggregation and open a cursor to the results.
// Use '.toArray()' to exhaust the cursor to return the whole result set.
// You can use '.hasNext()/.next()' to iterate through the cursor page by page.
db.getCollection("sales").aggregate([
  // Find all of the sales that occurred in 2014.
  {
    $match: {
      date: { $gte: new Date("2014-01-01"), $lt: new Date("2015-01-01") },
    },
  },
  // Group the total sales for each product.
  {
    $group: {
      _id: "$item",
      totalSaleAmount: { $sum: { $multiply: ["$price", "$quantity"] } },
    },
  },
]);
```
