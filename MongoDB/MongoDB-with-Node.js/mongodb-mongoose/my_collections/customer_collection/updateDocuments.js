import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import customer from "../../model/customerData.js";

mongoose.connect(process.env.MONGODB_URI);

// Example: Update a document based on a condition (e.g., _id)
const customerIdToUpdate = "657211241a3db27e73b32b92"; // Replace with the actual _id value
const updateDocument = { last_name: "Omondi" }; // Update fields and values as needed

customer
  .findOneAndUpdate(
    { _id: customerIdToUpdate },
    { $set: updateDocument },
    { new: true } // return the updated customer document
  )
  .then((result) => {
    console.log("Document updated successfully", result);
  })
  .catch((err) => {
    console.log("Error updating document", err);
  })
  .finally(() => {
    //close the connection
    mongoose.connection.close();
  });
