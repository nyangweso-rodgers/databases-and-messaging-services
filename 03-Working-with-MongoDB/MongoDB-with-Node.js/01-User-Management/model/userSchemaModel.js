import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    slug: { type: String, required: false },
    first_name: {
      type: String,
      required: [true, "Add firstName field"],
      immutable: true,
    },
    last_name: {
      type: String,
      required: [true, "Add lastName field"],
      immutable: true,
    },
    audit: [
      {
        created_at: {
          type: Date,
          default: () => Date.now(),
          immutable: true,
        },
        updated_at: {
          type: Date,
          default: () => Date.now(),
          immutable: false,
        },
      },
    ],
    active: {
      type: Boolean,
      enum: [0, 1],
      required: true,
      default: true,
    },
    location: [
      {
        country: {
          type: String,
          required: true,
          default: "KE",
        },
        city: {
          type: String,
        },
        latitude: {
          type: Number,
        },
        longitude: {
          type: Number,
        },
      },
    ],
    date_of_birth: { type: Date },
    age: { type: Number },
    contact: [
      {
        contact_mobile: {
          type: String,
          required: true,
          default: "+2547........",
        },
        email: {
          type: String,
          minLength: 10,
          required: false,
          lowercase: true,
          unique: true,
        },
      },
    ],
  },
  { collection: "users" }, // Explicitly set the collection name
  { timestamps: true }
);
userSchema.pre("save", function (next) {
  this.updated_at = Date.now(); // update the date every time a document is saved
  next();
});
const User = model("user", userSchema);
export default User;