const mongoose = require("mongoose");

const carSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
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
    carImage: {
      type: String,
      required: true,
    },
    pricePerDay: {
      type: Number,
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
    rideCity: {
      type: String,
      required: true,
    },
    rideState: {
      type: String,
    },
    carDesc: {
      type: String,
    },
    carOtherImages: {
      type: [String],
    },
    status: {
      type: String,
      enum: ["Available", "UnAvailable", "Suspended", "AwaitingApproval"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Car", carSchema);
