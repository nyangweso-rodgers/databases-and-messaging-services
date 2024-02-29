import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
  title: {
    type: String,
    required: false,
  },
  slug: String,
  firstName: {
    type: String,
    required: [true, "Add firstName field"],
  },
  lastName: {
    type: String,
    required: [true, 'Add lastName field'],
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
    immutable: false,
  },
  active: Boolean,
  location: [
    {
      country: String,
      city: String,
      latitude: Number,
      longitude: Number,
    },
  ],
  date_of_birth: Date,
  age: Number,
  email: {
    type: String,
    minLength: 10,
    required: false,
    lowercase: true,
    unique: true,
  },
});

const user = model("User", userSchema);
export default user;
