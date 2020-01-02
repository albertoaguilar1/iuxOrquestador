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



exports.initiliaze = function (req, res) {

    console.log("initiliaze"+req.body.User);
    //IAM
    var assistant = new watson.AssistantV1({

      iam_apikey: config.wconv_apikey,
      version: config.wconv_version_date,
      url: config.wconv_url
    });
    console.log("initiliaze"+assistant);
    var username = req.body.User
  
    assistant.message({
      workspace_id: config.wconv_workspaceId,
      input: {'text': ''},
      context: { 
        'USERNAME': username,
        "CANAL": "WEB"
      }
    },  function(err, response) {
     console.log(response)
        res.send(response)
    });
  
};






    exports.continueChat= function (req, res) {
    console.log("continueChat"+req.body.message);
    console.log("continueChat"+req.body.context);
  
    var message = req.body.message;
    var saved_context = req.body.context;

  
  
    console.log("sendMessage"+message);
    //IAM
    var assistant = new watson.AssistantV1({
     
        iam_apikey: config.wconv_apikey,
        version: config.wconv_version_date,
        url: config.wconv_url
    });
  
    //IAM
    assistant.message({
      workspace_id: config.wconv_workspaceId,
      input: {'text': message},
      context: saved_context
    }, 
      
     function(err, response) {
        console.log (response);
         res.send(response)
     });
   
 };