import mongoose from "mongoose";

const { Schema, model } = mongoose;

const driverSchema = new Schema({
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
    immutable: false,
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

const Driver = model("Driver", driverSchema);
export default Driver;