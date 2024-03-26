import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { router } from "./src/main/routes/saleOrderRoute.js";

// Load environment variables from .env file
dotenv.config({ path: "./config/.env" });

// create an express application object
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use(router);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Start the server
const port = 3200;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
