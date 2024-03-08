# CRUD Operations

## Table of Contents

# Query

## Connect to MongoDB Atlas

- Connect to a MongoDB cluster by:

  ```js
  // create an order-management Database

  import mongoose, { mongo } from "mongoose";
  import dotenv from "dotenv";
  dotenv.config(); // Load environment variables from .env file

  // connect to database
  mongoose.connect(process.env.MONGODB_URI);

  mongoose.connect(
    // enter connection string here to connect
    process.env.MONGODB_URI
  );

  // check and Test Connection
  const db = mongoose.connection;
  db.on("error", (error) => console.error("Connection error:", error));
  db.once("open", () => console.log("Connected to MongoDB Atlas"));
  ```

## CREATE Collections(s) in a MongoDB Database

- MongoDB won't create the database until you insert some data into it or create a collection within it. Therefore, simply connecting to MongoDB won't create the database in Atlas. You need to perform some operations that trigger the creation of the database.

### CREATE Collection(s)

- Create a `sale_order_service` DB with a single `sale_order` collection:

  - use an `sync/await`

    ```js
    //connect to the database

    // create an order-management Database with a sale_order collection
    const createCollections = async () => {
      try {
        await mongoose.connect(connectionURI);

        // create a collection
        await mongoose.connection.createCollection("sale_order");

        console.log("Connected to MongoDB...");
        console.log("Created sale_orders collection!");
      } catch (error) {
        console.error("MongoDB connection error:", error);
      } finally {
        mongoose.disconnect(); // Close the connection when done
      }
    };

    // Call the function to create collections
    createCollections();
    ```

- we can also use `createCollection` method to create multiple collections.
- it is important to note that the `createCollection` method returns a **promise**. Therefore, we should handle the creation of multiple collections using separate promises or use `async`/`await` to ensure sequential execution.

  ```js
  // connect to the database

  // create an order-management Database with a multiple collections
  const createCollections = async () => {
    try {
      await mongoose.connect(connectionURI);

      // create collections sequencially
      await mongoose.connection.createCollection("sale_orders");
      await mongoose.connection.createCollection("customers");
      await mongoose.connection.createCollection("sale_order_items");

      console.log("Connected to MongoDB...");
      console.log("Created collection1!");
    } catch (error) {
      console.error("MongoDB connection error:", error);
    } finally {
      mongoose.disconnect(); // Close the connection when done
    }
  };

  // Call the function to create collections
  createCollections();
  ```

## INSERT Documents In a MongoDB Collection

### Insert Single document within the `sale_order` Collection in the `sale_order_service` Database

```js
//connect to the database

// import the saleOrderSchema
import saleOrder from "../../model/saleOrderSchemaModel.js";

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

- or,

  ```js
  //connect to the database

  // import the saleOrderSchema
  import saleOrder from "../../model/saleOrderSchemaModel.js";

  // create a sale order document
  const insertSaleOrderDocument = await saleOrder.create({
    sales_agent: {
      id: 1,
    },
    audit: {},
    items: {},
  });

  // Find a single user from the sale_order
  console.log(insertSaleOrderDocument);
  ```

### Insert Multiple `sale_order` Documents using `create()` method

```js
// insert multiple customers
const customersData = [
  { customer_id: "1", gender: "male" },
  { customer_id: "2", gender: "female" },
  { customer_id: "3", gender: "male" },
];

const insertCustomer = customer
  .create(customersData)
  .then((result) => {
    console.log("documents inserted successfully:", result);
  })
  .catch((err) => {
    console.log("error while inserting the documents:", err);
  });

// find a single user from the mongodb
console.log(insertCustomer);
```

### Create Multiple Documents using `Model.insertMany()`

```js
// insert using `Model.insertMany()`

// insert multiple customers
const customersData = [
  {
    customer_id: "7",
    first_name: "Rodgers",
    last_name: "Rodgers",
    gender: "male",
  },
  {
    customer_id: "8",
    first_name: "Rodgers",
    last_name: "Rodgers",
    gender: "female",
  },
  {
    customer_id: "9",
    first_name: "Rodgers",
    last_name: "Rodgers",
    gender: "male",
  },
];

const insertCustomer = customer
  .insertMany(customersData)
  .then((result) => {
    console.log("documents inserted successfully:", result);
  })
  .catch((err) => {
    console.log("error while inserting the documents:", err);
  });

// find a single user from the mongodb
console.log(insertCustomer);
```

### Generate Documents

```js
// generate sales orders from the schema model

