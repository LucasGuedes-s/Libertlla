const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

async function CadrastrarOcorrencias(req, res) {
    const ocorrencias = await prisma.Ocorrencias.create({
        data:{
            tipo_denuncia: req.ocorrencias.tipo_denuncia,
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
            email: profissionalId // Filtra pelo ID do profissional
        },
        include: {
            ocorrencias: true  // Assumindo que você tem uma relação chamada 'ocorrencias'
        }
    });
    return ocorrencias;
}

async function GetOcorrencias() {
    const ocorrencia = await prisma.Ocorrencias.findMany({
        where: { status: "Andamento" }, 
        orderBy: { data_denuncia: "desc" }
    });

    return ocorrencia;
}
async function GetOcorrencia(req) {
    const ocorrencias = await prisma.Ocorrencias.findUnique({
        where: { id: parseInt(req) }, 
    });
    return ocorrencias;
}

async function GetTodasOcorrencias() {
    const totalOcorrencias = await prisma.Ocorrencias.count();
    return { totalOcorrencias };
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
        console.log(profissional)

        // Atualizar a ocorrência para associar o profissional e mudar o status
        const ocorrenciaAtualizada = await prisma.ocorrencias.update({
            where: { id: ocorrenciaId },
            data: {
                profissional: profissional.id, // Atualizando o ID do profissional na ocorrência
            }
        });

        console.log("Ocorrência atualizada:", ocorrenciaAtualizada);
        return ocorrenciaAtualizada;
    } catch (error) {
        console.error("Erro ao atualizar ocorrência:", error);
        return res.status(500).json({ error: "Erro ao atualizar ocorrência." });
    }
}

module.exports = {CadrastrarOcorrencias, GetOcorrencia, GetOcorrencias, getOcorrenciasProfissional, GetTodasOcorrencias, updateOcorrencia}