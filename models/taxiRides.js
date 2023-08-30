const mongoose = require("mongoose");

const taxiRideSchema = mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    multiplier: {
      type: Number,
      required: true,
    },
    catImg: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "SUSPENDED"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TaxiRide", taxiRideSchema);
