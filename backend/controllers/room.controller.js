const models = require("../models");

const { Room, RoomCategory } = require("../models");

// Get all room using stored procedure
// function getRooms(req, res) {
//   models.sequelize
//     .query("CALL GetRooms()")
//     .then((rooms) => {
//       res.status(200).json({
//         success: true,
//         rooms: rooms,
//       });
//     })
//     .catch((err) => {
//       res.status(400).json({
//         success: false,
//         message: err.message,
//       });
//     });
// }



function getRooms(req, res) {
  Room.findAll({
    include: [
      {
        model: RoomCategory,
        as: "RoomCategory", // remove 'as' if you didn't alias the relation
        attributes: ["id", "category_name", "price"],
      },
    ],
  })
    .then((rooms) => {
      res.status(200).json({
        success: true,
        rooms,
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    });
}




// Create a new room using stored procedure
// function createRoom(req, res) {
//   const { room_name, category_id } = req.body;
//   const status = "available";

//   models.sequelize
//     .query("CALL CreateRoom(:room_name, :category_id, :status)", {
//       replacements: { room_name, category_id, status },
//     })
//     .then((result) => {
//       res.status(201).json({
//         success: true,
//         message: "Room created successfully",
//       });
//     })
//     .catch((err) => {
//       res.status(400).json({
//         success: false,
//         message: err.message,
//       });
//     });
// }



async function createRoom(req, res) {
  const { room_name, category_id } = req.body;
  const status = "available";

  try {
    await Room.create({
      room_name,
      category_id,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Room created successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}


// Update room category using stored procedure
function updateRoom(req, res) {
  const { id, room_name, category_id, status } = req.body;
  console.log(id);
  models.sequelize
    .query("CALL UpdateRoom(:id, :room_name, :category_id, :status)", {
      replacements: {
        id: id,
        room_name: room_name,
        category_id: category_id,
        status: status,
      },
    })
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Room updated successfully",
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
function deleteRoom(req, res) {
  const { id } = req.params;

  models.sequelize
    .query("CALL DeleteRoom(:id)", {
      replacements: { id },
    })
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Room deleted successfully",
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    });
}

// Get all room details using view
// function getRoomsAllDetails(req, res) {
//   models.sequelize
//     .query("SELECT * FROM RoomDetails")
//     .then((rooms) => {
//       res.status(200).json({
//         success: true,
//         rooms: rooms[0],
//       });
//     })
//     .catch((err) => {
//       res.status(400).json({
//         success: false,
//         message: err.message,
//       });
//     });
// }








function getRoomsAllDetails(req, res) {
  console.log('Executing getRoomsAllDetails at', new Date().toLocaleString());
  console.log('Room model defined:', !!Room);
  console.log('RoomCategory model defined:', !!RoomCategory);

  Promise.all([
    Room.findAll({ paranoid: false, raw: true }),
    RoomCategory.findAll({
      attributes: ['id', 'category_name', 'price','image', 'description'],
      paranoid: false,
      raw: true,
    }),
  ])
    .then(([rooms, categories]) => {
      const roomsWithCategories = rooms.map(room => {
        const category = categories.find(cat => cat.id === room.category_id);
        return {
          ...room,
          category: category || null,
        };
      });

      console.log('Rooms fetched:', roomsWithCategories.length);
      res.status(200).json({
        success: true,
        rooms: roomsWithCategories,
      });
    })
    .catch((err) => {
      console.error('Error in getRoomsAllDetails:', err);
      res.status(400).json({
        success: false,
        message: err.message,
      });
    });
}

module.exports = { getRoomsAllDetails };





module.exports = {
  getRooms: getRooms,
  createRoom: createRoom,
  updateRoom: updateRoom,
  deleteRoom: deleteRoom,
  getRoomsAllDetails: getRoomsAllDetails,
};