import { nanoid } from "nanoid";
import fs from "fs";

const createTestSaleOrders = async () => {
  const saleOrders = [];

  for (let i = 0; i < 21; i++) {
    const saleOrder = {
      id: nanoid(20),
      audit: {
        created_at: Date.now(),
        order_date: Date.now(),
        scheduled_delivery_date: Date.now(),
        delivery_date: Date.now(),
      },
      created_by_name: "Random User" + i,
      updated_by_name: "Rodgers Nyangweso",
      sales_agent: [
        {
          id: nanoid(20),
          name: "Test Sales Agent" + i,
          contact_mobile: "+2547",
        },
      ],
      status: "CREATED", // Or choose a random status from the enum
      items: [
        {
          item_id: nanoid(10),
          name: "Test Item " + i,
          uom: "Test UOM",
          ordered_qty: Math.floor(Math.random() * 10) + 1, // Random quantity
          unit_selling_price: Math.random() * 100 + 1, // Random price
          // ... other fields
        },
        {
          item_id: nanoid(10),
          name: "Test Item " + i + i,
          uom: "Test UOM",
          ordered_qty: Math.floor(Math.random() * 10) + 2, // Random quantity
          unit_selling_price: Math.random() * 100 + 2, // Random price
          // ... other fields
        },
      ],
    };
    saleOrders.push(saleOrder);
  }
  // write orders to a JSON file
  const generatedJsonData = JSON.stringify(saleOrders, null, 2); // pretty print
  fs.writeFileSync("generatedJsonData.json", generatedJsonData);

  console.log("20 test orders created and saved to generatedJsonData.json");
};

createTestSaleOrders();
```

### Insert `json` data into a MongoDB Collection

```js
// generate random 100 sale orders and insert them into the sale_orders collection

const insertRandomGeneratedSaleOrders = async () => {
  const saleOrders = [];

  for (let i = 1; i < 101; i++) {
    const saleOrder = new SaleOrder({
      id: nanoid(20),
      audit: {
        created_at: Date.now(),
        order_date: Date.now(),
        scheduled_delivery_date: Date.now(),
        delivery_date: Date.now(),
      },
      created_by_name: "Random User" + i,
      updated_by_name: "Rodgers Nyangweso",
      sales_agent: [
        {
          id: nanoid(20),
          name: "Test Sales Agent" + i,
          contact_mobile: "+2547",
        },
      ],
      status: "CREATED", // Or choose a random status from the enum
      items: [
        {
          item_id: nanoid(10),
          name: "Test Item " + i,
          uom: "Test UOM",
          ordered_qty: Math.floor(Math.random() * 10) + 1, // Random quantity
          unit_selling_price: Math.random() * 100 + 1, // Random price
          // ... other fields
        },
        {
          item_id: nanoid(10),
          name: "Test Item " + i + i,
          uom: "Test UOM",
          ordered_qty: Math.floor(Math.random() * 10) + 2, // Random quantity
          unit_selling_price: Math.random() * 100 + 2, // Random price
          // ... other fields
        },
      ],
    });
    try {
      await saleOrder.save(); // save to a database
      saleOrders.push(saleOrder); // Add to array for JSON file
    } catch (error) {
      console.error("Error creating a sale_order", error);
    }
  }
};

