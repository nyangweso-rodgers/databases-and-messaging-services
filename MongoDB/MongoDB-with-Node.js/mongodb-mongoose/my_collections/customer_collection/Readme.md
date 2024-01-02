# Customer collection

## Tabe Of Contents

- [Drop MongoDB Collection](#Drop-MongoDB-Collection)
- [Resources](#Resources)

# Check and Test MongoDB Connection

```js
// check and Test Connection
const db = mongoose.connection;
db.on("error", (error) => console.error("Connection error:", error));
db.once("open", () => console.log("Connected to MongoDB Atlas"));
```

# Create an Empty Collection in MongoDB

- create an empty `customer` collection
  ```js
  // create a new `customer` collection
  ```

# Create Documents in a Collection

## Create a Document using `create()` method

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
  customer_id: "12",
  gender: "male",
  customer_name: "Test Customer",
  first_name: "First Name",
  last_name: "Last Name",
  contact: [
    {
      phone_number: "+254",
      email: "rodgerso65@gmail.com",
    },
  ],
});

// find a single user from the mongodb
console.log(insertCustomer);
```

## Create Multiple Documents using `create()` method

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

## Create Multiple Documents using `Model.insertMany()`

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

## Create Document from an external `JSON` object

- import `saveCustomerData.json` and insert into `customer` collection

  ```js
  // import and insert document into a collection
  import mongoose from "mongoose";
  import fs from "fs";
  import dotenv from "dotenv";
  dotenv.config(); // Load environment variables from .env file
  import customer from "../../model/customerSchemaModel.js";

  // connect to database
  /*
    mongoose.connect(
      process.env.MONGODB_URI,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    */

  // OR, connect to database
  mongoose.connect(
    "" //TODO: insert a connection string
  );

  function insertCustomer(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, "utf8", (err, jsonStringFile) => {
        if (err) {
          return reject(err);
        }
        try {
          const jsonObject = JSON.parse(jsonStringFile);

          customer
            .insertMany(jsonObject)
            .then(() => resolve("Data successfully inserted into MongoDB"))
            .catch((createError) => reject(createError));
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  // Example usage
  const sampleCustomerDataPath = "./sampleCustomerData.json";

  // run the function to create customers
  insertCustomer(sampleCustomerDataPath)
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log("Error", err);
    })
    .finally(() => {
      mongoose.connection.close();
    });
  ```

## Batch Insert Documents into a MongoDB Collection

```js

```

# Update Documents in a Collection

## Update Single Document using `updateOne()` or `findOneAndUpdate()`

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

## Update Multiple documents using `updateMany()`

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

# Delete Documents in a Collection

- To delete a single document in **MongoDB** using **Mongoose**, you can use the `deleteOne()` or `findOneAndDelete()` methods.

## Delete a document using `deleteOne()` method.

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

  - or,

    ```js

    ```

## Delete a document using `findOneAndDelete()` method

```js

```

## Delete all documents within a Collection using `deleteMany()` method

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

# Drop MongoDB Collection

## Drop `customer` collection using `drop()` method

```js
// drop customer collection from MongoDB
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import customer from "../../model/customerSchemaModel.js";

// Connect to MongoDB
mongoose
  .connect(
    "" //TODO: insert a connection string
  )
  .then(() => {
    console.log("DB connected ....");
  });

// OR
/*
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
*/

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

# Resources

1. []()
