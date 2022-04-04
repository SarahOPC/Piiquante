const express = require("express");
// création du routeur
const router = express.Router();

// va chercher la logique métier dans le dossier controllers
const sauceController = require("../controllers/sauce");

// on importe l'authentification
const auth = require("../middleware/auth");

// on importe le multer
const multer = require("../middleware/multer-config");

// -----------------------------------------------------------------------------------------------------
// vérifier si le frontend renvoit déjà un id et si oui le delete (avec req.body._id) avant const sauce
// -----------------------------------------------------------------------------------------------------

router.post('/', auth, multer, sauceController.createSauce);
router.put('/:id', auth, multer, sauceController.updateSauce);
router.delete('/:id', auth, sauceController.deleteSauce);
router.get('/:id', auth, sauceController.getOneSauce);
router.get('/', auth, sauceController.getAllSauces);

// on exporte le router
module.exports = router;
// /api/sauces, route de base d'enregistrement du router est remplacé par / car nous sommes déjà dans le router