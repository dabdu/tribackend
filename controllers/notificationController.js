const asyncHandler = require("express-async-handler");
const Notification = require("../models/notificationModel");
const getNotificationsByUserId = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    userId: req.params.userId,
  }).sort({
    createdAt: -1,
  });
  res.status(200).json(notifications);
});
const onReadNotification = asyncHandler(async (req, res) => {
  const read = await Notification.findByIdAndUpdate(
    req.params.notificationId,
    { status: "read" },
    {
      new: true,
    }
  );
  res.status(201).send(read);
});
const unReadCount = asyncHandler(async (req, res) => {
  const counts = await Notification.count({
    userId: req.params.userId,
    status: "unread",
  });
  res.status(200).json(counts);
});

module.exports = { getNotificationsByUserId, onReadNotification, unReadCount };
