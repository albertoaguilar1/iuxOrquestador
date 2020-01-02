'user strict'

var moment = require('moment');
//jwt
var jwt = require('jsonwebtoken');
//encrypting passwords.
var bcrypt = require('bcryptjs');
// Cargamos los modelos para usarlos posteriormente
var config = require('../config');


function ensureAuth(req, res, next) {
console.log('aunteticado');
if(!req.headers.authorization){
    return res.status(403).send({message: 'La peticion no tiene la cabecera de autenticación'});
} else {
    var token = req.headers.authorization.replace(/['"]+/g, '');
try{
        var payload = jwt.decode(token, config.SECRET_TOKEN);
        console.log(payload);
        console.log(moment().unix());
       if(payload.exp < moment().unix()){
            return res.status(401).send({
                message: 'EL token ha expirado'
            });
        }
    } catch (ex){
        return res.status(404).send({
            message: 'EL token no es valido'
        });
    }
req.user = payload;
next();
}
}
 
module.exports = ensureAuth;



