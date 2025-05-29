require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const roomRoutes = require("./routes/room.route");
const roomCategoryRoutes = require("./routes/roomcategory.route");
const bookedRoutes = require("./routes/booked.route");
const detailsRoutes = require("./routes/details.route");
const customerRoutes = require("./routes/customer.route");
const bookingRoutes = require("./routes/booking.route");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "Uploads/room_category"))
);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/roomcategory", roomCategoryRoutes);
app.use("/api/booked", bookedRoutes);
app.use("/api/details", detailsRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/booking", bookingRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("Server Error:", err); // Log errors for debugging
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.get("/", (req, res) => {
  res.send("server is ready!");
});

module.exports = app;