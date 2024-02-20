// server.js

import mongoose, { mongo } from "mongoose";
//const mongoose = require("mongoose");

import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

//require("dotenv").config();

const uri = process.env.MONGO_URI;
//const ToDo = require("./model/toDoSchemaModel.js");
import ToDo from "./model/toDoSchemaModel.js";

mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

server.post("/api/tasks", async (req, res) => {
  const newTask = new ToDo(req.body);
  try {
    await newTask.save();
    res.json({ message: "Task added successfully!" });
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ message: "Error adding task" });
  }
});
