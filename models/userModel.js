const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
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
    phoneNumber: {
      type: String,
      required: [true, "Phone Number Field is Required"],
      unique: true,
    },
    profileImg: {
      type: String,
      required: [true, "Profile Picture is Required"],
    },
    password: {
      type: String,
      required: [true, "Password Field is Required"],
    },
    userRole: {
      type: String,
      required: [true, "User Role Field is Required"],
    },
    userStatus: {
      type: String,
      required: [true, "User Status Field is Required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
