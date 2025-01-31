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
    console.log(ocorrencias)
    return ocorrencias;
}

async function GetOcorrencias() {
    try {
        const ocorrencias = await prisma.Ocorrencias.findMany({
            where: { status: "Andamento" }, 
            orderBy: { data_denuncia: "desc" } 
        });
        return ocorrencias;
    } catch (error) {
        console.error("Erro ao buscar ocorrências:", error);
        throw new Error("Erro ao buscar ocorrências.");
    }
}

module.exports = {CadrastrarOcorrencias, GetOcorrencias}