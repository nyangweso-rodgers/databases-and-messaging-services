import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import customer from "../../model/customerData.js";

// connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Delete a document based on a condition (e.g., _id)

// delete all documents using deleteMany()
async function deleteAllDocuments() {
  try {
    // specify an empty filter to match all documents
    const query = {};

    // Use Mongoose's deleteMany to delete all documents in the collection
    const result = await customer.deleteMany(query);

    console.log(`${result.deletedCount} documents deleted`);
  } catch (err) {
    console.err('Error deleting documents:', err);
  } finally {
    // close the connection
    mongoose.connection.close();
  }
}

// call the function to delete all documents
deleteAllDocuments();