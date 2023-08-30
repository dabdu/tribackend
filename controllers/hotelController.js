const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Hotel = require("../models/hotelModel");
const Reservation = require("../models/reservationModel");
const Room = require("../models/roomModel");
const Notification = require("../models/notificationModel");
const { sendMailFunction } = require("../functions/mailFunction");
const getHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.find({ user: req.user.id });
  res.status(200).json(hotel);
});
const getHotelById = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.hotel_id);
  res.status(200).json(hotel);
});
const getHotelBySearchedTown = asyncHandler(async (req, res) => {
  const hotels = await Hotel.find({ town: req.params.town });
  res.status(200).json(hotels);
});
const getAllHotels = asyncHandler(async (req, res) => {
  const hotels = await Hotel.find();
  res.status(200).json(hotels);
});
const createHotel = asyncHandler(async (req, res) => {
  const {
    hotelName,
    fImg,
    address,
    state,
    town,
    lat,
    lng,
    description,
    terms,
  } = req.body;

  if (!hotelName || !fImg || !town || !state || !description) {
    res.status(400);
    throw new Error("All Fields Must be fill");
  }
  const hotel = await Hotel.create({
    user: req.user.id,
    hotelName,
    fImg,
    address,
    state,
    town,
    lat: "",
    lng: "",
    description,
    terms,
    status: "Active",
  });
  res.status(201).json(hotel);
});
const adminAddHotel = asyncHandler(async (req, res) => {
  const {
    hotelName,
    fImg,
    images,
    address,
    state,
    town,
    description,
    facilities,
    terms,
  } = req.body;

  if (!hotelName || !fImg || !town || !state || !description || !facilities) {
    res.status(400);
    throw new Error("All Fields Must be fill");
  }
  const hotel = await Hotel.create({
    user: req.user.id,
    hotelName,
    fImg,
    images,
    address,
    state,
    town,
    lat: "",
    lng: "",
    description,
    facilities,
    terms,
    status: "Active",
  });
  res.status(201).json(hotel);
});
const getUserReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ userId: req.params.id });
  res.status(200).json(reservations);
});
const getReservationByHotelId = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({
    userId: req.params.hotel_id,
  }).sort({
    createdAt: -1,
  });
  res.status(200).json(reservations);
});
const getReservationByHotelAdminId = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({
    hotelAdminId: req.params.user_id,
  }).sort({
    createdAt: -1,
  });
  res.status(200).json(reservations);
});
const getAllReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find().sort({
    createdAt: -1,
  });
  res.status(200).json(reservations);
});
const getBookedReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ status: "BOOKED" });
  res.status(200).json(reservations);
});
const getConfirmedReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ status: "CONFIRMED" });
  res.status(200).json(reservations);
});
const getCheckedInReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ status: "CHECKEDIN" });
  res.status(200).json(reservations);
});
const setCheckedInReservations = asyncHandler(async (req, res) => {
  await Reservation.findByIdAndUpdate(
    req.body.reserveId,
    { status: "CHECKEDIN" },
    {
      new: true,
    }
  );
  res.status(201).json("Checked In Successfully");
});
const getCheckOutReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ status: "CHECKEDOUT" });
  res.status(200).json(reservations);
});
const setCheckedOutReservations = asyncHandler(async (req, res) => {
  const confirmed = await Reservation.findByIdAndUpdate(
    req.body.reserveId,
    { status: "CHECKEDOUT" },
    {
      new: true,
    }
  );
  if (confirmed) {
    const changeStatus = await Room.findByIdAndUpdate(
      req.body.assignedRoomId,
      { status: "Available" },
      {
        new: true,
      }
    );
    if (changeStatus) {
      res.status(201).json("Checkout Successfully");
    }
  }
});
const getCancelReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ status: "CANCEL" });
  res.status(200).json(reservations);
});
const addNewReservation = asyncHandler(async (req, res) => {
  const {
    hotelId,
    categoryId,
    transId,
    nights,
    amount,
    checkInDate,
    checkOutDate,
    isPaid,
    status,
    hotelAdminId,
    userEmail,
  } = req.body;

  if (
    !hotelId ||
    !categoryId ||
    !hotelAdminId ||
    !transId ||
    !nights ||
    !checkInDate ||
    !checkOutDate ||
    !status ||
    !userEmail
  ) {
    res.status(400);
    throw new Error("All Fields Must be fill");
  }
  const reservation = await Reservation.create({
    userId: req.user.id,
    hotelId,
    hotelAdminId,
    categoryId,
    transId,
    nights,
    amount,
    checkInDate,
    checkOutDate,
    isPaid,
    status,
    assignedRoomId: null,
  });
  const hotel_admin = await User.findById(hotelAdminId);
  const userContent = `Your Payment and Reservation was Successful, Checking In on ${checkInDate} to ${checkOutDate}, which is for ${nights} nights. Please Exercise Patience while we confirm your reservation. You will an email once our processes is done Thanks`;

  await Notification.create({
    userId: req.user.id,
    desc: userContent,
    title: "Successful Reservation",
    type: "Hotel",
    status: "unread",
  });
  await sendMailFunction(
    `${hotel_admin.email}`,
    "Urgent, Confirm Reservation",
    `A User Just reserve your Hotel, from ${checkInDate} to ${checkOutDate}, which is ${nights}. Please Login to confirmed user's Reservation. Thanks`
  );
  await sendMailFunction(`${userEmail}`, "Successful Reservation", userContent);
  res.status(201).json(reservation);
});

