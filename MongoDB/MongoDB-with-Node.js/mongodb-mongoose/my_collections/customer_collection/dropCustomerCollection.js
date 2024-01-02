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
