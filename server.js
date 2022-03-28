const https = require("https");
// on importe app.js
const app = require("./app");

// renvoit un port valide (numéro ou chaîne)
const normalizePort = val => {
    const port = parseInt(val, 10);
    
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

// on dit à l'application express sur quel port elle doit tourner
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// recherche les différentes erreurs, les gère et est enregistrée par le serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// on passe app.js au serveur
const server = https.createServer(app);

// écouteur d'événements consignant le port sur lequel le serveur s'éxécute
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
