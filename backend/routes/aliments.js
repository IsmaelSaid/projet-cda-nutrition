const express = require("express");
const router = express.Router();
const { Aliment } = require("../models");

/* GET users listing. */
router.get("/", async function (req, res) {
  try {
    const aliments = await Aliment.findAll();
    res.status(200).json(aliments);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/", async function (req, res) {
  const { nom, calories, proteines, glucides, lipides } = req.body;
  try {
    const aliment = await Aliment.create({
      nom,
      calories,
      proteines,
      glucides,
      lipides,
    });
    return res.json(aliment);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});
router.get("/:id", function (req, res) {
  res.send("respond with a resource");
});
router.patch("/:id", function (req, res) {
  res.send("respond with a resource");
});
router.delete("/:id", function (req, res) {
  res.send("respond with a resource");
});

module.exports = router;
