import mongoose from "mongoose";

import to_do from "../model/toDoData.js";

// Create a to do document
const createToDo = to_do.create({
  description: "Respond to emails",
});

console.log(createToDo);
