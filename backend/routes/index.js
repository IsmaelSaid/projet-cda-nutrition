var express = require("express");
const { calculateMB } = require("../utiles/fonctions");
var router = express.Router();

/* GET home page. */
router.post("/", function (req, res) {
  const { mail, age, nom, poids, taille, sexe } = req.body;
  const mb = calculateMB(poids, taille, sexe, age);
  return res.status(200).json({
    mb,
  });
});

module.exports = router;
