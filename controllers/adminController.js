const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const initiateAdmin = asyncHandler(async (req, res) => {
  // const { name, email, password, Role } = req.body;
  // console.log(req.body);
  // if (!name || !email || !password || !Role) {
  //   res.status(400);
  //   throw new Error("All Fields Must be fill");
  // }
  let name = "Admin Admin";
  let email = "admin@gmail.com";
  let password = "password";
  const adminExist = await Admin.findOne({ email });
  if (adminExist) {
    res.status(400);
    throw new Error("Admin Already Exist");
  }

  //   Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);
  // Create User
  const admin = await Admin.create({
    name,
    email,
    Role: "admin",
    Status: "active",
    password: hashedpassword,
  });
  if (admin) {
    res.status(201).json({
      _id: admin.id,
      name: admin.name,
      email: admin.email,
      Role: admin.Role,
      Status: admin.Status,
      token: generateToken(admin._id),
    });
  } else {
    res.status(400);
    throw new Error("Admin Couldn't be created");
  }
});

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //   User Check
  const admin = await Admin.findOne({ email });
  const totalUser = await User.count();
  const totalCustomers = await User.count({ userRole: "User" });
  const totalVendors = await User.count({ userRole: { $ne: "User" } });
  const totalHotelVendors = await User.count({
    userRole: "hotelAdmin",
  });
  const totalCarVendors = await User.count({ userRole: "carRentor" });
  const totalTaxiVendors = await User.count({
    userRole: "taxiDriver",
  });
  const totalRestautrantVendors = await User.count({
    userRole: "resAdmin",
  });
  if (admin && (await bcrypt.compare(password, admin.password))) {
    res.json({
      _id: admin.id,
      name: admin.name,
      email: admin.email,
      Role: admin.Role,
      Status: admin.Status,
      token: generateToken(admin._id),
      totalUser,
      totalCustomers,
      totalVendors,
      totalHotelVendors,
      totalCarVendors,
      totalTaxiVendors,
      totalRestautrantVendors,
    });
  } else {
    res.status(400);
    throw new Error("Invalid Email or Password");
  }
});

// Generate JWT
function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
}

module.exports = { initiateAdmin, adminLogin };
