const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function CriarNotificacaoService(req) {
  const { endereco, data } = req.body;
  const vitimaId = req.user.id;

  //const data = new Date();
  //data.setHours(0, 0, 0, 0); // Zera a hora

  const notificacao = await prisma.notificacao_botao.create({
    data: {
      endereco,
      data,
      vitimaId,
    },
  });

  return notificacao;
}

async function BuscarNotificacoesService(vitimaId) {
  const notificacoes = await prisma.notificacao_botao.findMany({
    where: {
      vitimaId: parseInt(vitimaId),
    },
    orderBy: {
      data: 'desc',
    },
  });

  return notificacoes;
}

module.exports = { CriarNotificacaoService, BuscarNotificacoesService };
