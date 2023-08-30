const express = require("express");
const {
  getCategories,
  createCategory,
  getAllCategories,
  getCatRooms,
  createRoom,
  getCatById,
  getAvailableRooms,
} = require("../controllers/categoryController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").get(protect, getCategories).post(protect, createCategory);
router.route("/hotel/categories/:hotel_id").get(getAllCategories);
router.route("/add-room").post(protect, createRoom);
router.route("/:id/rooms").get(protect, getCatRooms);
router.route("/available-rooms/:id").get(protect, getAvailableRooms);
router.route("/:id").get(protect, getCatById);
// router.route("/:id").put(protect, updateGoal).delete(protect, deleteGoal);

module.exports = router;
