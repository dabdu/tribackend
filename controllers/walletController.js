const asyncHandler = require("express-async-handler");
const Wallet = require("../models/walletModel");
const Notification = require("../models/notificationModel");
const getUserTransactions = asyncHandler(async (req, res) => {
  const transactions = await Wallet.find({ userId: req.user.id }).sort({
    createdAt: -1,
  });
  res.status(200).json(transactions);
});
const createNewTransaction = asyncHandler(async (req, res) => {
  const {
    desc,
    amount,
    transType,
    transactionId,
    transactionRef,
    paymentMode,
    userId,
    notDesc,
    notTitle,
    notType,
  } = req.body;

  if (
    !desc ||
    !amount ||
    !transType ||
    !transactionId ||
    !transactionRef ||
    !paymentMode ||
    !userId
  ) {
    res.status(400);
    throw new Error("All Fields Must be fill");
  }
  const transaction = await Wallet.create({
    userId,
    desc,
    amount,
    transType,
    transactionId,
    transactionRef,
    paymentMode,
  });
  await Notification.create({
    userId,
    desc: notDesc,
    title: notTitle,
    type: notType,
    status: "unread",
  });
  res.status(201).json(transaction);
});

module.exports = {
  getUserTransactions,
  createNewTransaction,
};
