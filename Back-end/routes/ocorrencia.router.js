const express = require('express')
const router = express.Router()
const controller = require('../controllers/ocorrencias.controller')
const validarJWT = require('../middlewares/auth.js')

router.get('/ocorrencias', [validarJWT], controller.GetOcorrencias);

router.get('/ocorrencia/:id', [validarJWT], controller.GetOcorrenciaEspecifica);

router.get('/todasocorrencias', controller.GetTodasOcorrencias);

router.post('/cadastrar/ocorrencia', controller.PostOcorrencias)

router.get('/ocorrencias/:email',  [validarJWT], controller.getOcorrenciasProfissional)

router.post('/aceitar/ocorrencia',  [validarJWT], controller.updateOcorrencia)

module.exports = router;