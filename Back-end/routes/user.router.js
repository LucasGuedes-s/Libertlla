const express = require('express')
const router = express.Router()
const controller = require('../controllers/user.controller')
const validarJWT = require('../middlewares/auth.js')

router.post('/login', validarJWT, controller.LoginUsuario)


module.exports = router;
