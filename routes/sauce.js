const express = require("express");
// création du routeur
const router = express.Router();

// va chercher la logique métier dans le dossier controllers
const sauceController = require("../controllers/sauce");

// on importe l'authentification
const auth = require("../middleware/auth");

// on importe le multer
const multer = require("../middleware/multer-config");

router.post('/', auth, multer, sauceController.createSauce);
router.put('/:id', auth, multer, sauceController.updateSauce);
router.delete('/:id', auth, sauceController.deleteSauce);
router.get('/:id', auth, sauceController.getOneSauce);
router.get('/', auth, sauceController.getAllSauces);
router.post('/:id/like', auth, sauceController.ratingSauce);

// on exporte le router
module.exports = router;
// /api/sauces, route de base d'enregistrement du router est remplacé par / car nous sommes déjà dans le router