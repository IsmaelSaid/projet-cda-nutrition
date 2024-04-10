var express = require("express");
const { Plat, Ingredient } = require("../models");
const {
  calculateMB,
  calculeBesoinMacronutrimentsQuotidient,
} = require("../utiles/fonctions");
const { sendEmail } = require("../utiles/mail");

var router = express.Router();

/* GET home page. */
router.post("/mb", function (req, res) {
  const { age, poids, taille, sexe } = req.body;
  const mb = calculateMB(poids, taille, sexe, age);
  const { proteines, lipides, glucides } =
    calculeBesoinMacronutrimentsQuotidient(mb);
  return res.status(200).json({
    mb,
    proteines,
    lipides,
    glucides,
  });
});

router.post("/plan", async function (req, res) {
  let { mb, nom, prenom, email, choix } = req.body;
  switch (choix) {
    case "Maigrir":
      mb = mb - 200;
      break;
    case "Grossir":
      mb = mb + 300;
      break;
    default:
  }

  console.log(req.body);
  const caloriesParRepas = Math.round(mb / 3);
  const platPetitDejeuner = await Plat.findOne({
    where: { typeDeRepas: "Petit Déjeuner" },
  });
  const caloriesPlatPetitDejeuner = platPetitDejeuner.dataValues.calories;
  const coeffPetitDejeuner = caloriesParRepas / caloriesPlatPetitDejeuner;
  const indredientsPetitDejeuner = await Ingredient.findAll({
    raw: true,
    where: { platId: platPetitDejeuner.dataValues.id },
  });
  const platDejeuner = await Plat.findOne({
    where: { typeDeRepas: "Déjeuner" },
  });
  const indredientsDejeuner = await Ingredient.findAll({
    raw: true,
    where: { platId: platDejeuner.dataValues.id },
  });
  const caloriesPlatDejeuner = platDejeuner.dataValues.calories;
  const coeffDejeuner = caloriesParRepas / caloriesPlatDejeuner;
  const platDiner = await Plat.findOne({
    where: { typeDeRepas: "Dîner" },
  });
  const indredientsDiner = await Ingredient.findAll({
    raw: true,
    where: { platId: platDiner.dataValues.id },
  });
  const caloriesPlatDiner = platDiner.dataValues.calories;
  const coeffDiner = caloriesParRepas / caloriesPlatDiner;

  let plan = {
    petit_dejeuner: {
      plat: {
        ...platPetitDejeuner.dataValues,
        calories: (
          platPetitDejeuner.dataValues.calories * coeffPetitDejeuner
        ).toFixed(2),
        proteines: (
          platPetitDejeuner.dataValues.proteines * coeffPetitDejeuner
        ).toFixed(2),
        glucides: (
          platPetitDejeuner.dataValues.glucides * coeffPetitDejeuner
        ).toFixed(2),
        lipides: (
          platPetitDejeuner.dataValues.lipides * coeffPetitDejeuner
        ).toFixed(2),
        portion: (
          platPetitDejeuner.dataValues.portion * coeffPetitDejeuner
        ).toFixed(0),
        id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        typeDeRepas: undefined,
      },
      ingredient: indredientsPetitDejeuner.map((element) => {
        return {
          ...element,
          quantite: Math.round(element.quantite * coeffPetitDejeuner).toFixed(
            0
          ),
          id: undefined,
          platId: undefined,
          createdAt: undefined,
          updatedAt: undefined,
        };
      }),
    },
    dejeuner: {
      plat: {
        ...platDejeuner.dataValues,
        calories: (platDejeuner.dataValues.calories * coeffDejeuner).toFixed(2),
        proteines: (platDejeuner.dataValues.proteines * coeffDejeuner).toFixed(
          2
        ),
        glucides: (platDejeuner.dataValues.glucides * coeffDejeuner).toFixed(2),
        lipides: (platDejeuner.dataValues.lipides * coeffDejeuner).toFixed(2),
        portion: (platDejeuner.dataValues.portion * coeffDejeuner).toFixed(0),
        id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        typeDeRepas: undefined,
      },
      ingredient: indredientsDejeuner.map((element) => {
        return {
          ...element,
          quantite: Math.round(element.quantite * coeffDejeuner).toFixed(0),
          id: undefined,
          platId: undefined,
          createdAt: undefined,
          updatedAt: undefined,
        };
      }),
    },
    diner: {
      plat: {
        ...platDiner.dataValues,
        id: undefined,
        calories: (platDiner.dataValues.calories * coeffDiner).toFixed(2),
        proteines: (platDiner.dataValues.proteines * coeffDiner).toFixed(2),
        glucides: (platDiner.dataValues.glucides * coeffDiner).toFixed(2),
        lipides: (platDiner.dataValues.lipides * coeffDiner).toFixed(2),
        portion: (platDiner.dataValues.portion * coeffDiner).toFixed(0),
        createdAt: undefined,
        updatedAt: undefined,
        typeDeRepas: undefined,
      },
      ingredient: indredientsDiner.map((element) => {
        return {
          ...element,
          quantite: Math.round(element.quantite * coeffDiner).toFixed(0),
          id: undefined,
          platId: undefined,
          createdAt: undefined,
          updatedAt: undefined,
        };
      }),
    },
  };

  plan.totalCalories =
    parseFloat(plan.petit_dejeuner.plat.calories) +
    parseFloat(plan.dejeuner.plat.calories) +
    parseFloat(plan.diner.plat.calories);
  plan.totalProteines =
    parseFloat(plan.petit_dejeuner.plat.proteines) +
    parseFloat(plan.dejeuner.plat.proteines) +
    parseFloat(plan.diner.plat.proteines);
  plan.totalGlucides =
    parseFloat(plan.petit_dejeuner.plat.glucides) +
    parseFloat(plan.dejeuner.plat.glucides) +
    parseFloat(plan.diner.plat.glucides);
  plan.totalLipides =
    parseFloat(plan.petit_dejeuner.plat.lipides) +
    parseFloat(plan.dejeuner.plat.lipides) +
    parseFloat(plan.diner.plat.lipides);

  sendEmail(email, nom, prenom, plan);
  res.status(200).json(plan);
});

module.exports = router;
