const express = require("express");
// création du routeur
const router = express.Router();

// va chercher la logique métier dans le dossier controllers
const sauceController = require("../controllers/sauce");

// -----------------------------------------------------------------------------------------------------
// vérifier si le frontend renvoit déjà un id et si oui le delete (avec req.body._id) avant const sauce
// -----------------------------------------------------------------------------------------------------

router.post('/', sauceController.createSauce);
router.put('/:id', sauceController.updateSauce);
router.delete('/:id', sauceController.deleteSauce);
router.get('/:id', sauceController.getOneSauce);
router.get('/', sauceController.getAllSauces);

// on exporte le router
module.exports = router;
// /api/sauce, route de base d'enregistrement du router est remplacé par / car nous sommes déjà dans le router