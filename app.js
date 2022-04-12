// ce dont l'appli a besoin pour fonctionner
const express = require("express"); // framework node pour créer des serveurs
const mongoose = require("mongoose"); // permet de faire le lien entre BDD (MongoDB) et l'appli
const app = express();
// nous donne accès au chemin du système de fichiers
const path = require("path");
const cors = require("cors");

//sécurité
let helmet = require('helmet');
app.use(helmet());
const mongoSanitize = require('express-mongo-sanitize');
// By default, $ and . characters are removed completely from user-supplied input in the following places:
// - req.body
// - req.params
// - req.headers
// - req.query

// To sanitize data that only contains $,allowDots and replaceWith_
// Can be useful for letting data pass that is meant for querying nested documents.

app.use(
  mongoSanitize({
    allowDots: true,
    replaceWith: '_',
  }),
);

// on importe les routers
const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");
// on importe nos modèles
const User = require("./models/user");

// pour connecter l'API avec la BDD MongoDB // ADMIN et PWD avec ``et $ :
// `mongodb+srv://$ADMIN:$PWD@cluster0.gwdng.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
mongoose.connect('mongodb+srv://Richa:Hallow33n@cluster0.gwdng.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// met à disposition de req.body toutes les requêtes contenant du json (même chose que bodyParser)
app.use(express.json());

// gestion des CORS : Cross Origin Resource Sharing : bloque appels http entre serveurs différents
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use(cors({
    origin: 'http://localhost:4200' // HOST ----------------------------------------
}));

// pour toutes les requêtes envoyées à /images, on sert ce dossier statique image
app.use('/images', express.static(path.join(__dirname, 'images'))); // nom du dossier + images

// pour cette route là, va voir dans sauceRoutes donc dans le router
app.use('/api/sauces', sauceRoutes);
// pour cette route là, va voir dans userRoutes donc dans le router
app.use('/api/auth', userRoutes);

// on exporte app.js
module.exports = app;