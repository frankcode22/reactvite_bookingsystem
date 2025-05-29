// models/RoomCategory.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RoomCategory extends Model {
    static associate(models) {
      console.log('RoomCategory: Setting up association with Room');
      RoomCategory.hasMany(models.Room, {
        foreignKey: "category_id",
        as: "rooms",
      });
    }
  }

  RoomCategory.init(
    {
      category_name: DataTypes.STRING,
      price: DataTypes.DOUBLE,
      image: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "RoomCategory",
      paranoid: true,
    }
  );

  return RoomCategory;
};