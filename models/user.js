const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

// création du schéma de données pour les users
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}// doit être haché
});

// on applique le validator au schéma avant d'en faire un modèle
userSchema.plugin(uniqueValidator);

// pour pouvoir l'utiliser dans la BDD
module.exports = mongoose.model("User", userSchema);