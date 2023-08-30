const express = require("express");
const {
  addCarDetails,
  getCarsByLocation,
  getCarsByAvailablity,
  carBooking,
  getUserBookings,
  getCarById,
  getAllCarBookings,
  getBookingcarOwnerId,
  onAccept,
  onDecline,
  onPickedUp,
  onReturn,
  getCarsByUserId,
} = require("../controllers/carController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/add-car-details").post(protect, addCarDetails);
router.route("/available-cars").get(protect, getCarsByAvailablity);
router.route("/booking").post(protect, carBooking);
router.route("/all-bookings").get(protect, getAllCarBookings);
router.route("/rentor/accept").put(protect, onAccept);
router.route("/rentor/decline").put(protect, onDecline);
router.route("/rentor/returned").put(protect, onReturn);
router.route("/user/pickedup").put(protect, onPickedUp);
router.route("/user-cars/:userId").get(protect, getCarsByUserId);
router.route("/cars/:ride_city").get(protect, getCarsByLocation);
router.route("/bookings/user/:id").get(protect, getUserBookings);
router.route("/car/:id").get(protect, getCarById);
router.route("/user/:carOwnerId").get(protect, getBookingcarOwnerId);

module.exports = router;
