const asyncHandler = require("express-async-handler");
const Price = require("../../models/priceModel");
const initiateDeliveryPrice = asyncHandler(async (req, res) => {
  const price = await Price.create({
    price: 200,
    description: "deliveryChargesPerMile",
  });
  res.status(201).json(price);
});
const updateDeliveryCharges = asyncHandler(async (req, res) => {
  const { deliveryChargesPerMile } = req.body;

  if (!deliveryChargesPerMile) {
    res.status(400);
    throw new Error("All Fields Must be fill");
  }
  const price = await Price.findOne({
    description: "deliveryChargesPerMile",
  });
  const update = await Price.findByIdAndUpdate(
    price._id,
    { price: deliveryChargesPerMile },
    {
      new: true,
    }
  );
  res.status(201).json(update);
});
const getDeliveryCharges = asyncHandler(async (req, res) => {
  const price = await Price.findOne({
    deliveryChargesPerMile: "deliveryChargesPerMile",
  });
  res.status(200).json(price);
});

module.exports = {
  initiateDeliveryPrice,
  updateDeliveryCharges,
  getDeliveryCharges,
};
