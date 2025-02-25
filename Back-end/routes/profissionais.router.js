const express = require('express')
const router = express.Router()
const controller = require('../controllers/profissionais.controller')
const validarJWT = require('../middlewares/auth.js')

router.post('/cadastrar/profissional', [validarJWT], controller.postProfissional);

module.exports = router;