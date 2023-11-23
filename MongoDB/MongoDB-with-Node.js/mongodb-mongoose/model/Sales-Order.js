import mongoose from "mongoose";

const { Schema, model } = mongoose;

const saleOrderSchema = new Schema({
  createdAt: {
    type: Date,
    immutable: true,
  },
  updatedAt: {
    type: Date,
  },
  order_date: {
    type: Date
  },
  scheduled_delivery_date: {
    type: Date
  },
  delivery_date: {
    type: Date
  }
  created_by_name: {
    type: String,
  },
  updated_by_name: {
    type: String,
  },
  status: {
    type: String
  },
  customer: [{
    customer_id: String,
    phone_number: String,
    latitude: String,
    longitude: String,
    city: String,
    country: String
  }],
  items: [{
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
  }]
});

const sale_order = model("sale_order", saleOrderSchema);
export default sale_order;