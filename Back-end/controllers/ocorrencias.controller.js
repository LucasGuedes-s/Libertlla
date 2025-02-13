const  Ocorrencia = require("../services/ocorrencias.service");

async function PostOcorrencias(req, res, next) {
    try {
        const ocorrencias = await Ocorrencia.CadrastrarOcorrencias(req.body)
        res.status(200).json({
            ocorrencias
        })
        next()
    } catch (error) {
        console.error(error)
        console.error('Erro no cadrastro da ocorrencia')
    }
}
async function getOcorrenciasProfissional(req, res, next) {
    try {
        const processos = await Ocorrencia.getOcorrenciasProfissional(req.params.email)
        res.status(200).json({
            processos
        })
        next()
    } catch (error) {
        console.error(error)
        console.error('Erro no get em processos do profissional')
    }
}
async function GetOcorrencias(req, res, next) {
    try {
        const ocorrencias = await Ocorrencia.GetOcorrencias()
        res.status(200).json({
            ocorrencias
        })
        next()
    } catch (error) {
        console.error(error)
        console.error('Erro ao receber ocorrencias')
    }
}
async function GetTodasOcorrencias(req, res, next) {
    try {
        const { totalOcorrencias } = await Ocorrencia.GetTodasOcorrencias();
        res.status(200).json({ totalOcorrencias });
        next();
    } catch (error) {
        console.error(error);
        console.error('Erro ao receber todas as ocorrências');
    }
}

async function GetOcorrenciaEspecifica(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "ID inválido." });
        }

        const ocorrencia = await Ocorrencia.GetOcorrenciaEspecifica(id);
        if (!ocorrencia) {
            return res.status(404).json({ error: "Ocorrência não encontrada." });
        }

        res.status(200).json({ ocorrencia });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar a ocorrência." });
    }
}


async function updateOcorrencia(req, res, next) {
    try {
        const ocorrencias = await Ocorrencia.updateOcorrencia(req)
        res.status(200).json({
            ocorrencias
        })
        next()
    } catch (error) {
        console.error(error)
        console.error('Erro ao realizar alteração na ocorrencia/processo')
    }
}
module.exports = {PostOcorrencias, GetOcorrencias, getOcorrenciasProfissional, GetTodasOcorrencias, GetOcorrenciaEspecifica, updateOcorrencia};
