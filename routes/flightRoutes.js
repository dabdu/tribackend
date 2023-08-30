const express = require("express");
const {
  addNewBooking,
  ticketIssued,
} = require("../controllers/flightController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/book").post(protect, addNewBooking);
router.route("/issue-ticket").post(ticketIssued);

module.exports = router;
