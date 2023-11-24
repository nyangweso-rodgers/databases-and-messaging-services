import mongoose from "mongoose";
import sale_items from "../model/saleItemData";

// create a sale item

const createSaleItem = sale_items.create({
  country: "Kenya",
  active: true,
  item_code: "item code 1",
});

console.log(createSaleItem);

// create multiple sale items
