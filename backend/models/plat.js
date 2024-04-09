"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Plat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Ingredient }) {
      // define association here
      this.hasMany(Ingredient, { foreignKey: "platId", as: "ingredients" });
    }

    toJSON() {
      return { ...this.get() };
    }
  }
  Plat.init(
    {
      nom: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.STRING, allowNull: false },
      typeDeRepas: { type: DataTypes.STRING, allowNull: false },
      calories: { type: DataTypes.INTEGER, allowNull: false },
      proteines: { type: DataTypes.FLOAT, allowNull: false },
      glucides: { type: DataTypes.FLOAT, allowNull: false },
      lipides: { type: DataTypes.FLOAT, allowNull: false },
      portion: { type: DataTypes.FLOAT, allowNull: false },
    },
    {
      sequelize,
      tableName: "plats",
      modelName: "Plat",
    }
  );
  return Plat;
};
