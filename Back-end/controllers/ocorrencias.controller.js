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
module.exports = {PostOcorrencias};
