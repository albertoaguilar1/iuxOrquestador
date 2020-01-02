// Utilizar funcionalidades del Ecmascript 6
'use strict'
// Cargamos el módulo de mongoose para poder conectarnos a MongoDB
var mongoose = require('mongoose');
// *Cargamos el fichero app.js con la configuración de Express
var app = require('./app');
// Creamos la variable PORT para indicar el puerto en el que va a funcionar el servidor
var port = 3800;
// Le indicamos a Mongoose que haremos la conexión con Promesas
mongoose.Promise = global.Promise;
// Usamos el método connect para conectarnos a nuestra base de datos

//mongoose.connect('mongodb://192.168.99.100:32768/museum_db', { useNewUrlParser: true});

var mongo_host = (process.env.MONGO_SERVICE_HOST || 'localhost' );
var mongo_port = (process.env.MONGO_SERVICE_PORT || 27017 );
var url = 'mongodb://'+mongo_host+':'+mongo_port+'/museum_db';


const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
   // autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
  };

mongoose.connect(url, options)
    .then(() => console.log("La conexión a la base de datos museum_db se ha realizado correctamente"+"_"+url))
    .catch(err => console.log("Error connecting db", err + url));


var db = mongoose.connection;


// Setup server port
var port = process.env.PORT || 8084;

    
        // CREAR EL SERVIDOR WEB CON NODEJS
        app.listen(port, () => {
            console.log("** Running ServerUser on port **" + port);
        });
  

    



