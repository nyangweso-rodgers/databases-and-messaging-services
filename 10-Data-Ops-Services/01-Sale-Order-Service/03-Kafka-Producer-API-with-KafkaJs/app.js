//Producer API with KafkaJs

import express from "express";
import "dotenv/config";

// create an express application object
const app = express();
const port = process.env.PORT;

//Middleware
app.use(express.json());

// Routes will be written here

// start the server
app.listen(port, (error) => {
  if (!error) {
    console.log(`Server is running on http://localhost:${port}`);
  } else {
    console.log("Error occurred, server can't start", error);
  }
});
