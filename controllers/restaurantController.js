const asyncHandler = require("express-async-handler");
const Restaurant = require("../models/restaurantModel");
const ResReservation = require("../models/resReservationModel");
const ResMenuItem = require("../models/resMenuItemModel");
const User = require("../models/userModel");
const ResMenuOrder = require("../models/resMenuOrder");
const Rider = require("../models/riderModel");
const { sendMailFunction } = require("../functions/mailFunction");

const adminAddrestaurant = asyncHandler(async (req, res) => {
  const {
    restaurantName,
    fImg,
    address,
    state,
    town,
    openDaysStart,
    openDaysEnd,
    lat,
    lng,
    description,
    terms,
    user,
  } = req.body;

  if (
    !restaurantName ||
    !fImg ||
    !town ||
    !openDaysStart ||
    !openDaysEnd ||
    !state ||
    !description ||
    !user
  ) {
    res.status(400);
    throw new Error("All Fields Must be fill");
  }
  const restaurant = await Restaurant.create({
    user,
    restaurantName,
    fImg,
    address,
    state,
    town,
    openDaysStart,
    openDaysEnd,
    lat,
    lng,
    description,
    terms,
    resStatus: "ACTIVE",
  });
  res.status(201).json(restaurant);
});
const adminGetAllRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find();
  res.status(200).json(restaurants);
});
const addNewReservation = asyncHandler(async (req, res) => {
  const {
    restaurantId,
    transId,
    checkInDate,
    checkInTime,
    reservePersons,
    status,
  } = req.body;

  if (
    !restaurantId ||
    !transId ||
    !reservePersons ||
    !checkInDate ||
    !checkInTime ||
    !status
  ) {
    res.status(400);
    throw new Error("All Fields Must be fill");
  }
  const reservation = await ResReservation.create({
    userId: req.user.id,
    restaurantId,
    transId,
    reservePersons,
    checkInDate,
    checkInTime,
    status,
  });
  res.status(201).json(reservation);
});
const getUserReservations = asyncHandler(async (req, res) => {
  const reservations = await ResReservation.find({
    userId: req.params.id,
  }).sort({
    createdAt: -1,
  });
  res.status(200).json(reservations);
});
const adminGetAllReservations = asyncHandler(async (req, res) => {
  const reservations = await ResReservation.find();
  res.status(200).json(reservations);
});

const getAdminRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({
    user: req.params.user_id,
  });
  res.status(200).json(restaurant);
});

