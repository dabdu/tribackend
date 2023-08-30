const express = require("express");
const {
  registerUser,
  loginUser,
  getMe,
  createUserOtherInfo,
  getOtherInfo,
  getUserInfo,
  onUpdatePersonalInfo,
  onUpdateUserInfo,
  onUpdateProfileImg,
  onBoardResAdmin,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/restaurant", onBoardResAdmin);
router.post("/login", loginUser);
router.post("/add-user-info", protect, createUserOtherInfo);
router.get("/get-user-info", protect, getOtherInfo);
router.get("/profile", protect, getMe);
router.get("/user/:id", protect, getUserInfo);

router.put("/update-personal-info", protect, onUpdatePersonalInfo);
router.put("/update-other-info", protect, onUpdateUserInfo);
router.put("/update-profile-img", protect, onUpdateProfileImg);

module.exports = router;
