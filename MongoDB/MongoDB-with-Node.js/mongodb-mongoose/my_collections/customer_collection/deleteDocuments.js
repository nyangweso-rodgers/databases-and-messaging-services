import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

//import customer from "../../model/customerData.js";

mongoose.connect(process.env.MONGODB_URI);
