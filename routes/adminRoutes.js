const express = require("express");
const { initiateAdmin, adminLogin } = require("../controllers/adminController");
const { adminProtect } = require("../middleware/adminAuthMiddleware");
const {
  GetAllRestaurants,
  GetAllRestaurantAdmins,
  GetAllReservations,
  GetAllDishOrders,
  GetAllMenuItems,
  onApproveResAdmin,
  GetSingleReservation,
  GetSingleOrder,
} = require("../controllers/admin/restaurantController");
const router = express.Router();

router.post("/initiate", initiateAdmin);
router.post("/login", adminLogin);

// Restraurant Routes
router.put("/restaurant/approve-admin", onApproveResAdmin);
router.get("/res-admin", adminProtect, GetAllRestaurantAdmins);
router.get("/restaurants", adminProtect, GetAllRestaurants);
router.get("/dishes", adminProtect, GetAllMenuItems);
router.get("/reservations", adminProtect, GetAllReservations);
router.get("/reservation/:id", adminProtect, GetSingleReservation);
router.get("/dish-orders", adminProtect, GetAllDishOrders);
router.get("/order/:id", adminProtect, GetSingleOrder);

module.exports = router;
