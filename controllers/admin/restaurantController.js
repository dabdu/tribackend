const asyncHandler = require("express-async-handler");
const User = require("../../models/userModel");
const Restaurant = require("../../models/restaurantModel");
const ResReservation = require("../../models/resReservationModel");
const ResMenuOrder = require("../../models/resMenuOrder");
const ResMenuItem = require("../../models/resMenuItemModel");
const { primaryEmail } = require("../../functions/data");
const { sendMailFunction } = require("../../functions/mailFunction");

const onApproveResAdmin = asyncHandler(async (req, res) => {
  const { userID } = req.body;

  if (!userID) {
    res.status(400);
    throw new Error("Inavlid User");
  }
  const user = await User.findByIdAndUpdate(
    userID,
    { userStatus: "active" },
    {
      new: true,
    }
  );
  // send Login credential to USer primaryEmail
  const splited = user?.name?.split(" ");
  const password = splited[0].toLowerCase() + "20";
  await sendMailFunction(
    `${user.email}`,
    "Account Approved",
    `Dear Esteemed Vendor, your account has been approved, and these are you login credentials, Email: ${user.email} and password: ${password}. Once you Logged in you can add your restaurant details and add dishes to your restuarant, you welcome onboard. Thanks, Triluxy.`
  );
  res.status(201).send({ message: "User Status Changed Successfully" });
});
const onDeactivateResAdmin = asyncHandler(async (req, res) => {
  const { userID } = req.body;

  if (!userID) {
    res.status(400);
    throw new Error("Inavlid User");
  }
  const getUser = await User.findByIdAndUpdate(
    userID,
    { userStatus: "DEACTIVATED" },
    {
      new: true,
    }
  );
  console.log(getUser._id.toString());
  const restaurant = await Restaurant.findOne({
    user: getUser._id,
  });
  console.log(restaurant);
  await Restaurant.findByIdAndUpdate(
    restaurant._id,
    { resStatus: "DEACTIVATED" },
    {
      new: true,
    }
  );
  // send login
  await sendMailFunction(
    `${getUser.email}`,
    "Account Deactivated",
    `Dear Esteemed Vendor, your account has been Deactivated, you can't have access to your account, and you items won't be visible on the App, contact the Administrator for further clarity. Thanks, Triluxy.`
  );
  res.status(201).send({ message: "User Account Deactivated Successfully" });
});
const GetAllRestaurantAdmins = asyncHandler(async (req, res) => {
  const admins = await User.find({
    userRole: "resAdmin",
  }).sort({
    createdAt: -1,
  });
  res.status(200).json(admins);
});
const GetAllRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find().sort({
    createdAt: -1,
  });
  res.status(200).json(restaurants);
});

const GetAllMenuItems = asyncHandler(async (req, res) => {
  const reservations = await ResMenuItem.find()
    .sort({
      createdAt: -1,
    })
    .populate("restaurantId");
  res.status(200).json(reservations);
});
{
  /*
DISH ORDERS  FUCTIONS STARTS HERE
*/
}
const GetAllDishOrders = asyncHandler(async (req, res) => {
  const reservations = await ResMenuOrder.find()
    .sort({
      createdAt: -1,
    })
    .populate("userId")
    .populate("restaurantId");
  res.status(200).json(reservations);
});
const GetSingleOrder = asyncHandler(async (req, res) => {
  const order = await ResMenuOrder.findById(req.params.id)
    .populate("userId")
    .populate("restaurantId")
    .populate("assignedRiderId");
  res.status(200).json(order);
});
{
  /*
DISH ORDERS  FUCTIONS STARTS HERE
*/
}
{
  /*
RESERVATIONS FUCTIONS STARTS HERE
*/
}
const GetAllReservations = asyncHandler(async (req, res) => {
  const reservations = await ResReservation.find()
    .sort({
      createdAt: -1,
    })
    .populate("userId")
    .populate("restaurantId");
  res.status(200).json(reservations);
});
const GetSingleReservation = asyncHandler(async (req, res) => {
  const reservation = await ResReservation.findById(req.params.id)
    .populate("userId")
    .populate("restaurantId");
  res.status(200).json(reservation);
});
{
  /*
RESERVATIONS FUCTIONS ENDS HERE
*/
}

module.exports = {
  GetAllRestaurantAdmins,
  GetAllRestaurants,
  GetAllReservations,
  GetAllDishOrders,
  GetAllMenuItems,
  onApproveResAdmin,
  GetSingleReservation,
  GetSingleOrder,
  onDeactivateResAdmin,
};
