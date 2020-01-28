'use strict'
//jwt
var jwt = require('jsonwebtoken');
//encrypting passwords.
var bcrypt = require('bcryptjs');
// Cargamos los modelos para usarlos posteriormente

var Conversation = require('../models/conversation.js');

var config = require('../config');

var watson = require('watson-developer-cloud');
var fs = require('fs');


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
  var resultado = "";
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


const assistant = new watson.AssistantV1({
 
  iam_apikey: config.wconv_apikey,
  version: config.wconv_version_date,
  url: config.wconv_url
});



const visualRecognition = new watson.VisualRecognitionV3({
  version: config.wconv_version_date,
  iam_apikey: config.wvisual_apikey,
  url: config.wvisual_url
});


exports.visualRecognition= (req, res) => {
  console.log("entra al metodo");
  console.log("1"+req.body.images_file);
  console.log("2"+req.body.threshold);
  console.log("3"+req.body.classifier_ids);


  if(!req.body.classifier_ids) {
    return res.status(400).send({
        message: "classifier_ids req can not be empty"
    });
}
if(!req.body.images_file) {
  return res.status(400).send({
      message: "images_file req can not be empty"
  });
}
if(!req.body.threshold) {
  return res.status(400).send({
      message: "threshold req can not be empty"
  });
}
                    
classifier_ids= req.body.classifier_ids

var resultado = mostrarPropiedades(config,classifier_ids);

console.log (resultado)

var images_file= fs.createReadStream(req.body.images_file);
var classifier_ids= [resultado];
var threshold = req.body.threshold;


var params = {
	images_file: images_file,
	classifier_ids: classifier_ids,
	threshold: threshold
};


visualRecognition.classify(params, function(err, response) {

	if (err) { 
    res.json(err);
	} else {

 

    res.json(response);

		console.log(JSON.stringify(response, null, 2))
	}
});
}




exports.initiliaze2= (req, res) => {

  console.log(""+req.body.User);
  console.log(""+req.body.Museum);
  console.log(""+req.body.IdSkill);
  if(!req.body.IdSkill) {
    return res.status(400).send({
        message: "IdSkill req can not be empty"
    });
}
if(!req.body.User) {
  return res.status(400).send({
      message: "User req can not be empty"
  });
}
if(!req.body.Museum) {
  return res.status(400).send({
      message: "Museum req can not be empty"
  });
}

  var username = req.body.User
  var  museum = req.body.Museum
  var  skill = req.body.IdSkill


  var resultado = mostrarPropiedades(config,skill);

if(!resultado) {
  return res.status(400).send({
      message: "IdSkill not found"
  });
}


  const params={
  workspace_id: resultado,
  input: {'text': ''},
  context: { 
    'nameUser': username,
    "canal": "WEB",
    "skill":  skill
  }
  };



    assistant.message(params, (err, response) => {
    
      if (err) {
        console.error(err);
        res.status(500).json(err);
      } else {
        
        
        var respuesta = saveConversation(response);
        console.log("esperando vlaor "+respuesta)
        res.json(response);



     //  if(respuesta  === 'Success'){
     //   res.json(response);
      //   console.log(respuesta)

        
     // } else{
    //    res.status(500).json(err);
        
     //   }
      }


    });

};




 


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


 function saveConversation(req) {


   console.log("sec"+ req.output.text)

var respuesta="";
  var conversation = new Conversation();
  conversation.nameUser = req.context.nameUser;
  conversation.canal = req.context.canal;
  conversation.skill = req.context.skill;
  conversation.conversation_id = req.context.conversation_id;
  conversation.dateBegin =  new Date();
  conversation.conversacion =  req.output.text;
  conversation.node = req.output.nodes_visited;
  conversation.dialog_turn_counter = req.context.system.dialog_turn_counter;
  conversation.dialog_request_counter = req.context.system.dialog_request_counter;



 respuesta = conversation.save().then(resultados => {

   if(resultados._id)
   console.log("valor resultado"+resultados)
   respuesta="Succes";
   console.log("valor resultado"+respuesta)
        return respuesta
       
      
}).catch(err => {
  console.log("valor err"+err)    
  respuesta=err
  console.log("valor resultado"+respuesta)
    return respuesta
   
});
console.log("valor resultado"+respuesta)
return respuesta
 
  };


  function saveConversationUpdate(err,req) {
    Conversation.findByIdAndUpdate({ _id: req.params.users_id }, {
      NameUser : req.body.NameUser ? req.body.NameUser : users.NameUser,
      nameUser : req.context.nameUser,
      canal : req.context.canal,
      skill : req.context.skill,
      conversation_id : req.context.conversation_id

    }, {new: true})   
    .then(conversation => {

    if(!conversation) {
        return res.status(404).send({
            message: "User not found with id " + req.params.users_id,
                status:'404',
                data: err
        });
    }
    return res.status(200).send({
        message: 'user Info updated',
        status:"success",
        data: conversation
    });
           
}).catch(err => {
    console.log("err"+err);
    if(err.kind === 'ObjectId') {
        return res.status(404).send({
            message: "User not found with id " + req.params.users_id,
            status:'404',
            data: err
        });                
    }
    return res.status(500).send({
        message: "Error updating user with id " + req.params.users_id,
        status:'500',
        data: err
    });
});
};




  
  
   

   

 