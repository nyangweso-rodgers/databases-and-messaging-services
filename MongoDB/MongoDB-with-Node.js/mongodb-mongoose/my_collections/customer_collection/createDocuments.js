import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

import jsonfile from "jsonfile";
import customer from "../../model/customerData.js";
var sampleCustomerData = jsonfile.readFileSync("./sampleCustomerData.json");

mongoose.connect(
  // enter connection string here to connect
  process.env.MONGODB_URI
);

// Read data from the JSON file
var insertCustomersFromJSON = function () {
  customer.insertMany(sampleCustomerData, function (err, result) {
    if (err) {
      console.log("Error inserting customers from JSON file", err);
    } else {
      console.log(result.length + " Successfully inserted customers");
    }
    // close the MongoDB connection after inserting customers
    mongoose.connection.close();
  });
};

// run the function to create customers
insertCustomersFromJSON();