insertRandomGeneratedSaleOrders();
```

## READ Operations

## UPDATE MongoDB Documents

### Update Single Document using `updateOne()` or `findOneAndUpdate()`

- To update a single document you can use the `updateOne()` or `findOneAndUpdate()` methods.
- The `updateOne()` method takes two arguments:

  - The first argument is the filter condition that specifies which document(s) to update. In this case, it's based on the `_id `field.
  - The second argument is the update operation. Here, we use the `$set` operator to update specific fields with new values.

  - using `updateOne()`:

    ```js
    // Example: Update a document based on a condition (e.g., _id)
    const customerIdToUpdate = "657211241a3db27e73b32b92"; // Replace with the actual _id value
    const updateDocument = { first_name: "Rodgers" }; // Update fields and values as needed

    customer
      .updateOne({ _id: customerIdToUpdate }, { $set: updateDocument })
      .then((result) => {
        console.log("Document updated successfully", result);
      })
      .catch((err) => {
        console.log("Error updating document", err);
      })
      .finally(() => {
        //close the connection
        mongoose.connection.close();
      });
    ```

- The `updateOne()` method returns a promise that resolves to an object containing information about the update operation, such as the number of documents matched and modified.

  ```js
  // Example: Update a document based on a condition (e.g., _id)
  const customerIdToUpdate = "657211241a3db27e73b32b92"; // Replace with the actual _id value
  const updateDocument = { last_name: "Nyangweso" }; // Update fields and values as needed

  customer
    .findOneAndUpdate(
      { _id: customerIdToUpdate },
      { $set: updateDocument },
      { new: true } // return the updated customer document
    )
    .then((result) => {
      console.log("Document updated successfully", result);
    })
    .catch((err) => {
      console.log("Error updating document", err);
    })
    .finally(() => {
      //close the connection
      mongoose.connection.close();
    });
  ```

- If you need to retrieve the original document before the update, you might consider using `findOneAndUpdate()`.

### Update Multiple Documents using `updateMany()`

- To update multiple documents in **MongoDB** using **Mongoose**, you can use the `updateMany()` method.
- Syntax:

  ```js
  const mongoose = require("mongoose");

  // Define your customer schema
  const customerSchema = new mongoose.Schema({
    name: String,
    email: String,
    // other fields...
  });

  // Create a Mongoose model
  const Customer = mongoose.model("Customer", customerSchema);

  // Connect to MongoDB
  mongoose.connect("mongodb://localhost/your-database", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Example: Update multiple documents based on a condition
  const condition = {
    /* your condition here */
  }; // Specify the condition for matching documents
  const updateData = { $set: { email: "new-email@example.com" } }; // Update fields and values as needed

  Customer.updateMany(condition, updateData)
    .then((result) => {
      console.log(`${result.nModified} documents updated successfully.`);
    })
    .catch((error) => {
      console.error("Error updating documents:", error);
    })
    .finally(() => {
      // Close the MongoDB connection after updating
      mongoose.connection.close();
    });
  ```

## DELETE MongoDB Documents

- To delete a single document in **MongoDB** using **Mongoose**, you can use the `deleteOne()` or `findOneAndDelete()` methods.

### Delete a document using `deleteOne()` method.

- `deleteOne()` method takes one argument, which is the filter condition that specifies which document to delete.

  - E.g., delete a document based on the `_id` field.

    ```js
    import mongoose from "mongoose";
    import dotenv from "dotenv";
    dotenv.config();

    import customer from "../../model/customerData.js";

    // Delete a document based on a condition (e.g., _id)
    const customerIdToDelete = "6572198c08355d37f3d7ac9d"; // Replace with the actual _id value

    const deleteDocument = async () => {
      // connect to MongoDB
      await mongoose.connect(process.env.MONGODB_URI);

      try {
        const result = await customer.deleteOne({ _id: customerIdToDelete });
        console.log(`${result.deletedCount} document deleted successfully.`);
      } catch (err) {
        console.error("Error deleting document:", err);
      } finally {
        // Close the MongoDB connection after deleting
        mongoose.connection.close();
      }
    };

    export default deleteDocument;
    ```

### Delete all documents within a Collection using `deleteMany()` method

- to delete all documents in a collection using Mongoose, you can specify an empty filter object, like this:

  ```js
  import mongoose from "mongoose";
  import dotenv from "dotenv";
  dotenv.config();

  import customer from "../../model/customerData.js";

  // connect to MongoDB
  mongoose.connect(process.env.MONGODB_URI);

  // Delete a document based on a condition (e.g., _id)

  // delete all documents using deleteMany()
  async function deleteAllDocuments() {
    try {
      // specify an empty filter to match all documents
      const query = {};

      // Use Mongoose's deleteMany to delete all documents in the collection
      const result = await customer.deleteMany(query);

      console.log(`${result.deletedCount} documents deleted`);
    } catch (err) {
      console.err("Error deleting documents:", err);
    } finally {
      // close the connection
      mongoose.connection.close();
    }
  }

  // call the function to delete all documents
  deleteAllDocuments();
  ```

## Drop MongoDB Collection

### Drop `customer` collection using `drop()` method

```js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import customer from "../../model/customerSchemaModel.js";

// Connect to MongoDB

// Drop collection
customer.collection
  .drop()
  .then(() => {
    console.log("Customer Collection Dropped");
  })
  .catch((error) => {
    console.log("Error while dropping Customer Collection: ", error);
  })
  .finally(() => {
    // Close the MongoDB connection after dropping the collection
    mongoose.connection.close();
  });
```

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
