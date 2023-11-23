import mongoose from "mongoose";

import sale_order from "./model/saleOrderData.js";
import to_do from "./model/toDoData.js";

mongoose.connect(
  // enter connection string here to connect
  ""
);

// check and Test Connection
const db = mongoose.connection;
db.on("error", (error) => console.error("Connection error:", error));
db.once("open", () => console.log("Connected to MongoDB Atlas"));

// Create a document
const createToDo = to_do.create({
  description: "Respond to emails",
});

console.log(createToDo);

// create Sale Order Document
/*
const createSaleOrder = await sale_order.create({
  customer: [
    {
      customer_name: "Customer 2",
    },
  ],
});
console.log(createSaleOrder);
*/

// Find document

// Update document

// Delete documents

// Delete collection

// Delete Database
