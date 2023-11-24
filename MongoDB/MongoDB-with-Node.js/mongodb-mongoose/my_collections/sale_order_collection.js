import mongoose from "mongoose";

import sale_order from "../model/saleOrderData";

// create a new sale order
const createSaleOrder = sale_order.create({
  customer: [
    {
      customer_name: "Customer 2",
    },
  ],
});

console.log(createSaleOrder);
