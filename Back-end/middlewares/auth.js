const config = require('../config/app.config.js')
const jwt = require('jsonwebtoken')


function validarJWT(req, res, next){
    if(!req.headers.authorization){
        return res.status(422).send({
            message: "Token nulo"
        });
    }

    //extrai o token do header
    const jwt_token = req.headers.authorization.split(' ')[1];
    jwt.verify(jwt_token, config.jwtSecret, (err, userInfo) =>{

        if(err){
            console.log(err);
            if (err.name === "TokenExpiredError") {
                return res.status(401).send({
                    message: "Token expirado"
                });
            } else{
                return res.status(403).send({
                    message: "Token invalido"
                });
            }
        }
        req.user = userInfo;
        next();
    });
}
module.exports = validarJWT;
