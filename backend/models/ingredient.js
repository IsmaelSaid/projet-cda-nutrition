"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ingredient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Plat }) {
      // define association here
      this.belongsTo(Plat, { foreignKey: "platId", as: "plat" });
    }
    toJSON() {
      return { ...this.get(), platId: undefined, id: undefined };
    }
  }
  Ingredient.init(
    {
      nom: { type: DataTypes.STRING, allowNull: false },
      quantite: { type: DataTypes.FLOAT, allowNull: false },
    },
    {
      sequelize,
      tableName: "ingredients",
      modelName: "Ingredient",
    }
  );
  return Ingredient;
};
