const mongoose = require("mongoose");

const taxiDriverSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      unique: true,
    },
    carName: {
      type: String,
      required: true,
    },
    carModel: {
      type: String,
      required: true,
    },
    carColor: {
      type: String,
      required: true,
    },
    plateNumber: {
      type: String,
      required: true,
    },
    plateNumberImg: {
      type: String,
      required: true,
    },
    carImage: {
      type: String,
      required: true,
    },
    licenseNumber: {
      type: String,
      required: true,
    },
    licenseImg: {
      type: String,
      required: true,
    },
    rideCity: {
      type: String,
      required: true,
    },
    rideState: {
      type: String,
      required: true,
    },
    carDesc: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Available", "UnAvailable", "Suspended"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TaxiDriver", taxiDriverSchema);
