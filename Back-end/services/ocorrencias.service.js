const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

async function CadrastrarOcorrencias(req, res) {
    console.log(req)
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
async function getProcesso(req, res) {
    const profissionalId = req
    const processos = await prisma.Profissionais.findFirst({
        where: {
            email: profissionalId // Filtra pelo ID do profissional
        },
        select: {
            processos: {
                include: {
                    ocorrecia: true // Inclui os dados da ocorrência associada ao processo
                }
            }
        }
    });
    return processos;
}

async function GetOcorrencias() {
    const ocorrencias = await prisma.Ocorrencias.findMany({
        where: { status: "Andamento" }, 
        orderBy: { data_denuncia: "desc" }
    });

    return ocorrencias;
}

async function updateOcorrencia(req, res) {
    const { ocorrenciaId, profissionalEmails} = req.body
    
    const profissionais = await prisma.profissionais.findMany({
        where: { email: { in: profissionalEmails } },
        select: { id: true }
    });

    // Se nenhum profissional for encontrado, retorna erro
    if (profissionais.length === 0) {
        throw new Error("Nenhum profissional encontrado com os e-mails fornecidos.");
    }

    const profissionalIds = profissionais.map(prof => prof.id); // Extrai os IDs

    // Atualizar o status da ocorrência
    const ocorrenciaAtualizada = await prisma.Ocorrencias.update({
        where: { id: ocorrenciaId },
        data: { 
            status: "Em progresso", // Alterando o status da ocorrência
        }
    });

    // Criar o processo
    const novoProcesso = await prisma.processo.create({
        data: {
            status: "Em progresso",  // Status inicial do processo
            ocorrencia: ocorrenciaId, // Associa o processo à ocorrência
            profissionais: { connect: profissionalIds.map(id => ({ id })) } // Conectando o profissional ao processo
        }
    });
    console.log(ocorrenciaAtualizada, novoProcesso)
    return { ocorrenciaAtualizada, novoProcesso };
}

module.exports = {CadrastrarOcorrencias, GetOcorrencias, getProcesso, updateOcorrencia}