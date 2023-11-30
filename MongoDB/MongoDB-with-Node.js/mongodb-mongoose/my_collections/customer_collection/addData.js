import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

//import customer from "../../model/customerData.js";

mongoose.connect(process.env.MONGODB_URI);

// check and Test Connection
const db = mongoose.connection;
db.on("error", (error) => console.error("Connection error:", error));
db.once("open", () => console.log("Connected to MongoDB Atlas"));
