'use strict'
// Cargamos el módulo de mongoose
var mongoose =  require('mongoose');
// Usaremos los esquemas
//cargamos plugin uniquevalidator para evitar correo repetido
var uniqueValidator = require('mongoose-unique-validator');

// Usaremos los esquemas
// Creamos el objeto del esquema y sus atributos
var ConversationsSchema = mongoose.Schema({
  //  users_id: mongoose.Schema.Types.ObjectId,
 
  nameUser: {
        type: String,
        required: true
    },
        canal: {
            type: String,
            required: true
        },
        skill: {
            type: String,
            required: true
        },
        conversation_id: {
            type: String,
            required: true
        },
        dateBegin: {
            type: Date,
            default: Date.now()
         
        },
        conversacion:
        [
            { type : String  
            }
        ]  ,
        node:
        [
            { type : String  
            }
        ]  ,
        dialog_request_counter: {
            type: Number,
            required: true
        },
        dialog_turn_counter: {
            type: Number,
            required: true
        },

});
// Export Users model


// Export Users model
var Conversations = module.exports = mongoose.model('Conversation', ConversationsSchema);
module.exports.get = function (callback, limit) {
    Conversations.find(callback).limit(limit);
}


