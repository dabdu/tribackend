const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const Room = require("../models/roomModel");
const getCategories = asyncHandler(async (req, res) => {
  const hotels = await Category.find({ hotel: req.body.hotel_id });
  res.status(200).json(hotels);
});
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ hotel: req.params.hotel_id });
  res.status(200).json(categories);
});
const createCategory = asyncHandler(async (req, res) => {
  const {
    categoryName,
    price,
    maxPersons,
    features,
    description,
    discountedPrice,
    hotel,
  } = req.body;

  if (!categoryName || !price || !maxPersons) {
    res.status(400);
    throw new Error("All Fields Must be fill");
  }
  const category = await Category.create({
    hotel,
    categoryName,
    price,
    discountedPrice,
    maxPersons,
    features,
    description,
  });
  res.status(201).json(category);
});
// Get Category Rooms
const getCatRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find({ categoryId: req.params.id });
  res.status(200).json(rooms);
});
const getAvailableRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find({
    categoryId: req.params.id,
    status: "Available",
  });
  res.status(200).json(rooms);
});
// Get Single Category By ID
const getCatById = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id });
  res.status(200).json(category);
});
const createRoom = asyncHandler(async (req, res) => {
  const { categoryName, roomName, status, hotelId, categoryId } = req.body;

  if (!categoryName || !roomName || !status || !hotelId || !categoryId) {
    res.status(400);
    throw new Error("All Fields Must be fill");
  }
  const room = await Room.create({
    hotelId,
    categoryId,
    categoryName,
    roomName,
    status,
  });
  res.status(201).json(room);
});

module.exports = {
  getCategories,
  createRoom,
  getCatRooms,
  createCategory,
  getAllCategories,
  getCatById,
  getAvailableRooms,
};
