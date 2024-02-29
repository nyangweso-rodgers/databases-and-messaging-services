import mongoose from "mongoose";

const { Schema, model } = mongoose;

const vehicleSchema = new Schema({
  created_at: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
    required: true,
  },
  updated_at: {
    type: Date,
    default: () => Date.now(),
    required: true,
  },
  wheels: {
    type: String,
  },
  doors: {
    type: String,
  },
  engine_capacity: {},
  make: {
    enum: ["Audi", "Isuzu", "Toyota", "Nissan", "Honda", "Suzuki", "Subaru"],
  },
  model: {
    enum: ["Skyline"],
  },
  capacity: {},
  vehicle_type: {
    enum: ["VAN", "LORRY", "PICK-UP", "CANTER", "TUK TUK"],
  },
});
