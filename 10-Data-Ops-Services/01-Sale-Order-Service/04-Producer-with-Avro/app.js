import express  from "express";
import bodyParser from "body-parser";
import { router } from "./src/main/routes/producerRoute.js";

const app = express();
const port = process.env.PORT || 8001;

//Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes will be written here
app.use(router);

// start the server
app.listen(port, (error) => {
  if (!error) {
    console.log(`Server is running on http://localhost:${port}`);
  } else {
    console.log("Error occurred, server can't start", error);
  }
});
