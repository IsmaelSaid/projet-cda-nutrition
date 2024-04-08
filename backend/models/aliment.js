"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Aliment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Aliment.init(
    {
      nom: { type: DataTypes.STRING, allowNull: false },
      calories: { type: DataTypes.INTEGER, allowNull: false },
      proteines: { type: DataTypes.FLOAT, allowNull: false },
      glucides: { type: DataTypes.FLOAT, allowNull: false },
      lipides: { type: DataTypes.FLOAT, allowNull: false },
    },
    {
      sequelize,
      tableName: "aliments",
      modelName: "Aliment",
    }
  );
  return Aliment;
};
