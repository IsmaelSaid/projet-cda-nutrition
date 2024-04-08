var express = require("express");
const { Aliment } = require("../models");
const {
  calculateMB,
  calculeBesoinMacronutrimentsQuotidient,
} = require("../utiles/fonctions");
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
  //const { mb, proteines, lipides, glucides, email } = req.body;
  console.log(req.body);
  const mb = 1800,
    proteines = mb * (20 / 100),
    glucides = mb * (50 / 100),
    lipides = mb * (30 / 100);
  const oeuf = await Aliment.findOne({ where: { nom: "oeuf" } });
  const blancPoulet = await Aliment.findOne({
    where: { nom: "blanc de poulet" },
  });
  const saumon = await Aliment.findOne({
    where: { nom: "saumon" },
  });
  const pain = await Aliment.findOne({ where: { nom: "Pain" } });
  const riz = await Aliment.findOne({ where: { nom: "riz blanc" } });
  const pates = await Aliment.findOne({ where: { nom: "Pates" } });

  const avocat = await Aliment.findOne({ where: { nom: "avocat" } });
  const amande = await Aliment.findOne({ where: { nom: "amande" } });
  const proteinesParRepas = Math.round(proteines / 3 / 4);
  let quantiteOeufs = proteinesParRepas / oeuf.proteines;
  let quantitePoulet = proteinesParRepas / blancPoulet.proteines;
  let quantiteSaumon = proteinesParRepas / saumon.proteines;

  const glucidesParRepas = Math.round(glucides / 3 / 4);
  let quantitePain = glucidesParRepas / pain.glucides;
  let quantiteRiz = glucidesParRepas / riz.glucides;
  let quantitePates = glucidesParRepas / pates.glucides;

  const LipidesParRepas = Math.round(lipides / 3 / 9);
  let quantiteAvocat = LipidesParRepas / avocat.lipides;
  let quantiteAmande = glucidesParRepas / amande.lipides;
  console.log(LipidesParRepas);
  const plan = {
    petit_dejeuner: {
      oeufs: { quantite: Math.floor(quantiteOeufs * 100), unite: "g" },
      pain: { quantite: Math.floor(quantitePain * 100), unite: "g" },
      avocat: { quantite: Math.floor(quantiteAvocat * 100), unite: "g" },
    },
    dejeuner: {
      poulet: { quantite: Math.floor(quantitePoulet * 100), unite: "g" },
      riz: { quantite: Math.floor(quantiteRiz * 100), unite: "g" },
      amande: { quantite: Math.floor(quantiteAmande * 100), unite: "g" },
    },
    diner: {
      saumon: { quantite: Math.floor(quantiteSaumon * 100), unite: "g" },
      pates: { quantite: Math.floor(quantitePates * 100), unite: "g" },
    },
  };

  let calories =
    plan.petit_dejeuner.oeufs.quantite * oeuf.calories +
    quantitePoulet * blancPoulet.calories +
    quantiteSaumon * saumon.calories;
  console.log("Je suis la quantité de calories", calories);
  res.status(200).json(plan);
});

module.exports = router;
