'use strict'
// Cargamos el módulo de mongoose
var mongoose =  require('mongoose');
// Usaremos los esquemas
//cargamos plugin uniquevalidator para evitar correo repetido
var uniqueValidator = require('mongoose-unique-validator');

// Usaremos los esquemas
// Creamos el objeto del esquema y sus atributos
var ParameterSchema = mongoose.Schema({
  //  parameter_id: mongoose.Schema.Types.ObjectId,
  
  NameParameter: {
    type: String,
    required: true
},
value: {
    type: String,
    required: true
}
})
    

// Export Users model
var Parameter = module.exports = mongoose.model('Parameter', ParameterSchema);
module.exports.get = function (callback, limit) {
    Parameter.find(callback).limit(limit);
}


