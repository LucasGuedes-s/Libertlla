const Profissional = require('../services/profissionais.service')

async function postProfissional(req, res, next){
    try {
        const cadastro = await Profissional.postProfissional(req.body)
        res.status(200).json({cadastro});
        next()
    } catch (err) {
        console.log(err)
        console.error(`Erro ao receber usuário`);
    }  
}
module.exports = {postProfissional};