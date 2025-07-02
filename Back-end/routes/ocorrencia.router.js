const express = require('express')
const router = express.Router()
const controller = require('../controllers/ocorrencias.controller')
const validarJWT = require('../middlewares/auth.js')

router.get('/ocorrencias', [validarJWT], controller.GetOcorrencias);

router.get('/ocorrencia/:id', controller.GetOcorrenciaEspecifica);

router.get('/conversas/:profissionalEmail', controller.getConversas);

router.get('/todasocorrencias', controller.GetTodasOcorrencias);

router.post('/cadastrar/ocorrencia', controller.PostOcorrencias)

router.get('/ocorrencias/:email', controller.getOcorrenciasProfissional)

router.post('/aceitar/ocorrencia',  [validarJWT], controller.updateOcorrencia)

router.post('/progresso/chat/:id', controller.adicionarProgressoChat);

router.post('/progresso/ocorrencia/:id', controller.adicionarProgressoOcorrencia);

router.put("/ocorrencias/arquivar", [validarJWT], controller.arquivarOcorrencia);

router.put('/conversas/arquivar', [validarJWT], controller.arquivarConversa);

router.get("/todas/ocorrencias", controller.GetOcorrenciasTotais);

router.post('/ocorrencias/:id/vincular-vitima', controller.vincularVitimaController);

module.exports = router;