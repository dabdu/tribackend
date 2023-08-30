const mongoose = require("mongoose");
const ItemSchema = mongoose.Schema({
  menuId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "ResMenuItem",
  },
  menuName: {
    type: String,
    required: [true, "Menu Name Field is Required"],
  },
  menuImg: {
    type: String,
    required: [true, "Menu Image Field is Required"],
  },
  price: {
    type: Number,
    required: [true, "Price Field is Required"],
  },
  qty: {
    type: Number,
    required: [true, "Order Quantity Field is Required"],
  },
  //   restaurantId: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     required: true,
  //     ref: "Restaurant",
  //   }
});
const locationSchema = mongoose.Schema({
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
});
const deliverySchema = mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  location: {
    type: locationSchema,
    required: true,
  },
  deliveryCity: {
    type: String,
    required: true,
  },
  deliveryFee: {
    type: Number,
    required: true,
  },
});
const resMenuOrderSchema = mongoose.Schema(
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
    deliveryAddress: {
      type: deliverySchema,
      required: true,
    },
    orderedItems: {
      type: [ItemSchema],
      required: true,
    },
    isPaid: {
      type: Boolean,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "NEW",
        "ACCEPT",
        "COOKING",
        "READY_FOR_PICKUP",
        "DELIVERY_ACCEPTED",
        "PICKED_UP",
        "COMPLETED",
        "CANCEL",
        "REFUNDED",
        "DECLINE",
      ],
    },
    paymentMode: {
      type: String,
      required: true,
    },
    assignedRiderId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResMenuOrder", resMenuOrderSchema);
