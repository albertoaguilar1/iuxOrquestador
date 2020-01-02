'use strict'
// Cargamos el módulo de express para poder crear rutas
var express = require('express');
// Llamamos al router
var api = express.Router();
//jwt token
var jwt = require('jsonwebtoken');
// Cargamos el controlador
var orchestratorController = require('../controllers/orchestrator')

var authenticated = require('../middlewares/authenticated');



api.get('/',function(req,res){
    res.json({
        status:'API orchestrator WORKING',
        message:'Bienvenido a la raiz del servicio'
    });
});


    // Contact routes
    api.route('/orchestrator')
    .get(orchestratorController.index);



      // Contact routes
      api.route('/initiliaze')
      .post(orchestratorController.initiliaze),

      
      api.route('/continue')
      .post(orchestratorController.continueChat);
    

    


// Exportamos la configuración
module.exports = api;