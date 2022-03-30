// middleware va vérifier le token envoyé par l'appli frontend avec sa requête
// pour vérifier qu'il s'agit d'un token valable
// et que si un user id est envoyé avec la requête, il corresponde bien avec celui encodé dans le token

const jwt = require("jsonwebtoken"); // pour vérifier les tokens

module.exports = (req, res, next) => {
    try {
        // on va chercher le token, on le split autour de l'espace et on prend le 2ème élément du tableau
        // car 1er = Bearer
        const token = req.headers.authorization.split(" ")[1];
        // puis on va décoder le token
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET"); // on vérifie le token avec la clé secrète
        // on récupère le userId alors retrouvé dans l'objet Js récupéré
        const userId = decodedToken.userId;
        // on attribut le userId à l'objet requête
        req.auth = {userId: userId};
        // peut être écrit = req.auth = {userId};
        //  revient à ça = req.userId = userId;
        // si j'ai un userId dans la requête, je le compare avec celui récupéré du token
        if(req.body.userId && req.body.userId !== userId) { // si j'ai un userId dans la requête et qu'il est différent de celui du token
            throw "User Id non valable";
        } else {
            next(); // sinon, on peut executer les autres middlewares en jeu
        }

    } catch(error) {
        res.status(401).json({error: error | "Requête non authentifiée"});
    }
};
