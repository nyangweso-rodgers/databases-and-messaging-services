import mongoose from "mongoose";

const { Schema, model } = mongoose;

const customerSchema = new Schema({
  createdAt: {
    type: Date,
    immutable: true,
  },
  updatedAt: {
    type: Date,
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
    },
  ],
  gender: String,
  active: Boolean,
});

const Customer = model("Customer", customerSchema);
export default Customer;
