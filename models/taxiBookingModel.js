const mongoose = require("mongoose");

const taxiBookingnSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "TaxiRide",
    },
    transactionId: {
      type: String,
      required: true,
    },
    transactionRef: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    rideCity: {
      type: String,
      required: true,
    },
    pickupDate: {
      type: String,
      required: true,
    },
    pickupTime: {
      type: String,
      required: true,
    },
    originLat: {
      type: Number,
      required: true,
    },
    originLng: {
      type: Number,
      required: true,
    },
    originDesc: {
      type: String,
      required: true,
    },
    destLat: {
      type: Number,
      required: true,
    },
    destLng: {
      type: Number,
      required: true,
    },
    destDesc: {
      type: String,
      required: true,
    },
    isPaid: {
      type: Boolean,
      required: true,
    },
    status: {
      type: String,
      enum: ["BOOKED", "CONFIRMED", "CHECKEDIN", "CHECKEDOUT", "CANCEL"],
    },
    assignedCarId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TaxiBooking", taxiBookingnSchema);
