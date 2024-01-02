// insert multiple customer documents into a MongoDB collection

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

const insertCustomers = (path) => {
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
};

// import customers .json file
const sampleCustomerDataPath = "./sampleCustomersData.json";

// run the fuinction to insert customers into MongoDB collection
insertCustomers(sampleCustomerDataPath)
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log("Error", err);
  })
  .finally(() => {
    mongoose.connection.close();
  });
