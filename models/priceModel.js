const mongoose = require("mongoose");

const priceSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Price", priceSchema);
