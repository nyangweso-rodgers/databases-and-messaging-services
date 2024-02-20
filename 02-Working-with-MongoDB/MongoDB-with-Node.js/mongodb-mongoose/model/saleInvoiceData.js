import mongoose from "mongoose";

const { Schema, model } = mongoose;

const saleInvoiceSchema = new Schema({
  createdAt: {
    type: Date,
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
    immutable: false,
  },
  created_by_name: String,
  updated_by_name: String,
  status: String,
  customer_name: String,
  currency: String,
  items: [
    {
      createdAt: {
        type: Date,
        immutable: true,
      },
      updatedAt: {
        type: Date,
      },
    },
  ],
});

const sales_invoice = model("sales_invoice", saleInvoiceSchema);
export default sales_invoice;