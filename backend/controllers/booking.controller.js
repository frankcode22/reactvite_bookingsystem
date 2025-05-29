const models = require("../models");



const { Booking, Room, Customer } = require('../models'); // Adjust the path accordingly

async function getAllBookingDetails(req, res) {
  try {
    // Step 1: Get all bookings
    const bookings = await Booking.findAll({ raw: true });

    // Step 2: Get all rooms and customers
    const rooms = await Room.findAll({ raw: true });
    const customers = await Customer.findAll({ raw: true });

    // Step 3: Manually join data
    const detailedBookings = bookings.map((booking) => {
      const room = rooms.find(r => r.id === booking.room_id);
      const customer = customers.find(c => c.id === booking.customer_id);

      return {
        ...booking,
        room_name: room?.name || null,
        room_type: room?.type || null,
        customer_name: customer?.name || null,
        customer_email: customer?.email || null,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Booking data fetched successfully",
      data: detailedBookings,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


// async function getAllBookingDetails(req, res) {
//   try {
//     const bookings = await Booking.findAll({
//       include: [
//         {
//           model: Customer,
//           as: 'customer', // adjust alias if used differently
//           attributes: ['id', 'name', 'email'], // add fields you want
//         },
//         {
//           model: Room,
//           as: 'room', // adjust alias if used differently
//           attributes: ['id', 'name', 'type'], // add fields you want
//         },
//       ],
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Booking data fetched successfully",
//       data: bookings,
//     });
//   } catch (error) {
//     return res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// }


// Get all booking details using stored procedure
// function getAllBookingDetails(req, res) {
//   try {
//     models.sequelize
//       .query("SELECT * FROM GetBookingDetails")
//       .then((result) => {
//         res.status(200).json({
//           success: true,
//           message: "Booking data fetched successfully",
//           data: result[0],
//         });
//       })
//       .catch((err) => {
//         res.status(400).json({
//           success: false,
//           message: err.message,
//         });
//       });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// }

// Get pending booking details using stored procedure
function getPendingBookingDetails(req, res) {
  try {
    models.sequelize
      .query("SELECT * FROM GetPendingBookingDetails")
      .then((result) => {
        res.status(200).json({
          success: true,
          message: "Pending booking data fetched successfully",
          data: result[0],
        });
      })

      .catch((err) => {
        res.status(400).json({
          success: false,
          message: err.message,
        });
      });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// Get checked-in booking details using stored procedure
function getCheckedInBookingDetails(req, res) {
  try {
    models.sequelize
      .query("SELECT * FROM GetCheckInBookingDetails")
      .then((result) => {
        res.status(200).json({
          success: true,
          message: "Checked-in booking data fetched successfully",
          data: result[0],
        });
      });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// Create a new booking using stored procedure
// function createBooking(req, res) {
//   const { room_id, customer_id, check_in, check_out } = req.body;

//   if (!room_id) {
//     return res.status(400).json({
//       success: false,
//       message: "Room ID is required",
//     });
//   }

//   if (!customer_id) {
//     return res.status(400).json({
//       success: false,
//       message: "Customer ID is required",
//     });
//   }

//   if (!check_in) {
//     return res.status(400).json({
//       success: false,
//       message: "Check-in date is required",
//     });
//   }

//   if (!check_out) {
//     return res.status(400).json({
//       success: false,
//       message: "Check-out date is required",
//     });
//   }

//   if (new Date(check_in) > new Date(check_out)) {
//     return res.status(400).json({
//       success: false,
//       message: "Check-in date should be less than check-out date",
//     });
//   }

//   if (new Date(check_in) + 1 < new Date()) {
//     return res.status(400).json({
//       success: false,
//       message: "Check-in date should be future date",
//     });
//   }

//   if (new Date(check_out) < new Date()) {
//     return res.status(400).json({
//       success: false,
//       message: "Check-out date should be future date",
//     });
//   }

//   if (new Date(check_out) < new Date(check_in)) {
//     return res.status(400).json({
//       success: false,
//       message: "Check-out date should be greater than check-in date",
//     });
//   }

//   models.sequelize
//     .query(
//       "CALL CreateBooking(:room_id, :customer_id, :check_in, :check_out)",
//       {
//         replacements: {
//           room_id,
//           customer_id,
//           check_in,
//           check_out,
//         },
//       }
//     )
//     .then((result) => {
//       res.status(200).json({
//         success: true,
//         message: "Booking created successfully",
//         data: result,
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         success: false,
//         message: "Booking creation failed",
//         error: err.message,
//       });
//     });
// }


async function createBooking(req, res) {
  const { room_id, customer_id, check_in, check_out } = req.body;

  if (!room_id) {
    return res.status(400).json({
      success: false,
      message: "Room ID is required",
    });
  }

  if (!customer_id) {
    return res.status(400).json({
      success: false,
      message: "Customer ID is required",
    });
  }

  if (!check_in) {
    return res.status(400).json({
      success: false,
      message: "Check-in date is required",
    });
  }

  if (!check_out) {
    return res.status(400).json({
      success: false,
      message: "Check-out date is required",
    });
  }

  const checkInDate = new Date(check_in);
  const checkOutDate = new Date(check_out);
  const now = new Date();

  if (checkInDate > checkOutDate) {
    return res.status(400).json({
      success: false,
      message: "Check-in date should be less than check-out date",
    });
  }

  if (checkInDate <= now) {
    return res.status(400).json({
      success: false,
      message: "Check-in date should be a future date",
    });
  }

  if (checkOutDate <= now) {
    return res.status(400).json({
      success: false,
      message: "Check-out date should be a future date",
    });
  }

  try {
    const booking = await Booking.create({
      room_id,
      customer_id,
      check_in: checkInDate,
      check_out: checkOutDate,
    });

    return res.status(200).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Booking creation failed",
      error: error.message,
    });
  }
}


// Edit a booking using stored procedure
function editBooking(req, res) {
  const { booking_id, room_id, check_in, check_out } = req.body;

  if (!booking_id) {
    return res.status(400).json({
      success: false,
      message: "Booking ID is required",
    });
  }

  if (!room_id) {
    return res.status(400).json({
      success: false,
      message: "Room ID is required",
    });
  }

  if (!check_in) {
    return res.status(400).json({
      success: false,
      message: "Check-in date is required",
    });
  }

  if (!check_out) {
    return res.status(400).json({
      success: false,
      message: "Check-out date is required",
    });
  }

  if (new Date(check_in) > new Date(check_out)) {
    return res.status(400).json({
      success: false,
      message: "Check-in date should be less than check-out date",
    });
  }

  if (new Date(check_in) + 1 < new Date()) {
    return res.status(400).json({
      success: false,
      message: "Check-in date should be future date",
    });
  }

  if (new Date(check_out) < new Date()) {
    return res.status(400).json({
      success: false,
      message: "Check-out date should be future date",
    });
  }

  if (new Date(check_out) < new Date(check_in)) {
    return res.status(400).json({
      success: false,
      message: "Check-out date should be greater than check-in date",
    });
  }

  models.sequelize
    .query("CALL EditBooking(:booking_id, :room_id, :check_in, :check_out)", {
      replacements: {
        booking_id,
        room_id,
        check_in,
        check_out,
      },
    })
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Booking edited successfully",
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Booking edit failed",
        error: err.message,
      });
    });
}

// Cancel a booking using stored procedure
function cancelBooking(req, res) {
  const { booking_id } = req.params;

  if (!booking_id) {
    return res.status(400).json({
      success: false,
      message: "Booking ID is required",
    });
  }

  models.sequelize
    .query("CALL CancelBooking(:booking_id)", {
      replacements: {
        booking_id,
      },
    })
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Booking cancelled successfully",
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Booking cancellation failed",
        error: err.message,
      });
    });
}

module.exports = {
  getAllBookingDetails: getAllBookingDetails,
  getPendingBookingDetails: getPendingBookingDetails,
  getCheckedInBookingDetails: getCheckedInBookingDetails,
  createBooking: createBooking,
  editBooking: editBooking,
  cancelBooking: cancelBooking,
};