const getRestaurantReservations = asyncHandler(async (req, res) => {
  const reservations = await ResReservation.find({
    restaurantId: req.params.restaurantId,
  }).sort({
    createdAt: -1,
  });
  res.status(200).json(reservations);
});
const onAcceptReservation = asyncHandler(async (req, res) => {
  const accept = await ResReservation.findByIdAndUpdate(
    req.body.id,
    { status: "CONFIRMED" },
    {
      new: true,
    }
  );
  if (!accept) {
    res.status(400);
    throw new Error("Error Occured, Please Try Again");
  } else {
    await sendMailFunction(
      `${req.body.userEmail}`,
      "Reservation Confirmed",
      `Your Reseravtion Accept and Confirm by the Admin on the Time and date booked by You. Thanks`
    );
  }
  res.status(201).send(accept);
});
const onDeclineReservation = asyncHandler(async (req, res) => {
  const decline = await ResReservation.findByIdAndUpdate(
    req.body.id,
    { status: "DECLINED" },
    {
      new: true,
    }
  );
  if (!decline) {
    res.status(400);
    throw new Error("Error Occured, Please Try Again");
  } else {
    await sendMailFunction(
      `${req.body.userEmail}`,
      "Reservation  Declined",
      `Your Reservation request was declined by the admin, Sorry for the incoviences. Thanks`
    );
  }
  res.status(201).send(decline);
});
const onCheckedIn = asyncHandler(async (req, res) => {
  const check_in = await ResReservation.findByIdAndUpdate(
    req.body.id,
    { status: "CHECKEDIN" },
    {
      new: true,
    }
  );
  if (!check_in) {
    res.status(400);
    throw new Error("Error Occured, Please Try Again");
  } else {
    await sendMailFunction(
      `${req.body.userEmail}`,
      "Reservation In Progress",
      `Your Reservation Has Just started, Have Enjoy your Awesome moment with Us. Thanks`
    );
  }
  res.status(201).send(check_in);
});
const onCheckedOut = asyncHandler(async (req, res) => {
  const check_out = await ResReservation.findByIdAndUpdate(
    req.body.id,
    { status: "CHECKEDOUT" },
    {
      new: true,
    }
  );
  if (!check_out) {
    res.status(400);
    throw new Error("Error Occured, Please Try Again");
  } else {
    await sendMailFunction(
      `${req.body.userEmail}`,
      "Reservation  Completed",
      `You have just been checked out, Reservation Completed - Booked, Confirmed, Checked In, Checked Out all Successful. Hope you had a Wonderful moment with us. Thanks`
    );
  }
  res.status(201).send(check_out);
});
const addMenuItem = asyncHandler(async (req, res) => {
  const {
    restaurantId,
    menuName,
    menuImg,
    menuType,
    price,
    location,
    discountedPrice,
    description,
  } = req.body;

  if (
    !restaurantId ||
    !price ||
    !menuName ||
    !menuImg ||
    !menuType ||
    !location
  ) {
    res.status(400);
    throw new Error("All Fields Must be fill");
  }
  const menu_item = await ResMenuItem.create({
    restaurantId,
    menuName,
    menuImg,
    menuType,
    price,
    discountedPrice,
    description,
    location,
  });
  res.status(201).json(menu_item);
});
const getDishByLocation = asyncHandler(async (req, res) => {
  // const menu_items = await ResMenuItem.find({
  //   location: req.params.location,
  // }).sort({
  //   createdAt: -1,
  // });
  const menu_items = await ResMenuItem.aggregate([
    {
      $lookup: {
        from: "restaurants", // The name of the Restaurant collection
        localField: "restaurantId",
        foreignField: "_id",
        as: "restaurant",
      },
    },
    {
      $unwind: "$restaurant", // Unwind the restaurant array
    },
    {
      $match: {
        "restaurant.resStatus": "ACTIVE", // Filter based on the resStatus field
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);
  // Now, menu_items contains only menu items from active restaurants

  res.status(200).json(menu_items);
});
const getRestaurantByLocation = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find({
    location: req.params.location,
    resStatus: "ACTIVE",
  }).sort({
    createdAt: -1,
  });
  // Now, restaurants contains only menu items from active restaurants

  res.status(200).json(restaurants);
});
const getRestaurantMenuItems = asyncHandler(async (req, res) => {
  const menu_items = await ResMenuItem.find({
    restaurantId: req.params.id,
  }).sort({
    createdAt: -1,
  });
  res.status(200).json(menu_items);
});
const createOrder = asyncHandler(async (req, res) => {
  const {
    userId,
    restaurantId,
    transactionId,
    transactionRef,
    amount,
    orderedItems,
    status,
    isPaid,
    paymentMode,
    deliveryAddress,
  } = req.body;

  if (
    !userId ||
    !restaurantId ||
    !transactionId ||
    !transactionRef ||
    !amount ||
    !orderedItems ||
    !status ||
    !paymentMode ||
    !deliveryAddress
  ) {
    res.status(400);
    throw new Error("All Fields Must be fill");
  }
  const order = await ResMenuOrder.create({
    userId,
    restaurantId,
    transactionId,
    transactionRef,
    amount,
    orderedItems,
    deliveryAddress,
    status,
    isPaid,
    paymentMode,
    assignedRiderId: "",
  });
  if (!order) {
    res.status(400);
    throw new Error("Error Occured, Please Try Again");
  } else {
    const restaurant = await Restaurant.findById(restaurantId);
    const user = await User.findById(restaurant.user);
    console.log(user);
    await sendMailFunction(
      `${user.email},`,
      "Urgent, Confrim Order",
      "You Just recieve a new Order, Please Login on your Dashboard to Confirm and process the Order. Thanks"
    );
  }
  res.status(201).json(order);
});
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await ResMenuOrder.find({
    userId: req.params.id,
  }).sort({
    createdAt: -1,
  });
  res.status(200).json(orders);
});
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await ResMenuOrder.find();
  res.status(200).json(orders);
});
const getRestaurantOrders = asyncHandler(async (req, res) => {
  const orders = await ResMenuOrder.find({
    restaurantId: req.params.restaurantId,
  }).sort({
    createdAt: -1,
  });
  res.status(200).json(orders);
});
const onAcceptOrder = asyncHandler(async (req, res) => {
  const accept = await ResMenuOrder.findByIdAndUpdate(
    req.body.id,
    { status: "ACCEPT" },
    {
      new: true,
    }
  );
  if (!accept) {
    res.status(400);
    throw new Error("Error Occured, Please Try Again");
  } else {
    await sendMailFunction(
      `${req.body.userEmail}`,
      "Order Confirmed",
      `Your Order has been Accepted and Confirmed by the Admin, Dish Preparation and Proccessing in Progress, You Will Be update in due cause. Thanks`
    );
  }
  res.status(201).send(accept);
});
const onDeclineOrder = asyncHandler(async (req, res) => {
  const decline = await ResMenuOrder.findByIdAndUpdate(
    req.body.id,
    { status: "DECLINE" },
    {
      new: true,
    }
  );
  if (!decline) {
    res.status(400);
    throw new Error("Error Occured, Please Try Again");
  } else {
    await sendMailFunction(
      `${req.body.userEmail}`,
      "Order  Declined",
      `Your Order request was declined by the admin due to unavoidable reasons, Your refund shall be made immediately, Sorry for the incoviences. Thanks`
    );
  }
  res.status(201).send(decline);
});
const onCookingOrder = asyncHandler(async (req, res) => {
  const cooking = await ResMenuOrder.findByIdAndUpdate(
    req.body.id,
    { status: "COOKING" },
    {
      new: true,
    }
  );
  if (!cooking) {
    res.status(400);
    throw new Error("Error Occured, Please Try Again");
  } else {
    await sendMailFunction(
      `${req.body.userEmail}`,
      "Order  Processing Started",
      `Your Order Processing Has started, Your order will soon be ready for Pick Up. Thanks`
    );
  }
  res.status(201).send(cooking);
});
const onOrderReady = asyncHandler(async (req, res) => {
  const { id, userEmail, rideCity } = req.body;

  if (!id || !userEmail || !rideCity) {
    res.status(400);
    throw new Error("All Fields Must be fill");
  }

  const on_ready = await ResMenuOrder.findByIdAndUpdate(
    id,
    { status: "READY_FOR_PICKUP" },
    {
      new: true,
    }
  );
  if (!on_ready) {
    res.status(400);
    throw new Error("Error Occured, Please Try Again");
  } else {
    const ridersByLocation = await Rider.find({
      rideCity: rideCity,
      status: "Available",
    });
    for (const val of ridersByLocation) {
      const riders = await User.find({ _id: val.userId });
      await sendMailFunction(
        `${riders[0].email},`,
        "Urgent, Confirm Dispatch Request",
        "A Food Delivery Request in your locality, Quickly Login into your dashboard to check request Details and Accept, before anyone does. Thanks"
      );
    }
    await sendMailFunction(
      `${req.body.userEmail}`,
      "Order  Ready",
      `Your Order Ready for Pickup awaiting nearest Delivery Man Confirmation, Your order will soon be Pick Up For Pick up. Thanks`
    );
  }
  res.status(201).json(on_ready);
});
module.exports = {
  adminAddrestaurant,
  adminGetAllRestaurants,
  adminGetAllReservations,
  addNewReservation,
  getUserReservations,
  getRestaurantByLocation,
  addMenuItem,
  getRestaurantMenuItems,
  getAdminRestaurant,
  getRestaurantReservations,
  onAcceptReservation,
  onDeclineReservation,
  onCheckedIn,
  onCheckedOut,
  createOrder,
  getUserOrders,
  getRestaurantOrders,
  onAcceptOrder,
  onDeclineOrder,
  onCookingOrder,
  onOrderReady,
  getAllOrders,
  getDishByLocation,
};
