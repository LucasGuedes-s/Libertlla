const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function CriarNotificacaoService(req) {
  const { endereco } = req.body;
  const vitimaId = req.user.id;
  // Obtem a data atual em UTC
    const now = new Date();
    const brasilTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    
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
