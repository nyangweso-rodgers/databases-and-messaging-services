# Customer collection

## Files

1. `createDocuments.js` - adds data to the database. It also fabricates the database file if it doesn’t exist.

- `dbFileCheck.js` - confirms if the database file has been created.
- `query.js` - checks if a database exists and executes a function passed to it.
- `removeData.js` - removes selected data.
- `retrieveData.js` - fetches all data
- `updateData.js` - edits data.

# Check and Test MongoDB Connection

```js
// check and Test Connection
const db = mongoose.connection;
db.on("error", (error) => console.error("Connection error:", error));
db.once("open", () => console.log("Connected to MongoDB Atlas"));
```

# Inser a new Document

```js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

import customer from "../../model/customerData.js";

//mongoose.connect(process.env.MONGODB_URI);
mongoose.connect(
  // enter connection string here to connect
  process.env.MONGODB_URI
);

// insert a customer
const insertCustomer = await customer.create({
  customer_id: "9",
  gender: "male",
});

// find a single user from the mongodb
console.log(insertCustomer);
```

# Insert Multiple Documents

```js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

import customer from "../../model/customerData.js";

//mongoose.connect(process.env.MONGODB_URI);
mongoose.connect(
  // enter connection string here to connect
  process.env.MONGODB_URI
);

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

# Insert Multiple Documents using `Model.insertMany()`

```js
// insert using `Model.insertMany()`
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

import customer from "../../model/customerData.js";

//mongoose.connect(process.env.MONGODB_URI);
mongoose.connect(
  // enter connection string here to connect
  process.env.MONGODB_URI
);

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

# Insert documents from an external `JSON` object

# Update Single Document using `updateOne()` or `findOneAndUpdate()`

- To update a single document you can use the `updateOne()` or `findOneAndUpdate()` methods.
- The `updateOne()` method takes two arguments:

  - The first argument is the filter condition that specifies which document(s) to update. In this case, it's based on the `_id `field.
  - The second argument is the update operation. Here, we use the `$set` operator to update specific fields with new values.

  - using `updateOne()`:

    ```js
    import mongoose from "mongoose";
    import dotenv from "dotenv";
    dotenv.config();

    import customer from "../../model/customerData.js";

    mongoose.connect(process.env.MONGODB_URI);

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
  import mongoose from "mongoose";
  import dotenv from "dotenv";
  dotenv.config();

  import customer from "../../model/customerData.js";

  mongoose.connect(process.env.MONGODB_URI);

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

# Update Multiple documents using `updateMany()`

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

# Delete a single document using `deleteOne()` or `findOneAndDelete()` methods.

- To delete a single document in **MongoDB** using **Mongoose**, you can use the `deleteOne()` or `findOneAndDelete()` methods.
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

# Drop `customer` collection using `drop()` method

```js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import customer from "../../model/customerData.js";

mongoose.connect(process.env.MONGODB_URI);

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
