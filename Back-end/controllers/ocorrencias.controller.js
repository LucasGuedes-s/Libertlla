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
async function getProcesso(req, res, next) {
    try {
        const processo = await  Ocorrencia.getProcesso(req.params.email)
        res.status(200).json({
            processo
        })
        next()
    } catch (error) {
        console.error(error)
        console.error('Erro ao receber processos do usuário')
    }
}
module.exports = {PostOcorrencias, getProcesso};
