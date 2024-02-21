// server.js
import http from "http";
import fs from "fs";
import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
import ToDo from "./model/toDoSchemaModel.js";

dotenv.config(); // Load environment variables from .env file

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const server = http.createServer((req, res) => {
  const url = req.url;

  if (url === "/") {
    // check if index.html exists and serve it
    fs.access("index.html", fs.constants.F_OK, (err) => {
      if (err) {
        // file not found send 404 error message
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("File not found");
      } else {
        // file exists, read and serve it
        fs.readFile("index.html", (err, data) => {
          if (err) {
            // internal server error
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal Server Error");
          } else {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            res.end();
          }
        });
      }
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
