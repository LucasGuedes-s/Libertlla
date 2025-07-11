const notificacaoService = require('../services/notificacao.service');

async function CriarNotificacao(req, res) {
  try {
    const notificacao = await notificacaoService.CriarNotificacaoService(req);
    
    // Emitir evento para todos os clientes conectados
    req.io.emit('novaNotificacao', notificacao);

    res.status(201).json(notificacao);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao enviar notificação' });
  }
}

async function BuscarNotificacoes(req, res) {
  try {
    const notificacoes = await notificacaoService.BuscarNotificacoesService();
    res.status(200).json(notificacoes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar notificações' });
  }
}

module.exports = { CriarNotificacao, BuscarNotificacoes };
