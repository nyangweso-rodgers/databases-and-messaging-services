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
      required: [true, "Customer MUST have a unique customer identifier"],
    },
    customer_name: {
      type: String,
      required: [true, "Customer Name MUST be provided"],
      default: "",
    },
    first_name: {
      type: String,
      default: "",
      required: true,
    },
    last_name: {
      type: String,
      default: "",
      required: true,
    },
    contact: [
      {
        phone_number: {
          type: String,
          default: "+254",
          required: true,
        },
        email: {
          type: String,
          default: "",
        },
      },
    ],
    location: [
      {
        latitude: {
          type: String,
          default: "",
          required: true,
        },
        longitude: {
          type: String,
          default: "",
          required: true,
        },
        country: { type: String, default: "KE", required: true },
        city: {
          type: String,
          default: "",
          required: true,
        },
        state: {
          type: String,
          default: "",
        },
      },
    ],
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "",
    },
    active: {
      type: Boolean,
      enum: [true, false],
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

const customer = model("customer", customerSchema);
export default customer;
