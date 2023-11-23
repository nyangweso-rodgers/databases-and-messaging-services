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
    required: true,
  },
  lastName: {
    type: String,
    required: true,
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
      longitude: Number
    },
  ],
  date_of_birth: Date,
  age: Number,
  email: {
    type: String,
    minLength: 10,
    required: false,
    lowercase: true,
  }
});

const User = model("User", userSchema);
export default User;
