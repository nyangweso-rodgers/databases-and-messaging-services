import express from "express";

import { produceSaleOrderKafkaMessage } from "../controllers/saleOrderControllerWithKafkaJs.js";

const router = express.Router();

//router for posting record to kafka topic
router.post("/", produceSaleOrderKafkaMessage);

export { router }; // Exporting the router object correctly
