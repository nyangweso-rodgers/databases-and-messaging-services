import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

//import customer from "../../model/customerData.js";

//mongoose.connect(process.env.MONGODB_URI);
mongoose.connect(
  // enter connection string here to connect
  process.env.MONGODB_URI
);

// check and Test Connection
const db = mongoose.connection;
db.on("error", (error) => console.error("Connection error:", error));
db.once("open", () => console.log("Connected to MongoDB Atlas"));