const mongoose = require("mongoose");

const reservationSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    hotelAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Hotel",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    transId: {
      type: String,
      required: [true, "Transaction Id is Field is Required"],
    },
    nights: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    checkInDate: {
      type: String,
      required: true,
    },
    checkOutDate: {
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
    assignedRoomId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
