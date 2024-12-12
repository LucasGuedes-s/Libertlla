const { Router } = require('express')
const LoginUser = require('../services/user.service')

async function LoginUsuario(req, res, next) {
    try {
        console.log("Aqui")
        console.log(req.body)
        const Login = await LoginUser.LoginUser(req.body)
        res.status(200)
        res.end()
    } catch (error) {
        console.error('Erro no login do usuário', error)
        next(error)
    }
}

module.exports = {LoginUsuario}