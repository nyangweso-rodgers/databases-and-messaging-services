import mongoose from "mongoose";

const { Schema, model } = mongoose;

const saleItemSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
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
  active: {
    type: Boolean,
    required: true,
  },
  item_code: {
    type: String,
    required: true,
  },
  item_group: String,
  item_uom: {
    type: String,
    required: true,
  },
  description: String,
});

const SaleItem = model("sale_item", saleInvoiceSchema);
export default SaleItem;
