const mongoose = require("mongoose");

const adminSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name Field is Required"],
    },
    email: {
      type: String,
      required: [true, "Email Field is Required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password Field is Required"],
    },
    Role: {
      type: String,
      required: [true, "User Role Field is Required"],
    },
    Status: {
      type: String,
      required: [true, "User Status Field is Required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
