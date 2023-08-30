const mongoose = require("mongoose");

const resReservationSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Restaurant",
    },
    transId: {
      type: String,
      required: [true, "Transaction Id is Field is Required"],
    },
    reservePersons: {
      type: Number,
      required: true,
    },
    checkInDate: {
      type: String,
      required: true,
    },
    checkInTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "BOOKED",
        "CONFIRMED",
        "CHECKEDIN",
        "CHECKEDOUT",
        "CANCEL",
        "DECLINED",
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResReservation", resReservationSchema);
