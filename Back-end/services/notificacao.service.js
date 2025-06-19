const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function CriarNotificacaoService(req) {
  const { endereco, vitimaId} = req.body;

  const data = new Date(); 
  data.setHours(0, 0, 0, 0); // zera hora, minuto, segundo, milissegundo

  const notificacao = await prisma.notificacao_botao.create({
    data:{
      endereco,
      data: data,
      vitimaId, // Adicione o ID da vítima se necessário
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
