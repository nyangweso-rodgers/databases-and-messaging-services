// generate random 100 sale orders and insert them into the sale_orders collection

import mongoose from "mongoose";
import { nanoid } from "nanoid";

// import the saleOrderSchema
import SaleOrder from "../../model/saleOrderSchemaModel.js";

const connectionURI =
  "mongodb+srv://nyangweso-rodgers:Mqns718Gf5Ixgk68@test-cluster.uo4jsy5.mongodb.net/order-management?retryWrites=true&w=majority"; //TODO: insert a connection string

mongoose
  .connect(connectionURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const insertRandomGeneratedSaleOrders = async () => {
  const saleOrders = [];

  for (let i = 1; i < 101; i++) {
    const saleOrder = new SaleOrder({
      id: nanoid(20),
      audit: {
        created_at: Date.now(),
        order_date: Date.now(),
        scheduled_delivery_date: Date.now(),
        delivery_date: Date.now(),
      },
      created_by_name: "Random User" + i,
      updated_by_name: "Rodgers Nyangweso",
      sales_agent: [
        {
          id: nanoid(20),
          name: "Test Sales Agent" + i,
          contact_mobile: "+2547",
        },
      ],
      status: "CREATED", // Or choose a random status from the enum
      items: [
        {
          item_id: nanoid(10),
          name: "Test Item " + i,
          uom: "Test UOM",
          ordered_qty: Math.floor(Math.random() * 10) + 1, // Random quantity
          unit_selling_price: Math.random() * 100 + 1, // Random price
          // ... other fields
        },
        {
          item_id: nanoid(10),
          name: "Test Item " + i + i,
          uom: "Test UOM",
          ordered_qty: Math.floor(Math.random() * 10) + 2, // Random quantity
          unit_selling_price: Math.random() * 100 + 2, // Random price
          // ... other fields
        },
      ],
    });
    try {
      await saleOrder.save(); // save to a database
      saleOrders.push(saleOrder); // Add to array for JSON file
    } catch (error) {
      console.error("Error creating a sale_order", error);
    }
  }
};

insertRandomGeneratedSaleOrders();
