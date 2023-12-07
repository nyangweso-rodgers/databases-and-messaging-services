import mongoose from "mongoose";

const { Schema, model } = mongoose;

const customerSchema = new Schema(
  {
    created_by: {
      type: String,
      default: "Rodgers Nyangweso",
      required: true,
    },
    updated_by: {
      type: String,
      default: "Rodgers Nyangweso",
      required: true,
    },
    customer_id: {
      type: String,
      required: true,
    },
    customer_name: String,
    first_name: {
      type: String,
      default: "",
    },
    last_name: {
      type: String,
      default: "",
    },
    contact: [
      {
        phone_number: String,
        email: String,
      },
    ],
    location: [
      {
        latitude: {
          type: String,
          default: "",
        },
        longitude: {
          type: String,
          default: "",
        },
        country: { type: String, default: "KE" },
        city: {
          type: String,
          default: "",
        },
        state: {
          type: String,
          default: "",
        },
        zip: String,
      },
    ],
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "",
    },
    active: Boolean,
  },
  { timestamps: true }
);

const customer = model("customer", customerSchema);
export default customer;
