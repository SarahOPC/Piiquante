const mongoose = require("mongoose");

// création du schéma de données pour les users
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}// doit être haché
});

// pour pouvoir l'utiliser dans la BDD
module.exports = mongoose.model("user", userSchema);