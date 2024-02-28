// define a schema model
import mongoose from "mongoose";
//const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const toDoSchema = new Schema(
  {
    created_by: {
      type: String,
      default: "Rodgers Nyangweso",
      immutable: true,
      required: true,
    },
    updated_by: {
      type: String,
      default: "Rodgers Nyangweso",
      immutable: false,
      required: true,
    },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

// use the schema to create a model
const ToDo = model("to_do", toDoSchema);
export default ToDo;
