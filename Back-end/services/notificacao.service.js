const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function CriarNotificacaoService(data) {
  const notificacao = await prisma.notificacao_botao.create({
    data,
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
module.exports = {CriarNotificacaoService, BuscarNotificacoesService};
