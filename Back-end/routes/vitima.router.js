const express = require('express')
const router = express.Router()
const controller = require('../controllers/vitima.controller')
const validarJWT = require('../middlewares/auth.js');

router.post('/login/vitima', controller.LoginVitma)

router.get('/vitima', controller.getVitimas)

router.get('/vitima/:email', controller.getVitimaPorEmail);

router.get('/vitima/id-token', validarJWT, controller.getIdVitimaPorToken);

router.put('/vitima/:email/contato', controller.adicionarContato);

module.exports = router;