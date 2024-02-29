# CRUD Operations

## Table of Contents

# Query

## Other Useful Methods

### 1. `exists()`

- `exists()` returns either `null` or the `ObjectId` of a document that matches the provided query.

  ```js
  // other useful methods
  // exists()
  const findUser = await User.exists({ slug: "Rodgy" });

  console.log(findUser);
  ```

### 2. `where()`

- `where()` allows us to chain and build queries

  ```js
  // where() method
  // instead of using a standard find method
  const userFind = await User.findOne({ slug: "Rodgy" });

  // use the equivalent where() method
  const userWhere = await User.where("slug").equals("Rodgy");

  console.log(userWhere);
  ```

### 3. `select()`

- `select()` To include projection when using the `where()` method, chain the `select()` method after your query.

  ```js
  // use the equivalent where() method
  const userWhere = await User.where("slug")
    .equals("Rodgy")
    .select("firstName, createdAt");

  console.log(userWhere);
  ```

# Resources
