const express = require("express");
const {
  addBooking,
  getUserTaxiBookings,
  adminGetAllTaxiBookings,
  addTaxiCar,
  getTaxiRides,
  addTaxiRides,
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
} = require("../controllers/taxiController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
router.route("/booking").post(protect, addBooking);
router.route("/admin/bookings").get(protect, adminGetAllTaxiBookings);
router.route("/rides").get(protect, getTaxiRides).post(protect, addTaxiRides);
router.route("/add-driver-details").post(protect, addtaxiDriverDetails);
router.route("/accept-request").put(protect, onAcceptRequest);
router.route("/start-trip").put(protect, onStartTrip);
router.route("/end-trip").put(protect, onEndTrip);
router
  .route("/bookings/location/:city")
  .get(protect, getTaxiBookingsByLocation);
router.route("/user/bookings/:userid").get(protect, getUserTaxiBookings);
router
  .route("/bookings/driver/:assignedCarId")
  .get(protect, getDriverBookingsById);
router.route("/details/:id").get(protect, getTaxiById);
router.route("/drivers/:ride_city").get(protect, getTaxiDriversByLocation);
router.route("/user/driver/:userId").get(protect, getTaxiDriverByUserId);
router.route("/drivers-available").get(protect, getDriverByAvailablity);

module.exports = router;
