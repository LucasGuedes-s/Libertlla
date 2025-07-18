const notificacaoService = require('../services/notificacao.service');

async function CriarNotificacao(req, res) {
  try {
    const notificacao = await notificacaoService.CriarNotificacaoService(req);

    // Emitir evento opcional para sockets, se usado
    req.io?.emit?.('novaNotificacao', notificacao);

    res.status(201).json(notificacao);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao enviar notificação' });
  }
}

async function BuscarNotificacoes(req, res) {
  try {
    const { vitimaId } = req.query;

    if (!vitimaId) {
      return res.status(400).json({ erro: 'vitimaId é obrigatório' });
    }

    const notificacoes = await notificacaoService.BuscarNotificacoesService(vitimaId);
    res.status(200).json(notificacoes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar notificações' });
  }
}

module.exports = { CriarNotificacao, BuscarNotificacoes };
