const { Plat, Ingredient } = require("../models"); // Assuming your model is named 'Plat'

const addDish = async (req, res) => {
  try {
    const {
      nom,
      description,
      typeDeRepas,
      calories,
      proteines,
      glucides,
      lipides,
      portion,
      ingredients,
    } = req.body;

    // Create the dish
    const plat = await Plat.create({
      nom,
      description,
      typeDeRepas,
      calories,
      proteines,
      glucides,
      lipides,
      portion,
    });

    for (const [ingredientName, quantity] of Object.entries(ingredients)) {
      await Ingredient.create({
        nom: ingredientName,
        quantite: quantity,
        platId: plat.id,
      });
    }

    res.status(201).json({ message: "Dish added successfully", data: plat });
  } catch (error) {
    console.error("Error adding dish:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllPlats = async (req, res) => {
  try {
    const plats = await Plat.findAll();
    return res.json(plats);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getPlat = async (req, res) => {
  const { id } = req.params;

  try {
    const plat = await Plat.findOne({ where: { id }, include: "ingredients" });
    return res.json(plat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  addDish,
  getPlat,
  getAllPlats,
};
