const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()


async function CadrastrarOcorrencias(req, res) {
    const ocorrencias = await prisma.Ocorrencias.create({
        data: {
            tipo_denuncia: 'Fomulário',
            tipo_violencia: req.ocorrencias.tipo_violencia,
            agressor: req.ocorrencias.agressor,
            provas: req.ocorrencias.provas,
            descricao: req.ocorrencias.descricao,
            local: req.ocorrencias.local,
            data_denuncia: new Date(),
            data_ocorrencia: req.ocorrencias.data_ocorrencia
        }
    })
    return ocorrencias;
}
async function getOcorrenciasProfissional(req, res) {
    const profissionalId = req
    const ocorrencias = await prisma.Profissionais.findMany({
        where: {
            email: profissionalId,
        },
        include: {
            ocorrencias: true
        }
    });

    return ocorrencias;
}

async function getConversasProfissional(profissionalEmail) {
    const conversas = await prisma.Conversa.findMany({
      where: {
        profisssional: { 
          email: profissionalEmail, 
        },
      },
    });
  
    return conversas
}

async function GetOcorrencias() {
    const ocorrencia = await prisma.Ocorrencias.findMany({
        where: { status: "Andamento" },
        orderBy: { data_denuncia: "desc" }
    });


    return ocorrencia;
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

async function GetOcorrencia(req) {
    const ocorrencias = await prisma.Ocorrencias.findUnique({
        where: { id: parseInt(req) },
    });

    return ocorrencias;
}


async function GetTodasOcorrencias() {
    const totalOcorrencias = await prisma.Ocorrencias.count();
    const totalConversas = await prisma.Conversa.count(); // Contagem das denúncias feitas pelo chat
    const totalDenuncias = totalOcorrencias + totalConversas; // Soma os dois valores
    const totalAtendidas = await prisma.ocorrencias.count({
        where: {
            status: "Em progresso"
        }
    });


    return { totalDenuncias, totalConversas, totalOcorrencias, totalAtendidas };
}


async function GetOcorrenciaEspecifica(id) {
    console.log(id)
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


        // Atualizar a ocorrência para associar o profissional e mudar o status
        const ocorrenciaAtualizada = await prisma.ocorrencias.update({
            where: { id: ocorrenciaId },
            data: {
                profissional: profissional.id, // Atualizando o ID do profissional na ocorrência
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

        const ocorrenciaArquivada = await prisma.ocorrencias.update({
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
        throw new Error("Erro ao arquivar ocorrência.");
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

module.exports = { CadrastrarOcorrencias, GetOcorrenciaTotais, GetOcorrencia, getConversasProfissional,GetOcorrencias, getOcorrenciasProfissional, GetOcorrenciaEspecifica, GetTodasOcorrencias, updateOcorrencia, arquivarOcorrencia, adicionarProgressoChat, adicionarProgressoOcorrencia}
