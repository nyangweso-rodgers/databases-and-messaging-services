import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import customer from "../../model/customerData.js";

// connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Delete a document based on a condition (e.g., _id)
const customerIdToDelete = "6572198c08355d37f3d7ac9c"; // Replace with the actual _id value

const deleteDocument = async () => {
  try {
    const result = await customer.findOneAndDelete({ _id: customerIdToDelete });
    console.log(`${result.deletedCount} document deleted successfully.`);
  } catch (err) {
    console.error("Error deleting document:", error);
  } finally {
    // Close the MongoDB connection after deleting
    mongoose.connection.close();
  }
};

export default deleteDocument;
