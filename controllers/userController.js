const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const UserOtherInfo = require("../models/userOtherInfo");
const { sendMailFunction } = require("../functions/mailFunction");
const { primaryEmail } = require("../functions/data");

const onBoardResAdmin = asyncHandler(async (req, res) => {
  const { email, firstName, lastName, phoneNumber } = req.body;
  if (!firstName || !email || !lastName || !phoneNumber) {
    res.status(400);
    throw new Error("All Fields Must be fill");
  }
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("User Already Exist");
  }
  //   Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(
    `${firstName.toLowerCase()}20`,
    salt
  );
  // Create User
  const user = await User.create({
    name: firstName + " " + lastName,
    email,
    phoneNumber,
    userRole: "resAdmin",
    userStatus: "PENDING",
    password: hashedpassword,
    profileImg:
      "https://res.cloudinary.com/dc5ulgooc/image/upload/v1679504085/403554_ib5oa4.png",
  });
  if (user) {
    await sendMailFunction(
      `${email}`,
      "Welcome OnBoard",
      `Thank you for registering with us, your account is being reviewed, once its approved you will recieve your Login details through this mail. Thanks, Triluxy.`
    );
    await sendMailFunction(
      `${primaryEmail}`,
      "New Onboard",
      `New Restaurant Vendor Just Registered Now, Please Login to the Admin Panel to Approve His Account. Thanks, Triluxy.`
    );
    res.status(201).json({ message: "User Register Successfully" });
  } else {
    res.status(400);
    throw new Error("User Couldn't be created");
  }
});
const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phoneNumber,
    userRole,
    userStatus,
    profileImg,
  } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    !phoneNumber ||
    !userRole ||
    !profileImg ||
    !userStatus
  ) {
    res.status(400);
    throw new Error("All Fields Must be fill");
  }
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("User Already Exist");
  }

  //   Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);
  // Create User
  const user = await User.create({
    name,
    email,
    phoneNumber,
    userRole,
    userStatus,
    password: hashedpassword,
    profileImg,
  });
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profileImg: user.profileImg,
      userRole: user.userRole,
      userStatus: user.userStatus,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User Couldn't be created");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //   User Check
  const user = await User.findOne({ email });

  if (user?.userStatus === "PENDING") {
    res.status(400);
    throw new Error("Your Account is Pending Approval");
  } else if (user?.userStatus === "DEACTIVATED") {
    res.status(400);
    throw new Error(
      "Your Account has been Deactivated, Please Contact Our Support Center"
    );
  } else {
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profileImg: user.profileImg,
        userRole: user.userRole,
        userStatus: user.userStatus,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid Email or Password");
    }
  }
});

const createUserOtherInfo = asyncHandler(async (req, res) => {
  const { gender, address, state, town, zipCode } = req.body;

  if (!gender || !address || !state || !town) {
    res.status(400);
    throw new Error("All Fields Must be fill");
  }
  const userInfoExist = await UserOtherInfo.findOne({ user: req.user.id });
  if (userInfoExist) {
    res.status(400);
    throw new Error("User Info Already Exist");
  }
  // Create User Info
  const userInfo = await UserOtherInfo.create({
    user: req.user.id,
    gender,
    address,
    state,
    town,
    zipCode,
  });
  if (userInfo) {
    res.status(201).send("User Information added Successfully");
  } else {
    res.status(400);
    throw new Error("User Info Couldn't be added");
  }
});
// UPdating Personal Info
const onUpdatePersonalInfo = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, userId } = req.body;

  if (!name || !email || !phoneNumber || !userId) {
    res.status(400);
    throw new Error("All Fields Must be fill");
  }
  const user = await User.findByIdAndUpdate(
    userId,
    { name, email, phoneNumber },
    {
      new: true,
    }
  );
  res.status(201).send(user);
});
// UPdating User Info
const onUpdateUserInfo = asyncHandler(async (req, res) => {
  const { gender, address, state, town, zipCode, otherInfoID } = req.body;

  if (!gender || !address || !state || !town) {
    res.status(400);
    throw new Error("All Fields Must be fill");
  }
  const userInfo = await UserOtherInfo.findByIdAndUpdate(
    otherInfoID,
    { gender, address, state, town, zipCode },
    {
      new: true,
    }
  );
  res.status(201).send(userInfo);
});
// Upating Profile Image
const onUpdateProfileImg = asyncHandler(async (req, res) => {
  const { userId, profileImg } = req.body;

  if (!userId || !profileImg) {
    res.status(400);
    throw new Error("All Fields Must be fill");
  }
  const user = await User.findByIdAndUpdate(
    userId,
    { profileImg },
    {
      new: true,
    }
  );
  res.status(201).send(user);
});
const getOtherInfo = asyncHandler(async (req, res) => {
  const userInfo = await UserOtherInfo.findOne({ user: req.user.id });
  res.status(200).json(userInfo);
});
const getMe = asyncHandler(async (req, res) => {
  const { _id, name, email } = await User.findById(req.user.id);
  res.status(200).json({
    id: _id,
    name,
    email,
  });
  res.send("meUser");
});
// Get User Info
const getUserInfo = asyncHandler(async (req, res) => {
  const userInfo = await User.findById(req.params.id);
  res.status(200).json(userInfo);
});
// Generate JWT
function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
  createUserOtherInfo,
  getOtherInfo,
  getUserInfo,
  onUpdatePersonalInfo,
  onUpdateProfileImg,
  onUpdateUserInfo,
  onBoardResAdmin,
};
