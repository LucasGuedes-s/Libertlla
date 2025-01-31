const express = require('express')
const router = express.Router()
const controller = require('../controllers/ocorrencias.controller')
// const validarJWT = require('../middlewares/auth.js')

router.get('/ocorrencias', controller.GetOcorrencias);

router.post('/cadastrar/ocorrencia', controller.PostOcorrencias)

router.get('/ocorrencia/processos/:email', controller.getProcessos)

module.exports = router;