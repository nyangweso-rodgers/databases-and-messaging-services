# Customer collection

## Files

- `addData.js` - adds data to the database. It also fabricates the database file if it doesn’t exist.
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

# Drop `customer` collection
