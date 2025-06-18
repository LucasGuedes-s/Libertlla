const CriarNotificacaoService = require('../services/notificacao.service');

async function CriarNotificacao(req, res) {
  try {
    const notificacao = await CriarNotificacaoService(req.body);
    res.status(201).json(notificacao);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao enviar notificação' });
  }
}

module.exports = { CriarNotificacao };
