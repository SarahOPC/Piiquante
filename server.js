const http = require("http");
// on importe app.js
const app = require("./app");
const PORT = 3000;

// on passe app.js au serveur
const server = http.createServer(app);

// on dit à l'application express sur quel port elle doit tourner
server.listen(process.env.PORT || 3000);
console.log("Listening on port " + PORT);