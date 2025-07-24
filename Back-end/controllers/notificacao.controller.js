const notificacaoService = require('../services/notificacao.service');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function CriarNotificacao(req, res) {
  try {
    const notificacao = await notificacaoService.CriarNotificacaoService(req);

    req.io?.emit?.('novaNotificacao', notificacao);

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

async function NotificarVitima(req, res) {
  try {
    const { id } = req.params;
    console.log(`[NotificarVitima] id recebido: ${id}`);
    console.log('[NotificarVitima] req.params:', req.params);

    const notificacao = await prisma.notificacao_botao.findUnique({
      where: { id: parseInt(id) },
      include: { vitima: true },
    });

    if (!notificacao) {
      console.log('[NotificarVitima] Notificação não encontrada');
      return res.status(404).json({ erro: 'Notificação não encontrada' });
    }

    if (!req.io) {
      console.error('[NotificarVitima] req.io não está definido');
      return res.status(500).json({ erro: 'Socket.IO não disponível' });
    }

    console.log('[NotificarVitima] Emitindo socket para:', notificacao.vitimaId);
    req.io.to(`notificacao-vitima-${notificacao.vitimaId}`).emit('notificacao', {
      titulo: '🚨 Alerta!',
      mensagem: 'As autoridades estão a caminho!',
      notificacaoId: notificacao.id,
    });

    return res.status(200).json({ mensagem: 'Notificação enviada à vítima com sucesso' });
  } catch (error) {
    console.error('[NotificarVitima] Erro:', error);
    return res.status(500).json({ erro: 'Erro ao notificar vítima' });
  }
}

module.exports = { CriarNotificacao, BuscarNotificacoes, NotificarVitima };
