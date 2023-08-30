const mongoose = require("mongoose");

const resMenuItemSchema = mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Restaurant",
    },
    menuName: {
      type: String,
      required: [true, "Menu Name Field is Required"],
    },
    menuImg: {
      type: String,
      required: [true, "Menu Image Field is Required"],
    },
    menuType: {
      type: String,
      required: [true, "Menu Type Field is Required"],
      enum: ["FOOD", "DRINK"],
    },
    price: {
      type: Number,
      required: [true, "Price Field is Required"],
    },
    discountedPrice: {
      type: Number,
    },
    description: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: [true, "Status Field is Required"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResMenuItem", resMenuItemSchema);
