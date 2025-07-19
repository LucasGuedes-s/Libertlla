const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificacao.controller')

router.post('/notificacao', controller.CriarNotificacao);

router.get('/notificacoes', controller.BuscarNotificacoes);

// router.get('/notificacao/:id/status', notificacaoController.status);

module.exports = router;
