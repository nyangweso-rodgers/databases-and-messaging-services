// routes/orderRoutes.js
import express from "express";
import createSaleOrder from "../controllers/order-controller.js";

const router = express.Router();

// Route for creating a new sale order
router.post("/orders/create", createSaleOrder);

//export default router;
export { router }; // Exporting the router object correctly