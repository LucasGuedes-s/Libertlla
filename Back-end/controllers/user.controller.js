const { Router } = require('express')
const LoginUser = require('../services/user.service')

async function LoginUsuario(req, res, next) {
    try {
        const Login = await LoginUser.LoginUser(req.body)
        res.setHeader('Authorization', `Bearer ${Login.token}`);
        res.status(200)
        res.end()
    } catch (error) {
        console.error('Erro no login do usuário', error)
        next(error)
    }
}

module.exports = { LoginUsuario }