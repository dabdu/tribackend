const express = require("express");
const {
  getUserTransactions,
  createNewTransaction,
} = require("../controllers/walletController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/user-transactions").get(protect, getUserTransactions);

router.route("/").post(protect, createNewTransaction);

module.exports = router;
