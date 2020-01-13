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
      .post(authenticated,orchestratorController.initiliaze),

      
      api.route('/continue')
      .post(authenticated,orchestratorController.continueChat);
    
      api.route('/initiliaze2')
      .post(authenticated,orchestratorController.initiliaze2);
    





    


// Exportamos la configuración
module.exports = api;