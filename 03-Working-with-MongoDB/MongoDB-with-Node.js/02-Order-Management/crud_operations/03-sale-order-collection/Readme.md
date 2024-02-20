# Sale Order Collection using Mongoose

## Table of Contents

# Working with Sale Order Collection

## Task 1: Test a Connection to MongoDB

```js
// create an order-management Database

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

//mongoose.connect(process.env.MONGODB_URI);
/*
mongoose.connect(
  // enter connection string here to connect
  process.env.MONGODB_URI
);
*/

// OR, connect to database
mongoose.connect(
  "" //TODO: insert a connection string
);

// check and Test Connection
const db = mongoose.connection;
db.on("error", (error) => console.error("Connection error:", error));
db.once("open", () => console.log("Connected to MongoDB Atlas"));
```

## Task 2: Create an `order-management` Database with an empty `sale-order` Collection

- Remarks:

  - MongoDB won't create the database until you insert some data into it or create a collection within it. Therefore, simply connecting to MongoDB won't create the database in Atlas. You need to perform some operations that trigger the creation of the database.

    ```js
    import mongoose, { mongo } from "mongoose";
    import dotenv from "dotenv";
    dotenv.config(); // Load environment variables from .env file

    // connect to database
    mongoose
      .connect(
        "" //TODO: insert a connection string
      )
      .then(() => {
        // create sale-order collection within the order-management DB
        return mongoose.connection.createCollection("sale_order");
      })
      .then(() =>
        console.log(
          "Connected to MongoDB, created an order-management DB with sale-order collection"
        )
      )
      .catch(() => console.log("MongoDB connection error!"));
    ```

## Task 3: Create a single `sales-order` document within the `order-management` DB

```js
// insert sale-order document
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

// import the saleOrderSchema
import saleOrder from "../../model/saleOrderSchemaModel.js";

mongoose.connect(
  "<connection_string>/order-management?retryWrites=true&w=majority" //TODO: insert a connection_string)
);

// create a sale order document
const saleOrderDocument = {
  sales_agent: {
    id: 1,
  },
  audit: {},
  items: {},
};
// insert a sale-order document
const insertSalesOrder = await saleOrder.create(saleOrderDocument);

// Find a single user from the sale_order
console.log(insertSalesOrder);
```

# Resources
