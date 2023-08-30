const express = require("express");
const {
  addRiderDeatils,
  getRiderByLocation,
  getRiderByUserId,
  onAcceptRequest,
  onPickup,
  onCompleted,
} = require("../controllers/riderController");

const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
router.route("/add-rider-details").post(protect, addRiderDeatils);
router.route("/accept-request").put(protect, onAcceptRequest);
router.route("/picked-up").put(protect, onPickup);
router.route("/completed").put(protect, onCompleted);
// router
//   .route("/bookings/location/:city")
//   .get(protect, getTaxiBookingsByLocation);
// router.route("/user/bookings/:userid").get(protect, getUserTaxiBookings);
// router
//   .route("/bookings/driver/:assignedCarId")
//   .get(protect, getDriverBookingsById);
router.route("/riders/:ride_city").get(protect, getRiderByLocation);
router.route("/user/rider/:userId").get(protect, getRiderByUserId);
module.exports = router;
