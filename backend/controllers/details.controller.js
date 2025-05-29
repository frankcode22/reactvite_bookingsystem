const models = require("../models");

const { Booking, Payment, Room } = require("../models");
const { Sequelize } = require("sequelize");

function detailsForOverView(req, res) {
  Promise.all([
    // Total Revenue
    Payment.sum("amount", {
      where: { payment_status: "success" },
    }),

    // Total Bookings
    Booking.count(),

    // Total Customers (distinct customer IDs in bookings)
    Booking.aggregate("customer_id", "count", {
      distinct: true,
    }),

    // Total Rooms and Occupied Rooms
    Room.count(),
    Room.count({
      where: { status: "occupied" },
    }),
  ])
    .then(([totalRevenue, totalBookings, totalCustomers, totalRooms, occupiedRooms]) => {
      const occupancyRate = totalRooms > 0
        ? parseFloat(((occupiedRooms / totalRooms) * 100).toFixed(2))
        : 0.0;

      res.status(200).json({
        success: true,
        message: "Overview details fetched successfully",
        data: {
          total_revenue: parseFloat(totalRevenue || 0),
          total_bookings: totalBookings,
          total_customers: totalCustomers,
          occupancy_rate: occupancyRate,
        },
      });
    })
    .catch((err) => {
      console.error("Error fetching overview details:", err);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching overview details.",
      });
    });
}


// function detailsForOverView(req, res) {
//   models.sequelize
//     .query("CALL GetAllRevenueAndStatistics();")
//     .then((result) => {
//       res.status(200).json({
//         success: true,
//         message: "Overview details fetched successfully",
//         data: result,
//       });
//     })
//     .catch((err) => {
//       console.error("Error fetching overview details:", err);
//       res
//         .status(500)
//         .json({ error: "An error occurred while fetching overview details." });
//     });
// }

module.exports = {
  detailsForOverView: detailsForOverView,
};
