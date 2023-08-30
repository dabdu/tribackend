const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Hotel",
    },
    categoryName: {
      type: String,
      required: [true, "Category Name Field is Required"],
    },
    price: {
      type: Number,
      required: [true, "Price Field is Required"],
    },
    discountedPrice: {
      type: Number,
      required: [true, "Price Field is Required"],
    },
    maxPersons: {
      type: Number,
      required: [true, "Number of Persons is Required"],
    },
    features: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
