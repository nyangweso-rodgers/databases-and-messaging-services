import mongoose from "mongoose";

const { Schema, model } = mongoose;

const driverSchema = new Schema({
  createdAt: {
    type: Date,
    immutable: true,
  },
  updatedAt: {
    type: Date,
  },
  created_by_name: String,
  updated_by_name: String,
  first_name: String,
  last_name: String,
  full_name: String,
  phone_number: String,
  active: Boolean,
  location: [
    {
      country: String,
      city: String,
    },
  ],
});
