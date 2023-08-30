const mongoose = require("mongoose");

const roomSchema = mongoose.Schema(
  {
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
    roomName: {
      type: String,
      required: [true, "Room Name Field is Required"],
    },
    categoryName: {
      type: String,
      required: [true, "Category Name Field is Required"],
    },
    status: {
      type: String,
      enum: ["Available", "Occupied", "Unavailable"],
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
