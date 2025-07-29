const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

async function CadrastrarOcorrencias(data) {
  const ocorrencias = await prisma.Ocorrencias.create({
    data: {
      tipo_denuncia: 'Formulário',
      tipo_violencia: data.tipo_violencia,
      agressor: data.agressor,
      provas: data.provas,
      descricao: data.descricao,
      local: data.local,
      data_denuncia: new Date(),
      data_ocorrencia: data.data_ocorrencia,
      endereco_vitima: data.endereco_vitima,
    }
  });
  return ocorrencias;
}

async function getOcorrenciasProfissional(profissionalEmail) {
  const profissional = await prisma.Profissionais.findUnique({
    where: { email: profissionalEmail },
    select: {
      id: true,
      profissionaisOcorrencias: {
        include: {
          ocorrencia: true,
        },
      },
    },
  });

  // Retorna só as ocorrências associadas
  return profissional.profissionaisOcorrencias.map(po => po.ocorrencia);
}

async function getConversasProfissional(profissionalEmail) {
  // Busca o id do profissional pelo email
  const profissional = await prisma.Profissionais.findUnique({
    where: { email: profissionalEmail },
    select: { id: true },
  });

  if (!profissional) return [];

  const conversas = await prisma.Conversa.findMany({
    where: {
      profissional: profissional.id,
    },
    include: {
      registros: true,
    },
  });

  return conversas;
}

async function GetOcorrencias() {
  const ocorrencias = await prisma.Ocorrencias.findMany({
    where: { status: "Andamento" },
    orderBy: { data_denuncia: "desc" }
  });

  return ocorrencias;
}

async function GetOcorrenciaTotais() {
  const ocorrencias = await prisma.Ocorrencias.groupBy({
    by: ['tipo_violencia'],
    _count: {
      tipo_violencia: true,
    },
  });

  return ocorrencias.map(o => ({
    tipo: o.tipo_violencia,
    quantidade: o._count.tipo_violencia,
  }));
};

async function GetOcorrencia(id) {
  const ocorrencia = await prisma.Ocorrencias.findUnique({
    where: { id: parseInt(id) },
  });

  return ocorrencia;
}

async function GetTodasOcorrencias() {
  const totalOcorrencias = await prisma.Ocorrencias.count();
  const totalConversas = await prisma.Conversa.count();
  const totalDenuncias = totalOcorrencias + totalConversas;
  const totalAtendidas = await prisma.Ocorrencias.count({
    where: {
      status: "Em progresso"
    }
  });

  return { totalDenuncias, totalConversas, totalOcorrencias, totalAtendidas };
}

async function GetOcorrenciaEspecifica(id) {
  const ocorrencia = await prisma.Ocorrencias.findUnique({
    where: { id: id },
    include: {
      registros: true
    }
  });
  return ocorrencia;
}

async function updateOcorrencia(req, res) {
  try {
    const { ocorrenciaId, profissionalEmail } = req.body;
    if (!ocorrenciaId || !profissionalEmail) {
      return res.status(400).json({ error: "ID da ocorrência e e-mail do profissional são obrigatórios." });
    }

    // Buscar o profissional pelo e-mail
    const profissional = await prisma.Profissionais.findUnique({
      where: { email: profissionalEmail },
      select: { id: true }
    });

    if (!profissional) {
      return res.status(404).json({ error: "Profissional não encontrado." });
    }

    await prisma.OcorrenciasProfissionais.create({
      data: {
        ocorrenciaId: ocorrenciaId,
        profissionalId: profissional.id
      }
    });

    const ocorrenciaAtualizada = await prisma.Ocorrencias.update({
      where: { id: ocorrenciaId },
      data: {
        status: "Em progresso"
      }
    });

    return ocorrenciaAtualizada;
  } catch (error) {
    console.error("Erro ao atualizar ocorrência:", error);
    return res.status(500).json({ error: "Erro ao atualizar ocorrência." });
  }
}

async function arquivarOcorrencia(ocorrenciaId) {
  try {
    if (!ocorrenciaId) {
      throw new Error("ID da ocorrência é obrigatório.");
    }

    const ocorrenciaArquivada = await prisma.Ocorrencias.update({
      where: {
        id: Number(ocorrenciaId)
      },
      data: {
        status: "Arquivada"
      }
    });

    return ocorrenciaArquivada;
  } catch (error) {
    console.error("Erro ao arquivar ocorrência:", error);
  }
}

async function arquivarConversa(conversaId) {
  try {
    if (!conversaId) {
      throw new Error("ID da conversa é obrigatório.");
    }

    const conversa = await prisma.Conversa.findUnique({
      where: { id: conversaId }
    });

    if (!conversa) {
      throw new Error("Conversa não encontrada.");
    }

    const conversaArquivada = await prisma.Conversa.update({
      where: { id: conversaId },
      data: { status: "Arquivada" }
    });

    return conversaArquivada;
  } catch (error) {
    console.error("Erro ao arquivar conversa:", error);
    throw error;
  }
}

async function adicionarProgressoChat(descricao, anexos, chatId) {
  return await prisma.Registro.create({
    data: {
      descricoes: descricao,
      anexos: anexos,
      data: new Date().toISOString(),
      chat: {
        connect: { id: chatId }
      }
    }
  });
}

async function adicionarProgressoOcorrencia(descricao, anexos, ocorrenciaId) {
  return await prisma.Registro.create({
    data: {
      descricoes: descricao,
      anexos: anexos,
      data: new Date().toISOString(),
      ocorrencia: { connect: { id: Number(ocorrenciaId) } }
    }
  });
}

async function vincularVitima(ocorrenciaId, vitimaId) {
  const ocorrenciaAtualizada = await prisma.Ocorrencias.update({
    where: { id: ocorrenciaId },
    data: { vitimaId: vitimaId }
  });

  return ocorrenciaAtualizada;
}

async function adicionarVisitaOcorrencia(data, descricao, testemunhas, anexos, assinatura, ocorrenciaId) {
  return await prisma.registro.create({
    data: {
      descricoes: descricao,
      testemunhas,
      anexos,
      assinatura,
      data: new Date().toISOString(),
      ocorrencia: { connect: { id: Number(ocorrenciaId) } }
    }
  });
}

async function adicionarVisitaConversa(data, descricao, testemunhas, anexos, assinatura, chatId) {
  return await prisma.registro.create({
    data: {
      descricoes: descricao,
      testemunhas,
      anexos,
      assinatura,
      data: new Date().toISOString(),
      chat: {
        connect: { id: chatId }
      }
    }
  });
}

module.exports = { CadrastrarOcorrencias, GetOcorrenciaTotais, GetOcorrencia, getConversasProfissional, GetOcorrencias, getOcorrenciasProfissional, GetOcorrenciaEspecifica, GetTodasOcorrencias, updateOcorrencia, arquivarOcorrencia, arquivarConversa, adicionarProgressoChat, adicionarProgressoOcorrencia, vincularVitima, adicionarVisitaOcorrencia, adicionarVisitaConversa };