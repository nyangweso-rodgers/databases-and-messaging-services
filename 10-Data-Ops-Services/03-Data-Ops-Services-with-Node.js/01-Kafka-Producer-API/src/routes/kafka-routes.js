//routes

import express from "express";

//import bodyParser from "body-parser";
import { postMessage } from "../controllers/kafka-controller.js";

const router = express.Router();

router.post("/", postMessage);

//module.exports = router;
export { router }; // Exporting the router object correctly