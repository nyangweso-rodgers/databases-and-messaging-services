# PostgreSQL with Node.js

## Table Of Contents

# Introduction to `node-postgres` (`pg`) Library

- `node-postgres` is a PostgreSQL client for `Node.js`, providing a native implementation of the PostgreSQL protocol. It allows you to connect to PostgreSQL databases, execute SQL queries, and handle the results. It's widely used in the Node.js ecosystem for building applications that interact with PostgreSQL databases.

# How to Use `node-postgres` in a Node.js Application

## Step #1: Install `node-postgres` package using `npm` or `yarn`

```sh
    npm i pg
    # or
    yarn add pg
```

## Step #2: Require `pg` module in a Node.js application

```js
const { Pool } = require("pg");
```

## Step #3: Create a PostgreSQL client instance using `Pool`

```js
const pool = new Pool({
  user: "your_database_user",
  host: "localhost",
  database: "your_database_name",
  password: "your_database_password",
  port: 5432,
});
```

## Step #4: Use the client to execute SQL queries

```js
pool.query("SELECT * FROM your_table", (err, res) => {
  if (err) {
    console.error("Error executing query", err);
  } else {
    console.log("Query result:", res.rows);
  }
});
```

# Resources

1. [official node-postgres GitHub repository](https://github.com/brianc/node-postgres)
