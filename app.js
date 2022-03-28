const express = require("express");
const app = express();

// met à disposition de req.body toutes les requêtes contenant du json (même chose que bodyParser)
app.use(express.json());


// gestion des CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.post('/api/sauce', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
        message : "Sauce créée"
    })
});





// on exporte app.js
module.exports = app;