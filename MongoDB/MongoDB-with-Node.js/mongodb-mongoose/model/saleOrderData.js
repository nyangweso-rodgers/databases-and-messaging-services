import mongoose from "mongoose";
import { nanoid } from "nanoid";

const { Schema, model } = mongoose;

const saleOrderSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      default: () => nanoid(7),
    },
    createdAt: {
      type: Date,
      required: [true, "add Created At!"],
      default: () => Date.now(),
      immutable: true,
    },
    order_date: {
      type: Date,
      default: () => Date.now(),
    },
    scheduled_delivery_date: {
      type: Date,
    },
    delivery_date: {
      type: Date,
    },
    created_by_name: {
      type: String,
    },
    updated_by_name: {
      type: String,
    },
    status: {
      type: String,
    },
    customer: [
      {
        customer_id: String,
        customer_name: String,
        phone_number: String,
        latitude: String,
        longitude: String,
        city: String,
        country: String,
      },
    ],
    items: [
      {
        item_id: String,
        created_at: Date,
        updated_at: Date,
        item_name: String,
        item_uom: String,
        item_category: String,
        ordered_qty: Number,
        delivered_qty: Number,
        item_status: String,
        discount_amount: Number,
        unit_selling_price: Number,
        total_ordered: Number,
        total_delivered: Number,
      },
    ],
  },
  { timestamps: true }
);

saleOrderSchema.pre("save", function (next) {
  this.updated_at = Date.now(); // update the date every time a document is saved
  next();
});

const sale_order = model("sale_order", saleOrderSchema);
export default sale_order;
