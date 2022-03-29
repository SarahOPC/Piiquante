// logique métier ie le corps des fonctions / middlewares

// on importe nos modèles
const Sauce = require("../models/sauce");

exports.createSauce = (req, res, next) => {
    const sauce = new Sauce({
        // opérateur spread ...
        // va chercher tous les éléments dans le body et les intègre à chaque élément de l'objet Sauce
        // sans besoin de préciser name: req.body.name, etc...
        ...req.body
    });
    // on enregistre dans la BDD
    sauce.save()
        // on renvoit un statut de réponse pour que la requête n'expire pas
        .then(() => res.status(201).json({message : "Sauce enregistrée"}))
        // on catche l'erreur au cas où
        .catch(error => res.status(400).json({ error}));
};

exports.updateSauce = (req, res, next) => {
    Sauce.updateOne({_id: req.params.id}, {...req.body, _id: req.params.id}) // ancien objet, nouvel objet avec le bon paramètre
        .then(() => res.status(200).json({ message : "Sauce mise à jour"}))
        .catch(error => res.status(400).json({ error}));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({_id: req.params.id})
        .then(() => res.status(200).json({ message : 'Sauce supprimée'}))
        .catch(error => res.status(400).json({ error}));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        // renvoit la sauce trouvée dans la BDD
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error})); // 404 = non trouvé
};

exports.getAllSauces = (req, res, next) => {
    // on va chercher toutes les sauces dans le BDD
    Sauce.find()
    // retourne le tableau de toutes les sauces contenues dans la BDD
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error}));
};