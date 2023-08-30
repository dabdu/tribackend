const mongoose = require("mongoose");

const flightBookingSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    transId: {
      type: String,
      required: true,
    },
    flightDetails: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    flightReferenceID: {
      type: String,
      required: true,
    },
    isPaid: {
      type: Boolean,
      required: true,
    },
    status: {
      type: String,
      enum: ["BOOKED", "PENDING", "CONFIRMED", "USED", "CANCEL", "REFUNDED"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("flightBooking", flightBookingSchema);
