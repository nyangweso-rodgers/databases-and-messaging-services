// insert sale-order document
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

// import the saleOrderSchema
import saleOrder from "../../model/saleOrderSchemaModel.js";

mongoose.connect(
  "<connection_string>/order-management?retryWrites=true&w=majority" //TODO: insert a connection_string)
);

// create a sale order document
const saleOrderDocument = {
  sales_agent: {
    id: 1,
  },
  audit: {},
  items: {},
};
// insert a sale-order document
const insertSalesOrder = await saleOrder.create(saleOrderDocument);

// Find a single user from the sale_order
console.log(insertSalesOrder);
