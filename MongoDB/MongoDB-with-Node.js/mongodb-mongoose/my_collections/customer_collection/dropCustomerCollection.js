import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import customer from '../../model/customerData.js';

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
