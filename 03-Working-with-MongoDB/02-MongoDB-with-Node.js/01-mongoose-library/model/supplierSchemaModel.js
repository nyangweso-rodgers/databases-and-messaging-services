import mongoose from "mongoose";

const { Schema, model } = mongoose;

const saleItemSupplierSchema = new Schema(
  {
    created_at: {
      type: Date,
      default: new Date(),
      immutable: true,
    },
    updated_at: {
      type: Date,
      default: new Date(),
      required: true,
    },
    created_by_name: {
      type: String,
      required: true,
      default: "Rodgers Nyangweso",
    },
    updated_by_name: {
      type: String,
      required: true,
      default: "Rodgers Nyangweso",
    },
    id: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["CREATED", "APPROVED", "DELETED", "PENDING"],
      default: "CREATED",
    },
    supplier_type: {
      type: String,
      enum: ["Company", "Distributor"],
      required: true,
      default: "Company",
    },
    supplier_contact: [
      {
        email: {
          type: String,
        },
        phone_number: {
          type: String,
        },
        contact_person_name: {
          type: String,
        },
      },
    ],
    items: [
      {
        product_id: {
          type: String,
          default: "supplier product",
        },
      },
    ],
    location: [
      {
        country: {
          type: String,
          required: true,
        },
        city: String,
        latitude: String,
        longitude: String,
      },
    ],
  },
  { timestamps: true }
);

const sale_items_supplier = model(
  "sale_items_supplier",
  saleItemSupplierSchema
);
export default sale_items_supplier;
