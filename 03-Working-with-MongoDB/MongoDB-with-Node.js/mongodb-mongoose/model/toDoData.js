import mongoose from "mongoose";

const { Schema, model } = mongoose;

const toDoSchema = new Schema(
  {
    created_at: {
      type: Date,
      required: true,
      default: new Date(),
      immutable: true
    },
    task_id: {
      type: Schema.Types.Integer.ObjectId,
      required: [true, "Enter task ID"],
    },
    description: {
      type: String,
      required: [true, "Enter task description"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// use the schema to create a model
const to_do = model("to_do", toDoSchema);
export default to_do;
