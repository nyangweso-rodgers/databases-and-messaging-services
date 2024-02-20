// create an order-management Database with a multiple collections

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables from .env file

const connectionURI =
  "mongodb+srv://<user_name>:<password>/order-management?retryWrites=true&w=majority"; //TODO: insert a connection string

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
