const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificacao.controller')
const validarJWT = require('../middlewares/auth');

router.post('/notificacao', validarJWT, controller.CriarNotificacao);

router.get('/notificacoes', controller.BuscarNotificacoes);

router.post('/notificacoes/:id/notificar', controller.NotificarVitima);

module.exports = router;
