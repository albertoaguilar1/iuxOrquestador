'use strict'
//jwt
var jwt = require('jsonwebtoken');
//encrypting passwords.
var bcrypt = require('bcryptjs');
// Cargamos los modelos para usarlos posteriormente

var config = require('../config');

var watson = require('watson-developer-cloud');



// Handle index actions
exports.index = function (req, res) {

        console.log("email"+req.body.EmailUser); 
        console.log("password"+req.body.PasswordUser); 

            
        return res.status(200).send({
            status: "success",
            message: "service",
       
        });
 
};


function mostrarPropiedades(config, skill) {
  var resultado = ``;
  for (var i in config) {
    //objeto.hasOwnProperty se usa para filtrar las propiedades del objeto
    
      if(i===skill ){
        if (config.hasOwnProperty(i)) {
          resultado  = config[i];
          console.log(resultado)
  
      }
        break
      }
  
  }

  return resultado;
}

//servicio para inicializar la ocnversacion
exports.initiliaze = function (req, res) {

    console.log(""+req.body.User);
    console.log(""+req.body.Museum);
    console.log(""+req.body.IdSkill);

    var username = req.body.User
    var  museum = req.body.Museum
    var  skill = req.body.IdSkill
    
   var resultado = mostrarPropiedades(config,skill)
    //IAM
    var assistant = new watson.AssistantV1({
 
      iam_apikey: config.wconv_apikey,
      version: config.wconv_version_date,
      url: config.wconv_url
    });
 
  
    assistant.message({
      workspace_id: resultado,
      input: {'text': ''},
      context: { 
        'USERNAME': username,
        "CANAL": "WEB",
        "skill":  skill,
       
      }
    },  function(err, response) {
     console.log(response)
   
        res.send(response)
    });
  
};





// servicio para continuar la conversacion 
    exports.continueChat= function (req, res) {
    console.log("continueChat"+req.body.message);
    console.log("continueChat"+req.body.context);
  
    var message = req.body.message;
    var saved_context = req.body.context;

    var resultado = mostrarPropiedades(config,req.body.context.skill)
  
   
    //IAM
    var assistant = new watson.AssistantV1({
     
        iam_apikey: config.wconv_apikey,
        version: config.wconv_version_date,
        url: config.wconv_url
    });
  
    //IAM
    assistant.message({
      workspace_id:resultado,
      input: {'text': message},
      context: saved_context
    }, 
      
     function(err, response) {
        console.log (response);
         res.send(response)
     });
   
 };


