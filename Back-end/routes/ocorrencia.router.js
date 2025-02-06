const express = require('express')
const router = express.Router()
const controller = require('../controllers/ocorrencias.controller')
// const validarJWT = require('../middlewares/auth.js')

router.get('/ocorrencias', controller.GetOcorrencias);

router.get('/todasocorrencias', controller.GetTodasOcorrencias);

router.post('/cadastrar/ocorrencia', controller.PostOcorrencias)

router.get('/ocorrencias/:email', controller.getOcorrenciasProfissional)

router.post('/aceitar/ocorrencia', controller.updateOcorrencia)

module.exports = router;