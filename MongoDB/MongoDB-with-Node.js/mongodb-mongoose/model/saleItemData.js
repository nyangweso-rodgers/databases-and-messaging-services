import mongoose from "mongoose";
import { nanoid } from "nanoid";

const { Schema, model } = mongoose;

const saleItemSchema = new Schema({
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
    immutable: false,
  },
  id: {
    type: String,
    required: true,
    default: () => nanoid(7),
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

const sale_items = model("sale_items", saleItemSchema);
export default sale_items;
