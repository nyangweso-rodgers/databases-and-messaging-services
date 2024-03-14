import mongoose from "mongoose";
const { Schema, model } = mongoose;

const saleOrderSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      default: () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");
        const hours = String(currentDate.getHours()).padStart(2, "0");
        const minutes = String(currentDate.getMinutes()).padStart(2, "0");
        const seconds = String(currentDate.getSeconds()).padStart(2, "0");

        return `SO-${year}${month}${day}${hours}${minutes}${seconds}`;
      },
      immutable: true,
    },
    customer: {
      type: "String",
      required: true,
      default: "Test customer",
      immutable: true,
    },
    created_by: {
      type: "string",
      default: "Rodgers",
      required: true,
      immutable: true,
    },
    updated_by: {
      type: "string",
      required: true,
      default: "Rodgers",
      immutable: false,
    },
    order_date: {
      type: Date,
      required: true,
      default: new Date(),
      immutable: true,
    },
    scheduled_delivery_date: {
      type: String,
      required: true,
      immutable: false,
      default: () => {
        const currentDate = new Date();
        const year = String(currentDate.getFullYear());
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
      },
    },
    status: {
      type: String,
      enum: [
        "CREATED",
        "PROCESSING",
        "DELIVERED",
        "PAID",
        "RETURNED",
        "EXPIRED",
      ],
      default: "CREATED",
    },
  },
  { timestamps: true }
);

const saleOrder = model("saleOrder", saleOrderSchema);
export default saleOrder;
