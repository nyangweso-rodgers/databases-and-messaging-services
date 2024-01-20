import mongoose from "mongoose";

const { Schema, model } = mongoose;

const customerSchema = new Schema(
  {
    audit: [
      {
        created_at: {
          type: Date,
          required: true,
          default: new Date(),
          immutable: true,
        },
        updated_at: [
          {
            type: Date,
            required: true,
          },
        ],
      },
    ],
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
          required: false,
        },
        longitude: {
          type: String,
          default: "",
          required: false,
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
      enum: ["Male", "Female"],
      default: "",
    },
    active: {
      type: Boolean,
      enum: [true, false],
      required: true,
      default: true,
    },
  },
  { collection: "customers" },
  { timestamps: true }
);

const Customer = model("customers", customerSchema);
export default Customer;
