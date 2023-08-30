const asyncHandler = require("express-async-handler");
const TaxiBooking = require("../models/taxiBookingModel");
const TaxiCar = require("../models/taxiCarModel");
const TaxiRide = require("../models/taxiRides");
const User = require("../models/userModel");
const TaxiDriver = require("../models/taxiDriverModel");
const { sendMailFunction } = require("../functions/mailFunction");
const addTaxiRides = asyncHandler(async (req, res) => {
  const { categoryName, multiplier, catImg } = req.body;

  if (!categoryName || !catImg || !multiplier) {
    res.status(400);
    throw new Error("All Fields Must be fill");
  }
  const ride = await TaxiRide.create({
    categoryName,
    multiplier,
    catImg,
    status: "ACTIVE",
  });
  res.status(201).json(ride);
});
const getTaxiRides = asyncHandler(async (req, res) => {
  const rides = await TaxiRide.find();
  res.status(200).json(rides);
});
const addBooking = asyncHandler(async (req, res) => {
  const {
    userId,
    categoryId,
    transactionId,
    transactionRef,
    amount,
    pickupDate,
    pickupTime,
    originLat,
    originLng,
    originDesc,
    destLat,
    destLng,
    destDesc,
    status,
    rideCity,
  } = req.body;

  if (
    !userId ||
    !categoryId ||
    !transactionId ||
    !transactionRef ||
    !amount ||
    !pickupDate ||
    !pickupTime ||
    !originLat ||
    !originLng ||
    !originDesc ||
    !destLat ||
    !destLng ||
    !destDesc ||
    !status ||
    !rideCity
  ) {
    res.status(400);
    throw new Error("All Fields Must be fill");
  }
  const book = await TaxiBooking.create({
    userId,
    categoryId,
    transactionId,
    transactionRef,
    amount,
    pickupDate,
    pickupTime,
    originLat,
    originLng,
    originDesc,
    destLat,
    destLng,
    destDesc,
    status,
    isPaid: true,
    assignedCarId: "",
    rideCity,
  });
  if (!book) {
    return;
  } else {
    const driversByLocation = await TaxiDriver.find({
      rideCity: rideCity,
      status: "Available",
    });
    for (const val of driversByLocation) {
      const drivers = await User.find({ _id: val.userId });
      await sendMailFunction(
        `${drivers[0].email},`,
        "Urgent, Confirm Ride Request",
        "A User Just Booked a ride now with your locality, Quickly Login into your dashboard and Accept, by anyone does. Thanks"
      );
    }
  }
  res.status(201).json(book);
});
const getUserTaxiBookings = asyncHandler(async (req, res) => {
  const taxiBookings = await TaxiBooking.find({
    userId: req.params.userid,
  }).sort({
    createdAt: -1,
  });
  res.status(200).json(taxiBookings);
});
const adminGetAllTaxiBookings = asyncHandler(async (req, res) => {
  const taxiBookings = await TaxiBooking.find();
  res.status(200).json(taxiBookings);
});
const addtaxiDriverDetails = asyncHandler(async (req, res) => {
  const {
    userId,
    carName,
    carModel,
    carColor,
    plateNumber,
    plateNumberImg,
    carImage,
    licenseNumber,
    licenseImg,
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
    !licenseNumber ||
    !licenseImg ||
    !rideCity ||
    !rideState
  ) {
    res.status(400);
    throw new Error("All Fields Must be fill");
  }
  const taxi_driver = await TaxiDriver.create({
    userId,
    carName,
    carModel,
    carColor,
    plateNumber,
    plateNumberImg,
    carImage,
    licenseNumber,
    licenseImg,
    rideCity,
    rideState,
    carDesc,
    status: "Available",
  });
  // if (!taxi_driver) {
  //   res.status(500);
  //   throw new Error("Error Occured, Please Try Again");
  // } else {
  //   await User.findByIdAndUpdate(
  //     userId,
  //     { userStatus: "activeTaxiDriver" },
  //     {
  //       new: true,
  //     }
  //   );
  res.status(201).json(taxi_driver);
  // }
});
const getTaxiById = asyncHandler(async (req, res) => {
  const taxi = await TaxiDriver.findById(req.params.id);
  res.status(200).json(taxi);
});
const getTaxiDriverByUserId = asyncHandler(async (req, res) => {
  const taxi = await TaxiDriver.findOne({
    userId: req.params.userId,
  });
  res.status(200).json(taxi);
});
const getTaxiDriversByLocation = asyncHandler(async (req, res) => {
  const driversByLocation = await TaxiDriver.find({
    rideCity: req.params.ride_city,
    status: "Available",
  });
  res.status(200).json(driversByLocation);
});
const getTaxiBookingsByLocation = asyncHandler(async (req, res) => {
  const bookings = await TaxiBooking.find({
    rideCity: req.params.city,
  });
  res.status(200).json(bookings);
});
const getDriverBookingsById = asyncHandler(async (req, res) => {
  const bookings = await TaxiBooking.find({
    assignedCarId: req.params.assignedCarId,
  });
  res.status(200).json(bookings);
});
const getDriverByAvailablity = asyncHandler(async (req, res) => {
  const driversByAvailability = await TaxiDriver.find();
  res.status(200).json(driversByAvailability);
});
const onAcceptRequest = asyncHandler(async (req, res) => {
  const { assignedCarId, bookingId, driverEmail, userId } = req.body;
  const accept = await TaxiBooking.findByIdAndUpdate(
    bookingId,
    { status: "CONFIRMED", assignedCarId: assignedCarId },
    {
      new: true,
    }
  );
  if (!accept) {
    res.status(400);
    throw new Error("Error Occured!!!");
  } else {
    const user = await User.findById(userId);
    await sendMailFunction(
      `${user.email}`,
      "Taxi Request Confirmed",
      `Your Taxi Booking Has Been confirmed, and You have been assigned a Driver for your ride, Login to your app and check the Driver's and Car's Details. Thanks`
    );
    await sendMailFunction(
      `${driverEmail}`,
      "Request Accepted",
      `you have accepted the user's Taxi request. Thanks`
    );
  }
  res.status(201).send(accept);
});
const onStartTrip = asyncHandler(async (req, res) => {
  const { assignedCarId, bookingId, driverEmail, userId } = req.body;
  const start_trip = await TaxiBooking.findByIdAndUpdate(
    bookingId,
    { status: "CHECKEDIN", assignedCarId: assignedCarId },
    {
      new: true,
    }
  );
  if (!start_trip) {
    res.status(400);
    throw new Error("Error Occured!!!");
  } else {
    const user = await User.findById(userId);
    await sendMailFunction(
      `${user.email}`,
      "Trip Started",
      `Your trip has started, the driver has picked you from your destination, Safe Strip. Thanks`
    );
    await sendMailFunction(
      `${driverEmail}`,
      "Trip Started",
      `You just started this ride now. Thanks`
    );
  }
  res.status(201).send(start_trip);
});
const onEndTrip = asyncHandler(async (req, res) => {
  const { assignedCarId, bookingId, driverEmail, userId } = req.body;
  const end_trip = await TaxiBooking.findByIdAndUpdate(
    bookingId,
    { status: "CHECKEDOUT", assignedCarId: assignedCarId },
    {
      new: true,
    }
  );
  if (!end_trip) {
    res.status(400);
    throw new Error("Error Occured!!!");
  } else {
    const user = await User.findById(userId);
    await sendMailFunction(
      `${user.email}`,
      "Trip Ended",
      `Your trip has end, the driver has arrived you from your destination, Hope you Enjoyed your trip. Thanks`
    );
    await sendMailFunction(
      `${driverEmail}`,
      "Trip Ended",
      `You just Ended this ride now, Kindly Await your Payment. Thanks`
    );
  }
  res.status(201).send(end_trip);
});
module.exports = {
  addBooking,
  getUserTaxiBookings,
  adminGetAllTaxiBookings,
  addTaxiRides,
  getTaxiRides,
  addtaxiDriverDetails,
  getTaxiDriversByLocation,
  getDriverByAvailablity,
  getTaxiById,
  getTaxiBookingsByLocation,
  getTaxiDriverByUserId,
  onAcceptRequest,
  getDriverBookingsById,
  onStartTrip,
  onEndTrip,
};
