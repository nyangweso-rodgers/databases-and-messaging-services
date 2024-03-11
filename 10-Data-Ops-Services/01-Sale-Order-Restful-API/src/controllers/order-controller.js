// controllers/orderController.js

import saleOrder from "../model/saleOrderSchemaModel.js";

const createSaleOrder = async (req, res) => {
  try {
    // Extract the order details from the request body
    const orderData = req.body;

    // Create a new order document
    const newSaleOrder = await saleOrder.create(orderData);

    // Send a success response with the newly created order
    res.status(201).json({ status: "success", data: { order: newSaleOrder } });
  } catch (error) {
    //handle any errors
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

export default createSaleOrder;
