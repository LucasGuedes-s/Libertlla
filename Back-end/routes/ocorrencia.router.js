const express = require('express')
const router = express.Router()
const controller = require('../controllers/ocorrencias.controller')
const validarJWT = require('../middlewares/auth.js')

router.get('/ocorrencias', [validarJWT], controller.GetOcorrencias);

router.get('/ocorrencia/:id', controller.GetOcorrenciaEspecifica);

router.get('/todasocorrencias', controller.GetTodasOcorrencias);

router.post('/cadastrar/ocorrencia', controller.PostOcorrencias)

router.get('/ocorrencias/:email',  [validarJWT], controller.getOcorrenciasProfissional)

router.post('/aceitar/ocorrencia',  [validarJWT], controller.updateOcorrencia)

router.post('/ocorrencia/:ocorrenciaId/progresso', controller.adicionarProgresso);

router.put("/ocorrencias/arquivar", [validarJWT], controller.arquivarOcorrencia);

module.exports = router;