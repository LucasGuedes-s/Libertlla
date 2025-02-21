const Profissional = require('../services/profissionais.service')

async function postProfissional(req, res, next){
    try {
        const cadastro = await Profissional.postProfissional(req.body)
        res.status(200).json({cadastro});
        next()
    } catch (error) { 
        console.error('Erro ao cadastrar profissional:', error);

        if (error.code === 'P2002') {  // Erro de chave única (e-mail já cadastrado)
            return res.status(409).json({ message: 'E-mail já cadastrado!' });
        }

        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}
module.exports = {postProfissional};