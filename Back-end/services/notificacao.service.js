const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function CriarNotificacaoService(data) {
  const notificacao = await prisma.notificacao_botao.create({
    data,
  });
  return notificacao;
}

module.exports = CriarNotificacaoService;
