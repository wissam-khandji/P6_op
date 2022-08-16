//requires
const express = require("express");
const router = express.Router();
//Import de notre controller contenant le CRUD
const sauceCtrl = require("../controllers/sauce");
//import du middleware 
const auth = require("../middleware/auth");
//Import de mutler
const multer = require("../middleware/multer-config");

//création des route pour les sauces
router.get("/", auth, sauceCtrl.getAllSauces);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.put("/:id", auth, multer, sauceCtrl.updateSauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.like);

//exportation du router sauce
module.exports = router;