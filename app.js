// Utilizar funcionalidades del Ecmascript 6
'use strict'
// Cargamos los módulos de express y body-parser
var express = require('express');
var bodyParser = require('body-parser');
// Llamamos a express para poder crear el servidor
var app = express();
// Importamos las rutas
var orchestrator_routes = require('./routes/orchestrator'); 
//cargamos morgan
var morgan = require('morgan');
// Cargamos la apide swageger para documetar 
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('./swagger.json');
//cargar middlewares
//un metodo que se ejecuta antes que llegue a un controlador
//Configuramos bodyParser para que convierta el body de nuestras peticiones a JSON
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
// Cargamos las rutas

var cfenv = require('cfenv');


var bodyParser = require('body-parser');

////////////////////////  Configuración para Morgan y creación del stream node.lo
var fs = require('fs'); var util = require('util');
app.use(morgan('combined', {stream: fs.createWriteStream(__dirname + '/node.log', {flags : 'a'})}));
// Send message for default URL
app.get('/', (req, res) => res.send('Hello World with Express orchestrator'));

// Use Api routes in the App
app.use('/api-docs/orchestrator', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api', orchestrator_routes);
// exportamos este módulo para poder usar la variable app fuera de este archivo


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;

    //pass error to the next matching route.
    next(err);
});

// handle error, print stacktrace
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
      });
      
});

// Exportamos la configuración
module.exports = app;



