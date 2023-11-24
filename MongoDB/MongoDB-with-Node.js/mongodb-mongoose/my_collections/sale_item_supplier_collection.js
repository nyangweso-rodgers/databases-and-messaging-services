import mongoose from "mongoose";

// import supplier schema
import sale_items_supplier from "../model/saleItemSupplierData";

// create a supplier
const createSupplier = sale_items_supplier.create({
  name: "supplier 1",
  location: [
    {
      country: "Kenya",
    },
  ],
});

// create multiple suppliers
var supplier_list = [
  {
    name: "supplier 1",
    location: [
      {
        country: "Kenya",
      },
    ],
  },
  {
    name: "supplier 2",
    location: [
      {
        country: "Uganda",
      },
    ],
  },
  {
    name: "supplier 3",
    location: [
      {
        country: "Tanzania",
      },
    ],
  },
];