const onConfirmReservation = asyncHandler(async (req, res) => {
  const {
    reserveId,
    hotelAdminEmail,
    userEmail,
    categoryName,
    hotelName,
    checkInDate,
  } = req.body;
  const confirmed = await Reservation.findByIdAndUpdate(
    reserveId,
    { status: "CONFIRMED" },
    {
      new: true,
    }
  );
  await sendMailFunction(
    `${hotelAdminEmail}`,
    "Reservation Confirmed",
    `You have Confirmed Your User's Reservation. Thanks`
  );
  await sendMailFunction(
    `${userEmail}`,
    "Reservation Confirmed",
    `Your Reservation for ${categoryName} at ${hotelName} was Confirmed, we can't wait to see you on ${checkInDate}. Thanks`
  );
  res.status(201).json(confirmed);
});
const onCancelReservation = asyncHandler(async (req, res) => {
  const {
    reserveId,
    hotelAdminEmail,
    userEmail,
    categoryName,
    hotelName,
    checkInDate,
  } = req.body;
  const canceled = await Reservation.findByIdAndUpdate(
    reserveId,
    { status: "CANCEL" },
    {
      new: true,
    }
  );
  await sendMailFunction(
    `${hotelAdminEmail}`,
    "Reservation CANCEL",
    `You have CANCEL Reservation By a Customer. Thanks`
  );
  await sendMailFunction(
    `${userEmail}`,
    "Reservation CANCEL",
    `We are sorry to inform you that Your Reservation for ${categoryName} at ${hotelName} was CANCEL Due Some Uniavoidable Circumstances, we are sorry for what ever inconvinience this might Caused you, You will be contacted on how and when your Payment will be refund. , we can't wait to see you on ${checkInDate}. Thanks`
  );
  res.status(201).json(canceled);
});

const onCheckedInReservation = asyncHandler(async (req, res) => {
  const {
    reserveId,
    hotelAdminEmail,
    userEmail,
    categoryName,
    hotelName,
    checkInDate,
  } = req.body;
  if (
    !reserveId ||
    !hotelAdminEmail ||
    !userEmail ||
    !categoryName ||
    !hotelName ||
    !checkInDate
  ) {
    res.status(400);
    throw new Error("All Fields Must be fill");
  }
  const checkedin = await Reservation.findByIdAndUpdate(
    reserveId,
    { status: "CHECKEDIN" },
    {
      new: true,
    }
  );
  await sendMailFunction(
    `${hotelAdminEmail}`,
    "User Checked In",
    `User Checked In Successfully. Thanks`
  );
  await sendMailFunction(
    `${userEmail}`,
    "Reservation Checked In",
    `You have been Checked in to ${categoryName} at ${hotelName} You Booked Earlier, We hope you enjoy your Stay with Us. Thank you`
  );
  res.status(201).json(checkedin);
});
const onCheckedOutReservation = asyncHandler(async (req, res) => {
  const {
    reserveId,
    hotelAdminEmail,
    userEmail,
    categoryName,
    hotelName,
    checkInDate,
  } = req.body;
  if (
    !reserveId ||
    !hotelAdminEmail ||
    !userEmail ||
    !categoryName ||
    !hotelName ||
    !checkInDate
  ) {
    res.status(400);
    throw new Error("All Fields Must be fill");
  }
  const checkedout = await Reservation.findByIdAndUpdate(
    reserveId,
    { status: "CHECKEDOUT" },
    {
      new: true,
    }
  );
  await sendMailFunction(
    `${hotelAdminEmail}`,
    "User Checked Out",
    `User Checked Out Successfully. Thanks`
  );
  await sendMailFunction(
    `${userEmail}`,
    "Reservation Checked Out",
    `You have been Checked Out of ${categoryName} which you Checked In on ${checkInDate} at ${hotelName} , We hope you enjoyed your Stay with Us and Hope to see you soon. Thank you`
  );
  res.status(201).json(checkedout);
});
const confirmBooking = asyncHandler(async (req, res) => {
  const confirmed = await Reservation.findByIdAndUpdate(
    req.body.reserveId,
    { status: "CONFIRMED", assignedRoomId: req.body.assignedRoomId },
    {
      new: true,
    }
  );
  if (confirmed) {
    const changeStatus = await Room.findByIdAndUpdate(
      req.body.assignedRoomId,
      { status: "Occupied" },
      {
        new: true,
      }
    );
    if (changeStatus) {
      res.status(201).json("Confirmation Successully");
    }
  }
});

module.exports = {
  getHotel,
  getHotelById,
  getHotelBySearchedTown,
  createHotel,
  adminAddHotel,
  getAllHotels,
  getReservationByHotelId,
  getReservationByHotelAdminId,
  getUserReservations,
  addNewReservation,
  getAllReservations,
  getBookedReservations,
  getConfirmedReservations,
  getCheckedInReservations,
  getCheckOutReservations,
  getCancelReservations,
  confirmBooking,
  setCheckedInReservations,
  setCheckedOutReservations,
  onConfirmReservation,
  onCancelReservation,
  onCheckedInReservation,
  onCheckedOutReservation,
};
