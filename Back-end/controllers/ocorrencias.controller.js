const  Ocorrencia = require("../services/ocorrencias.service");

async function PostOcorrencias(req, res, next) {
    try {
        const ocorrencias = await  Ocorrencia.OcorrenciaOcorrencias(req.body)
        res.status(200).json({
            ocorrencias
        })
        next()
    } catch (error) {
        console.error(error)
        console.error('Erro no cadrastro da ocorrencia')
    }
}
async function getProcessos(req, res, next) {
    try {
        const processos = await  Ocorrencia.getProcesso(req.params.email)
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
module.exports = {PostOcorrencias, GetOcorrencias, getProcessos};
