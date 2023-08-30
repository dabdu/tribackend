const asyncHandler = require("express-async-handler");
const Car = require("../models/carModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");

const CarBooking = require("../models/carBookingModel");
const { sendMailFunction } = require("../functions/mailFunction");

const addCarDetails = asyncHandler(async (req, res) => {
  const {
    userId,
    carName,
    carModel,
    carColor,
    carImage,
    pricePerDay,
    plateNumber,
    plateNumberImg,
    rideCity,
    rideState,
    carDesc,
  } = req.body;

  if (
    !userId ||
    !carName ||
    !carModel ||
    !carColor ||
    !plateNumber ||
    !plateNumberImg ||
    !carImage ||
    !rideCity ||
    !pricePerDay
  ) {
    res.status(400);
    throw new Error("All Fields Must be fill");
  }
  const car = await Car.create({
    userId,
    carName,
    carModel,
    carColor,
    carImage,
    pricePerDay,
    plateNumber,
    plateNumberImg,
    rideCity,
    rideState,
    carDesc,
    status: "Available",
  });
  res.status(201).json(car);
});
const getCarById = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);
  res.status(200).json(car);
});
const getCarsByUserId = asyncHandler(async (req, res) => {
  const carsByUserId = await Car.find({
    userId: req.params.userId,
  });
  res.status(200).json(carsByUserId);
});
const getCarsByLocation = asyncHandler(async (req, res) => {
  const carsByLocation = await Car.find({
    rideCity: req.params.ride_city,
    status: "Available",
  });
  res.status(200).json(carsByLocation);
});
const getCarsByAvailablity = asyncHandler(async (req, res) => {
  const carsByAvailability = await Car.find({
    status: "Available",
  });
  res.status(200).json(carsByAvailability);
});
const carBooking = asyncHandler(async (req, res) => {
  const {
    userId,
    carId,
    transactionId,
    transactionRef,
    amount,
    days,
    pickupDate,
    returnDate,
    pickupLat,
    pickupLng,
    pickupDesc,
    returnLat,
    returnLng,
    returnDesc,
    status,
    isPaid,
    carOwnerId,
  } = req.body;

  if (
    !userId ||
    !carId ||
    !transactionId ||
    !transactionRef ||
    !amount ||
    !days ||
    !pickupDate ||
    !returnDate ||
    !pickupLat ||
    !pickupLng ||
    !pickupDesc ||
    !status ||
    !carOwnerId
  ) {
    res.status(400);
    throw new Error("All Fields Must be fill");
  }
  const book = await CarBooking.create({
    userId,
    carId,
    carOwnerId,
    transactionId,
    transactionRef,
    amount,
    days,
    pickupDate,
    returnDate,
    pickupLat,
    pickupLng,
    pickupDesc,
    returnLat,
    returnLng,
    returnDesc,
    status,
    isPaid,
  });
  if (!book) {
    return;
  } else {
    await Notification.create({
      userId: userId,
      desc: "Your Car Payment and Booking was successful, Please await the our mail as the car owner confirms your booking. Thank you for using of service.",
      title: "Successful Booking",
      type: "Car",
      status: "unread",
    });
    const car_owner = await User.findById(carOwnerId);
    await sendMailFunction(
      `${car_owner.email}`,
      "Urgent, Confirm Car Rent Request",
      `A User Just request to rent your car from ${pickupDate} to ${returnDate}, Please Login to confirmed user's booking. Thanks`
    );
  }
  res.status(201).json(book);
});
const getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await CarBooking.find({
    userId: req.params.id,
  }).sort({
    createdAt: -1,
  });
  res.status(200).json(bookings);
});
const getAllCarBookings = asyncHandler(async (req, res) => {
  const bookings = await CarBooking.find().sort({
    createdAt: -1,
  });
  res.status(200).json(bookings);
});
const getBookingcarOwnerId = asyncHandler(async (req, res) => {
  const car = await CarBooking.find({ carOwnerId: req.params.carOwnerId }).sort(
    {
      createdAt: -1,
    }
  );
  res.status(200).json(car);
});

const onAccept = asyncHandler(async (req, res) => {
  const accept = await CarBooking.findByIdAndUpdate(
    req.body.id,
    { status: "CONFIRMED" },
    {
      new: true,
    }
  );
  if (!accept) {
    return;
  } else {
    await sendMailFunction(
      `${req.body.userEmail}`,
      "Car Request Accepted",
      `Your Car Request was accepted successfully, the car will be delivered to you on the Booked Date and Location. Thanks`
    );
  }
  res.status(201).send(accept);
});
const onDecline = asyncHandler(async (req, res) => {
  const decline = await CarBooking.findByIdAndUpdate(
    req.body.id,
    { status: "REJECTED" },
    {
      new: true,
    }
  );
  if (!decline) {
    return;
  } else {
    await sendMailFunction(
      `${req.body.userEmail}`,
      "Car Request Declined",
      `Your Car Request was not accepted due to some reasons best known by the Car Owner, your money will be refunded back to you as soon as possible. Thanks`
    );
  }
  res.status(201).send(decline);
});
const onPickedUp = asyncHandler(async (req, res) => {
  const { carId, carOwnerId, id, userEmail, name, returnDate } = req.body;
  const pickedup = await CarBooking.findByIdAndUpdate(
    id,
    { status: "PICKEDUP" },
    {
      new: true,
    }
  );
  if (!pickedup) {
    res.status(400);
    throw new Error("Error Occured!!!");
  } else {
    const unavailable = await Car.findByIdAndUpdate(
      carId,
      { status: "UnAvailable" },
      {
        new: true,
      }
    );
    if (!unavailable) {
      res.status(400);
      throw new Error("Error Occured!!!");
    } else {
      const car_owner = await User.findById(carOwnerId);
      await sendMailFunction(
        `${car_owner.email}`,
        "Car Picked Up",
        `${name} Just Picked Up your Car. which he is expected to return it on ${returnDate}. Thanks`
      );
      await sendMailFunction(
        `${userEmail}`,
        "Car Picked Up",
        `you Just Picked Up the Car you rented. Make sure to return it on ${returnDate} as Booked. Thanks`
      );
    }
  }
  res.status(201).send(pickedup);
});
const onReturn = asyncHandler(async (req, res) => {
  const returned = await CarBooking.findByIdAndUpdate(
    req.body.id,
    { status: "RETURNED" },
    {
      new: true,
    }
  );
  if (!returned) {
    res.status(400);
    throw new Error("Error Occured");
  } else {
    const unavailable = await Car.findByIdAndUpdate(
      req.body.carId,
      { status: "Available" },
      {
        new: true,
      }
    );
    if (!unavailable) {
      res.status(400);
      throw new Error("Error Occured!!!");
    } else {
      await sendMailFunction(
        `${req.body.userEmail}`,
        "Car Request Process Completed",
        `Your Car Request Process is completed successfully, the car rented by you has been returned, Hope to see you soon, don't forget to give review about your exprience with our Service. Thanks`
      );
    }
  }
  res.status(201).send(returned);
});
module.exports = {
  addCarDetails,
  getCarById,
  getCarsByLocation,
  getCarsByUserId,
  getCarsByAvailablity,
  carBooking,
  getUserBookings,
  getAllCarBookings,
  getBookingcarOwnerId,
  onAccept,
  onDecline,
  onPickedUp,
  onReturn,
};
