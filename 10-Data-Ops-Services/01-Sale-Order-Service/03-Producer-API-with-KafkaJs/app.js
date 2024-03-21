//Producer API with KafkaJs

import express from "express";

// create an express application object
const app = express();


// start the server
const port = 80;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});