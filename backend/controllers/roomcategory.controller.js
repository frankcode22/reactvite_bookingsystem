const models = require("../models");

const { RoomCategory } = require("../models");

// Get all room categories using stored procedure
// function getRoomCategories(req, res) {
//   models.sequelize
//     .query("SELECT * FROM GetRoomCategories")
//     .then((roomcategories) => {
//       res.status(200).json({
//         success: true,
//         roomcategories: roomcategories[0],
//       });
//     })
//     .catch((err) => {
//       res.status(400).json({
//         success: false,
//         message: err.message,
//       });
//     });
// }



async function getRoomCategories(req, res) {
  try {
    const roomcategories = await RoomCategory.findAll();

    res.status(200).json({
      success: true,
      roomcategories,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}


// Create a new room category using stored procedure
// function createRoomCategory(req, res) {
//   const { category_name, price, description } = req.body;
//   const room_image = req.file ? req.file.filename : null;

//   models.sequelize
//     .query(
//       "CALL CreateRoomCategory(:category_name, :price, :description, :room_image)",
//       {
//         replacements: {
//           category_name: category_name,
//           price: price,
//           description: description,
//           room_image: room_image,
//         },
//       }
//     )
//     .then(() => {
//       res.status(201).json({
//         success: true,
//         message: "Room category created successfully",
//       });
//     })
//     .catch((err) => {
//       res.status(400).json({
//         success: false,
//         message: err.message,
//       });
//     });
// }



async function createRoomCategory(req, res) {
  const { category_name, price, description } = req.body;
  const room_image = req.file ? req.file.filename : null;

  try {
    await RoomCategory.create({
      category_name,
      price,
      description,
      image:room_image,
    });

    res.status(201).json({
      success: true,
      message: "Room category created successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}


// Update room category using stored procedure
function updateRoomCategory(req, res) {
  const { id } = req.params;
  const { category_name, price, description } = req.body;
  const room_image = req.file ? req.file.filename : null;

  models.sequelize
    .query(
      "CALL UpdateRoomCategory(:id, :category_name, :price, :description, :room_image)",
      {
        replacements: {
          id: id,
          category_name: category_name,
          price: price,
          description: description,
          room_image: room_image,
        },
      }
    )
    .then(() => {
      res.status(200).json({
        success: true,
        message: "Room category updated successfully",
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    });
}

// Delete room category using stored procedure
function deleteRoomCategory(req, res) {
  const { id } = req.params;

  models.sequelize
    .query("CALL SoftDeleteRoomCategory(:id)", {
      replacements: { id: id },
    })
    .then(() => {
      res.status(200).json({
        success: true,
        message: "Room category deleted successfully",
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    });
}

module.exports = {
  getRoomCategories: getRoomCategories,
  createRoomCategory: createRoomCategory,
  deleteRoomCategory: deleteRoomCategory,
  updateRoomCategory: updateRoomCategory,
};
