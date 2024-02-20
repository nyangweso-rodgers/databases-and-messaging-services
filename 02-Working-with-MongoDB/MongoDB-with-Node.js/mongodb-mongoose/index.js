import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import sale_items from "./model/saleItemData.js";

mongoose.connect(
  // enter connection string here to connect
  process.env.MONGODB_URI
);

// check and Test Connection

// Create a document


// create multiple documents

// Find document

// Update document

// Delete documents
/*
import deleteDocument from "./my_collections/customer_collection/deleteDocuments.js";
deleteDocument()
  .then(() => {
    console.log("Delete operation completed");
  })
  .catch(() => {
    console.log("error in the delete operation");
  });
*/

// Delete collection

// Delete Database
