const Cadrastrar = require("../services/ocorrencias.service");

async function PostOcorrencias(req, res, next) {
    try {
        const ocorrencias = await Cadrastrar.CadrastrarOcorrencias(req.body)
        res.status(200).json({
            ocorrencias
        })
        next()
    } catch (error) {
        console.error(error)
        console.error('Erro no cadrastro da ocorrencia')
    }
}
async function GetOcorrencias(req, res, next){
    try {
        const ocorrencias = await Ocorrencias.GetOcorrencias()
        res.status(200).json({ocorrencias});
        next()
    } catch (err) {
        console.error(`Erro ao receber ocorrência do usuário`);
    }
}
module.exports = {PostOcorrencias, GetOcorrencias };
