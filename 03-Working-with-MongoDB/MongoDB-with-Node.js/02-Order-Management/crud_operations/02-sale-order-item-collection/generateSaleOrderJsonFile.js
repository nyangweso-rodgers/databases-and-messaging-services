// generate sales orders from the schema model

import { nanoid } from "nanoid";
import fs from "fs";

const createTestSaleOrders = async () => {
  const saleOrders = [];

  for (let i = 0; i < 21; i++) {
    const saleOrder = {
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
          name: "Test Item " + i+i,
          uom: "Test UOM",
          ordered_qty: Math.floor(Math.random() * 10) + 2, // Random quantity
          unit_selling_price: Math.random() * 100 + 2, // Random price
          // ... other fields
        },
      ],
    };
    saleOrders.push(saleOrder);
  }
  // write orders to a JSON file
  const generatedJsonData = JSON.stringify(saleOrders, null, 2); // pretty print
  fs.writeFileSync("generatedJsonData.json", generatedJsonData);

  console.log("20 test orders created and saved to generatedJsonData.json");
};

createTestSaleOrders();
