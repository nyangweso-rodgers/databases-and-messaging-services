import mongoose from "mongoose";
import { nanoid } from "nanoid";

const { Schema, model } = mongoose;

const saleOrderSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      default: () => nanoid(7),
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
          default: () => Date.now(),
        },
        delivery_date: {
          type: Date,
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
    sales_agent: [{
      id: {
        type: String,
      },
      name: {
        type: String,
        required: true,
        immutable: true,
      },
      contact_mobile: {
        type: String,
        default: "+2547"
      }
    }],
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
    },

    items: [
      {
        item_id: {
          type: "string",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        uom: {
          type: String,
          required: true,
        },
        category_id: {
          type: String,
        },
        ordered_qty: {
          type: Number,
          required: true,
        },
        delivered_qty: {
          type: Number,
          required: true,
        },
        item_status: {
          enum: [
            "ITEM_CREATED",
            "ITEM_PROCESSING",
            "ITEM_DELIVRED",
            "ITEM_PAID",
            "ITEM_RETURNED",
            "ITEM_CANCELLED",
            "PITEM_EXPIRED",
          ],
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
          default: 0,
        },
        total_delivered: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

saleOrderSchema.pre("save", function (next) {
  this.updated_at = Date.now(); // update the date every time a document is saved
  next();
});

const sale_order = model("sale_order", saleOrderSchema);
export default sale_order;
