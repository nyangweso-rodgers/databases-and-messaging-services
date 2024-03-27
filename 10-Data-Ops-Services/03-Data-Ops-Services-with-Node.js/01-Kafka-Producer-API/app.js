//app.js

import express from "express";
import bodyParser from "body-parser";
import { router } from "./src/routes/kafka-routes.js";
import consumer from "./src/Kafka-Consumer-Service/test-consumer.js";

// create an express application object
const app = express();

// Middleware
app.use(express.json());

// Parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use(router);

consumer.on("ready", () => {
  console.log("Kafka consumer is ready.");
});

// start the server
const port = 6501;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
