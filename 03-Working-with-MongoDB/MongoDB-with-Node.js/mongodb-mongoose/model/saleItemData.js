import mongoose from "mongoose";
import { nanoid } from "nanoid";

const { Schema, model } = mongoose;

const saleItemSchema = new Schema({
  created_at: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
  updated_at: {
    type: Date,
    default: () => Date.now(),
    immutable: false,
  },
  id: {
    type: String,
    required: true,
    default: () => nanoid(7),
  },
  country: {
    type: String,
    required: [true, "Enter item country"],
  },
  created_by_name: {
    type: String,
    default: "Rodgers Nyangweso",
  },
  updated_by_name: {
    type: String,
    default: "Rodgers Nyangweso",
  },
  active: {
    type: Boolean,
    required: [true, "Specify active status"],
    enum: ["true", "false"],
  },
  item_code: {
    type: String,
    required: [true, "Enter item_code"],
  },
  item_group: String,
  item_uoms: [
    {
      type: String,
      required: [true, "Enter item uom"],
    },
  ],
  description: String,
  shelf_life_in_days: Number,
});

const sale_items = model("sale_items", saleItemSchema);
export default sale_items;
