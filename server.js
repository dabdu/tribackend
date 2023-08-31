const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const port = process.env.PORT;

connectDB();
const app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://tribackoffice.vercel.app");
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
// Middlewares
// app.use(
//   cors({
//     origin: ["https://tribackoffice.vercel.app", "http://localhost:3000"],
//     credentials: true,
//   })
// );
// Add this line

// Middleware to set up CORS headers

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/flight", require("./routes/flightRoutes"));
app.use("/api/hotel", require("./routes/hotelRoutes"));
app.use("/api/category", require("./routes/categoryRoutes"));
app.use("/api/restaurant", require("./routes/restaurantRoutes"));
app.use("/api/wallet", require("./routes/walletRoutes"));
app.use("/api/taxi", require("./routes/taxiRoutes"));
app.use("/api/car", require("./routes/carRoutes"));
app.use("/api/rider", require("./routes/riderRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

// Admin ROutes
app.use("/api/admin", require("./routes/adminRoutes"));

app.use(errorHandler);
app.listen(port, () => console.log(`Server started on port ${port}`));
