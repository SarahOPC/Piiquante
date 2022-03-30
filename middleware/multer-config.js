// pour aider à la gestion des fichiers avec des requêtes http vers l'api
const multer = require("multer");

// pour récupérer les extensions des fichiers
const MIME_TYPES = {
    "images/jpg" : "jpg",
    "images/jpeg" : "jpg",
    "images/png" : "png",
}

// on crée un objet de configuration pour multer
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images") // pas d'erreur et nom du dossier
    },
    filename: (req, file, callback) => {
        // on va générer un nouveau nom pour le fichier pour éviter les collisions de noms de fichiers
        const name = file.originalname.split(" ").join("_"); // on remplace les espaces par des _
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now + "." + extension); // construit le nom du fichier
    }
});

module.exports = multer({storage}).single("image"); // que des fichiers uniques et ce sont des images