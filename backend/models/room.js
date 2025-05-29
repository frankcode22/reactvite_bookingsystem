// models/Room.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static associate(models) {
      console.log('Room: Setting up association with RoomCategory');
      Room.belongsTo(models.RoomCategory, {
        foreignKey: "category_id",
        as: "category",
      });
    }
  }

  Room.init(
    {
      room_name: DataTypes.STRING,
      category_id: DataTypes.INTEGER,
      status: DataTypes.ENUM("available", "occupied", "maintenance"),
    },
    {
      sequelize,
      modelName: "Room",
      paranoid: true,
    }
  );

  return Room;
};