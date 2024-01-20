import mongoose from "mongoose";
import { nanoid } from "nanoid";

const { Schema, model } = mongoose;

const saleOrderSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      default: () => nanoid(20),
    },
    audit: [
      {
        created_at: {
          type: Date,
          required: [true, "add Created At!"],
          default: () => Date.now(),
          immutable: true,
        },
        order_date: {
          type: Date,
          default: () => Date.now(),
        },
        scheduled_delivery_date: {
          type: Date,
          default: () => {
            const currentDate = new Date();

            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, "0");
            const day = String(currentDate.getDate()).padStart(2, "0");

            return `${year}-${month}-${day}`;
          },
        },
        delivery_date: {
          type: Date,
          default: () => Date.now(),
        },
      },
    ],
    created_by_name: {
      type: String,
      default: "Rodgers Nyangweso",
      required: true,
      immutable: true,
    },
    updated_by_name: {
      type: String,
      default: "Rodgers Nyangweso",
      required: true,
    },
    sales_agent: [
      {
        id: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          default: "Rodgers Nyangweso",
          required: true,
          immutable: true,
        },
        contact_mobile: {
          type: String,
          default: "+2547",
          required: true,
        },
      },
    ],
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

    items: [
      {
        item_id: {
          type: "string",
          required: true,
          default: "A",
        },
        name: {
          type: String,
          required: true,
          default: "Test item name",
        },
        uom: {
          type: String,
          required: true,
          default: "Test uom",
        },
        category_id: {
          type: String,
        },
        ordered_qty: {
          type: Number,
          required: true,
          default: 1,
        },
        delivered_qty: {
          type: Number,
          required: true,
          default: 0,
        },
        item_status: {
          type: String,
          enum: [
            "ITEM_CREATED",
            "ITEM_PROCESSING",
            "ITEM_DELIVRED",
            "ITEM_PAID",
            "ITEM_RETURNED",
            "ITEM_CANCELLED",
            "PITEM_EXPIRED",
          ],
          default: "ITEM_CREATED",
          required: true,
        },
        currency: {
          type: String,
          default: "KES",
          required: true,
          immutable: true,
        },
        discount_amount: {
          type: Number,
          required: true,
          default: 0,
        },
        unit_selling_price: {
          required: true,
          default: 0.0,
          type: mongoose.Decimal128,
        },
        total_ordered: {
          type: Number,
          required: true,
          default: 1,
        },
        total_delivered: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],
  },
  {
    collection: "sale_order", // Explicitly set the collection name
  },
  { timestamps: true }
);

saleOrderSchema.pre("save", function (next) {
  this.updated_at = Date.now(); // update the date every time a document is saved
  next();
});

const SaleOrder = model("sale_order", saleOrderSchema);
export default SaleOrder;
