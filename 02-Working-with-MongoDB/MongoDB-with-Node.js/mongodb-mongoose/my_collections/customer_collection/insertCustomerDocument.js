// import and insert document into a collection
import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file
import customer from "../../model/customerSchemaModel.js";

// connect to database
/*
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
*/

// OR, connect to database
mongoose.connect(
  "" //TODO: insert a connection string
);

function insertCustomer(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, jsonStringFile) => {
      if (err) {
        return reject(err);
      }
      try {
        const jsonObject = JSON.parse(jsonStringFile);

        customer
          .insertMany(jsonObject)
          .then(() => resolve("Data successfully inserted into MongoDB"))
          .catch((createError) => reject(createError));
      } catch (err) {
        reject(err);
      }
    });
  });
}

// Example usage
const sampleCustomerDataPath = "./sampleCustomerData.json";

// run the function to create customers
insertCustomer(sampleCustomerDataPath)
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log("Error", err);
  })
  .finally(() => {
    mongoose.connection.close();
  });