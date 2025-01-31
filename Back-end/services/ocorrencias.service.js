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
            processos: true, // Inclui os dados dos processos associados
        }
    });
    return processos;
}

module.exports = {CadrastrarOcorrencias, getProcesso}