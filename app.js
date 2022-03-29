// ce dont l'appli a besoin pour fonctionner
const express = require("express"); // framework node pour créer des serveurs
const mongoose = require("mongoose"); // permet de faire le lien entre BDD (MongoDB) et l'appli
const app = express();

// on importe nos modèles
const Sauce = require("./models/sauce");
const User = require("./models/user");

// pour connecter l'API avec la BDD MongoDB
mongoose.connect('mongodb+srv://Richa:Hallow33n@cluster0.gwdng.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// met à disposition de req.body toutes les requêtes contenant du json (même chose que bodyParser)
app.use(express.json());

// gestion des CORS : Cross Origin Resource Sharing : bloque appels htpp entre serveurs différents
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// -----------------------------------------------------------------------------------------------------
// vérifier si le frontend renvoit déjà un id et si oui le delete (avec req.body._id) avant const sauce
// -----------------------------------------------------------------------------------------------------

app.post('/api/sauce', (req, res, next) => {
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
});

app.put('/api/sauce/:id', (req, res, next) => {
    Sauce.updateOne({_id: req.params.id}, {...req.body, _id: req.params.id}) // ancien objet, nouvel objet avec le bon paramètre
        .then(() => res.status(200).json({ message : "Sauce mise à jour"}))
        .catch(error => res.status(400).json({ error}));
});

app.delete('/api/sauce/:id', (req, res, next) => {
    Sauce.deleteOne({_id: req.params.id})
        .then(() => res.status(200).json({ message : 'Sauce supprimée'}))
        .catch(error => res.status(400).json({ error}));
});

app.get('/api/sauce/:id', (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        // renvoit la sauce trouvée dans la BDD
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error})); // 404 = non trouvé
});

app.get('/api/sauce', (req, res, next) => {
    // on va chercher toutes les sauces dans le BDD
    Sauce.find()
    // retourne le tableau de toutes les sauces contenues dans la BDD
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error}));
});

// on exporte app.js
module.exports = app;