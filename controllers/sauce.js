// logique métier ie le corps des fonctions / middlewares

// file System donne accès au système de fichiers et permet de le modifier
const fs = require("fs");

// on importe nos modèles
const Sauce = require("../models/sauce");

exports.createSauce = (req, res, next) => {
    // pour extraire l'objet Json de la sauce
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        // opérateur spread ...
        // fait une copie de l'objet pour modifier la copie et non l'objet
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
        .catch(error => res.status(400).json({error}));
};

exports.updateSauce = (req, res, next) => {
    // Y a t il une image avec cette maj ?
    // si oui, on aura un req.file
    // sinon, on aura juste un objet

    const sauceObject = req.file ? // req.file existe -t- il ? oui : non
    {
        ...JSON.parse(req.body.sauce), // on récupère toutes les informations de sauce qui sont dans la requête
        // et on génère l'image
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`

    } : {...req.body};

    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id}) // ancien objet, nouvel objet avec le bon paramètre
        .then(() => res.status(200).json({ message : "Sauce mise à jour"}))
        .catch(error => res.status(400).json({error}));
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
            // on va chercher l'image pour la supprimer en même temps
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
                    .catch(error => res.status(400).json({error}));
             });
        })
        .catch(error => res.status(500).json({error}));
};
            
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        // renvoit la sauce trouvée dans la BDD
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error})); // 404 = non trouvé
};

exports.getAllSauces = (req, res, next) => {
    // on va chercher toutes les sauces dans le BDD
    Sauce.find()
    // retourne le tableau de toutes les sauces contenues dans la BDD
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
};

exports.ratingSauce = (req, res, next) => {
    const like = req.body.like;
    const dislike = req.body.dislike;
    const userId = req.body.userId;
    const sauceId = req.params.id;
    const usersLiked = [userId];
    const usersDisliked = [userId];
    
    // je vérifie si la sauce existe
    Sauce.findOne({_id: sauceId})
        .then((sauce) => {
            if(!sauce) {
                return res.status(401).json({error: new Error("Sauce non trouvée")}); // si la sauce n'existe pas
            }
            // si la sauce existe, j'évalue les différentes possibilités de like / dislike
            switch(like) {
                case 1: // la personne aime
                    Sauce.updateOne({_id: sauceId},
                    {$push : {usersLiked: userId}, // j'ajoute le userId dans le tableau like
                    $inc: {like: +1}}) // j'incrémente les likes de 1
                        .then(() => res.status(200).json({ message: 'Sauce bien aimée !'}))
                        .catch(error => res.status(400).json({error}));
                    break;

                case -1: // la personne n'aime pas
                    Sauce.updateOne({_id: sauceId},
                    {$push : {usersDisliked: userId}, // j'ajoute le userId dans le tableau dislike
                    $inc: {dislike: +1}}) // j'incrémente les dislikes de 1
                        .then(() => res.status(200).json({ message: 'Sauce pas aimée !'}))
                        .catch(error => res.status(400).json({error}));                
                    break;

                case 0: // la personne ne donne pas d'avis ou le retire
                    switch(usersLiked.includes(userId)){ // je regarde si le userId est dans le tableau like
                        case true: // si oui
                            for(let i = 0; i < usersLiked.length; i ++){
                                if(usersLiked[i] === userId){
                                    Sauce.updateOne({_id: sauceId},
                                    {$pull : {usersLiked: userId}, // je retire le userId du tableau like
                                    $inc: {like: -1}}) // et je décrémente de 1 les likes
                                        .then(() => res.status(200).json())
                                        .catch(error => res.status(400).json({error}));
                                }
                            }
                            break;

                        case false: // sinon
                            for(let i = 0; i < usersDisliked.length; i ++){
                                if(usersDisliked[i] === userId){
                                    Sauce.updateOne({_id: sauceId},
                                    {$pull : {usersLiked: userId}, // je retire le userId du tableau dislike
                                    $inc: {like: -1}}) // et je décrémente de 1 les dislikes
                                        .then(() => res.status(200).json())
                                        .catch(error => res.status(400).json({error}));
                                }
                            }
                            break;
                    }
                    break;
            }
        })
        .catch(error => res.status(404).json({error}))
};