// create an order-management Database

import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

// connect to database
mongoose
  .connect(
    "<connection_string>/order-management?retryWrites=true&w=majority" //TODO: insert a connection string
  )
  .then(() => {
    // create sale-order collection within the order-management DB
    return mongoose.connection.createCollection("sale_order");
  })
  .then(() => console.log("Connected to MongoDB, created an order-management DB with sale-order collection"))
  .catch(() => console.log("MongoDB connection error!"));

