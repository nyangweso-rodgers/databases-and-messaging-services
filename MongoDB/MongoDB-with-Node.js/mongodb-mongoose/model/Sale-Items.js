import mongoose from "mongoose";

const { Schema, model } = mongoose;

const saleItemSchema = new Schema({
  createdAt: {
    type: Date,
    immutable: true,
  },
  updatedAt: {
    type: Date,
  },
  created_by_name: String,
  updated_by_name: String,
  active: Boolean,
});
