const express = require('express')
const router = express.Router()
const controller = require('../controllers/ocorrencias.controller')
// const validarJWT = require('../middlewares/auth.js')

router.post('/cadastrar/ocorrencia', controller.PostOcorrencias)

router.get('/get/ocorrencias/:email', controller.getProcesso)

module.exports = router;