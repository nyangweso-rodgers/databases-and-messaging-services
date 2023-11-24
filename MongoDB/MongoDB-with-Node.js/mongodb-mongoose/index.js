import mongoose from "mongoose";

import sale_items from "./model/saleItemData.js";

mongoose.connect(
  // enter connection string here to connect
  "mongodb+srv://nyangweso-rodgers:Mqns718Gf5Ixgk68@test-cluster.uo4jsy5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
);

// check and Test Connection
const db = mongoose.connection;
db.on("error", (error) => console.error("Connection error:", error));
db.once("open", () => console.log("Connected to MongoDB Atlas"));

// Create a document

// create multiple documents

// Find document

// Update document

// Delete documents

// Delete collection

// Delete Database
