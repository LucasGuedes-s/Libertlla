require('dotenv').config();

config = {
    jwtSecret: process.env.JWT_SECRET,
    senha: process.env.SENHA,
}

module.exports = config;