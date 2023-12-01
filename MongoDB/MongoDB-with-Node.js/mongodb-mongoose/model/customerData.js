import mongoose from "mongoose";

const { Schema, model } = mongoose;

const customerSchema = new Schema({
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
  customer_name: String,
  first_name: String,
  last_name: String,
  phone_number: String,
  location: [
    {
      latitude: Number,
      longitude: Number,
      country: String,
      city: String,
      state: String,
      zip: String,
    },
  ],
  gender: String,
  active: Boolean,
});

const customer = model("customer", customerSchema);
export default customer;
