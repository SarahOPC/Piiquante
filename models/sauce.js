const mongoose = require("mongoose");

// création du schéma de données pour les sauces
const sauceSchema = mongoose.Schema({
    userId: {type: String, required: true},
    name: {type: String, required: true},
    manufacturer: {type: String, required: true},
    description: {type: String, required: true},
    mainPepper: {type: String, required: true},
    imageUrl: {type: String, required: true},
    heat: {type: Number, min: 1, max: 10, required: true},
    likes: {type: Number},
    dislikes: {type: Number},
    usersLiked: {type: [String]},
    usersDisliked: {type: [String]}
});

// pour pouvoir l'utiliser dans la BDD
module.exports = mongoose.model("Sauce", sauceSchema);