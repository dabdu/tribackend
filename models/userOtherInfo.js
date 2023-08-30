const mongoose = require("mongoose");

const userOtherInfoSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      unique: true,
    },
    gender: {
      type: String,
      required: [true, "State Field is Required"],
    },
    address: {
      type: String,
      required: [true, "Address Field is Required"],
    },
    state: {
      type: String,
      required: [true, "State Field is Required"],
    },
    town: {
      type: String,
      required: [true, "Town Field is Required"],
    },
    zipCode: {
      type: String,
      required: [true, "Zip Code Field is Required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserOtherInfo", userOtherInfoSchema);
