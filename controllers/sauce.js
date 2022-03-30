// logique métier ie le corps des fonctions / middlewares

// on importe nos modèles
const sauce = require("../models/sauce");
const Sauce = require("../models/sauce");

exports.createSauce = (req, res, next) => {
    // pour extraire l'objet Json de la sauce
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        // opérateur spread ...
        // va chercher tous les éléments dans le body et les intègre à chaque élément de l'objet Sauce
        // sans besoin de préciser name: req.body.name, etc...
        ...sauceObject,
        // on modifie l'url de l'image en le générant comme suit :
        // http ou https, ://, la racine du serveur, /images/ le nom du fichier
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    });
    // on enregistre dans la BDD
    sauce.save()
        // on renvoit un statut de réponse pour que la requête n'expire pas
        .then(() => res.status(201).json({message : "Sauce enregistrée"}))
        // on catche l'erreur au cas où
        .catch(error => res.status(400).json({ error}));
};

exports.updateSauce = (req, res, next) => {
    // Y a t il une image avec cette maj ?
    // si oui, on aura un req.file
    // sinon, on aura juste un objet

    
    Sauce.updateOne({_id: req.params.id}, {...req.body, _id: req.params.id}) // ancien objet, nouvel objet avec le bon paramètre
        .then(() => res.status(200).json({ message : "Sauce mise à jour"}))
        .catch(error => res.status(400).json({ error}));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if(!sauce) {
                return res.status(401).json({error: new Error("Sauce non trouvée")}); // si la sauce n'existe pas
            }
            if(sauce.userId !== req.auth.userId) {
                return res.status(400).json({error: new Error("Requête non autorisée")}); // si le user Id n'est pas le bon
            }
            // si on est ici ie on a une sauce et le user Id est le bon donc
            Sauce.deleteOne({_id: req.params.id})
                .then(() => res.status(200).json({ message : 'Sauce supprimée'}))
                .catch(error => res.status(400).json({ error}));
        })
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