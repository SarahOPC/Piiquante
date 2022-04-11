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
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0
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
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
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
    const likes = req.body.like;
    const userId = req.body.userId;
    const sauceId = req.params.id;
    console.log("like de la req = " + req.body.like);
    console.log("userId de la req = " + req.body.userId);
    console.log("id de la sauce = " + req.params.id);
    // je vérifie si la sauce existe
    Sauce.findOne({_id: sauceId}) // je cherche la bonne sauce pour la mettre à jour
    .then(sauce => {    
        let tabUsersLiked = sauce.usersLiked;
        let tabUsersDisliked = sauce.usersDisliked;

        // j'évalue les différentes possibilités de like / dislike
        switch(likes) {
            case 1:
                // la personne aime
                // on met à jour la sauce dans la BDD (userId dans tableau like et nombre de likes)
                tabUsersLiked.push(userId);
                sauce.likes = sauce.likes + 1;
                console.log("je like");
                sauce.save()
                    .then(() => res.status(201).json({ message : "Sauce likée"}))
                    .catch(error => res.status(400).json({error}));
                break;
            case -1 :
                // la personne n'aime pas
                // on met à jour la sauce dans la BDD (userId dans tableau like et nombre de likes)
                tabUsersDisliked.push(userId);
                sauce.dislikes = sauce.dislikes + 1;
                console.log("je dislike");
                sauce.save()
                    .then(() => res.status(201).json({ message : "Sauce dislikée"}))
                    .catch(error => res.status(400).json({error}));
                break;
            case 0:
                if(tabUsersLiked.includes(userId)) {
                    // si le userId est dans le tableau like pour cette sauce là
                    // cela veut dire que la personne unlike
                    function unliked() {
                        // on le retire du tableau et on décrémente de 1 les likes
                        sauce.likes = sauce.likes - 1;
                        let myIndex = tabUsersLiked.indexOf(userId);
                        tabUsersLiked.splice(myIndex, 1);
                        console.log("Like supprimé");
                        console.log("je unlike");
                        sauce.save()
                            .then(() => res.status(201).json({ message : "Sauce unlikée"}))
                            .catch(error => res.status(400).json({error}));
                    };
                    unliked();
                } else if(tabUsersDisliked.includes(userId)) {
                    // la personne undislike
                    function undisliked() {
                        // on le retire du tableau et on décrémente de 1 les dislikes
                        sauce.dislikes = sauce.dislikes - 1;
                        let myIndex = tabUsersDisliked.indexOf(userId);
                        tabUsersDisliked.splice(myIndex, 1);
                        console.log("Dislike supprimé");
                        console.log("je undislike");
                        sauce.save()
                            .then(() => res.status(201).json({ message : "Sauce undislikée"}))
                            .catch(error => res.status(400).json({error}));
                    };
                    undisliked();
                }
                break;
        }
    })
    .catch(error => res.status(404).json({error}))
}
