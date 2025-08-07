const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function CriarNotificacaoService(req) {
  const { endereco } = req.body;
  const vitimaId = req.user.id;
  // Obtem a data atual em UTC
    const now = new Date();

    // Ajusta para o horário de Brasília (UTC-3)
    const brasilTime = new Date(now.getTime() - 3 * 60 * 60 * 1000);

    const notificacao = await prisma.notificacao_botao.create({
      data: {
        endereco,
        data: brasilTime,
        vitimaId,
      },
    });

  return notificacao;
}

async function BuscarNotificacoesService() {
  const notificacoes = await prisma.notificacao_botao.findMany({
    orderBy: {
      data: 'desc',
    },
  });

  return notificacoes;
}

module.exports = { CriarNotificacaoService, BuscarNotificacoesService };
