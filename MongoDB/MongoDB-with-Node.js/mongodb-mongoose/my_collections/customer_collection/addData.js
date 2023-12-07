import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

import customer from "../../model/customerData.js";

//mongoose.connect(process.env.MONGODB_URI);
mongoose.connect(
  // enter connection string here to connect
  process.env.MONGODB_URI
);

// Read data from the JSON file