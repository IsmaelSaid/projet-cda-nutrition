const express = require("express");
const router = express.Router();
const { addDish, getAllPlats, getPlat } = require("../controller/plat");

/* GET users listing. */
router.get("/", getAllPlats);
router.post("/", addDish);
router.get("/:id", getPlat);
router.patch("/:id", function (req, res) {
  res.send("respond with a resource");
});
router.delete("/:id", function (req, res) {
  res.send("respond with a resource");
});

module.exports = router;
