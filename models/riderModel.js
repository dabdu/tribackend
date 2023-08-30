const mongoose = require("mongoose");

const riderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      unique: true,
    },
    rideCity: {
      type: String,
      required: true,
    },
    rideState: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Available", "UnAvailable", "Suspended"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rider", riderSchema);
