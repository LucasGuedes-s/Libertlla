const express = require('express')
const router = express.Router()
const controller = require('../controllers/vitima.controller')

router.post('/login/vitima', controller.LoginVitma)

router.get('/vitima', controller.getVitimas)

router.get('/vitima/:email', controller.getVitimaPorEmail);

router.get('/vitima/id', controller.getVitimaIdPorEmail);

router.put('/vitima/:email/contato', controller.adicionarContato);

module.exports = router;