const mongoose = require("mongoose");

const carBookingSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Car",
    },
    carOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Car",
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
    days: {
      type: Number,
      required: true,
    },
    pickupDate: {
      type: String,
      required: true,
    },
    returnDate: {
      type: String,
      required: true,
    },
    pickupLat: {
      type: Number,
      required: true,
    },
    pickupLng: {
      type: Number,
      required: true,
    },
    pickupDesc: {
      type: String,
      required: true,
    },
    returnLat: {
      type: Number,
    },
    returnLng: {
      type: Number,
    },
    returnDesc: {
      type: String,
    },
    isPaid: {
      type: Boolean,
      required: true,
    },
    status: {
      type: String,
      enum: ["BOOKED", "CONFIRMED", "PICKED", "RETURNED", "CANCEL", "REJECTED"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CarBooking", carBookingSchema);
