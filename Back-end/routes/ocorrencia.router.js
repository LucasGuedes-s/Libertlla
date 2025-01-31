const express = require('express')
const router = express.Router()
const controller = require('../controllers/ocorrencias.controller')

router.get('/ocorrencias', controller.GetOcorrencias);

router.post('/cadastrar/ocorrencia', controller.PostOcorrencias)

module.exports = router;