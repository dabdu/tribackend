const express = require("express");
const {
  getHotel,
  createHotel,
  getAllHotels,
  getUserReservations,
  addNewReservation,
  adminAddHotel,
  getAllReservations,
  getBookedReservations,
  getConfirmedReservations,
  getCheckedInReservations,
  getCheckOutReservations,
  getCancelReservations,
  confirmBooking,
  setCheckedInReservations,
  setCheckedOutReservations,
  getHotelById,
  getHotelBySearchedTown,
  getReservationByHotelId,
  getReservationByHotelAdminId,
  onConfirmReservation,
  onCancelReservation,
  onCheckedInReservation,
  onCheckedOutReservation,
} = require("../controllers/hotelController");
const { protect } = require("../middleware/authMiddleware");
const { mailFunction } = require("../middleware/mailSender");
const router = express.Router();

router.route("/").get(protect, getHotel).post(protect, createHotel);
router.route("/mail").get(mailFunction);
router.route("/allhotels").get(getAllHotels);
router.route("/admin/add-hotel").post(protect, adminAddHotel);

router.route("/hotel/:hotel_id").get(protect, getHotelById);
router.route("/search/:town").get(protect, getHotelBySearchedTown);
// router.route("/:id").put(protect, updateGoal).delete(protect, deleteGoal);

// ALl Hotel Reveration Routes
router.route("/reservations").post(protect, addNewReservation);
router
  .route("/reservations/hotel/:hotel_id")
  .get(protect, getReservationByHotelId);
router
  .route("/reservations/admin/:user_id")
  .get(protect, getReservationByHotelAdminId);
router.route("/reservations/:id").get(protect, getUserReservations);
router.route("/all-reservations").get(protect, getAllReservations);
router.route("/bookings").get(protect, getBookedReservations);
router
  .route("/bookings/confirmed")
  .get(protect, getConfirmedReservations)
  .post(protect, confirmBooking);
router
  .route("/bookings/check-in")
  .get(protect, getCheckedInReservations)
  .post(protect, setCheckedInReservations);
router
  .route("/bookings/check-out")
  .get(protect, getCheckOutReservations)
  .post(protect, setCheckedOutReservations);
router.route("/bookings/cancel").get(protect, getCancelReservations);
router.route("/reservations/confirm").put(protect, onConfirmReservation);
router.route("/reservations/cancel").put(protect, onCancelReservation);
router.route("/reservations/checkin").put(protect, onCheckedInReservation);
router.route("/reservations/checkout").put(protect, onCheckedOutReservation);
module.exports = router;
