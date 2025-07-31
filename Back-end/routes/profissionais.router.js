const express = require('express')
const router = express.Router()
const controller = require('../controllers/profissionais.controller')
const validarJWT = require('../middlewares/auth.js')

router.post('/cadastrar/profissional', [validarJWT], controller.postProfissional);

router.put('/profissional/recuperar_senha', controller.alterarSenhaController);

router.put('/profissional/:id/foto', controller.atualizarFotoController);

module.exports = router;