import mongoose from "mongoose";

import sale_items from "./model/saleItemData.js";

mongoose.connect(
  // enter connection string here to connect
  ""
);

// check and Test Connection
const db = mongoose.connection;
db.on("error", (error) => console.error("Connection error:", error));
db.once("open", () => console.log("Connected to MongoDB Atlas"));

// Create a document
const createSaleItem = sale_items.create({
  country: "Uganda",
  active: true,
  item_code: "item code 2",
});

console.log(createSaleItem);

// create multiple documents

// Find document

// Update document

// Delete documents

// Delete collection

// Delete Database
