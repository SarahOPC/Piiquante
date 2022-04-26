const User = require("../models/user");
const bcrypt = require("bcrypt");
// permet de créer des tokens d'identification et de les vérifier
const jwt = require("jsonwebtoken");


exports.signup = (req, res, next) => {
    // en premier lieu, on hache le mdP (fonction asynchrone, prend du temps)
    bcrypt.hash(req.body.password, 10) // paramètres : le mdP et le nombre de fois où il va être haché
        // on récupère le hash pour l'enregistrer dans un nouveau user de la BDD avec son email
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // on sauvegarde ce user dans la BDD
            user.save()
                .then(() => res.status(201).json({message : "Utilisateur créé"}))
                .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(500).json({error}));

};

exports.login = (req, res, next) => {
    // en premier lieu, on cherche le user dans la BDD grâce à son email
    User.findOne({email: req.body.email}) // on compare l'email trouvé à celui envoyé dans la requête
        // on doit vérifier si on a ou pas récupéré un user
        .then(user => {
        if(!user) {
            return res.status(401).json({ error : "Utilisateur non trouvé"});
        }
        // sinon donc si user trouvé, on va utiliser bcrypt pour comparer les deux mdP
        bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if(!valid) {
                    return res.status(401).json({ error : "Mot de Passe non valide"});
                }
                // sinon comparaison est bonne donc on valide la connexion et on renvoit un id et un token
                res.status(200).json({
                    userId: user._id,
                    // permet de vérifier que les requêtes sont authentifiées et donc autorisées
                    token: jwt.sign(
                        // 1er argument : les données à encoder ie le payload
                        {userId: user._id}, // pour être sur que la requête corresponde à ce user id
                        // 2ème argument : clé secrète pour l'encodage
                        `${process.env.TOKEN}`,
                        // 3ème argument : durée de validité du token
                        {expiresIn: "24h"}
                    )
                });
            })
            .catch(error => res.status(500).json({error}));
    })
    // si problème de connexion - car si user pas trouvé, mongoose nous le dira
    .catch(error => res.status(500).json({error}));

};
